# Zero-Downtime Migrations

## O que é Zero-Downtime?

Zero-downtime (ou downtime zero) é a capacidade de aplicar mudanças no banco de dados **sem interromper o serviço** para os usuários.

```
Deployment Tradicional:  [App v1] → [DOWNTIME] → [App v2]
Zero-Downtime:           [App v1] → [v1 + v2 simultâneos] → [App v2]
```

## Por que é importante?

- Aplicações SaaS não podem parar
- E-commerce perde vendas durante downtime
- APIs precisam estar sempre disponíveis
- Melhor experiência do usuário

## Princípios Fundamentais

### 1. Mudanças Devem Ser Backward Compatible

A migration deve funcionar tanto com código antigo quanto novo durante o período de transição.

```
[Código Antigo] ←─┐
                   ├─→ [Banco de Dados] ← funciona com ambos
[Código Novo]   ←─┘
```

### 2. Deploy em Fases (Multi-Step)

Mudanças complexas são divididas em múltiplas migrations aplicadas ao longo do tempo.

```
Migration 1: Adicionar estrutura nova (mantendo antiga)
Deploy 1: Código que usa ambas estruturas
Migration 2: Migrar dados
Deploy 2: Código que usa apenas nova estrutura
Migration 3: Remover estrutura antiga
```

### 3. Never-Breaking Changes

Evite mudanças que quebram compatibilidade imediatamente:
- Remover colunas
- Renomear colunas
- Alterar tipos incompatíveis
- Adicionar NOT NULL sem default

## Estratégias de Zero-Downtime

### Estratégia 1: Expand-Migrate-Contract

O padrão mais comum e seguro.

#### Fase 1: Expand (Expandir)

**Adicionar nova estrutura sem remover antiga**

```javascript
// Migration 1: Expandir
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Adicionar nova coluna 'status_code' (mantendo 'status')
    await queryInterface.addColumn('orders', 'status_code', {
      type: Sequelize.STRING(20),
      allowNull: true
    });

    // Código antigo continua usando 'status'
    // Código novo pode usar 'status_code'
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('orders', 'status_code');
  }
};
```

**Deploy do código que escreve em ambas colunas:**

```javascript
// models/Order.js - Versão de transição
class Order extends Model {
  static async create(data) {
    // Escrever em AMBAS colunas durante transição
    const order = await super.create({
      ...data,
      status: data.status,        // Coluna antiga
      status_code: data.status    // Coluna nova
    });
    return order;
  }

  static async update(id, data) {
    const updates = { ...data };

    // Se status for atualizado, atualizar ambos
    if (updates.status) {
      updates.status_code = updates.status;
    }

    return super.update(updates, { where: { id } });
  }
}
```

#### Fase 2: Migrate (Migrar)

**Copiar dados da coluna antiga para nova**

```javascript
// Migration 2: Migrar dados
module.exports = {
  up: async (queryInterface) => {
    // Copiar dados existentes
    await queryInterface.sequelize.query(`
      UPDATE orders
      SET status_code = status
      WHERE status_code IS NULL
    `);

    console.log('Dados migrados de status para status_code');
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      UPDATE orders SET status_code = NULL
    `);
  }
};
```

**Aguardar e monitorar:**
- Verificar se não há mais acessos à coluna antiga
- Garantir que todos servidores estão rodando código novo

#### Fase 3: Contract (Contrair)

**Remover estrutura antiga**

```javascript
// Migration 3: Remover coluna antiga
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Remover coluna antiga
      await queryInterface.removeColumn('orders', 'status', { transaction });

      // Renomear nova coluna para nome original (opcional)
      await queryInterface.renameColumn('orders', 'status_code', 'status', { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.renameColumn('orders', 'status', 'status_code', { transaction });

      await queryInterface.addColumn('orders', 'status', {
        type: Sequelize.STRING(20)
      }, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
```

**Atualizar código para usar apenas nova estrutura:**

```javascript
// models/Order.js - Versão final
class Order extends Model {
  static async create(data) {
    return super.create({
      ...data,
      status: data.status  // Apenas uma coluna agora
    });
  }
}
```

### Estratégia 2: Blue-Green Deployment

Manter dois ambientes completos e alternar entre eles.

```
[Blue Environment]  ← Produção atual (100% tráfego)
[Green Environment] ← Nova versão com migrations

1. Aplicar migrations no Green
2. Testar Green
3. Redirecionar tráfego: Blue → Green
4. Manter Blue como fallback
```

**Infraestrutura:**

```yaml
# docker-compose.yml
version: '3.8'

services:
  # Ambiente Blue (atual)
  app-blue:
    image: myapp:v1
    environment:
      DATABASE_URL: postgresql://db-blue/myapp
    labels:
      - "traefik.http.services.app.loadbalancer.server.port=3000"
      - "traefik.http.services.app.loadbalancer.server.weight=100"

  # Ambiente Green (novo)
  app-green:
    image: myapp:v2
    environment:
      DATABASE_URL: postgresql://db-green/myapp
    labels:
      - "traefik.http.services.app.loadbalancer.server.port=3000"
      - "traefik.http.services.app.loadbalancer.server.weight=0"  # Inicialmente sem tráfego

  # Load balancer
  traefik:
    image: traefik:v2.9
    command:
      - "--providers.docker=true"
```

**Script de switch:**

```bash
#!/bin/bash
# scripts/blue-green-switch.sh

echo "Iniciando Blue-Green deployment..."

# 1. Aplicar migrations no Green
docker-compose exec app-green npm run migrate

# 2. Smoke tests
echo "Executando testes no Green..."
curl -f http://app-green:3000/health || exit 1

# 3. Gradual rollout
echo "Redirecionando 10% do tráfego para Green..."
docker-compose exec traefik \
  set-weight app-green 10

sleep 60

echo "Redirecionando 50% do tráfego para Green..."
docker-compose exec traefik \
  set-weight app-green 50

sleep 60

echo "Redirecionando 100% do tráfego para Green..."
docker-compose exec traefik \
  set-weight app-green 100

echo "Blue-Green deployment concluído!"
```

### Estratégia 3: Feature Flags

Controlar uso de novas funcionalidades via flags sem redeployment.

```javascript
// config/features.js
module.exports = {
  useNewStatusColumn: process.env.FEATURE_NEW_STATUS === 'true'
};
```

```javascript
// models/Order.js
const features = require('../config/features');

class Order extends Model {
  static async findAll(options = {}) {
    const orders = await super.findAll(options);

    return orders.map(order => {
      // Usar coluna baseado em feature flag
      const status = features.useNewStatusColumn
        ? order.status_code
        : order.status;

      return {
        ...order.toJSON(),
        status
      };
    });
  }

  static async create(data) {
    const orderData = { ...data };

    // Escrever em ambas colunas durante transição
    if (features.useNewStatusColumn) {
      orderData.status_code = data.status;
    } else {
      orderData.status = data.status;
    }

    return super.create(orderData);
  }
}
```

**Ativar feature gradualmente:**

```javascript
// Ativar para 10% dos usuários
const features = {
  useNewStatusColumn: Math.random() < 0.1  // 10% chance
};

// Ativar para usuários específicos (canary)
const features = {
  useNewStatusColumn: ['admin@example.com'].includes(user.email)
};
```

### Estratégia 4: Shadow Writing

Escrever em ambas estruturas, mas ler apenas de uma.

```javascript
// services/OrderService.js
class OrderService {
  async createOrder(data) {
    const transaction = await sequelize.transaction();

    try {
      // Escrever no schema novo
      const order = await Order.create(data, { transaction });

      // Shadow write - escrever também no schema antigo (para fallback)
      await LegacyOrder.create({
        ...data,
        new_order_id: order.id
      }, { transaction });

      await transaction.commit();
      return order;

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getOrder(id) {
    // Ler apenas do schema novo
    return Order.findByPk(id);
  }
}
```

## Casos Específicos

### 1. Adicionar Coluna NOT NULL

**Errado (causa downtime):**
```javascript
// Isto falhará se houver registros
await queryInterface.addColumn('users', 'phone', {
  type: Sequelize.STRING,
  allowNull: false  // ERRO!
});
```

**Correto (zero-downtime):**

```javascript
// Migration 1: Adicionar como nullable
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'phone', {
      type: Sequelize.STRING,
      allowNull: true,  // Nullable inicialmente
      defaultValue: ''
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'phone');
  }
};

// Deploy código que preenche phone

// Migration 2: Backfill dados existentes
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      UPDATE users SET phone = '' WHERE phone IS NULL
    `);
  },

  down: async (queryInterface) => {
    // Não desfazer
  }
};

// Migration 3: Tornar NOT NULL
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('users', 'phone', {
      type: Sequelize.STRING,
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('users', 'phone', {
      type: Sequelize.STRING,
      allowNull: true
    });
  }
};
```

### 2. Renomear Coluna

**Errado (causa downtime):**
```javascript
await queryInterface.renameColumn('users', 'name', 'full_name');
// Código antigo quebra imediatamente!
```

**Correto (zero-downtime):**

```javascript
// Migration 1: Adicionar nova coluna
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'full_name', {
      type: Sequelize.STRING,
      allowNull: true
    });
  }
};

// Deploy código que escreve em ambas
class User extends Model {
  static async create(data) {
    return super.create({
      ...data,
      name: data.name,
      full_name: data.name  // Duplicar
    });
  }
}

// Migration 2: Copiar dados
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      UPDATE users SET full_name = name WHERE full_name IS NULL
    `);
  }
};

// Deploy código que lê de full_name

// Migration 3: Remover coluna antiga
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'name');
  }
};
```

### 3. Adicionar Índice

**Problema:** Índices podem travar tabelas grandes.

**Solução: CREATE INDEX CONCURRENTLY (PostgreSQL)**

```javascript
module.exports = {
  up: async (queryInterface) => {
    // PostgreSQL: CONCURRENTLY evita lock
    await queryInterface.sequelize.query(`
      CREATE INDEX CONCURRENTLY idx_users_email ON users(email)
    `);

    console.log('Índice criado sem lock de tabela');
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      DROP INDEX CONCURRENTLY IF EXISTS idx_users_email
    `);
  }
};
```

**Observações:**
- `CONCURRENTLY` não usa transação
- Pode levar mais tempo
- Não trava leituras/escritas
- Específico do PostgreSQL

**Alternativa para MySQL:**

```javascript
module.exports = {
  up: async (queryInterface) => {
    // MySQL: ONLINE DDL (5.6+)
    await queryInterface.sequelize.query(`
      ALTER TABLE users
      ADD INDEX idx_users_email (email)
      ALGORITHM=INPLACE, LOCK=NONE
    `);
  }
};
```

### 4. Remover Coluna

**Correto (zero-downtime):**

```javascript
// Fase 1: Parar de usar a coluna no código
// Deploy código que não lê/escreve na coluna

// Fase 2: Aguardar (dias/semanas)
// Garantir que nenhum servidor antigo está rodando

// Fase 3: Remover coluna
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'old_column');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'old_column', {
      type: Sequelize.STRING,
      allowNull: true
    });
  }
};
```

## Monitoramento Durante Migration

```javascript
// middleware/migration-monitor.js
const prometheus = require('prom-client');

const migrationDuration = new prometheus.Histogram({
  name: 'migration_duration_seconds',
  help: 'Migration duration in seconds',
  labelNames: ['migration_name', 'status']
});

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const migrationName = '20240101-add-phone-column';
    const timer = migrationDuration.startTimer({ migration_name: migrationName });

    try {
      // Executar migration
      await queryInterface.addColumn('users', 'phone', {
        type: Sequelize.STRING
      });

      timer({ status: 'success' });
      console.log(`[OK] ${migrationName}`);

    } catch (error) {
      timer({ status: 'failure' });
      console.error(`[ERRO] ${migrationName}:`, error.message);
      throw error;
    }
  }
};
```

## Health Checks Durante Deploy

```javascript
// routes/health.js
const express = require('express');
const router = express.Router();
const { sequelize } = require('../models');

router.get('/health', async (req, res) => {
  try {
    // Verificar conexão com banco
    await sequelize.authenticate();

    // Verificar migrations aplicadas
    const [migrations] = await sequelize.query(`
      SELECT COUNT(*) as count FROM "SequelizeMeta"
    `);

    // Verificar se schema está correto
    const [columns] = await sequelize.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'users'
    `);

    const hasRequiredColumns = ['id', 'email', 'phone'].every(col =>
      columns.some(c => c.column_name === col)
    );

    if (!hasRequiredColumns) {
      return res.status(503).json({
        status: 'unhealthy',
        reason: 'Missing required database columns'
      });
    }

    res.json({
      status: 'healthy',
      migrations: migrations[0].count,
      database: 'connected'
    });

  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

module.exports = router;
```

**Kubernetes liveness/readiness probe:**

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: app
        image: myapp:latest
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 3
```

## Rollback Strategies

### Rollback Automático

```javascript
// scripts/auto-rollback.js
const axios = require('axios');

async function checkHealth() {
  try {
    const response = await axios.get('http://localhost:3000/health');
    return response.data.status === 'healthy';
  } catch (error) {
    return false;
  }
}

async function deployWithAutoRollback() {
  console.log('Aplicando migrations...');

  // Aplicar migrations
  await exec('npm run migrate');

  console.log('Aguardando estabilização...');
  await sleep(10000);

  // Verificar saúde 5 vezes
  for (let i = 0; i < 5; i++) {
    const healthy = await checkHealth();

    if (!healthy) {
      console.error('Health check falhou! Iniciando rollback...');

      // Rollback automático
      await exec('npm run migrate:undo');

      console.error('Rollback concluído');
      process.exit(1);
    }

    await sleep(2000);
  }

  console.log('Deploy concluído com sucesso!');
}
```

## Checklist de Zero-Downtime

Antes de aplicar migration em produção:

- [ ] Migration é backward compatible?
- [ ] Código funciona com e sem a migration?
- [ ] Usa Expand-Migrate-Contract se necessário?
- [ ] Índices usam CONCURRENTLY?
- [ ] NOT NULL é adicionado em fases?
- [ ] Remoções de colunas têm período de grace?
- [ ] Health checks estão implementados?
- [ ] Rollback automático está configurado?
- [ ] Monitoramento está ativo?
- [ ] Testado em staging com dados reais?
- [ ] Equipe foi notificada?
- [ ] Runbook de rollback está pronto?

## Resumo de Estratégias

| Estratégia | Complexidade | Melhor Para |
|------------|--------------|-------------|
| Expand-Migrate-Contract | Média | Mudanças de schema |
| Blue-Green | Alta | Deploy completo de versão |
| Feature Flags | Baixa | Funcionalidades novas |
| Shadow Writing | Alta | Migrações críticas |
| Índices Concorrentes | Baixa | Adicionar índices |

## Anti-Patterns (O que NÃO fazer)

1. Renomear colunas diretamente
2. Adicionar NOT NULL sem default
3. Remover colunas imediatamente
4. Alterar tipos incompatíveis
5. Criar índices sem CONCURRENTLY em tabelas grandes
6. Deploy sem health checks
7. Não testar rollback

## Exemplo Completo: Migração Crítica

```javascript
// Cenário: Mudar 'status' (string) para 'status_id' (integer com FK)

// Migration 1: Criar tabela de status
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('order_statuses', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, unique: true },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE
    });

    // Seed com status existentes
    await queryInterface.bulkInsert('order_statuses', [
      { id: 1, name: 'pending', created_at: new Date(), updated_at: new Date() },
      { id: 2, name: 'completed', created_at: new Date(), updated_at: new Date() },
      { id: 3, name: 'cancelled', created_at: new Date(), updated_at: new Date() }
    ]);
  }
};

// Migration 2: Adicionar status_id (nullable)
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('orders', 'status_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'order_statuses', key: 'id' }
    });
  }
};

// Deploy: Código que escreve em ambas colunas

// Migration 3: Backfill status_id
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      UPDATE orders o
      SET status_id = s.id
      FROM order_statuses s
      WHERE o.status = s.name
      AND o.status_id IS NULL
    `);
  }
};

// Deploy: Código que lê de status_id

// Migration 4: Remover coluna antiga
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.removeColumn('orders', 'status');
  }
};
```

Este processo pode levar **dias ou semanas**, mas garante zero-downtime.

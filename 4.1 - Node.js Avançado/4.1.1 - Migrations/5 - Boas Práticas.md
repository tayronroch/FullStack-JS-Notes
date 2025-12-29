# Boas Práticas com Migrations

## Regras Fundamentais

### 1. Nunca Edite Migrations Aplicadas

 **Errado:**
```javascript
// Migration já aplicada em produção
// NÃO FAÇA ISSO!
exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id');
    table.string('email');
    table.string('phone'); // Adicionado depois
  });
};
```

 **Correto:**
```javascript
// Crie uma NOVA migration
exports.up = function(knex) {
  return knex.schema.table('users', (table) => {
    table.string('phone');
  });
};
```

### 2. Sempre Implemente Rollback (DOWN)

 **Errado:**
```javascript
exports.up = async (queryInterface, Sequelize) => {
  await queryInterface.addColumn('users', 'age', {
    type: Sequelize.INTEGER
  });
};

exports.down = async (queryInterface, Sequelize) => {
  // Vazio - RUIM!
};
```

 **Correto:**
```javascript
exports.up = async (queryInterface, Sequelize) => {
  await queryInterface.addColumn('users', 'age', {
    type: Sequelize.INTEGER
  });
};

exports.down = async (queryInterface, Sequelize) => {
  await queryInterface.removeColumn('users', 'age');
};
```

### 3. Mantenha Migrations Pequenas e Focadas

 **Errado:**
```javascript
// Migration fazendo muitas coisas
exports.up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('users', {...});
  await queryInterface.createTable('posts', {...});
  await queryInterface.createTable('comments', {...});
  await queryInterface.addIndex('users', ['email']);
  await queryInterface.addColumn('posts', 'views', {...});
};
```

 **Correto:**
```javascript
// Migration 1: create_users_table
// Migration 2: create_posts_table
// Migration 3: create_comments_table
// Migration 4: add_index_to_users_email
// Migration 5: add_views_to_posts
```

## Nomenclatura

### Use Nomes Descritivos

 **Errado:**
- `migration1.js`
- `update.js`
- `fix.js`

 **Correto:**
- `create_users_table.js`
- `add_email_index_to_users.js`
- `add_published_column_to_posts.js`

### Padrão Recomendado

```
[timestamp]_[acao]_[entidade]_[complemento].js

Exemplos:
20240101_create_users_table.js
20240102_add_email_index_to_users.js
20240103_add_foreign_key_to_posts.js
```

## Ordem de Criação

### Respeite Dependências

 **Correto:**
```javascript
// 1. Criar tabela pai
exports.up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('users', {
    id: { type: Sequelize.INTEGER, primaryKey: true }
  });
};

// 2. Depois criar tabela filha
exports.up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('posts', {
    id: { type: Sequelize.INTEGER, primaryKey: true },
    userId: {
      type: Sequelize.INTEGER,
      references: { model: 'users', key: 'id' }
    }
  });
};
```

## Dados vs. Schema

### Migrations são para Schema

 **Evite colocar dados em migrations:**
```javascript
exports.up = async (queryInterface) => {
  await queryInterface.bulkInsert('users', [
    { name: 'Admin', email: 'admin@example.com' }
  ]);
};
```

 **Use Seeders para dados:**
```javascript
// seeders/demo-users.js
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('users', [
      { name: 'Admin', email: 'admin@example.com' }
    ]);
  }
};
```

**Exceção:** Dados essenciais para funcionamento podem estar em migrations.

## Segurança em Produção

### 1. Teste Antes de Aplicar

```bash
# Em staging/homologação primeiro
npx knex migrate:latest

# Teste rollback
npx knex migrate:rollback

# Se tudo OK, aplique em produção
```

### 2. Backup Antes de Migrar

```bash
# PostgreSQL
pg_dump meu_banco > backup_pre_migration.sql

# MySQL
mysqldump meu_banco > backup_pre_migration.sql
```

### 3. Use Transações

```javascript
exports.up = async (queryInterface, Sequelize) => {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    await queryInterface.addColumn('users', 'age', {
      type: Sequelize.INTEGER
    }, { transaction });

    await queryInterface.addIndex('users', ['age'], {
      transaction
    });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
```

## Migrations Destrutivas

### Cuidado ao Remover Colunas

 **Perigoso em produção:**
```javascript
exports.up = async (queryInterface) => {
  // Dados serão perdidos!
  await queryInterface.removeColumn('users', 'old_field');
};
```

 **Abordagem segura:**
```javascript
// Migration 1: Marcar como deprecated
exports.up = async (queryInterface, Sequelize) => {
  await queryInterface.renameColumn('users', 'old_field', 'old_field_deprecated');
};

// Aguardar alguns deploys...

// Migration 2: Remover depois de confirmar que não está em uso
exports.up = async (queryInterface) => {
  await queryInterface.removeColumn('users', 'old_field_deprecated');
};
```

## Performance

### Índices Grandes

```javascript
// Para tabelas grandes, use CONCURRENTLY (PostgreSQL)
exports.up = async (queryInterface) => {
  await queryInterface.sequelize.query(
    'CREATE INDEX CONCURRENTLY users_email_idx ON users(email)'
  );
};
```

### Alterações em Tabelas Grandes

```javascript
// Evite em horários de pico
exports.up = async (queryInterface, Sequelize) => {
  // Isso pode travar a tabela por muito tempo
  await queryInterface.changeColumn('users', 'email', {
    type: Sequelize.STRING(500)
  });
};
```

## Versionamento (Git)

### Sempre Commite Migrations

```bash
git add db/migrations/
git commit -m "feat: add email index to users table"
git push
```

### .gitignore Correto

```gitignore
# NÃO ignore migrations
# db/migrations/  

# Ignore dados sensíveis
.env
config/database.yml
```

## Boas Práticas de Implementação em Produção

### 1. Proibição de Alterações Manuais no Banco

**NUNCA** faça alterações diretas no banco de dados em produção.

 **Errado:**
```sql
-- Conectar direto no banco e executar
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
```

**Por que é ruim:**
- Sem versionamento
- Sem rollback
- Sem histórico
- Inconsistência entre ambientes
- Sem code review

 **Correto:**
```javascript
// Criar migration versionada
exports.up = function(knex) {
  return knex.schema.table('users', (table) => {
    table.string('phone', 20);
  });
};

exports.down = function(knex) {
  return knex.schema.table('users', (table) => {
    table.dropColumn('phone');
  });
};
```

### 2. Controle de Acesso ao Banco de Dados

```javascript
// config/database.js

const dbConfig = {
  development: {
    client: 'postgresql',
    connection: {
      host: 'localhost',
      user: 'dev_user',
      password: process.env.DEV_DB_PASSWORD,
      database: 'myapp_dev'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST,
      // Usuário com permissões RESTRITAS
      user: 'app_user',  // Sem acesso direto ao schema
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    }
  },

  // Usuário separado apenas para migrations
  migrations: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST,
      user: 'migration_user',  // Acesso apenas para DDL
      password: process.env.MIGRATION_PASSWORD,
      database: process.env.DB_NAME
    }
  }
};
```

**Permissões PostgreSQL:**
```sql
-- Usuário da aplicação (apenas DML)
CREATE USER app_user WITH PASSWORD 'secure_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
REVOKE CREATE ON SCHEMA public FROM app_user;

-- Usuário de migrations (DDL)
CREATE USER migration_user WITH PASSWORD 'secure_migration_password';
GRANT ALL PRIVILEGES ON SCHEMA public TO migration_user;
```

### 3. Versionamento de API para Migrations

Para aplicações com API, use versionamento para migrations administrativas:

```javascript
// routes/api/v1/admin/migrations.js

const express = require('express');
const router = express.Router();

// Middleware de autenticação ADMIN
const requireAdmin = require('../../../../middleware/requireAdmin');
const migrationLogger = require('../../../../middleware/migrationLogger');

// Endpoint protegido para executar migrations
router.post('/migrations/run',
  requireAdmin,           // Apenas admins
  migrationLogger,        // Log de auditoria
  async (req, res) => {
    try {
      // Verificar ambiente
      if (process.env.NODE_ENV === 'production' && !req.body.confirmed) {
        return res.status(400).json({
          error: 'Confirmation required for production migrations',
          message: 'Add { "confirmed": true } to proceed'
        });
      }

      // Executar migrations
      const result = await runMigrations();

      // Log de auditoria
      await auditLog.create({
        action: 'MIGRATION_RUN',
        userId: req.user.id,
        timestamp: new Date(),
        details: result
      });

      res.json({
        success: true,
        message: 'Migrations executed successfully',
        result
      });

    } catch (error) {
      // Log de erro
      await auditLog.create({
        action: 'MIGRATION_FAILED',
        userId: req.user.id,
        timestamp: new Date(),
        error: error.message
      });

      res.status(500).json({
        error: 'Migration failed',
        message: error.message
      });
    }
  }
);

// Endpoint para verificar status
router.get('/migrations/status',
  requireAdmin,
  async (req, res) => {
    const pending = await getPendingMigrations();
    const applied = await getAppliedMigrations();

    res.json({
      pending,
      applied,
      needsMigration: pending.length > 0
    });
  }
);

// Endpoint para rollback (CUIDADO!)
router.post('/migrations/rollback',
  requireAdmin,
  migrationLogger,
  async (req, res) => {
    // Require explicit confirmation
    if (!req.body.migrationName || !req.body.confirmed) {
      return res.status(400).json({
        error: 'Migration name and confirmation required'
      });
    }

    // Rollback específico
    const result = await rollbackMigration(req.body.migrationName);

    await auditLog.create({
      action: 'MIGRATION_ROLLBACK',
      userId: req.user.id,
      migrationName: req.body.migrationName,
      timestamp: new Date()
    });

    res.json({ success: true, result });
  }
);

module.exports = router;
```

**Uso da API:**
```bash
# Verificar status
curl -X GET https://api.myapp.com/api/v1/admin/migrations/status \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Executar migrations
curl -X POST https://api.myapp.com/api/v1/admin/migrations/run \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"confirmed": true}'
```

### 4. Automação via CI/CD

**GitHub Actions:**
```yaml
# .github/workflows/deploy.yml

name: Deploy with Migrations

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      # Executar migrations AUTOMATICAMENTE em staging
      - name: Run migrations (Staging)
        if: github.ref == 'refs/heads/develop'
        env:
          DATABASE_URL: ${{ secrets.STAGING_DATABASE_URL }}
        run: npm run migrate

      # Executar migrations em produção (com aprovação manual)
      - name: Run migrations (Production)
        if: github.ref == 'refs/heads/main'
        env:
          DATABASE_URL: ${{ secrets.PRODUCTION_DATABASE_URL }}
        run: |
          echo "Running production migrations..."
          npm run migrate
          echo "Migrations completed"

      - name: Deploy application
        run: ./deploy.sh
```

### 5. Logs e Auditoria

```javascript
// middleware/migrationLogger.js

const fs = require('fs');
const path = require('path');

module.exports = async (req, res, next) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    user: req.user.email,
    userId: req.user.id,
    action: req.path,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('user-agent')
  };

  // Log em arquivo
  const logPath = path.join(__dirname, '../logs/migrations.log');
  fs.appendFileSync(logPath, JSON.stringify(logEntry) + '\n');

  // Log em banco (audit table)
  await db.audit_logs.create({
    ...logEntry,
    category: 'MIGRATION'
  });

  next();
};
```

### 6. Proteção de Branches

**Configuração do GitHub:**
- Settings → Branches → Branch protection rules
- Protect branch: `main`
- Require pull request reviews: 2 approvers
- Require status checks: migrations tests must pass

**Hook pre-commit:**
```bash
# .git/hooks/pre-commit

#!/bin/bash

# Verificar se há migrations pendentes
if npm run migrate:status | grep -q "pending"; then
  echo "ERROR: Pending migrations detected!"
  echo "Run 'npm run migrate' before committing"
  exit 1
fi

echo "No pending migrations - OK"
```

### 7. Monitoramento de Migrations

```javascript
// scripts/check-migrations.js

const knex = require('knex')(require('./knexfile'));

async function checkMigrations() {
  try {
    const [current, pending] = await Promise.all([
      knex.migrate.currentVersion(),
      knex.migrate.list()
    ]);

    const pendingMigrations = pending[1];

    if (pendingMigrations.length > 0) {
      console.warn('WARNING: Pending migrations detected!');
      console.warn('Pending:', pendingMigrations);

      // Enviar alerta (Slack, email, etc.)
      await sendAlert({
        type: 'PENDING_MIGRATIONS',
        count: pendingMigrations.length,
        migrations: pendingMigrations
      });

      process.exit(1);
    }

    console.log('All migrations up to date');
    process.exit(0);

  } catch (error) {
    console.error('Error checking migrations:', error);
    process.exit(1);
  }
}

checkMigrations();
```

**Executar em produção:**
```bash
# Cron job diário
0 9 * * * /usr/bin/node /path/to/check-migrations.js
```

### 8. Regras de Ouro

1. **Migrations SOMENTE via código versionado**
   - NUNCA altere banco manualmente
   - SEMPRE use migrations

2. **Code Review obrigatório**
   - Toda migration deve ser revisada
   - Mínimo 2 aprovadores

3. **Teste em Staging primeiro**
   - SEMPRE teste em ambiente similar a produção
   - Valide rollback

4. **Backup obrigatório**
   - Backup automático antes de migrations
   - Retenção de 30 dias

5. **Acesso restrito**
   - Apenas DBAs/DevOps podem executar migrations em produção
   - Logs de auditoria de todas as operações

6. **Aprovação explícita em produção**
   - Confirmação manual ou via API
   - Notificação à equipe

## Checklist de Revisão

Antes de aplicar uma migration, verifique:

- [ ] Migration tem nome descritivo?
- [ ] Implementa `up` e `down`?
- [ ] Testou `up` e `down` localmente?
- [ ] Está usando transação se necessário?
- [ ] Não remove dados sem plano de backup?
- [ ] Respeita dependências de outras tabelas?
- [ ] Foi revisada por outro desenvolvedor?
- [ ] Está commitada no Git?
- [ ] Backup do banco foi feito (produção)?
- [ ] Não há alterações manuais no banco?
- [ ] Logs de auditoria configurados?
- [ ] Testado em staging primeiro?

## Resumo

| Fazer  | Não Fazer  |
|---------|-------------|
| Nomes descritivos | Nomes genéricos |
| Migrations pequenas | Migrations gigantes |
| Sempre implementar `down` | Deixar `down` vazio |
| Testar rollback | Aplicar direto em produção |
| Usar transações | Ignorar erros |
| Versionar no Git | Editar migrations aplicadas |
| Fazer backup | Remover colunas sem plano |
| Usar seeders para dados | Dados em migrations |

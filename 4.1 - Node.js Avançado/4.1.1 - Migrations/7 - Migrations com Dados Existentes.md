# Migrations com Dados Existentes

## O Desafio

Aplicar migrations em bancos de dados que já contêm dados de produção é um dos cenários mais delicados no desenvolvimento de software.

```
Banco Vazio: Migration simples
Banco com Dados: Requer planejamento cuidadoso
```

## Cenários Comuns

### 1. Adicionar Coluna NOT NULL

**Problema:**
```sql
-- Isto falhará se a tabela tiver registros
ALTER TABLE users ADD COLUMN phone VARCHAR(20) NOT NULL;
```

**Erro:**
```
ERROR: column "phone" contains null values
```

### Solução 1: Valor Padrão Temporário

```javascript
// Migration com Sequelize
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Passo 1: Adicionar coluna como nullable
    await queryInterface.addColumn('users', 'phone', {
      type: Sequelize.STRING(20),
      allowNull: true
    });

    // Passo 2: Preencher com valor padrão
    await queryInterface.sequelize.query(`
      UPDATE users SET phone = 'N/A' WHERE phone IS NULL
    `);

    // Passo 3: Tornar NOT NULL
    await queryInterface.changeColumn('users', 'phone', {
      type: Sequelize.STRING(20),
      allowNull: false
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'phone');
  }
};
```

### Solução 2: Valor Padrão no Banco

```javascript
// Migration com Knex
exports.up = async function(knex) {
  await knex.schema.table('users', (table) => {
    // Adicionar com valor padrão
    table.string('phone', 20).notNullable().defaultTo('N/A');
  });
};

exports.down = async function(knex) {
  await knex.schema.table('users', (table) => {
    table.dropColumn('phone');
  });
};
```

### Solução 3: Backfill em Múltiplas Etapas (Tabelas Grandes)

```javascript
// Migration para tabelas com milhões de registros
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // 1. Adicionar coluna nullable
      await queryInterface.addColumn('users', 'phone', {
        type: Sequelize.STRING(20),
        allowNull: true
      }, { transaction });

      await transaction.commit();

      // 2. Preencher em lotes (fora da transação)
      const batchSize = 1000;
      let offset = 0;
      let hasMore = true;

      while (hasMore) {
        const [results] = await queryInterface.sequelize.query(`
          UPDATE users
          SET phone = 'N/A'
          WHERE phone IS NULL
          AND id IN (
            SELECT id FROM users
            WHERE phone IS NULL
            LIMIT ${batchSize}
          )
        `);

        hasMore = results.rowCount === batchSize;
        offset += batchSize;

        console.log(`Processed ${offset} records...`);

        // Pausa para evitar sobrecarga
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // 3. Tornar NOT NULL em transação separada
      const transaction2 = await queryInterface.sequelize.transaction();

      await queryInterface.changeColumn('users', 'phone', {
        type: Sequelize.STRING(20),
        allowNull: false
      }, { transaction: transaction2 });

      await transaction2.commit();

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'phone');
  }
};
```

## 2. Alterar Tipo de Coluna

### Problema: Converter String para Integer

```sql
-- Dados existentes: email, age = "25", "30", "invalid"
ALTER TABLE users ALTER COLUMN age TYPE INTEGER;
-- ERRO: invalid input syntax for integer: "invalid"
```

### Solução: Migração em Fases

```javascript
// Migration 1: Criar nova coluna
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'age_new', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'age_new');
  }
};

// Migration 2: Migrar dados com validação
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Copiar dados válidos
    await queryInterface.sequelize.query(`
      UPDATE users
      SET age_new = CAST(age AS INTEGER)
      WHERE age ~ '^[0-9]+$'
    `);

    // Tratar dados inválidos
    await queryInterface.sequelize.query(`
      UPDATE users
      SET age_new = NULL
      WHERE age !~ '^[0-9]+$'
    `);

    // Log de registros afetados
    const [invalid] = await queryInterface.sequelize.query(`
      SELECT COUNT(*) as count
      FROM users
      WHERE age !~ '^[0-9]+$'
    `);

    console.log(`${invalid[0].count} registros com idade inválida foram definidos como NULL`);
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      UPDATE users SET age_new = NULL
    `);
  }
};

// Migration 3: Trocar colunas
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Remover coluna antiga
      await queryInterface.removeColumn('users', 'age', { transaction });

      // Renomear nova coluna
      await queryInterface.renameColumn('users', 'age_new', 'age', { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.renameColumn('users', 'age', 'age_new', { transaction });

      await queryInterface.addColumn('users', 'age', {
        type: Sequelize.STRING
      }, { transaction });

      await queryInterface.sequelize.query(`
        UPDATE users SET age = CAST(age_new AS VARCHAR)
      `, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
```

## 3. Adicionar Foreign Key

### Problema: Dados Órfãos

```sql
-- Tabela posts tem registros com user_id = 999
-- Mas não existe user com id = 999

ALTER TABLE posts
ADD CONSTRAINT fk_posts_users
FOREIGN KEY (user_id) REFERENCES users(id);

-- ERRO: insert or update on table "posts" violates foreign key constraint
```

### Solução: Limpeza Antes da Constraint

```javascript
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Encontrar registros órfãos
    const [orphans] = await queryInterface.sequelize.query(`
      SELECT COUNT(*) as count
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      WHERE u.id IS NULL
    `);

    console.log(`Encontrados ${orphans[0].count} posts órfãos`);

    // 2. Decidir o que fazer com órfãos

    // Opção A: Deletar órfãos
    await queryInterface.sequelize.query(`
      DELETE FROM posts
      WHERE user_id NOT IN (SELECT id FROM users)
    `);

    // Opção B: Atribuir a usuário padrão
    /*
    const [defaultUser] = await queryInterface.sequelize.query(`
      INSERT INTO users (name, email, created_at, updated_at)
      VALUES ('Deleted User', 'deleted@system.local', NOW(), NOW())
      RETURNING id
    `);

    await queryInterface.sequelize.query(`
      UPDATE posts
      SET user_id = ${defaultUser[0].id}
      WHERE user_id NOT IN (SELECT id FROM users)
    `);
    */

    // 3. Adicionar constraint
    await queryInterface.addConstraint('posts', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_posts_users',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeConstraint('posts', 'fk_posts_users');
  }
};
```

## 4. Migração de Dados Complexos

### Normalização de Dados

**Cenário:** Dividir campo "full_name" em "first_name" e "last_name"

```javascript
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // 1. Adicionar novas colunas
      await queryInterface.addColumn('users', 'first_name', {
        type: Sequelize.STRING,
        allowNull: true
      }, { transaction });

      await queryInterface.addColumn('users', 'last_name', {
        type: Sequelize.STRING,
        allowNull: true
      }, { transaction });

      // 2. Migrar dados
      await queryInterface.sequelize.query(`
        UPDATE users
        SET
          first_name = SPLIT_PART(full_name, ' ', 1),
          last_name = CASE
            WHEN full_name LIKE '% %' THEN
              SUBSTRING(full_name FROM POSITION(' ' IN full_name) + 1)
            ELSE
              ''
          END
        WHERE full_name IS NOT NULL
      `, { transaction });

      // 3. Tornar obrigatório (se apropriado)
      await queryInterface.changeColumn('users', 'first_name', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      }, { transaction });

      // 4. Remover coluna antiga (CUIDADO!)
      // Apenas em nova migration, depois de validar
      // await queryInterface.removeColumn('users', 'full_name', { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Restaurar full_name
      await queryInterface.addColumn('users', 'full_name', {
        type: Sequelize.STRING
      }, { transaction });

      await queryInterface.sequelize.query(`
        UPDATE users
        SET full_name = CONCAT(first_name, ' ', last_name)
      `, { transaction });

      await queryInterface.removeColumn('users', 'first_name', { transaction });
      await queryInterface.removeColumn('users', 'last_name', { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
```

## 5. Transformação de JSON/JSONB

### Migrar de Coluna JSON para Tabela Relacionada

**Cenário:** Migrar endereços armazenados em JSON para tabela separada

```javascript
// Antes: users.address = {"street": "...", "city": "..."}
// Depois: tabela addresses com foreign key

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // 1. Criar tabela addresses
      await queryInterface.createTable('addresses', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        user_id: {
          type: Sequelize.INTEGER,
          references: { model: 'users', key: 'id' },
          onDelete: 'CASCADE'
        },
        street: Sequelize.STRING,
        city: Sequelize.STRING,
        state: Sequelize.STRING,
        zip_code: Sequelize.STRING,
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE
      }, { transaction });

      // 2. Migrar dados do JSON para tabela
      const [users] = await queryInterface.sequelize.query(`
        SELECT id, address FROM users WHERE address IS NOT NULL
      `, { transaction });

      for (const user of users) {
        const address = typeof user.address === 'string'
          ? JSON.parse(user.address)
          : user.address;

        if (address && typeof address === 'object') {
          await queryInterface.sequelize.query(`
            INSERT INTO addresses (user_id, street, city, state, zip_code, created_at, updated_at)
            VALUES (:userId, :street, :city, :state, :zipCode, NOW(), NOW())
          `, {
            replacements: {
              userId: user.id,
              street: address.street || null,
              city: address.city || null,
              state: address.state || null,
              zipCode: address.zip_code || null
            },
            transaction
          });
        }
      }

      console.log(`Migrados ${users.length} endereços para tabela separada`);

      // 3. Remover coluna JSON (em migration separada)
      // await queryInterface.removeColumn('users', 'address', { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Restaurar JSON
      const [addresses] = await queryInterface.sequelize.query(`
        SELECT * FROM addresses
      `, { transaction });

      for (const addr of addresses) {
        const addressJson = JSON.stringify({
          street: addr.street,
          city: addr.city,
          state: addr.state,
          zip_code: addr.zip_code
        });

        await queryInterface.sequelize.query(`
          UPDATE users
          SET address = :addressJson
          WHERE id = :userId
        `, {
          replacements: {
            addressJson,
            userId: addr.user_id
          },
          transaction
        });
      }

      await queryInterface.dropTable('addresses', { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
```

## 6. Estratégia de Deploy Segura

### Padrão de 3 Migrations (Expand-Migrate-Contract)

**Fase 1: Expand (Expandir)**
```javascript
// Migration 1: Adicionar nova estrutura sem quebrar código antigo
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Adicionar nova coluna mantendo antiga
    await queryInterface.addColumn('users', 'email_new', {
      type: Sequelize.STRING,
      allowNull: true
    });

    // Código antigo continua funcionando com 'email'
    // Código novo pode usar 'email_new'
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'email_new');
  }
};
```

**Fase 2: Migrate (Migrar)**
```javascript
// Migration 2: Copiar dados da coluna antiga para nova
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      UPDATE users SET email_new = LOWER(email) WHERE email IS NOT NULL
    `);

    // Deploy código que usa email_new
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      UPDATE users SET email_new = NULL
    `);
  }
};
```

**Fase 3: Contract (Contrair)**
```javascript
// Migration 3: Remover estrutura antiga
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Remover coluna antiga
      await queryInterface.removeColumn('users', 'email', { transaction });

      // Renomear nova coluna
      await queryInterface.renameColumn('users', 'email_new', 'email', { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.renameColumn('users', 'email', 'email_new', { transaction });

      await queryInterface.addColumn('users', 'email', {
        type: Sequelize.STRING
      }, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
```

## 7. Validação de Dados Antes da Migration

```javascript
// Script de validação pré-migration
async function validateData() {
  const { sequelize } = require('../models');

  console.log('Validando dados antes da migration...');

  // Verificar dados inválidos
  const [invalidEmails] = await sequelize.query(`
    SELECT COUNT(*) as count
    FROM users
    WHERE email NOT LIKE '%@%'
  `);

  if (invalidEmails[0].count > 0) {
    console.error(`ERRO: ${invalidEmails[0].count} emails inválidos encontrados`);
    process.exit(1);
  }

  // Verificar órfãos
  const [orphans] = await sequelize.query(`
    SELECT COUNT(*) as count
    FROM posts p
    LEFT JOIN users u ON p.user_id = u.id
    WHERE u.id IS NULL
  `);

  if (orphans[0].count > 0) {
    console.error(`ERRO: ${orphans[0].count} posts órfãos encontrados`);
    process.exit(1);
  }

  console.log('Validação concluída com sucesso!');
}

module.exports = { validateData };
```

```json
// package.json
{
  "scripts": {
    "migrate:validate": "node scripts/validate-data.js",
    "migrate:safe": "npm run migrate:validate && npm run migrate"
  }
}
```

## 8. Backup e Restore

### Backup Automático Antes de Migration

```javascript
// scripts/migrate-with-backup.js
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function migrateWithBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = `backup_${timestamp}.sql`;

  try {
    console.log('Criando backup...');

    // PostgreSQL
    await execPromise(`pg_dump ${process.env.DATABASE_URL} > ${backupFile}`);

    console.log(`Backup criado: ${backupFile}`);
    console.log('Executando migrations...');

    // Executar migrations
    await execPromise('npx sequelize-cli db:migrate');

    console.log('Migrations aplicadas com sucesso!');
    console.log(`Backup disponível em: ${backupFile}`);

  } catch (error) {
    console.error('Erro durante migration:', error.message);
    console.log(`Para restaurar: psql ${process.env.DATABASE_URL} < ${backupFile}`);
    process.exit(1);
  }
}

migrateWithBackup();
```

## 9. Monitoramento Durante Migration

```javascript
// Migration com logging detalhado
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const startTime = Date.now();

    try {
      console.log('[MIGRATION] Iniciando migration...');

      // 1. Contar registros afetados
      const [beforeCount] = await queryInterface.sequelize.query(
        'SELECT COUNT(*) as count FROM users WHERE phone IS NULL'
      );
      console.log(`[MIGRATION] Registros a processar: ${beforeCount[0].count}`);

      // 2. Executar migration
      await queryInterface.addColumn('users', 'phone', {
        type: Sequelize.STRING(20),
        allowNull: true
      });

      // 3. Backfill
      const [result] = await queryInterface.sequelize.query(`
        UPDATE users SET phone = 'N/A' WHERE phone IS NULL
      `);
      console.log(`[MIGRATION] Registros atualizados: ${result.rowCount || 0}`);

      // 4. Tornar NOT NULL
      await queryInterface.changeColumn('users', 'phone', {
        type: Sequelize.STRING(20),
        allowNull: false
      });

      // 5. Verificar
      const [afterCount] = await queryInterface.sequelize.query(
        'SELECT COUNT(*) as count FROM users WHERE phone IS NULL'
      );
      console.log(`[MIGRATION] Registros NULL restantes: ${afterCount[0].count}`);

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`[MIGRATION] Concluída em ${duration}s`);

    } catch (error) {
      console.error('[MIGRATION] Erro:', error.message);
      throw error;
    }
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'phone');
  }
};
```

## Checklist de Segurança

Antes de aplicar migration com dados existentes:

- [ ] Backup do banco foi criado?
- [ ] Migration foi testada em ambiente de staging?
- [ ] Dados inválidos foram identificados?
- [ ] Estratégia para dados órfãos foi definida?
- [ ] Impacto de performance foi avaliado?
- [ ] Transações estão sendo usadas onde apropriado?
- [ ] Rollback foi testado?
- [ ] Logging está implementado?
- [ ] Equipe foi notificada?
- [ ] Janela de manutenção foi agendada (se necessário)?
- [ ] Script de validação pós-migration existe?

## Resumo de Estratégias

| Cenário | Estratégia Recomendada |
|---------|------------------------|
| Adicionar NOT NULL | Adicionar nullable → Backfill → Tornar NOT NULL |
| Alterar tipo | Criar nova coluna → Migrar dados → Trocar colunas |
| Foreign key | Limpar órfãos → Adicionar constraint |
| Normalizar dados | Expand-Migrate-Contract (3 migrations) |
| Tabela grande | Processar em lotes com pausas |
| Dados JSON → Tabela | Criar tabela → Migrar → Validar → Remover JSON |
| Produção crítica | Backup → Validar → Migrar → Verificar → Monitorar |

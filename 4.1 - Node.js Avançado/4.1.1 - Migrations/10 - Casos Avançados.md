# Casos Avançados de Migrations

## 1. Renomear Tabela

### Problema

Renomear tabelas diretamente quebra código em produção.

```javascript
// ERRADO - Quebra tudo imediatamente
await queryInterface.renameTable('users', 'accounts');
```

### Solução: Estratégia Multi-Step

#### Passo 1: Criar View com Nome Antigo

```javascript
// Migration 1: Renomear e criar view
module.exports = {
  up: async (queryInterface) => {
    // 1. Renomear tabela
    await queryInterface.renameTable('users', 'accounts');

    // 2. Criar view com nome antigo
    await queryInterface.sequelize.query(`
      CREATE VIEW users AS SELECT * FROM accounts
    `);

    console.log('Tabela renomeada. View criada para compatibilidade.');
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.query('DROP VIEW IF EXISTS users');
    await queryInterface.renameTable('accounts', 'users');
  }
};

// Código antigo continua funcionando via view
// Código novo pode usar 'accounts' diretamente
```

#### Passo 2: Atualizar Código Gradualmente

```javascript
// Antes
const users = await db.query('SELECT * FROM users');

// Depois
const users = await db.query('SELECT * FROM accounts');
```

#### Passo 3: Remover View

```javascript
// Migration 2: Remover view (após todo código atualizado)
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query('DROP VIEW users');
    console.log('View removida. Migração completa.');
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      CREATE VIEW users AS SELECT * FROM accounts
    `);
  }
};
```

### Alternativa: Shadow Table

```javascript
// Migration 1: Criar nova tabela
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Copiar estrutura
    await queryInterface.sequelize.query(`
      CREATE TABLE accounts (LIKE users INCLUDING ALL)
    `);

    // Copiar dados
    await queryInterface.sequelize.query(`
      INSERT INTO accounts SELECT * FROM users
    `);
  }
};

// Migration 2: Trigger para sincronizar
module.exports = {
  up: async (queryInterface) => {
    // Sincronizar INSERT
    await queryInterface.sequelize.query(`
      CREATE TRIGGER sync_insert_to_accounts
      AFTER INSERT ON users
      FOR EACH ROW
      EXECUTE FUNCTION mirror_to_accounts()
    `);

    // Sincronizar UPDATE
    await queryInterface.sequelize.query(`
      CREATE TRIGGER sync_update_to_accounts
      AFTER UPDATE ON users
      FOR EACH ROW
      EXECUTE FUNCTION mirror_to_accounts()
    `);
  }
};

// Migration 3: Remover tabela antiga (após deploy)
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query('DROP TRIGGER sync_insert_to_accounts ON users');
    await queryInterface.sequelize.query('DROP TRIGGER sync_update_to_accounts ON users');
    await queryInterface.dropTable('users');
  }
};
```

## 2. Renomear Coluna

### Estratégia: Expand-Copy-Contract

```javascript
// Migration 1: Adicionar nova coluna
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'full_name', {
      type: Sequelize.STRING,
      allowNull: true
    });

    // Copiar dados existentes
    await queryInterface.sequelize.query(`
      UPDATE users SET full_name = name WHERE full_name IS NULL
    `);
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'full_name');
  }
};

// Deploy: Código que escreve em ambas colunas
class User extends Model {
  static async create(data) {
    return super.create({
      ...data,
      name: data.name,
      full_name: data.name  // Duplicar
    });
  }

  static async update(id, data) {
    const updates = { ...data };
    if (updates.name) {
      updates.full_name = updates.name;
    }
    return super.update(updates, { where: { id } });
  }
}

// Migration 2: Remover coluna antiga
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'name');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'name', {
      type: Sequelize.STRING
    });

    await queryInterface.sequelize.query(`
      UPDATE users SET name = full_name WHERE name IS NULL
    `);
  }
};
```

## 3. Split Table (Dividir Tabela)

### Cenário: Separar endereços em tabela própria

**Antes:**
```
users (id, name, email, street, city, state, zip)
```

**Depois:**
```
users (id, name, email)
addresses (id, user_id, street, city, state, zip)
```

### Implementação

```javascript
// Migration 1: Criar tabela addresses
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('addresses', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'
      },
      street: Sequelize.STRING,
      city: Sequelize.STRING,
      state: Sequelize.STRING(2),
      zip: Sequelize.STRING(10),
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE
    });

    await queryInterface.addIndex('addresses', ['user_id']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('addresses');
  }
};

// Migration 2: Migrar dados
module.exports = {
  up: async (queryInterface) => {
    // Copiar endereços para nova tabela
    await queryInterface.sequelize.query(`
      INSERT INTO addresses (user_id, street, city, state, zip, created_at, updated_at)
      SELECT
        id,
        street,
        city,
        state,
        zip,
        NOW(),
        NOW()
      FROM users
      WHERE street IS NOT NULL
    `);

    console.log('Endereços migrados para tabela separada');
  },

  down: async (queryInterface) => {
    // Restaurar endereços em users
    await queryInterface.sequelize.query(`
      UPDATE users u
      SET
        street = a.street,
        city = a.city,
        state = a.state,
        zip = a.zip
      FROM addresses a
      WHERE u.id = a.user_id
    `);

    await queryInterface.sequelize.query('DELETE FROM addresses');
  }
};

// Deploy: Código que lê de ambas tabelas

// Migration 3: Remover colunas antigas de users
module.exports = {
  up: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.removeColumn('users', 'street', { transaction });
      await queryInterface.removeColumn('users', 'city', { transaction });
      await queryInterface.removeColumn('users', 'state', { transaction });
      await queryInterface.removeColumn('users', 'zip', { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.addColumn('users', 'street', {
        type: Sequelize.STRING
      }, { transaction });

      await queryInterface.addColumn('users', 'city', {
        type: Sequelize.STRING
      }, { transaction });

      await queryInterface.addColumn('users', 'state', {
        type: Sequelize.STRING(2)
      }, { transaction });

      await queryInterface.addColumn('users', 'zip', {
        type: Sequelize.STRING(10)
      }, { transaction });

      // Restaurar dados
      await queryInterface.sequelize.query(`
        UPDATE users u
        SET
          street = a.street,
          city = a.city,
          state = a.state,
          zip = a.zip
        FROM addresses a
        WHERE u.id = a.user_id
      `, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
```

## 4. Merge Tables (Unir Tabelas)

### Cenário: Unir tabelas relacionadas em uma só

**Antes:**
```
users (id, name, email)
profiles (id, user_id, bio, avatar)
```

**Depois:**
```
users (id, name, email, bio, avatar)
```

### Implementação

```javascript
// Migration 1: Adicionar colunas em users
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.addColumn('users', 'bio', {
        type: Sequelize.TEXT,
        allowNull: true
      }, { transaction });

      await queryInterface.addColumn('users', 'avatar', {
        type: Sequelize.STRING,
        allowNull: true
      }, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.removeColumn('users', 'bio', { transaction });
      await queryInterface.removeColumn('users', 'avatar', { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};

// Migration 2: Copiar dados
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      UPDATE users u
      SET
        bio = p.bio,
        avatar = p.avatar
      FROM profiles p
      WHERE u.id = p.user_id
    `);

    console.log('Dados de profiles copiados para users');
  },

  down: async (queryInterface) => {
    // Restaurar profiles
    await queryInterface.sequelize.query(`
      INSERT INTO profiles (user_id, bio, avatar, created_at, updated_at)
      SELECT id, bio, avatar, NOW(), NOW()
      FROM users
      WHERE bio IS NOT NULL OR avatar IS NOT NULL
      ON CONFLICT (user_id) DO UPDATE
      SET bio = EXCLUDED.bio, avatar = EXCLUDED.avatar
    `);
  }
};

// Deploy: Atualizar código para usar apenas users

// Migration 3: Remover tabela profiles
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.dropTable('profiles');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('profiles', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        unique: true,
        references: { model: 'users', key: 'id' }
      },
      bio: Sequelize.TEXT,
      avatar: Sequelize.STRING,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE
    });

    // Restaurar dados
    await queryInterface.sequelize.query(`
      INSERT INTO profiles (user_id, bio, avatar, created_at, updated_at)
      SELECT id, bio, avatar, NOW(), NOW()
      FROM users
      WHERE bio IS NOT NULL OR avatar IS NOT NULL
    `);
  }
};
```

## 5. Alterar Tipo de Dados

### Caso 1: String → Integer

```javascript
// Problema: users.age = "25" → 25
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // 1. Adicionar coluna temporária
      await queryInterface.addColumn('users', 'age_temp', {
        type: Sequelize.INTEGER,
        allowNull: true
      }, { transaction });

      // 2. Converter dados válidos
      await queryInterface.sequelize.query(`
        UPDATE users
        SET age_temp = CAST(age AS INTEGER)
        WHERE age ~ '^[0-9]+$'
      `, { transaction });

      // 3. Log dados inválidos
      const [invalid] = await queryInterface.sequelize.query(`
        SELECT id, age FROM users
        WHERE age !~ '^[0-9]+$' AND age IS NOT NULL
      `, { transaction });

      if (invalid.length > 0) {
        console.log(`Atenção: ${invalid.length} registros com idade inválida:`);
        invalid.forEach(row => console.log(`  ID ${row.id}: "${row.age}"`));
      }

      // 4. Remover coluna antiga
      await queryInterface.removeColumn('users', 'age', { transaction });

      // 5. Renomear coluna nova
      await queryInterface.renameColumn('users', 'age_temp', 'age', { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.renameColumn('users', 'age', 'age_temp', { transaction });

      await queryInterface.addColumn('users', 'age', {
        type: Sequelize.STRING
      }, { transaction });

      await queryInterface.sequelize.query(`
        UPDATE users SET age = CAST(age_temp AS VARCHAR)
      `, { transaction });

      await queryInterface.removeColumn('users', 'age_temp', { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
```

### Caso 2: VARCHAR(50) → TEXT

```javascript
// PostgreSQL - Simples, sem reescrita
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('posts', 'content', {
      type: Sequelize.TEXT
    });
    // PostgreSQL não reescreve tabela, é instantâneo
  },

  down: async (queryInterface, Sequelize) => {
    // Cuidado: pode truncar dados!
    await queryInterface.changeColumn('posts', 'content', {
      type: Sequelize.STRING(50)
    });
  }
};
```

### Caso 3: NOT NULL → Nullable

```javascript
// Simples e seguro
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('users', 'phone', {
      type: Sequelize.STRING,
      allowNull: true  // Tornar nullable
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Backfill antes de tornar NOT NULL
    await queryInterface.sequelize.query(`
      UPDATE users SET phone = '' WHERE phone IS NULL
    `);

    await queryInterface.changeColumn('users', 'phone', {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};
```

## 6. Migrar ENUM

### Adicionar Valor a ENUM

```javascript
// PostgreSQL
module.exports = {
  up: async (queryInterface) => {
    // Adicionar novo valor ao ENUM
    await queryInterface.sequelize.query(`
      ALTER TYPE order_status ADD VALUE 'refunded' AFTER 'cancelled'
    `);
  },

  down: async (queryInterface) => {
    // IMPOSSÍVEL remover valor de ENUM no PostgreSQL
    // Solução: recriar tipo
    console.log('Não é possível remover valor de ENUM. Rollback manual necessário.');
  }
};
```

### Remover Valor de ENUM (PostgreSQL)

```javascript
// Recriar tipo sem o valor
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // 1. Criar novo tipo
      await queryInterface.sequelize.query(`
        CREATE TYPE order_status_new AS ENUM ('pending', 'completed', 'cancelled')
      `, { transaction });

      // 2. Migrar dados (atualizar valores que serão removidos)
      await queryInterface.sequelize.query(`
        UPDATE orders
        SET status = 'cancelled'
        WHERE status = 'refunded'
      `, { transaction });

      // 3. Alterar coluna para usar novo tipo
      await queryInterface.sequelize.query(`
        ALTER TABLE orders
        ALTER COLUMN status TYPE order_status_new
        USING status::text::order_status_new
      `, { transaction });

      // 4. Remover tipo antigo
      await queryInterface.sequelize.query(`
        DROP TYPE order_status
      `, { transaction });

      // 5. Renomear novo tipo
      await queryInterface.sequelize.query(`
        ALTER TYPE order_status_new RENAME TO order_status
      `, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface) => {
    // Reverter processo
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.sequelize.query(`
        CREATE TYPE order_status_new AS ENUM ('pending', 'completed', 'cancelled', 'refunded')
      `, { transaction });

      await queryInterface.sequelize.query(`
        ALTER TABLE orders
        ALTER COLUMN status TYPE order_status_new
        USING status::text::order_status_new
      `, { transaction });

      await queryInterface.sequelize.query(`
        DROP TYPE order_status
      `, { transaction });

      await queryInterface.sequelize.query(`
        ALTER TYPE order_status_new RENAME TO order_status
      `, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
```

## 7. Normalização de Dados

### De JSON para Tabela Relacionada

```javascript
// Antes: users.metadata = {"preferences": {...}, "settings": {...}}
// Depois: user_preferences table

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // 1. Criar tabela
      await queryInterface.createTable('user_preferences', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        user_id: {
          type: Sequelize.INTEGER,
          unique: true,
          references: { model: 'users', key: 'id' }
        },
        theme: Sequelize.STRING,
        language: Sequelize.STRING(5),
        notifications: Sequelize.BOOLEAN,
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE
      }, { transaction });

      // 2. Migrar dados
      const [users] = await queryInterface.sequelize.query(
        'SELECT id, metadata FROM users WHERE metadata IS NOT NULL',
        { transaction }
      );

      for (const user of users) {
        const metadata = typeof user.metadata === 'string'
          ? JSON.parse(user.metadata)
          : user.metadata;

        if (metadata && metadata.preferences) {
          await queryInterface.sequelize.query(`
            INSERT INTO user_preferences (user_id, theme, language, notifications, created_at, updated_at)
            VALUES (:userId, :theme, :language, :notifications, NOW(), NOW())
          `, {
            replacements: {
              userId: user.id,
              theme: metadata.preferences.theme || 'light',
              language: metadata.preferences.language || 'en',
              notifications: metadata.preferences.notifications !== false
            },
            transaction
          });
        }
      }

      console.log(`Migradas preferências de ${users.length} usuários`);

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface) => {
    // Restaurar para JSON
    const [preferences] = await queryInterface.sequelize.query(`
      SELECT * FROM user_preferences
    `);

    for (const pref of preferences) {
      const metadata = {
        preferences: {
          theme: pref.theme,
          language: pref.language,
          notifications: pref.notifications
        }
      };

      await queryInterface.sequelize.query(`
        UPDATE users
        SET metadata = :metadata
        WHERE id = :userId
      `, {
        replacements: {
          metadata: JSON.stringify(metadata),
          userId: pref.user_id
        }
      });
    }

    await queryInterface.dropTable('user_preferences');
  }
};
```

## 8. Migração de Schema Multi-Tenant

### Single DB → Múltiplos Schemas (PostgreSQL)

```javascript
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Obter lista de tenants
    const [tenants] = await queryInterface.sequelize.query(`
      SELECT DISTINCT tenant_id FROM users
    `);

    for (const tenant of tenants) {
      const schemaName = `tenant_${tenant.tenant_id}`;

      // Criar schema
      await queryInterface.sequelize.query(`
        CREATE SCHEMA IF NOT EXISTS ${schemaName}
      `);

      // Criar tabelas no schema
      await queryInterface.createTable(
        { tableName: 'users', schema: schemaName },
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          name: Sequelize.STRING,
          email: Sequelize.STRING
        }
      );

      // Migrar dados
      await queryInterface.sequelize.query(`
        INSERT INTO ${schemaName}.users (id, name, email)
        SELECT id, name, email
        FROM public.users
        WHERE tenant_id = :tenantId
      `, {
        replacements: { tenantId: tenant.tenant_id }
      });

      console.log(`Migrado tenant ${tenant.tenant_id}`);
    }
  },

  down: async (queryInterface) => {
    // Reverter para tabela única
    const [schemas] = await queryInterface.sequelize.query(`
      SELECT schema_name
      FROM information_schema.schemata
      WHERE schema_name LIKE 'tenant_%'
    `);

    for (const schema of schemas) {
      const tenantId = schema.schema_name.replace('tenant_', '');

      await queryInterface.sequelize.query(`
        INSERT INTO public.users (id, name, email, tenant_id)
        SELECT id, name, email, :tenantId
        FROM ${schema.schema_name}.users
      `, {
        replacements: { tenantId }
      });

      await queryInterface.sequelize.query(`
        DROP SCHEMA ${schema.schema_name} CASCADE
      `);
    }
  }
};
```

## Checklist de Casos Avançados

- [ ] Migration foi dividida em múltiplos passos?
- [ ] Cada passo é reversível individualmente?
- [ ] Dados são preservados durante transformação?
- [ ] Período de transição foi planejado?
- [ ] Código funciona durante todo o processo?
- [ ] Rollback de cada etapa foi testado?
- [ ] Performance foi considerada?
- [ ] Dados inválidos foram tratados?
- [ ] Logs adequados foram implementados?
- [ ] Equipe foi notificada sobre complexidade?

## Resumo

| Operação | Complexidade | Passos Mínimos | Downtime Risk |
|----------|--------------|----------------|---------------|
| Renomear tabela | Alta | 3 | Baixo (com view) |
| Renomear coluna | Média | 2 | Baixo |
| Split table | Alta | 3 | Médio |
| Merge tables | Alta | 3 | Médio |
| Alterar tipo | Alta | 3 | Baixo |
| Modificar ENUM | Muito Alta | 5+ | Alto |
| Normalizar dados | Muito Alta | 3-5 | Médio |
| Multi-tenant | Muito Alta | Variável | Alto |

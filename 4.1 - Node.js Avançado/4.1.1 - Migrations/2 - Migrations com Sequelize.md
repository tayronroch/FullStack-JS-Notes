# Migrations com Sequelize

## Instalação

```bash
npm install sequelize sequelize-cli
npm install pg pg-hstore  # Para PostgreSQL
# ou
npm install mysql2        # Para MySQL
```

## Configuração Inicial

```bash
# Inicializar Sequelize
npx sequelize-cli init
```

Estrutura criada:
```
├── config/
│   └── config.json
├── migrations/
├── models/
└── seeders/
```

## Criar uma Migration

```bash
npx sequelize-cli migration:generate --name create-users-table
```

## Estrutura de uma Migration

```javascript
// migrations/20240101-create-users-table.js

'use strict';

module.exports = {
  // Aplicar mudanças
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  // Reverter mudanças
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
```

## Executar Migrations

```bash
# Aplicar todas as migrations pendentes
npx sequelize-cli db:migrate

# Reverter última migration
npx sequelize-cli db:migrate:undo

# Reverter todas as migrations
npx sequelize-cli db:migrate:undo:all
```

## Adicionar Coluna

```javascript
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'age', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'age');
  }
};
```

## Criar Índice

```javascript
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('users', ['email'], {
      name: 'users_email_index',
      unique: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('users', 'users_email_index');
  }
};
```

## Relacionamentos (Foreign Keys)

```javascript
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('posts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('posts');
  }
};
```

## Comandos Úteis

```bash
# Ver status das migrations
npx sequelize-cli db:migrate:status

# Criar migration
npx sequelize-cli migration:generate --name nome-da-migration

# Aplicar migrations
npx sequelize-cli db:migrate

# Reverter última migration
npx sequelize-cli db:migrate:undo

# Reverter até uma migration específica
npx sequelize-cli db:migrate:undo:all --to XXXXXXXXXXXXXX-create-posts.js
```

## Transações

```javascript
// Migration com transação
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.addColumn('users', 'phone', {
        type: Sequelize.STRING(20)
      }, { transaction });

      await queryInterface.addIndex('users', ['phone'], {
        name: 'users_phone_index',
        transaction
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.removeIndex('users', 'users_phone_index', { transaction });
      await queryInterface.removeColumn('users', 'phone', { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
```

## Raw Queries

```javascript
module.exports = {
  async up(queryInterface, Sequelize) {
    // Executar SQL customizado
    await queryInterface.sequelize.query(`
      CREATE INDEX CONCURRENTLY users_email_lower_idx
      ON users (LOWER(email))
    `);

    // Query com replacements (prevenir SQL injection)
    await queryInterface.sequelize.query(
      `UPDATE users SET status = :status WHERE created_at < :date`,
      {
        replacements: {
          status: 'inactive',
          date: '2024-01-01'
        }
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      'DROP INDEX CONCURRENTLY IF EXISTS users_email_lower_idx'
    );
  }
};
```

## Migrations com Dados

```javascript
// Backfill em lotes
module.exports = {
  async up(queryInterface, Sequelize) {
    // Adicionar coluna
    await queryInterface.addColumn('users', 'full_name', {
      type: Sequelize.STRING,
      allowNull: true
    });

    // Processar em batches
    const batchSize = 1000;
    let offset = 0;

    while (true) {
      const [results] = await queryInterface.sequelize.query(`
        SELECT id, first_name, last_name
        FROM users
        WHERE full_name IS NULL
        LIMIT ${batchSize}
      `);

      if (results.length === 0) break;

      for (const user of results) {
        await queryInterface.sequelize.query(
          `UPDATE users
           SET full_name = :fullName
           WHERE id = :id`,
          {
            replacements: {
              fullName: `${user.first_name} ${user.last_name}`,
              id: user.id
            }
          }
        );
      }

      offset += batchSize;
      console.log(`Processados ${offset} usuários...`);

      // Pausa para não sobrecarregar
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('users', 'full_name');
  }
};
```

## Constraints Customizadas

```javascript
module.exports = {
  async up(queryInterface, Sequelize) {
    // Adicionar constraint CHECK
    await queryInterface.sequelize.query(`
      ALTER TABLE products
      ADD CONSTRAINT products_price_positive
      CHECK (price > 0)
    `);

    // Adicionar constraint UNIQUE composta
    await queryInterface.addConstraint('posts', {
      fields: ['user_id', 'slug'],
      type: 'unique',
      name: 'unique_user_slug'
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE products
      DROP CONSTRAINT products_price_positive
    `);

    await queryInterface.removeConstraint('posts', 'unique_user_slug');
  }
};
```

## Migrations Condicionais

```javascript
module.exports = {
  async up(queryInterface, Sequelize) {
    // Verificar se coluna já existe
    const tableInfo = await queryInterface.describeTable('users');

    if (!tableInfo.phone) {
      await queryInterface.addColumn('users', 'phone', {
        type: Sequelize.STRING(20)
      });
      console.log('Coluna phone adicionada');
    } else {
      console.log('Coluna phone já existe');
    }

    // Verificar se índice existe
    const indexes = await queryInterface.showIndex('users');
    const hasEmailIndex = indexes.some(idx => idx.name === 'users_email_index');

    if (!hasEmailIndex) {
      await queryInterface.addIndex('users', ['email'], {
        name: 'users_email_index'
      });
    }
  }
};
```

## Configuração Avançada

```javascript
// config/config.js
module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },

  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 20,
      min: 5,
      acquire: 60000,
      idle: 10000
    }
  }
};
```

## Hooks e Lifecycle

```javascript
// .sequelizerc - Customizar paths
const path = require('path');

module.exports = {
  'config': path.resolve('config', 'database.js'),
  'models-path': path.resolve('src', 'models'),
  'seeders-path': path.resolve('db', 'seeders'),
  'migrations-path': path.resolve('db', 'migrations')
};
```

## Migrations com TypeScript

```typescript
// migrations/20240101-create-users.ts
import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.dropTable('users');
  }
};
```

## Debugging e Logging

```javascript
module.exports = {
  async up(queryInterface, Sequelize) {
    // Habilitar logging detalhado
    const startTime = Date.now();

    queryInterface.sequelize.options.logging = (sql, timing) => {
      console.log(`[${Date.now() - startTime}ms] ${sql}`);
    };

    await queryInterface.addColumn('users', 'phone', {
      type: Sequelize.STRING
    });

    console.log(`Migration concluída em ${Date.now() - startTime}ms`);
  }
};
```

## Tabelas Temporárias

```javascript
module.exports = {
  async up(queryInterface, Sequelize) {
    // Criar tabela temporária para processamento
    await queryInterface.createTable('users_temp', {
      id: Sequelize.INTEGER,
      email: Sequelize.STRING,
      email_normalized: Sequelize.STRING
    });

    // Processar dados
    await queryInterface.sequelize.query(`
      INSERT INTO users_temp (id, email, email_normalized)
      SELECT id, email, LOWER(TRIM(email))
      FROM users
    `);

    // Atualizar original
    await queryInterface.sequelize.query(`
      UPDATE users u
      SET email = t.email_normalized
      FROM users_temp t
      WHERE u.id = t.id
    `);

    // Limpar
    await queryInterface.dropTable('users_temp');
  }
};
```

## Rollback Seguro

```javascript
module.exports = {
  async up(queryInterface, Sequelize) {
    // Criar backup antes de mudança destrutiva
    await queryInterface.sequelize.query(`
      CREATE TABLE users_backup AS
      SELECT * FROM users
    `);

    try {
      // Operação arriscada
      await queryInterface.sequelize.query(`
        ALTER TABLE users DROP COLUMN old_column
      `);

    } catch (error) {
      // Restaurar de backup
      console.error('Erro, restaurando backup...');
      await queryInterface.sequelize.query(`
        INSERT INTO users SELECT * FROM users_backup
      `);
      throw error;
    }

    // Sucesso - limpar backup
    await queryInterface.dropTable('users_backup');
  },

  async down(queryInterface, Sequelize) {
    // Restaurar coluna
    await queryInterface.addColumn('users', 'old_column', {
      type: Sequelize.STRING
    });
  }
};
```

## Scripts Auxiliares

```javascript
// scripts/run-migration.js
const { Sequelize } = require('sequelize');
const Umzug = require('umzug');

async function runMigrations() {
  const sequelize = new Sequelize(process.env.DATABASE_URL);

  const umzug = new Umzug({
    migrations: {
      path: './migrations',
      params: [
        sequelize.getQueryInterface(),
        Sequelize
      ]
    },
    storage: 'sequelize',
    storageOptions: {
      sequelize
    }
  });

  try {
    const pending = await umzug.pending();
    console.log(`${pending.length} migrations pendentes`);

    await umzug.up();
    console.log('Migrations aplicadas com sucesso');

  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

runMigrations();
```

## Boas Práticas

-  Use nomes descritivos para migrations
-  Sempre teste o `up` e o `down`
-  Nunca edite migrations já aplicadas em produção
-  Mantenha migrations pequenas e focadas
-  Use timestamps nos nomes dos arquivos
-  Use transações para operações múltiplas
-  Implemente logging para debugging
-  Teste rollback antes de produção
-  Processe dados em lotes (batches)
-  Use constraints para integridade de dados

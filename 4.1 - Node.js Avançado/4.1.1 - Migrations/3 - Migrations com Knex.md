# Migrations com Knex.js

## O que é Knex?

Knex.js é um **SQL Query Builder** para Node.js que suporta múltiplos bancos de dados (PostgreSQL, MySQL, SQLite, etc.) e possui um sistema robusto de migrations.

## Instalação

```bash
npm install knex
npm install pg  # Para PostgreSQL
# ou
npm install mysql2  # Para MySQL
```

## Configuração Inicial

```bash
# Inicializar Knex
npx knex init
```

Arquivo `knexfile.js` criado:

```javascript
module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host: 'localhost',
      database: 'meu_banco',
      user: 'usuario',
      password: 'senha'
    },
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds'
    }
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './db/migrations'
    }
  }
};
```

## Criar Migration

```bash
npx knex migrate:make create_users_table
```

## Estrutura de uma Migration

```javascript
// db/migrations/20240101_create_users_table.js

exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name', 100).notNullable();
    table.string('email', 255).notNullable().unique();
    table.string('password', 255).notNullable();
    table.integer('age').nullable();
    table.timestamps(true, true); // created_at e updated_at
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
```

## Executar Migrations

```bash
# Aplicar todas as migrations pendentes
npx knex migrate:latest

# Reverter última migration
npx knex migrate:rollback

# Reverter todas
npx knex migrate:rollback --all

# Ver status
npx knex migrate:status
```

## Tipos de Dados

```javascript
exports.up = function(knex) {
  return knex.schema.createTable('products', (table) => {
    table.increments('id');
    table.string('name', 255);
    table.text('description');
    table.decimal('price', 10, 2);
    table.integer('stock');
    table.boolean('is_active').defaultTo(true);
    table.date('release_date');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.json('metadata');
    table.enum('status', ['active', 'inactive', 'pending']);
  });
};
```

## Modificar Tabelas

```javascript
// Adicionar coluna
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

## Criar Relacionamentos

```javascript
exports.up = function(knex) {
  return knex.schema.createTable('posts', (table) => {
    table.increments('id');
    table.integer('user_id').unsigned().notNullable();
    table.string('title', 255).notNullable();
    table.text('content');
    table.timestamps(true, true);

    // Foreign key
    table.foreign('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('posts');
};
```

## Criar Índices

```javascript
exports.up = function(knex) {
  return knex.schema.table('users', (table) => {
    table.index('email', 'users_email_index');
    table.index(['name', 'created_at'], 'users_name_created_index');
  });
};

exports.down = function(knex) {
  return knex.schema.table('users', (table) => {
    table.dropIndex('email', 'users_email_index');
    table.dropIndex(['name', 'created_at'], 'users_name_created_index');
  });
};
```

## Alterar Colunas

```javascript
exports.up = function(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.string('email', 500).alter();  // Aumentar tamanho
    table.string('name').notNullable().alter();  // Tornar NOT NULL
  });
};
```

## Raw Queries

```javascript
exports.up = function(knex) {
  return knex.raw(`
    CREATE INDEX CONCURRENTLY users_email_lower_idx
    ON users (LOWER(email))
  `);
};

exports.down = function(knex) {
  return knex.raw('DROP INDEX users_email_lower_idx');
};
```

## Comandos Úteis

```bash
# Criar migration
npx knex migrate:make nome_da_migration

# Aplicar migrations
npx knex migrate:latest

# Reverter última
npx knex migrate:rollback

# Ver status
npx knex migrate:status

# Aplicar próxima migration
npx knex migrate:up

# Reverter migration específica
npx knex migrate:down nome_da_migration.js
```

## Transações

```javascript
// Migration com transação manual
exports.up = async function(knex) {
  const trx = await knex.transaction();

  try {
    await trx.schema.table('users', (table) => {
      table.string('phone', 20);
    });

    await trx('users')
      .where('phone', null)
      .update({ phone: '' });

    await trx.commit();
  } catch (error) {
    await trx.rollback();
    throw error;
  }
};

// Knex gerencia transação automaticamente se retornar Promise
exports.up = function(knex) {
  // Operações executadas em transação automática
  return knex.schema.table('users', (table) => {
    table.string('phone', 20);
    table.index('phone');
  });
};
```

## Migrations com Dados

```javascript
// Backfill em lotes
exports.up = async function(knex) {
  // Adicionar coluna
  await knex.schema.table('users', (table) => {
    table.string('full_name');
  });

  // Processar em batches
  const batchSize = 1000;
  let page = 0;

  while (true) {
    const users = await knex('users')
      .whereNull('full_name')
      .limit(batchSize)
      .offset(page * batchSize);

    if (users.length === 0) break;

    await knex.transaction(async (trx) => {
      for (const user of users) {
        await trx('users')
          .where('id', user.id)
          .update({
            full_name: `${user.first_name} ${user.last_name}`
          });
      }
    });

    page++;
    console.log(`Processados ${page * batchSize} usuários...`);

    // Pausa para não sobrecarregar
    await new Promise(resolve => setTimeout(resolve, 100));
  }
};

exports.down = async function(knex) {
  await knex.schema.table('users', (table) => {
    table.dropColumn('full_name');
  });
};
```

## Constraints Avançadas

```javascript
exports.up = async function(knex) {
  await knex.schema.table('products', (table) => {
    // Check constraint
    table.check('price > 0', 'products_price_positive');

    // Unique constraint composta
    table.unique(['category_id', 'slug'], 'unique_category_slug');
  });

  // Constraint via raw SQL
  await knex.raw(`
    ALTER TABLE orders
    ADD CONSTRAINT orders_total_positive
    CHECK (total >= 0)
  `);
};

exports.down = async function(knex) {
  await knex.schema.table('products', (table) => {
    table.dropChecks(['products_price_positive']);
    table.dropUnique(['category_id', 'slug'], 'unique_category_slug');
  });

  await knex.raw(`
    ALTER TABLE orders
    DROP CONSTRAINT orders_total_positive
  `);
};
```

## Migrations Condicionais

```javascript
exports.up = async function(knex) {
  // Verificar se coluna existe
  const hasColumn = await knex.schema.hasColumn('users', 'phone');

  if (!hasColumn) {
    await knex.schema.table('users', (table) => {
      table.string('phone', 20);
    });
    console.log('Coluna phone adicionada');
  } else {
    console.log('Coluna phone já existe');
  }

  // Verificar se tabela existe
  const hasTable = await knex.schema.hasTable('profiles');

  if (!hasTable) {
    await knex.schema.createTable('profiles', (table) => {
      table.increments('id');
      table.integer('user_id').unsigned().notNullable();
      table.text('bio');
    });
  }
};
```

## Configuração Avançada

```javascript
// knexfile.js
require('dotenv').config();

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    },
    pool: {
      min: 2,
      max: 10,
      afterCreate: (conn, done) => {
        // Configurar sessão PostgreSQL
        conn.query('SET timezone="UTC"', (err) => {
          done(err, conn);
        });
      }
    },
    migrations: {
      directory: './db/migrations',
      tableName: 'knex_migrations',
      loadExtensions: ['.js', '.ts'],
      extension: 'js'
    },
    seeds: {
      directory: './db/seeds/dev'
    },
    debug: true
  },

  production: {
    client: 'postgresql',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    },
    pool: {
      min: 5,
      max: 30,
      acquireTimeoutMillis: 60000,
      idleTimeoutMillis: 600000,
      createTimeoutMillis: 30000
    },
    migrations: {
      directory: './db/migrations',
      tableName: 'knex_migrations'
    },
    debug: false,
    acquireConnectionTimeout: 60000
  }
};
```

## Migration com TypeScript

```typescript
// migrations/20240101_create_users.ts
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name', 100).notNullable();
    table.string('email', 255).notNullable().unique();
    table.string('password', 255).notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
}
```

## Migrations com Dados Complexos

```javascript
// Migrar JSON para tabela relacionada
exports.up = async function(knex) {
  // Criar tabela de endereços
  await knex.schema.createTable('addresses', (table) => {
    table.increments('id');
    table.integer('user_id').unsigned().notNullable();
    table.string('street');
    table.string('city');
    table.string('state', 2);
    table.string('zip', 10);
    table.timestamps(true, true);

    table.foreign('user_id').references('users.id').onDelete('CASCADE');
  });

  // Migrar dados de JSON para tabela
  const users = await knex('users').whereNotNull('address_json');

  for (const user of users) {
    const address = JSON.parse(user.address_json);

    await knex('addresses').insert({
      user_id: user.id,
      street: address.street,
      city: address.city,
      state: address.state,
      zip: address.zip,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    });
  }

  console.log(`Migrados ${users.length} endereços`);
};

exports.down = async function(knex) {
  // Restaurar JSON
  const addresses = await knex('addresses').select();

  for (const addr of addresses) {
    const addressJson = JSON.stringify({
      street: addr.street,
      city: addr.city,
      state: addr.state,
      zip: addr.zip
    });

    await knex('users')
      .where('id', addr.user_id)
      .update({ address_json: addressJson });
  }

  await knex.schema.dropTable('addresses');
};
```

## Debugging e Logging

```javascript
exports.up = async function(knex) {
  const startTime = Date.now();

  // Habilitar logging detalhado
  knex.on('query', (query) => {
    console.log(`[${Date.now() - startTime}ms]`, query.sql);
  });

  await knex.schema.table('users', (table) => {
    table.string('phone', 20);
  });

  console.log(`Migration concluída em ${Date.now() - startTime}ms`);
};
```

## Views e Funções

```javascript
// Criar view
exports.up = async function(knex) {
  await knex.raw(`
    CREATE OR REPLACE VIEW active_users AS
    SELECT id, name, email
    FROM users
    WHERE status = 'active'
  `);
};

exports.down = async function(knex) {
  await knex.raw('DROP VIEW IF EXISTS active_users');
};

// Criar função PostgreSQL
exports.up = async function(knex) {
  await knex.raw(`
    CREATE OR REPLACE FUNCTION update_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
  `);
};

exports.down = async function(knex) {
  await knex.raw('DROP TRIGGER IF EXISTS users_updated_at ON users');
  await knex.raw('DROP FUNCTION IF EXISTS update_updated_at()');
};
```

## Particionamento

```javascript
// Criar tabela particionada (PostgreSQL)
exports.up = async function(knex) {
  await knex.raw(`
    CREATE TABLE events (
      id BIGSERIAL,
      user_id INTEGER,
      event_type VARCHAR(50),
      created_at TIMESTAMP NOT NULL,
      data JSONB
    ) PARTITION BY RANGE (created_at)
  `);

  // Criar partições para últimos 12 meses
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const nextDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    await knex.raw(`
      CREATE TABLE events_${year}_${month}
      PARTITION OF events
      FOR VALUES FROM ('${date.toISOString().split('T')[0]}')
                    TO ('${nextDate.toISOString().split('T')[0]}')
    `);
  }
};
```

## Helper Functions

```javascript
// Função helper reutilizável
async function addTimestamps(knex, tableName) {
  await knex.schema.table(tableName, (table) => {
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Trigger para atualizar updated_at automaticamente
  await knex.raw(`
    CREATE TRIGGER ${tableName}_updated_at
    BEFORE UPDATE ON ${tableName}
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at()
  `);
}

exports.up = async function(knex) {
  await knex.schema.createTable('posts', (table) => {
    table.increments('id');
    table.string('title');
  });

  await addTimestamps(knex, 'posts');
};
```

## Rollback com Validação

```javascript
exports.up = async function(knex) {
  // Criar backup antes de mudança destrutiva
  await knex.raw(`
    CREATE TABLE users_backup AS SELECT * FROM users
  `);

  try {
    await knex.schema.table('users', (table) => {
      table.dropColumn('old_column');
    });

    // Validar mudança
    const count = await knex('users').count('* as count');
    const backupCount = await knex('users_backup').count('* as count');

    if (count[0].count !== backupCount[0].count) {
      throw new Error('Contagens não batem!');
    }

    // Sucesso - limpar backup
    await knex.schema.dropTable('users_backup');

  } catch (error) {
    // Restaurar de backup
    await knex.raw('DELETE FROM users');
    await knex.raw('INSERT INTO users SELECT * FROM users_backup');
    await knex.schema.dropTable('users_backup');
    throw error;
  }
};
```

## Executar Migrations Programaticamente

```javascript
// scripts/run-migrations.js
const knex = require('knex');
const config = require('../knexfile');

async function runMigrations() {
  const db = knex(config.production);

  try {
    console.log('Verificando migrations pendentes...');

    const [current, completed] = await db.migrate.list();

    console.log(`Pendentes: ${current.length}`);
    console.log(`Completadas: ${completed.length}`);

    if (current.length > 0) {
      console.log('Aplicando migrations...');
      const [batch, migrations] = await db.migrate.latest();

      console.log(`Batch ${batch} aplicado:`);
      migrations.forEach(m => console.log(`  - ${m}`));
    }

  } catch (error) {
    console.error('Erro:', error.message);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

runMigrations();
```

## Performance e Otimização

```javascript
// Criar índice concorrentemente
exports.up = async function(knex) {
  // PostgreSQL
  await knex.raw(`
    CREATE INDEX CONCURRENTLY users_email_idx ON users(email)
  `);

  // MySQL
  await knex.raw(`
    ALTER TABLE users
    ADD INDEX users_email_idx (email)
    ALGORITHM=INPLACE, LOCK=NONE
  `);
};

// Processar em chunks para tabelas grandes
exports.up = async function(knex) {
  const chunkSize = 1000;

  await knex.schema.table('users', (table) => {
    table.string('email_normalized');
  });

  let lastId = 0;
  while (true) {
    const users = await knex('users')
      .where('id', '>', lastId)
      .whereNull('email_normalized')
      .orderBy('id')
      .limit(chunkSize);

    if (users.length === 0) break;

    await knex.transaction(async (trx) => {
      for (const user of users) {
        await trx('users')
          .where('id', user.id)
          .update({
            email_normalized: user.email.toLowerCase()
          });
      }
    });

    lastId = users[users.length - 1].id;
    console.log(`Processado até ID ${lastId}`);

    await new Promise(resolve => setTimeout(resolve, 50));
  }
};
```

## Boas Práticas

-  Use transações para operações complexas
-  Sempre implemente `up` e `down`
-  Teste rollback antes de aplicar em produção
-  Use `table.timestamps(true, true)` para created_at/updated_at
-  Mantenha migrations pequenas e atômicas
-  Use `knex.raw()` para SQL específico de banco
-  Processe dados grandes em chunks/batches
-  Implemente logging para debugging
-  Use migrations condicionais quando necessário
-  Valide mudanças antes de limpar backups

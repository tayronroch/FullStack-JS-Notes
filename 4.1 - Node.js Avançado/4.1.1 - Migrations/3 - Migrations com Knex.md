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

## Boas Práticas

-  Use transações para operações complexas
-  Sempre implemente `up` e `down`
-  Teste rollback antes de aplicar em produção
-  Use `table.timestamps(true, true)` para created_at/updated_at
-  Mantenha migrations pequenas e atômicas

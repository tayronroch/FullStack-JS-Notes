# Migrations com node-pg-migrate

## O que é node-pg-migrate?

**node-pg-migrate** é uma biblioteca de migrations para PostgreSQL que permite escrever migrations tanto em **JavaScript/TypeScript** quanto em **SQL puro**, oferecendo controle total sobre o schema do banco.

```
Filosofia: Controle máximo + Flexibilidade total
```

## Diferença dos Outros ORMs

| Característica | Sequelize/Knex | Prisma | node-pg-migrate |
|----------------|----------------|--------|-----------------|
| Abstração | Alta | Muito Alta | Baixa |
| SQL Puro | Parcial | Não | Sim |
| PostgreSQL-específico | Não | Não | Sim |
| Controle fino | Médio | Baixo | Alto |
| Curva de aprendizado | Média | Baixa | Alta |
| Performance | Boa | Boa | Excelente |

## Instalação

```bash
npm install node-pg-migrate
npm install pg  # Driver PostgreSQL
```

## Configuração

### Opção 1: Via package.json

```json
{
  "scripts": {
    "migrate": "node-pg-migrate",
    "migrate:up": "node-pg-migrate up",
    "migrate:down": "node-pg-migrate down",
    "migrate:create": "node-pg-migrate create"
  },
  "node-pg-migrate": {
    "database-url": {
      "env": "DATABASE_URL"
    },
    "migrations-dir": "migrations",
    "dir": "migrations",
    "migration-file-language": "js",
    "ignore-pattern": "\\..*",
    "schema": "public"
  }
}
```

### Opção 2: Via arquivo de configuração

```javascript
// migrations/config.js
module.exports = {
  databaseUrl: process.env.DATABASE_URL,
  migrationsTable: 'pgmigrations',
  dir: 'migrations',
  direction: 'up',
  count: Infinity,
  createSchema: true,
  createMigrationsSchema: true,
  schema: 'public'
};
```

## Criar Migration

```bash
# Criar migration em JavaScript
npm run migrate:create -- create_users_table

# Criar migration em SQL
npm run migrate:create -- create_posts_table --migration-file-language sql

# Criar migration em TypeScript
npm run migrate:create -- create_comments_table --migration-file-language ts
```

## Migrations em SQL Puro

### Exemplo Básico

```sql
-- migrations/1234567890123_create_users_table.sql

-- Up Migration
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Criar índice
CREATE INDEX idx_users_email ON users(email);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Down Migration
DROP TRIGGER IF EXISTS users_updated_at ON users;
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP TABLE IF EXISTS users CASCADE;
```

### Relacionamentos

```sql
-- migrations/1234567890124_create_posts_table.sql

-- Up Migration
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

  -- Foreign key com ON DELETE CASCADE
  CONSTRAINT fk_posts_users
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- Índices
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_published ON posts(published);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);

-- Índice composto
CREATE INDEX idx_posts_user_published ON posts(user_id, published);

-- Down Migration
DROP TABLE IF EXISTS posts CASCADE;
```

### Constraints Avançadas

```sql
-- migrations/1234567890125_add_product_constraints.sql

-- Up Migration
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  category VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Check constraints
ALTER TABLE products
ADD CONSTRAINT products_price_positive
CHECK (price > 0);

ALTER TABLE products
ADD CONSTRAINT products_stock_non_negative
CHECK (stock >= 0);

ALTER TABLE products
ADD CONSTRAINT products_status_valid
CHECK (status IN ('active', 'inactive', 'discontinued'));

-- Unique constraint composta
ALTER TABLE products
ADD CONSTRAINT products_name_category_unique
UNIQUE (name, category);

-- Down Migration
DROP TABLE IF EXISTS products CASCADE;
```

## Migrations em JavaScript

### Exemplo Básico

```javascript
// migrations/1234567890126_create_categories.js

exports.up = (pgm) => {
  pgm.createTable('categories', {
    id: 'id',  // Shorthand para SERIAL PRIMARY KEY
    name: {
      type: 'varchar(100)',
      notNull: true,
      unique: true
    },
    description: {
      type: 'text',
      notNull: false
    },
    parent_id: {
      type: 'integer',
      references: 'categories',
      onDelete: 'SET NULL'
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('NOW()')
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('NOW()')
    }
  });

  // Criar índices
  pgm.createIndex('categories', 'name');
  pgm.createIndex('categories', 'parent_id');
};

exports.down = (pgm) => {
  pgm.dropTable('categories');
};
```

### Adicionar Colunas

```javascript
// migrations/1234567890127_add_user_fields.js

exports.up = (pgm) => {
  pgm.addColumns('users', {
    phone: {
      type: 'varchar(20)',
      notNull: false
    },
    bio: {
      type: 'text'
    },
    avatar_url: {
      type: 'varchar(500)'
    },
    is_verified: {
      type: 'boolean',
      default: false,
      notNull: true
    }
  });

  // Criar índice
  pgm.createIndex('users', 'phone', {
    unique: true,
    where: 'phone IS NOT NULL'  // Partial index
  });
};

exports.down = (pgm) => {
  pgm.dropIndex('users', 'phone');
  pgm.dropColumns('users', ['phone', 'bio', 'avatar_url', 'is_verified']);
};
```

## SQL Puro com Dados

### Backfilling

```sql
-- migrations/1234567890128_backfill_full_names.sql

-- Up Migration
-- 1. Adicionar coluna
ALTER TABLE users ADD COLUMN full_name VARCHAR(255);

-- 2. Backfill dados
UPDATE users
SET full_name = CONCAT(first_name, ' ', last_name)
WHERE full_name IS NULL;

-- 3. Tornar NOT NULL (após validação)
ALTER TABLE users
ALTER COLUMN full_name SET NOT NULL;

-- 4. Criar índice
CREATE INDEX idx_users_full_name ON users(full_name);

-- Down Migration
DROP INDEX IF EXISTS idx_users_full_name;
ALTER TABLE users DROP COLUMN full_name;
```

### Migração de Dados Complexa

```sql
-- migrations/1234567890129_normalize_addresses.sql

-- Up Migration
-- 1. Criar tabela de endereços
CREATE TABLE addresses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  street VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(2),
  zip_code VARCHAR(10),
  country VARCHAR(50) DEFAULT 'BR',
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Migrar dados existentes do JSON para tabela
INSERT INTO addresses (user_id, street, city, state, zip_code, is_primary)
SELECT
  id,
  address_json->>'street',
  address_json->>'city',
  address_json->>'state',
  address_json->>'zip',
  TRUE
FROM users
WHERE address_json IS NOT NULL;

-- 3. Criar índices
CREATE INDEX idx_addresses_user_id ON addresses(user_id);
CREATE INDEX idx_addresses_zip_code ON addresses(zip_code);

-- 4. Constraint: apenas um endereço primário por usuário
CREATE UNIQUE INDEX idx_addresses_user_primary
ON addresses(user_id)
WHERE is_primary = TRUE;

-- Down Migration
DROP TABLE IF EXISTS addresses CASCADE;
```

## Funcionalidades Avançadas do PostgreSQL

### ENUM Types

```sql
-- migrations/1234567890130_create_enums.sql

-- Up Migration
-- Criar tipo ENUM
CREATE TYPE order_status AS ENUM (
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded'
);

CREATE TYPE payment_method AS ENUM (
  'credit_card',
  'debit_card',
  'pix',
  'boleto',
  'paypal'
);

-- Usar ENUMs em tabela
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  status order_status NOT NULL DEFAULT 'pending',
  payment_method payment_method NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Down Migration
DROP TABLE IF EXISTS orders;
DROP TYPE IF EXISTS payment_method;
DROP TYPE IF EXISTS order_status;
```

### Views Materializadas

```sql
-- migrations/1234567890131_create_materialized_views.sql

-- Up Migration
-- View materializada para analytics
CREATE MATERIALIZED VIEW user_statistics AS
SELECT
  u.id AS user_id,
  u.name,
  u.email,
  COUNT(DISTINCT p.id) AS total_posts,
  COUNT(DISTINCT c.id) AS total_comments,
  MAX(p.created_at) AS last_post_date,
  AVG(CASE WHEN p.published THEN 1 ELSE 0 END) AS publish_rate
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
LEFT JOIN comments c ON u.id = c.user_id
GROUP BY u.id, u.name, u.email;

-- Criar índice na view materializada
CREATE INDEX idx_user_stats_total_posts ON user_statistics(total_posts DESC);

-- Function para refresh automático
CREATE OR REPLACE FUNCTION refresh_user_statistics()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY user_statistics;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para refresh quando posts mudam
CREATE TRIGGER refresh_stats_on_post_change
AFTER INSERT OR UPDATE OR DELETE ON posts
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_user_statistics();

-- Down Migration
DROP TRIGGER IF EXISTS refresh_stats_on_post_change ON posts;
DROP FUNCTION IF EXISTS refresh_user_statistics();
DROP MATERIALIZED VIEW IF EXISTS user_statistics;
```

### Full Text Search

```sql
-- migrations/1234567890132_add_full_text_search.sql

-- Up Migration
-- Adicionar coluna tsvector
ALTER TABLE posts
ADD COLUMN search_vector tsvector;

-- Criar índice GIN para full text search
CREATE INDEX idx_posts_search ON posts USING GIN(search_vector);

-- Function para atualizar search_vector
CREATE OR REPLACE FUNCTION posts_search_trigger()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('portuguese', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('portuguese', COALESCE(NEW.content, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar automaticamente
CREATE TRIGGER posts_search_update
BEFORE INSERT OR UPDATE ON posts
FOR EACH ROW
EXECUTE FUNCTION posts_search_trigger();

-- Atualizar posts existentes
UPDATE posts SET search_vector =
  setweight(to_tsvector('portuguese', COALESCE(title, '')), 'A') ||
  setweight(to_tsvector('portuguese', COALESCE(content, '')), 'B');

-- Down Migration
DROP TRIGGER IF EXISTS posts_search_update ON posts;
DROP FUNCTION IF EXISTS posts_search_trigger();
DROP INDEX IF EXISTS idx_posts_search;
ALTER TABLE posts DROP COLUMN search_vector;
```

### Particionamento

```sql
-- migrations/1234567890133_create_partitioned_events.sql

-- Up Migration
-- Criar tabela particionada
CREATE TABLE events (
  id BIGSERIAL,
  user_id INTEGER,
  event_type VARCHAR(50),
  event_data JSONB,
  created_at TIMESTAMP NOT NULL,
  PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- Criar partições para cada mês
CREATE TABLE events_2024_01 PARTITION OF events
  FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE events_2024_02 PARTITION OF events
  FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

CREATE TABLE events_2024_03 PARTITION OF events
  FOR VALUES FROM ('2024-03-01') TO ('2024-04-01');

-- Partição default para dados futuros
CREATE TABLE events_default PARTITION OF events DEFAULT;

-- Índices em cada partição
CREATE INDEX idx_events_2024_01_user ON events_2024_01(user_id);
CREATE INDEX idx_events_2024_02_user ON events_2024_02(user_id);
CREATE INDEX idx_events_2024_03_user ON events_2024_03(user_id);

-- Function para criar partições automaticamente
CREATE OR REPLACE FUNCTION create_monthly_partition()
RETURNS TRIGGER AS $$
DECLARE
  partition_name TEXT;
  start_date DATE;
  end_date DATE;
BEGIN
  start_date := date_trunc('month', NEW.created_at);
  end_date := start_date + INTERVAL '1 month';
  partition_name := 'events_' || to_char(start_date, 'YYYY_MM');

  -- Criar partição se não existir
  EXECUTE format(
    'CREATE TABLE IF NOT EXISTS %I PARTITION OF events
     FOR VALUES FROM (%L) TO (%L)',
    partition_name, start_date, end_date
  );

  -- Criar índice na partição
  EXECUTE format(
    'CREATE INDEX IF NOT EXISTS idx_%I_user ON %I(user_id)',
    partition_name, partition_name
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_partition_trigger
BEFORE INSERT ON events
FOR EACH ROW
EXECUTE FUNCTION create_monthly_partition();

-- Down Migration
DROP TRIGGER IF EXISTS create_partition_trigger ON events;
DROP FUNCTION IF EXISTS create_monthly_partition();
DROP TABLE IF EXISTS events CASCADE;
```

## Executar Migrations

```bash
# Aplicar todas migrations pendentes
npm run migrate:up

# Aplicar próxima migration
npm run migrate:up -- --count 1

# Reverter última migration
npm run migrate:down

# Reverter todas migrations
npm run migrate:down -- --count all

# Aplicar migration específica
npm run migrate:up -- --to 1234567890123

# Ver status
npm run migrate -- --list
```

## Vantagens do node-pg-migrate

### 1. Controle Total do PostgreSQL

```sql
-- Usar recursos específicos do PostgreSQL sem limitações
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- Trigram para busca fuzzy

-- Tipos nativos do PostgreSQL
CREATE TABLE advanced_table (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  data JSONB NOT NULL,
  tags TEXT[],
  search tsvector,
  location POINT,
  price_range int4range,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices especializados
CREATE INDEX idx_data_gin ON advanced_table USING GIN(data);
CREATE INDEX idx_tags_gin ON advanced_table USING GIN(tags);
CREATE INDEX idx_location_gist ON advanced_table USING GIST(location);
```

### 2. Performance Otimizada

```sql
-- Criar índice sem bloquear tabela
CREATE INDEX CONCURRENTLY idx_users_email_lower
ON users(LOWER(email));

-- Reindex sem downtime
REINDEX INDEX CONCURRENTLY idx_users_email;

-- Analyze para atualizar estatísticas
ANALYZE users;
```

### 3. SQL Puro = Sem Surpresas

```sql
-- Você sabe exatamente o que está executando
-- Sem "magia" de ORM
-- Sem SQL gerado automaticamente
-- Sem abstrações escondendo detalhes
```

### 4. Facilidade para DBAs

```sql
-- DBAs podem revisar SQL diretamente
-- Código SQL pode ser testado no psql
-- Planos de execução podem ser analisados
EXPLAIN ANALYZE
SELECT * FROM users WHERE email = 'test@example.com';
```

## Desvantagens

### 1. Específico para PostgreSQL

```javascript
// NÃO funciona com MySQL, SQLite, etc.
// Se precisar trocar de banco, reescrever tudo
```

### 2. Mais Verboso

```sql
-- SQL puro é mais verbose que abstrações
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- vs Sequelize:
// queryInterface.createTable('users', { ... })
```

### 3. Menos Portabilidade

```sql
-- Código não reutilizável em outros bancos
-- Sintaxe PostgreSQL-específica
```

### 4. Curva de Aprendizado

```sql
-- Requer conhecimento profundo de SQL e PostgreSQL
-- Não abstrai complexidade
-- Precisa conhecer tipos de dados, índices, constraints
```

## Quando Usar node-pg-migrate?

### Ideal Para:

#### 1. Sistemas que Exigem Performance Máxima

```sql
-- E-commerce de grande escala
-- Sistemas financeiros
-- Analytics em tempo real
-- Aplicações com milhões de registros
```

#### 2. Projetos PostgreSQL-Nativos

```sql
-- Quando PostgreSQL é requisito obrigatório
-- Quando você usa recursos avançados do PostgreSQL:
--   - JSONB
--   - Full Text Search
--   - PostGIS (geolocalização)
--   - Arrays nativos
--   - Particionamento
```

#### 3. Equipes com DBAs Especializados

```javascript
// Time com expertise forte em PostgreSQL
// DBAs revisam e otimizam migrations
// SQL é a linguagem comum da equipe
```

#### 4. Sistemas Legados

```sql
-- Migrar banco de dados existente
-- Integrar com schema complexo
-- Manter compatibilidade com procedures existentes
```

### NÃO Use Quando:

#### 1. Precisa de Portabilidade

```javascript
// Se pode mudar de PostgreSQL para MySQL
// Se quer abstrair o banco de dados
// Se trabalha com múltiplos SGBDs
```

#### 2. Equipe Júnior

```javascript
// Time sem experiência em SQL avançado
// Falta de conhecimento em PostgreSQL
// Prefere abstrações de ORM
```

#### 3. Prototipagem Rápida

```javascript
// Desenvolvimento rápido mais importante que performance
// MVP que pode mudar de tecnologia
// Projeto experimental
```

## Comparação Prática

### Cenário: E-commerce com 10M de usuários

**node-pg-migrate (SQL Puro):**
```sql
-- Controle total
-- Performance otimizada
-- Índices específicos do PostgreSQL
-- Particionamento nativo
-- Full text search otimizado
```

**Sequelize/Knex:**
```javascript
// Desenvolvimento mais rápido
// Menos controle
// Performance boa (não excelente)
// Portabilidade entre bancos
```

**Prisma:**
```javascript
// Muito produtivo
// Type-safe
// Menos controle sobre SQL gerado
// Alguns recursos PostgreSQL não suportados
```

## Exemplo Completo: Sistema de Blog

```sql
-- migrations/001_initial_schema.sql

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  bio TEXT,
  avatar_url VARCHAR(500),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts com full text search
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  search_vector tsvector,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices otimizados
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_published ON posts(published, published_at DESC);
CREATE INDEX idx_posts_search ON posts USING GIN(search_vector);
CREATE INDEX idx_posts_slug_trgm ON posts USING GIN(slug gin_trgm_ops);

-- Trigger para search_vector
CREATE FUNCTION posts_search_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('portuguese', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('portuguese', COALESCE(NEW.content, '')), 'B') ||
    setweight(to_tsvector('portuguese', COALESCE(NEW.excerpt, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_search_trigger
BEFORE INSERT OR UPDATE ON posts
FOR EACH ROW
EXECUTE FUNCTION posts_search_update();

-- Tags
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  slug VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts-Tags (many-to-many)
CREATE TABLE posts_tags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- View materializada para estatísticas
CREATE MATERIALIZED VIEW user_stats AS
SELECT
  u.id,
  u.username,
  COUNT(DISTINCT p.id) AS total_posts,
  COUNT(DISTINCT p.id) FILTER (WHERE p.published) AS published_posts,
  SUM(p.view_count) AS total_views
FROM users u
LEFT JOIN posts p ON u.id = p.author_id
GROUP BY u.id;

CREATE UNIQUE INDEX idx_user_stats_id ON user_stats(id);
```

## Checklist de Decisão

Use **node-pg-migrate** se:
- [ ] PostgreSQL é o banco definitivo do projeto
- [ ] Performance é crítica
- [ ] Equipe tem conhecimento avançado de PostgreSQL
- [ ] Usa recursos específicos do PostgreSQL (JSONB, FTS, PostGIS)
- [ ] Precisa de controle fino sobre SQL
- [ ] DBAs revisam migrations
- [ ] Tabelas com milhões de registros

Use **Sequelize/Knex** se:
- [ ] Pode precisar trocar de banco no futuro
- [ ] Equipe prefere JavaScript a SQL
- [ ] Desenvolvimento rápido é prioridade
- [ ] Aplicação pequena/média

Use **Prisma** se:
- [ ] TypeScript é obrigatório
- [ ] Type-safety é essencial
- [ ] Prototipagem rápida
- [ ] Equipe júnior/média

## Conclusão

**node-pg-migrate** é a escolha certa quando você:
- Tem certeza que vai usar PostgreSQL
- Precisa de performance máxima
- Quer controle total sobre o schema
- Tem equipe experiente em SQL

É **overkill** se você está apenas fazendo um CRUD simples ou pode mudar de banco no futuro.

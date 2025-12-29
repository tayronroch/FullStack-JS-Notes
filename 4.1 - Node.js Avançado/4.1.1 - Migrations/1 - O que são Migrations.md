# O que são Migrations

## Definição

Migrations (migrações) são arquivos que contêm instruções para modificar a estrutura do banco de dados de forma controlada e versionada.

## Por que usar Migrations?

### Vantagens

1. **Versionamento de Schema**
   - Histórico de todas as alterações no banco de dados
   - Rastreamento de quando e por que mudanças foram feitas

2. **Sincronização entre Ambientes**
   - Desenvolvimento, homologação e produção com o mesmo schema
   - Facilita trabalho em equipe

3. **Reversibilidade**
   - Possibilidade de desfazer alterações (rollback)
   - Segurança em caso de erros

4. **Automação**
   - Deploy automatizado de alterações
   - Redução de erros humanos

## Como funcionam?

```
Migration #1: Criar tabela users
Migration #2: Adicionar coluna email
Migration #3: Criar tabela posts
Migration #4: Adicionar índice em users.email
```

Cada migration tem:
- **UP**: código para aplicar a mudança
- **DOWN**: código para reverter a mudança

## Ferramentas Populares

- **Sequelize**: ORM completo com sistema de migrations
- **Knex.js**: Query builder com migrations
- **TypeORM**: ORM para TypeScript
- **Prisma**: ORM moderno com Prisma Migrate

## Exemplo Conceitual

```javascript
// Migration: criar_tabela_users

// UP - Aplicar
async function up() {
  await createTable('users', {
    id: 'integer primary key',
    name: 'varchar(255)',
    email: 'varchar(255) unique'
  })
}

// DOWN - Reverter
async function down() {
  await dropTable('users')
}
```

## História e Evolução de Migrations

### Era Pré-Migrations (até ~2005)

Antes das migrations, as mudanças no banco de dados eram feitas de forma manual e ad-hoc:

```sql
-- Script SQL executado manualmente
-- update_2024_01_15.sql

ALTER TABLE users ADD COLUMN phone VARCHAR(20);
CREATE INDEX idx_users_email ON users(email);
```

**Problemas:**
- Sem versionamento
- Sem sincronia entre ambientes
- Difícil rastrear quais scripts já foram executados
- Propenso a erros humanos
- Sem rollback

### Evolução das Ferramentas

**2005-2010: Frameworks Web Popularizam Migrations**
- Ruby on Rails (2005) - Pioneiro em migrations
- Django (Python) - Introduce South, depois migrations nativas
- Laravel (PHP) - Schema Builder

**2010-2015: Expansão para JavaScript/Node.js**
- Sequelize (2011)
- Knex.js (2013)
- Database migrations tornam-se padrão da indústria

**2015-Presente: ORMs Modernos**
- TypeORM (2016)
- Prisma (2019) - Abordagem declarativa
- Migrations como código

### Linha do Tempo

```
2005 ──────► 2010 ──────► 2015 ──────► 2020 ──────► Hoje
  │           │            │            │
Rails      Node.js     TypeORM      Prisma      Zero-downtime
ActiveRecord Sequelize             Declarativo  Blue-Green
            Knex.js                             Migrations
```

## Comparação de Abordagens

### 1. Schema-First (Database-First)

Você cria o schema no banco primeiro, depois gera o código.

```
[Banco de Dados] → [Gerador] → [Código ORM]
```

**Exemplo:**
```sql
-- Criar tabela no banco
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE
);
```

```bash
# Gerar models a partir do banco
sequelize-auto -h localhost -d mydb -u user -p password
```

**Vantagens:**
- DBAs têm controle total
- Otimizações de banco diretas
- Ferramentas visuais de design

**Desvantagens:**
- Código e banco podem ficar dessincronizados
- Difícil de versionar
- Não portátil entre SGBDs diferentes

### 2. Code-First (ORM-First)

Você define models no código, o ORM gera/atualiza o banco automaticamente.

```
[Código/Models] → [ORM] → [Banco de Dados]
```

**Exemplo (Sequelize):**
```javascript
// Definir model
const User = sequelize.define('User', {
  name: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    unique: true
  }
});

// Sincronizar com banco (desenvolvimento)
await sequelize.sync({ alter: true });
```

**Exemplo (Prisma):**
```prisma
model User {
  id    Int    @id @default(autoincrement())
  name  String
  email String @unique
}
```

```bash
npx prisma db push  # Atualiza banco automaticamente
```

**Vantagens:**
- Código é a fonte da verdade
- Rápido para prototipar
- Type-safe (com TypeScript)

**Desvantagens:**
- Perda de controle fino sobre SQL gerado
- Difícil fazer otimizações específicas de banco
- Pode gerar schemas não-ideais
- **PERIGOSO em produção** - pode perder dados

### 3. Migration-Based (Recomendado para Produção)

Você cria migrations explícitas que transformam o schema de forma controlada.

```
[Código] ← Sincronia Manual → [Migrations] → [Banco de Dados]
```

**Exemplo:**
```javascript
// models/User.js - Definição do model
const User = sequelize.define('User', {
  name: DataTypes.STRING,
  email: DataTypes.STRING
});

// migrations/001-create-users.js - Migration explícita
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: Sequelize.STRING,
      email: {
        type: Sequelize.STRING,
        unique: true
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('users');
  }
};
```

**Vantagens:**
- Controle total sobre mudanças
- Versionado e auditável
- Reversível
- Seguro para produção
- Testável

**Desvantagens:**
- Mais trabalho manual
- Precisa manter models e migrations sincronizados
- Curva de aprendizado

### Comparação Visual

| Aspecto | Schema-First | Code-First | Migration-Based |
|---------|--------------|------------|-----------------|
| Controle | DBA | Desenvolvedor | Desenvolvedor + DBA |
| Versionamento | Difícil | Automático | Explícito |
| Reversibilidade | Manual | Limitada | Completa |
| Produção | Arriscado | **PERIGOSO** | **Seguro** |
| Prototipagem | Lento | Rápido | Moderado |
| Type Safety | Não | Sim | Sim (com ORMs) |
| Portabilidade | Baixa | Alta | Alta |

### Recomendação por Ambiente

```javascript
// DESENVOLVIMENTO - Code-first para velocidade
if (process.env.NODE_ENV === 'development') {
  await sequelize.sync({ alter: true });
}

// STAGING/PRODUÇÃO - Sempre migrations
if (process.env.NODE_ENV === 'production') {
  // NUNCA use sync()!
  // Execute migrations via CLI ou deploy pipeline
  await runMigrations();
}
```

## Estado do Banco vs Código (Drift Detection)

### O que é Schema Drift?

**Schema Drift** ocorre quando o estado real do banco de dados diverge do esperado pelas migrations.

```
Estado Esperado (Migrations)    ≠    Estado Real (Banco)
   users.email: VARCHAR(255)          users.email: VARCHAR(500)
```

### Causas Comuns

1. **Alterações manuais no banco**
```sql
-- Alguém executou direto no banco
ALTER TABLE users MODIFY email VARCHAR(500);
```

2. **Migrations aplicadas fora de ordem**
```bash
# Desenvolvedor A aplicou migration #10
# Desenvolvedor B criou migration #9 depois
# Resultado: inconsistência
```

3. **Rollback parcial ou falho**
```bash
# Migration aplicou "UP" mas "DOWN" falhou
# Estado inconsistente
```

4. **Ambientes dessincronizados**
```
Desenvolvimento: migrations 1-10 aplicadas
Staging: migrations 1-9 aplicadas
Produção: migrations 1-8 aplicadas
```

### Detectando Drift

#### 1. Ferramentas Nativas

**Prisma Migrate:**
```bash
# Detecta diferenças
npx prisma migrate diff \
  --from-schema-datamodel prisma/schema.prisma \
  --to-schema-datasource DATABASE_URL

# Gera migration para corrigir
npx prisma migrate dev --create-only
```

**TypeORM:**
```bash
# Compara schema atual com entities
npx typeorm schema:log

# Sincroniza (cuidado!)
npx typeorm schema:sync
```

#### 2. Scripts Customizados

```javascript
// scripts/check-drift.js
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL);

async function checkDrift() {
  try {
    // Obter schema atual do banco
    const [tables] = await sequelize.query(`
      SELECT table_name, column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position
    `);

    // Obter migrations aplicadas
    const [migrations] = await sequelize.query(
      'SELECT name FROM SequelizeMeta ORDER BY name'
    );

    // Comparar com schema esperado
    const expectedSchema = require('./expected-schema.json');
    const actualSchema = formatSchema(tables);

    if (JSON.stringify(expectedSchema) !== JSON.stringify(actualSchema)) {
      console.error('SCHEMA DRIFT DETECTED!');
      console.error('Differences:', diff(expectedSchema, actualSchema));
      process.exit(1);
    }

    console.log('Schema is in sync');
    process.exit(0);

  } catch (error) {
    console.error('Error checking drift:', error);
    process.exit(1);
  }
}

checkDrift();
```

#### 3. CI/CD Integration

```yaml
# .github/workflows/check-schema.yml
name: Check Schema Drift

on:
  schedule:
    - cron: '0 9 * * *'  # Diariamente às 9h

jobs:
  check-drift:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Check schema drift
        env:
          DATABASE_URL: ${{ secrets.PRODUCTION_DB_URL }}
        run: |
          npm run check-drift

      - name: Notify on drift
        if: failure()
        uses: 8398a7/action-slack@v3
        with:
          status: failure
          text: 'Schema drift detected in production!'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Prevenindo Drift

1. **Proibir acesso direto ao banco**
```sql
-- Remover permissões DDL do usuário da aplicação
REVOKE CREATE, ALTER, DROP ON SCHEMA public FROM app_user;
```

2. **Migration locks**
```javascript
// Impedir migrations concorrentes
exports.up = async (queryInterface) => {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    // Adquirir lock
    await queryInterface.sequelize.query(
      'SELECT pg_advisory_lock(123456)',
      { transaction }
    );

    // Executar migration
    await queryInterface.addColumn('users', 'age', {
      type: Sequelize.INTEGER
    }, { transaction });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
```

3. **Validação automática**
```javascript
// middleware/checkSchema.js
const validateSchema = async (req, res, next) => {
  const isValid = await checkSchemaVersion();

  if (!isValid) {
    return res.status(503).json({
      error: 'Database schema out of sync',
      message: 'Please run pending migrations'
    });
  }

  next();
};

app.use(validateSchema);
```

4. **Documentação e treinamento**
- Code review obrigatório para migrations
- Documentação clara do processo
- Treinamento da equipe
- Checklist antes de deploy

### Recuperando de Drift

**Opção 1: Criar migration corretiva**
```javascript
// migration: fix-drift-users-email.js
exports.up = async (queryInterface, Sequelize) => {
  // Reverter para estado esperado
  await queryInterface.changeColumn('users', 'email', {
    type: Sequelize.STRING(255)
  });
};
```

**Opção 2: Atualizar migrations (apenas dev!)**
```bash
# APENAS EM DESENVOLVIMENTO
# NUNCA EM PRODUÇÃO!

# Resetar banco e reaplicar
npx sequelize-cli db:drop
npx sequelize-cli db:create
npx sequelize-cli db:migrate
```

**Opção 3: Backup e restore**
```bash
# Fazer backup
pg_dump production_db > backup.sql

# Aplicar migrations
npm run migrate

# Se algo der errado, restaurar
psql production_db < backup.sql
```

## Boas Práticas

-  Nunca editar migrations já aplicadas em produção
-  Criar uma migration para cada mudança lógica
-  Testar rollback antes de aplicar em produção
-  Incluir migrations no controle de versão (Git)
-  Nunca fazer alterações diretas no banco sem migration
-  Use migration-based approach em produção
-  Monitore schema drift regularmente
-  Mantenha código e migrations sincronizados

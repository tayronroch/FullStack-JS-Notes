# Migrations com Prisma

## O que é Prisma?

Prisma é um ORM moderno para Node.js e TypeScript que utiliza um schema declarativo e gera migrations automaticamente.

## Instalação

```bash
npm install prisma --save-dev
npm install @prisma/client

# Inicializar Prisma
npx prisma init
```

## Estrutura Criada

```
├── prisma/
│   └── schema.prisma
└── .env
```

## Schema Prisma

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  age       Int?
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([email])
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  authorId  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([authorId])
}
```

## Criar Migration

```bash
# Criar e aplicar migration
npx prisma migrate dev --name create_users_table

# Apenas criar migration (sem aplicar)
npx prisma migrate dev --create-only
```

## Aplicar Migrations

```bash
# Aplicar migrations pendentes (produção)
npx prisma migrate deploy

# Aplicar migrations em desenvolvimento
npx prisma migrate dev

# Reset database (apaga tudo e reaplica)
npx prisma migrate reset
```

## Tipos de Dados

```prisma
model Product {
  id          Int       @id @default(autoincrement())
  name        String    @db.VarChar(255)
  description String?   @db.Text
  price       Decimal   @db.Decimal(10, 2)
  stock       Int
  isActive    Boolean   @default(true)
  releaseDate DateTime  @db.Date
  metadata    Json?
  status      Status    @default(ACTIVE)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

enum Status {
  ACTIVE
  INACTIVE
  PENDING
}
```

## Relacionamentos

### Um para Muitos (1:N)

```prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  posts Post[]
}

model Post {
  id       Int  @id @default(autoincrement())
  title    String
  author   User @relation(fields: [authorId], references: [id])
  authorId Int
}
```

### Muitos para Muitos (N:N)

```prisma
model Post {
  id         Int        @id @default(autoincrement())
  title      String
  categories Category[]
}

model Category {
  id    Int    @id @default(autoincrement())
  name  String
  posts Post[]
}
```

### Um para Um (1:1)

```prisma
model User {
  id      Int      @id @default(autoincrement())
  email   String   @unique
  profile Profile?
}

model Profile {
  id     Int    @id @default(autoincrement())
  bio    String
  user   User   @relation(fields: [userId], references: [id])
  userId Int    @unique
}
```

## Índices e Constraints

```prisma
model User {
  id        Int    @id @default(autoincrement())
  email     String @unique
  firstName String
  lastName  String
  age       Int

  // Índice simples
  @@index([email])

  // Índice composto
  @@index([firstName, lastName])

  // Constraint único composto
  @@unique([firstName, lastName])
}
```

## Modificar Schema

1. **Edite o arquivo `schema.prisma`**
2. **Crie a migration:**

```bash
npx prisma migrate dev --name add_phone_to_users
```

Exemplo de mudança:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  phone     String?  // Nova coluna
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Comandos Úteis

```bash
# Criar migration em desenvolvimento
npx prisma migrate dev --name nome_da_migration

# Aplicar migrations em produção
npx prisma migrate deploy

# Ver status das migrations
npx prisma migrate status

# Reset database
npx prisma migrate reset

# Gerar Prisma Client
npx prisma generate

# Abrir Prisma Studio (GUI)
npx prisma studio

# Validar schema
npx prisma validate

# Formatar schema
npx prisma format
```

## Diferenças entre Dev e Deploy

| Comando | Uso | Ambiente |
|---------|-----|----------|
| `migrate dev` | Cria e aplica migrations | Desenvolvimento |
| `migrate deploy` | Apenas aplica migrations | Produção |
| `migrate reset` | Apaga tudo e reaplica | Desenvolvimento |

## Prototyping (Desenvolvimento Rápido)

```bash
# Sincroniza schema sem criar migration
npx prisma db push
```

 **Atenção**: `db push` não cria migrations. Use apenas em desenvolvimento!

## Usando Prisma Client

```javascript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Criar usuário
const user = await prisma.user.create({
  data: {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashed_password'
  }
})

// Buscar usuários
const users = await prisma.user.findMany({
  where: {
    email: {
      contains: '@example.com'
    }
  },
  include: {
    posts: true
  }
})
```

## Raw SQL em Migrations

```sql
-- migrations/20240101_custom_indexes/migration.sql
-- CreateIndex
CREATE INDEX CONCURRENTLY IF NOT EXISTS "users_email_lower_idx"
ON "users" (LOWER(email));

-- CreateTrigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
BEFORE UPDATE ON "users"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
```

## Migrations com Dados (Data Migrations)

```typescript
// prisma/migrations/20240101_backfill_full_names/migration.sql

-- Adicionar coluna
ALTER TABLE "users" ADD COLUMN "full_name" TEXT;

-- Backfill dados
UPDATE "users"
SET "full_name" = CONCAT("firstName", ' ', "lastName")
WHERE "full_name" IS NULL;
```

**Com Script TypeScript:**

```typescript
// prisma/migrations/20240101_backfill/data-migration.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando data migration...');

  const batchSize = 1000;
  let skip = 0;

  while (true) {
    const users = await prisma.user.findMany({
      where: { fullName: null },
      take: batchSize,
      skip
    });

    if (users.length === 0) break;

    await prisma.$transaction(
      users.map(user =>
        prisma.user.update({
          where: { id: user.id },
          data: {
            fullName: `${user.firstName} ${user.lastName}`
          }
        })
      )
    );

    skip += batchSize;
    console.log(`Processados ${skip} usuários...`);
  }

  console.log('Data migration concluída!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

## Múltiplos Schemas (PostgreSQL)

```prisma
// schema.prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["multiSchema"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  schemas  = ["public", "analytics"]
}

model User {
  id    Int    @id @default(autoincrement())
  email String @unique

  @@schema("public")
}

model Event {
  id        Int      @id @default(autoincrement())
  eventType String
  createdAt DateTime @default(now())

  @@schema("analytics")
}
```

## Views

```prisma
// schema.prisma
model ActiveUsers {
  id    Int    @id
  email String
  name  String

  @@map("active_users")
  @@ignore  // View, não cria migration
}
```

```sql
-- migrations/20240101_create_view/migration.sql
CREATE OR REPLACE VIEW active_users AS
SELECT id, email, name
FROM users
WHERE status = 'active';
```

## Customizar Migration

```bash
# Criar migration vazia
npx prisma migrate dev --create-only --name custom_migration

# Editar SQL manualmente
# migrations/XXXXXX_custom_migration/migration.sql

# Aplicar
npx prisma migrate dev
```

## Resolver Conflitos de Schema

```bash
# Verificar diferenças entre schema e banco
npx prisma migrate diff \
  --from-schema-datamodel prisma/schema.prisma \
  --to-schema-datasource $DATABASE_URL \
  --script

# Gerar SQL para sincronizar
npx prisma migrate diff \
  --from-schema-datasource $DATABASE_URL \
  --to-schema-datamodel prisma/schema.prisma \
  --script > fix.sql
```

## Shadow Database

```prisma
// schema.prisma - Para ambientes com restrições
datasource db {
  provider          = "postgresql"
  url               = env("DATABASE_URL")
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
}
```

```bash
# Usar shadow DB para gerar migration
DATABASE_URL="postgresql://user:pass@localhost/prod" \
SHADOW_DATABASE_URL="postgresql://user:pass@localhost/shadow" \
npx prisma migrate dev
```

## Baseline de Banco Existente

```bash
# Marcar todas migrations como aplicadas (banco existente)
npx prisma migrate resolve --applied "20240101_initial"

# Criar baseline do schema atual
npx prisma db pull  # Gera schema.prisma do banco
npx prisma migrate dev --name baseline --create-only
npx prisma migrate resolve --applied baseline
```

## Deploy Strategies

### Estratégia 1: Deploy Direto

```bash
# CI/CD Pipeline
npx prisma migrate deploy
npm run build
npm run start
```

### Estratégia 2: Blue-Green

```bash
# Aplicar migrations no Green primeiro
DATABASE_URL=$GREEN_DB_URL npx prisma migrate deploy

# Switch tráfego
# Reverter se necessário
```

### Estratégia 3: Expand-Migrate-Contract

```prisma
// schema.prisma - Fase 1: Expand
model User {
  id        Int    @id
  email     String // antiga
  email_new String? // nova (opcional)
}
```

```bash
npx prisma migrate dev --name add_email_new
# Deploy código que escreve em ambas

npx prisma migrate dev --name backfill_email_new
# Copiar dados

npx prisma migrate dev --name remove_old_email
# Remover coluna antiga
```

## Debugging

```bash
# Ver SQL gerado
npx prisma migrate dev --create-only --name test

# Aplicar com debug
DEBUG="*" npx prisma migrate dev

# Ver migrations aplicadas
npx prisma migrate status
```

## Seed Avançado

```typescript
// prisma/seed.ts
import { PrismaClient, Prisma } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('Limpando banco...');
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  console.log('Criando usuários...');

  // Factory function
  function createRandomUser(): Prisma.UserCreateInput {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      age: faker.number.int({ min: 18, max: 80 })
    };
  }

  // Criar em lote
  const users = Array.from({ length: 100 }, createRandomUser);

  await prisma.$transaction(
    users.map(user => prisma.user.create({ data: user }))
  );

  // Criar posts relacionados
  const createdUsers = await prisma.user.findMany();

  for (const user of createdUsers.slice(0, 10)) {
    await prisma.post.createMany({
      data: Array.from({ length: 5 }, () => ({
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(3),
        authorId: user.id,
        published: faker.datatype.boolean()
      }))
    });
  }

  console.log('Seed concluído!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
```

## Transações em Data Migrations

```typescript
// scripts/data-migration.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateAddresses() {
  // Usar transação interativa
  await prisma.$transaction(async (tx) => {
    const users = await tx.user.findMany({
      where: { addressJson: { not: null } }
    });

    for (const user of users) {
      const address = JSON.parse(user.addressJson);

      await tx.address.create({
        data: {
          userId: user.id,
          street: address.street,
          city: address.city,
          state: address.state,
          zip: address.zip
        }
      });
    }

    console.log(`Migrados ${users.length} endereços`);
  }, {
    maxWait: 5000,
    timeout: 60000
  });
}

migrateAddresses()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

## Rollback Manual

```bash
# Listar migrations
npx prisma migrate status

# Marcar migration como não aplicada (última)
npx prisma migrate resolve --rolled-back "20240101_migration_name"

# Executar SQL de rollback manualmente
psql $DATABASE_URL < migrations/20240101_migration_name/rollback.sql
```

```sql
-- migrations/20240101_add_column/rollback.sql
-- Criar manualmente se necessário
ALTER TABLE "users" DROP COLUMN "phone";
```

## CI/CD Integration

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

      - name: Generate Prisma Client
        run: npx prisma generate

      - name: Run migrations
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: npx prisma migrate deploy

      - name: Seed (if needed)
        if: github.event_name == 'workflow_dispatch'
        run: npx prisma db seed

      - name: Deploy application
        run: npm run deploy
```

## Performance Monitoring

```typescript
// prisma/client.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query'
    },
    'info',
    'warn',
    'error'
  ]
});

prisma.$on('query', (e) => {
  console.log(`Query: ${e.query}`);
  console.log(`Duration: ${e.duration}ms`);
});

export default prisma;
```

## Schema Validation

```typescript
// scripts/validate-schema.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function validateSchema() {
  try {
    // Verificar conexão
    await prisma.$connect();
    console.log('✓ Conexão OK');

    // Verificar se migrations estão aplicadas
    const tables = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `;

    console.log('✓ Tabelas encontradas:', tables.length);

    // Validar dados críticos
    const userCount = await prisma.user.count();
    console.log(`✓ Usuários no banco: ${userCount}`);

  } catch (error) {
    console.error('✗ Validação falhou:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

validateSchema();
```

## Boas Práticas

-  Sempre use `migrate dev` em desenvolvimento
-  Sempre use `migrate deploy` em produção
-  Commite as migrations no Git
-  Nunca edite migrations já aplicadas
-  Use `db push` apenas para prototipagem
-  Revise migrations geradas antes de aplicar
-  Use shadow database para ambientes restritos
-  Implemente seeds para dados de desenvolvimento
-  Valide schema após deploy
-  Use transações para data migrations
-  Monitore performance de queries
-  Crie rollback scripts para migrations críticas

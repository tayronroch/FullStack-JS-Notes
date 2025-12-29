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

## Boas Práticas

-  Sempre use `migrate dev` em desenvolvimento
-  Sempre use `migrate deploy` em produção
-  Commite as migrations no Git
-  Nunca edite migrations já aplicadas
-  Use `db push` apenas para prototipagem
-  Revise migrations geradas antes de aplicar

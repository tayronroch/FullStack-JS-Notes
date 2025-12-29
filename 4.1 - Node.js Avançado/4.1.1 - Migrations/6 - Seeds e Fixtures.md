# Seeds e Fixtures

## O que são Seeds?

**Seeds** (sementes) são arquivos que populam o banco de dados com dados iniciais ou de demonstração.

```
Migrations → Estrutura (DDL)
Seeds      → Dados (DML)
```

## Diferença entre Migration e Seed

| Aspecto | Migrations | Seeds |
|---------|-----------|-------|
| Propósito | Alterar **estrutura** (schema) | Inserir **dados** |
| SQL | DDL (CREATE, ALTER, DROP) | DML (INSERT, UPDATE) |
| Obrigatório | Sim | Não |
| Quando executar | Deploy, sempre | Apenas quando necessário |
| Rollback | Crítico | Menos crítico |
| Versionado | Sempre | Geralmente sim |
| Produção | Sempre | Raramente |

### Quando usar Migration vs Seed

 **Use Migration quando:**
```javascript
// Criar estrutura
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE
);

// Dados ESSENCIAIS para funcionamento
INSERT INTO roles VALUES (1, 'admin'), (2, 'user');
```

 **Use Seed quando:**
```javascript
// Dados de demonstração
INSERT INTO users VALUES
  (1, 'John Doe', 'john@example.com'),
  (2, 'Jane Smith', 'jane@example.com');

// Dados para desenvolvimento/testes
```

## Seeds com Sequelize

### Criar Seed

```bash
npx sequelize-cli seed:generate --name demo-users
```

### Estrutura de um Seed

```javascript
// seeders/20240101-demo-users.js

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: '$2b$10$hashed_password',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: '$2b$10$hashed_password',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: '$2b$10$hashed_password',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
```

### Seeds com Relacionamentos

```javascript
// seeders/20240102-demo-posts.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Obter IDs de usuários
    const [users] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email IN ('john@example.com', 'jane@example.com')`
    );

    await queryInterface.bulkInsert('posts', [
      {
        title: 'First Post',
        content: 'This is my first post',
        userId: users[0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Second Post',
        content: 'Another great post',
        userId: users[1].id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('posts', null, {});
  }
};
```

### Executar Seeds

```bash
# Executar todos os seeds
npx sequelize-cli db:seed:all

# Executar seed específico
npx sequelize-cli db:seed --seed 20240101-demo-users.js

# Reverter último seed
npx sequelize-cli db:seed:undo

# Reverter todos os seeds
npx sequelize-cli db:seed:undo:all

# Reverter seed específico
npx sequelize-cli db:seed:undo --seed 20240101-demo-users.js
```

## Seeds com Knex

### Criar Seed

```bash
npx knex seed:make demo_users
```

### Estrutura de um Seed

```javascript
// seeds/demo_users.js

exports.seed = async function(knex) {
  // Limpar tabela primeiro
  await knex('users').del();

  // Inserir dados
  await knex('users').insert([
    {
      name: 'Admin User',
      email: 'admin@example.com',
      password: '$2b$10$hashed_password',
      role: 'admin'
    },
    {
      name: 'John Doe',
      email: 'john@example.com',
      password: '$2b$10$hashed_password',
      role: 'user'
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: '$2b$10$hashed_password',
      role: 'user'
    }
  ]);
};
```

### Seeds com Relacionamentos (Knex)

```javascript
// seeds/01_users.js
exports.seed = async function(knex) {
  await knex('users').del();
  await knex('users').insert([
    { id: 1, name: 'John', email: 'john@example.com' },
    { id: 2, name: 'Jane', email: 'jane@example.com' }
  ]);
};

// seeds/02_posts.js
exports.seed = async function(knex) {
  await knex('posts').del();
  await knex('posts').insert([
    { title: 'First Post', user_id: 1 },
    { title: 'Second Post', user_id: 2 }
  ]);
};
```

### Executar Seeds (Knex)

```bash
# Executar todos os seeds
npx knex seed:run

# Executar seed específico
npx knex seed:run --specific=demo_users.js
```

### Configuração (knexfile.js)

```javascript
module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'myapp_dev'
    },
    seeds: {
      directory: './seeds/dev'
    }
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    seeds: {
      directory: './seeds/prod'
    }
  }
};
```

## Seeds com Prisma

### Arquivo de Seed

```typescript
// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Limpar dados existentes
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // Hash de senha
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Criar usuários
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'ADMIN'
    }
  });

  const john = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
      role: 'USER',
      posts: {
        create: [
          {
            title: 'First Post',
            content: 'This is my first post',
            published: true
          },
          {
            title: 'Second Post',
            content: 'Another post',
            published: false
          }
        ]
      }
    }
  });

  console.log({ admin, john });
  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### Configurar Seed (package.json)

```json
{
  "scripts": {
    "seed": "ts-node prisma/seed.ts"
  },
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

### Executar Seed (Prisma)

```bash
# Executar seed manualmente
npm run seed

# Resetar banco e executar seed
npx prisma migrate reset

# Apenas seed (sem migrations)
npx prisma db seed
```

## Fixtures para Testes

**Fixtures** são dados de teste fixos e previsíveis.

### Factory Pattern

```javascript
// tests/factories/userFactory.js

const bcrypt = require('bcrypt');

class UserFactory {
  static async create(overrides = {}) {
    const defaults = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: await bcrypt.hash('password123', 10),
      role: 'user'
    };

    return {
      ...defaults,
      ...overrides
    };
  }

  static async createMany(count, overrides = {}) {
    const users = [];
    for (let i = 0; i < count; i++) {
      users.push(await this.create(overrides));
    }
    return users;
  }

  static async admin() {
    return this.create({ role: 'admin' });
  }
}

module.exports = UserFactory;
```

### Uso em Testes

```javascript
// tests/user.test.js

const UserFactory = require('./factories/userFactory');
const { sequelize } = require('../models');

describe('User Tests', () => {
  beforeEach(async () => {
    // Limpar banco antes de cada teste
    await sequelize.sync({ force: true });
  });

  test('should create user', async () => {
    const userData = await UserFactory.create();
    const user = await User.create(userData);

    expect(user.email).toBe(userData.email);
  });

  test('admin can delete posts', async () => {
    const admin = await UserFactory.admin();
    const adminUser = await User.create(admin);

    // Testar funcionalidade de admin
  });
});
```

### Fixtures com Faker

```bash
npm install --save-dev @faker-js/faker
```

```javascript
// tests/factories/userFactory.js

const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');

class UserFactory {
  static async create(overrides = {}) {
    const defaults = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: await bcrypt.hash('password123', 10),
      age: faker.number.int({ min: 18, max: 80 }),
      bio: faker.lorem.paragraph(),
      avatar: faker.image.avatar()
    };

    return {
      ...defaults,
      ...overrides
    };
  }
}

module.exports = UserFactory;
```

## Seeds por Ambiente

### Estrutura de Diretórios

```
seeds/
├── common/          # Seeds para todos os ambientes
│   └── 01-roles.js
├── development/     # Apenas dev
│   ├── 02-demo-users.js
│   └── 03-demo-posts.js
├── staging/         # Apenas staging
│   └── 02-test-users.js
└── production/      # Apenas produção (raramente)
    └── 02-essential-data.js
```

### Script Customizado

```javascript
// scripts/seed.js

const path = require('path');
const { Sequelize } = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const seedsDir = path.join(__dirname, '../seeds', env);

async function runSeeds() {
  const sequelize = new Sequelize(process.env.DATABASE_URL);

  try {
    // Executar seeds comuns
    await executeSeedsFromDir(path.join(__dirname, '../seeds/common'));

    // Executar seeds do ambiente
    await executeSeedsFromDir(seedsDir);

    console.log(`Seeds for ${env} executed successfully`);
  } catch (error) {
    console.error('Error running seeds:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

async function executeSeedsFromDir(dir) {
  const fs = require('fs');
  const files = fs.readdirSync(dir).sort();

  for (const file of files) {
    if (file.endsWith('.js')) {
      const seed = require(path.join(dir, file));
      console.log(`Executing seed: ${file}`);
      await seed.up(queryInterface, Sequelize);
    }
  }
}

runSeeds();
```

## Boas Práticas

### 1. Idempotência

Seeds devem ser idempotentes (podem ser executados múltiplas vezes).

```javascript
// Ruim - duplica dados
exports.seed = async (knex) => {
  await knex('users').insert([
    { email: 'admin@example.com' }
  ]);
};

// Bom - verifica se existe
exports.seed = async (knex) => {
  const exists = await knex('users')
    .where('email', 'admin@example.com')
    .first();

  if (!exists) {
    await knex('users').insert([
      { email: 'admin@example.com' }
    ]);
  }
};

// Melhor - usa upsert
exports.seed = async (knex) => {
  await knex('users')
    .insert({ email: 'admin@example.com' })
    .onConflict('email')
    .ignore();
};
```

### 2. Ordem de Execução

Respeite dependências (foreign keys).

```
01_users.js      (tabela pai)
02_posts.js      (depende de users)
03_comments.js   (depende de posts)
```

### 3. Não use Seeds em Produção

```javascript
// package.json
{
  "scripts": {
    "seed": "if [ \"$NODE_ENV\" != \"production\" ]; then sequelize-cli db:seed:all; else echo 'Seeds disabled in production'; fi"
  }
}
```

### 4. Dados Sensíveis

```javascript
// NUNCA coloque senhas reais em seeds
const password = await bcrypt.hash('password123', 10);

// NUNCA commite dados de produção
// seeds/production/ deve estar em .gitignore (ou vazio)
```

### 5. Performance

```javascript
// Ruim - inserir um por vez
for (const user of users) {
  await knex('users').insert(user);
}

// Bom - inserir em batch
await knex('users').insert(users);

// Melhor - inserir em chunks
const chunkSize = 1000;
for (let i = 0; i < users.length; i += chunkSize) {
  const chunk = users.slice(i, i + chunkSize);
  await knex('users').insert(chunk);
}
```

### 6. Limpar Dados Antes

```javascript
exports.seed = async (knex) => {
  // Desabilitar checks temporariamente
  await knex.raw('SET FOREIGN_KEY_CHECKS = 0');

  // Limpar dados
  await knex('posts').del();
  await knex('users').del();

  // Reabilitar checks
  await knex.raw('SET FOREIGN_KEY_CHECKS = 1');

  // Inserir novos dados
  await knex('users').insert([...]);
};
```

## Exemplo Completo

```javascript
// seeds/dev/comprehensive-seed.js

const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Limpar dados existentes
    await queryInterface.bulkDelete('comments', null, {});
    await queryInterface.bulkDelete('posts', null, {});
    await queryInterface.bulkDelete('users', null, {});

    // 2. Criar usuários
    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = [
      {
        id: 1,
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Gerar 50 usuários aleatórios
    for (let i = 2; i <= 50; i++) {
      users.push({
        id: i,
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: hashedPassword,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await queryInterface.bulkInsert('users', users);

    // 3. Criar posts
    const posts = [];
    for (let i = 1; i <= 200; i++) {
      posts.push({
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(3),
        userId: faker.number.int({ min: 1, max: 50 }),
        published: faker.datatype.boolean(),
        createdAt: faker.date.past(),
        updatedAt: new Date()
      });
    }

    await queryInterface.bulkInsert('posts', posts);

    console.log('Seed completed: 50 users, 200 posts');
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('posts', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};
```

## Checklist

- [ ] Seeds são idempotentes?
- [ ] Ordem de execução respeita foreign keys?
- [ ] Senhas estão hasheadas?
- [ ] Não há dados sensíveis/reais?
- [ ] Performance otimizada (batch inserts)?
- [ ] Seeds de produção desabilitados?
- [ ] Fixtures para testes criadas?
- [ ] Documentação de como executar?

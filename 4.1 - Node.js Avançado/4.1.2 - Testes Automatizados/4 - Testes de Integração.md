# Testes de Integração

## O que são Testes de Integração?

Testes de integração verificam como **diferentes módulos/componentes** trabalham juntos, incluindo interações com banco de dados, APIs externas, sistema de arquivos, etc.

## Diferença entre Unitário e Integração

| Testes Unitários | Testes de Integração |
|------------------|---------------------|
| Testam funções isoladas | Testam módulos integrados |
| Usam mocks para dependências | Usam dependências reais |
| Rápidos (ms) | Mais lentos (segundos) |
| Não tocam infraestrutura | Banco, APIs, arquivos |

## Configuração

### Banco de Dados de Teste

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: ['**/*.integration.test.js']
};
```

```javascript
// tests/setup.js
beforeAll(async () => {
  // Conectar ao banco de testes
  await database.connect(process.env.TEST_DATABASE_URL);
});

afterAll(async () => {
  // Desconectar
  await database.disconnect();
});

beforeEach(async () => {
  // Limpar dados antes de cada teste
  await database.clear();
});
```

## Exemplos Práticos

### 1. Testando com Banco de Dados

```javascript
// UserRepository.js
export class UserRepository {
  constructor(database) {
    this.db = database;
  }

  async create(userData) {
    const result = await this.db.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [userData.name, userData.email]
    );
    return result.rows[0];
  }

  async findByEmail(email) {
    const result = await this.db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  }

  async delete(id) {
    await this.db.query('DELETE FROM users WHERE id = $1', [id]);
  }
}
```

```javascript
// UserRepository.integration.test.js
import { UserRepository } from './UserRepository';
import { database } from './database';

describe('UserRepository Integration', () => {
  let userRepository;

  beforeAll(async () => {
    await database.connect();
    await database.migrate(); // Rodar migrations
  });

  afterAll(async () => {
    await database.disconnect();
  });

  beforeEach(async () => {
    await database.query('TRUNCATE users CASCADE');
    userRepository = new UserRepository(database);
  });

  describe('create()', () => {
    test('should create user in database', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com'
      };

      const user = await userRepository.create(userData);

      expect(user.id).toBeDefined();
      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@example.com');

      // Verificar que realmente foi salvo
      const found = await userRepository.findByEmail('john@example.com');
      expect(found).toEqual(user);
    });

    test('should throw error on duplicate email', async () => {
      await userRepository.create({
        name: 'User 1',
        email: 'duplicate@example.com'
      });

      await expect(
        userRepository.create({
          name: 'User 2',
          email: 'duplicate@example.com'
        })
      ).rejects.toThrow();
    });
  });

  describe('findByEmail()', () => {
    test('should return user when exists', async () => {
      await userRepository.create({
        name: 'John',
        email: 'john@example.com'
      });

      const user = await userRepository.findByEmail('john@example.com');

      expect(user).toBeDefined();
      expect(user.email).toBe('john@example.com');
    });

    test('should return null when not exists', async () => {
      const user = await userRepository.findByEmail('notfound@example.com');
      expect(user).toBeNull();
    });
  });

  describe('delete()', () => {
    test('should delete user from database', async () => {
      const user = await userRepository.create({
        name: 'John',
        email: 'john@example.com'
      });

      await userRepository.delete(user.id);

      const found = await userRepository.findByEmail('john@example.com');
      expect(found).toBeNull();
    });
  });
});
```

### 2. Testando API REST

```javascript
// app.js
import express from 'express';
import { UserService } from './UserService';

export function createApp(userService) {
  const app = express();
  app.use(express.json());

  app.post('/users', async (req, res) => {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get('/users/:id', async (req, res) => {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  });

  return app;
}
```

```javascript
// app.integration.test.js
import request from 'supertest';
import { createApp } from './app';
import { UserService } from './UserService';
import { database } from './database';

describe('User API Integration', () => {
  let app;

  beforeAll(async () => {
    await database.connect();
  });

  afterAll(async () => {
    await database.disconnect();
  });

  beforeEach(async () => {
    await database.query('TRUNCATE users CASCADE');
    const userService = new UserService(database);
    app = createApp(userService);
  });

  describe('POST /users', () => {
    test('should create user successfully', async () => {
      const response = await request(app)
        .post('/users')
        .send({
          name: 'John Doe',
          email: 'john@example.com'
        })
        .expect(201);

      expect(response.body).toMatchObject({
        name: 'John Doe',
        email: 'john@example.com'
      });
      expect(response.body.id).toBeDefined();
    });

    test('should return 400 for invalid data', async () => {
      const response = await request(app)
        .post('/users')
        .send({
          name: 'John'
          // email missing
        })
        .expect(400);

      expect(response.body.error).toBeDefined();
    });
  });

  describe('GET /users/:id', () => {
    test('should return user when exists', async () => {
      // Criar usuário primeiro
      const createResponse = await request(app)
        .post('/users')
        .send({ name: 'John', email: 'john@example.com' });

      const userId = createResponse.body.id;

      // Buscar usuário
      const response = await request(app)
        .get(`/users/${userId}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: userId,
        name: 'John',
        email: 'john@example.com'
      });
    });

    test('should return 404 when user not found', async () => {
      await request(app)
        .get('/users/999')
        .expect(404);
    });
  });
});
```

### 3. Testando com Transações

```javascript
// OrderService.integration.test.js
import { OrderService } from './OrderService';
import { database } from './database';

describe('OrderService Integration', () => {
  let orderService;

  beforeEach(async () => {
    await database.query('TRUNCATE orders, order_items CASCADE');
    orderService = new OrderService(database);
  });

  describe('createOrder()', () => {
    test('should create order with items in single transaction', async () => {
      const orderData = {
        userId: 1,
        items: [
          { productId: 1, quantity: 2, price: 10 },
          { productId: 2, quantity: 1, price: 20 }
        ]
      };

      const order = await orderService.createOrder(orderData);

      expect(order.id).toBeDefined();
      expect(order.total).toBe(40);

      // Verificar que items foram criados
      const items = await database.query(
        'SELECT * FROM order_items WHERE order_id = $1',
        [order.id]
      );

      expect(items.rows).toHaveLength(2);
    });

    test('should rollback on error', async () => {
      const orderData = {
        userId: 1,
        items: [
          { productId: 1, quantity: 2, price: 10 },
          { productId: 999, quantity: 1, price: 20 } // Produto inválido
        ]
      };

      await expect(
        orderService.createOrder(orderData)
      ).rejects.toThrow();

      // Verificar que NADA foi criado
      const orders = await database.query('SELECT * FROM orders');
      expect(orders.rows).toHaveLength(0);

      const items = await database.query('SELECT * FROM order_items');
      expect(items.rows).toHaveLength(0);
    });
  });
});
```

### 4. Testando com APIs Externas

```javascript
// PaymentService.integration.test.js
import { PaymentService } from './PaymentService';
import nock from 'nock';

describe('PaymentService Integration', () => {
  let paymentService;

  beforeEach(() => {
    paymentService = new PaymentService();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('processPayment()', () => {
    test('should process payment successfully', async () => {
      // Mock da API externa
      nock('https://payment-api.example.com')
        .post('/charges')
        .reply(200, {
          id: 'ch_123',
          status: 'succeeded',
          amount: 1000
        });

      const result = await paymentService.processPayment({
        amount: 1000,
        currency: 'usd',
        token: 'tok_visa'
      });

      expect(result.status).toBe('succeeded');
      expect(result.id).toBe('ch_123');
    });

    test('should handle payment failure', async () => {
      nock('https://payment-api.example.com')
        .post('/charges')
        .reply(402, {
          error: 'card_declined'
        });

      await expect(
        paymentService.processPayment({
          amount: 1000,
          currency: 'usd',
          token: 'tok_visa'
        })
      ).rejects.toThrow('card_declined');
    });

    test('should retry on network error', async () => {
      nock('https://payment-api.example.com')
        .post('/charges')
        .replyWithError('Network error')
        .post('/charges')
        .reply(200, { id: 'ch_123', status: 'succeeded' });

      const result = await paymentService.processPayment({
        amount: 1000,
        currency: 'usd',
        token: 'tok_visa'
      });

      expect(result.status).toBe('succeeded');
    });
  });
});
```

## Ferramentas Úteis

### Supertest (API Testing)
```bash
npm install --save-dev supertest
```

### Nock (HTTP Mocking)
```bash
npm install --save-dev nock
```

### Testcontainers (Docker para testes)
```bash
npm install --save-dev testcontainers
```

## Boas Práticas

###  Fazer

1. **Use banco de dados de teste separado**
   ```javascript
   // .env.test
   DATABASE_URL=postgresql://localhost/myapp_test
   ```

2. **Limpe dados entre testes**
   ```javascript
   beforeEach(async () => {
     await database.query('TRUNCATE TABLE users CASCADE');
   });
   ```

3. **Teste fluxos completos**
   ```javascript
   test('complete user registration flow', async () => {
     const user = await createUser(data);
     const email = await checkEmailSent(user.email);
     const activated = await activateAccount(email.token);
     expect(activated).toBe(true);
   });
   ```

###  Evitar

1. **Não compartilhe estado entre testes**
2. **Não use produção para testes**
3. **Não ignore erros de setup/teardown**

## Exemplo Completo

```javascript
// e-commerce.integration.test.js
import { createApp } from './app';
import { database } from './database';
import request from 'supertest';

describe('E-commerce Flow Integration', () => {
  let app;

  beforeAll(async () => {
    await database.connect();
    await database.migrate();
  });

  afterAll(async () => {
    await database.disconnect();
  });

  beforeEach(async () => {
    await database.clear();
    app = createApp();
  });

  test('complete purchase flow', async () => {
    // 1. Criar usuário
    const userResponse = await request(app)
      .post('/users')
      .send({ name: 'John', email: 'john@example.com' })
      .expect(201);

    const userId = userResponse.body.id;

    // 2. Adicionar produto ao carrinho
    const cartResponse = await request(app)
      .post(`/users/${userId}/cart`)
      .send({ productId: 1, quantity: 2 })
      .expect(200);

    expect(cartResponse.body.items).toHaveLength(1);

    // 3. Criar pedido
    const orderResponse = await request(app)
      .post(`/users/${userId}/orders`)
      .send({ paymentMethod: 'credit_card' })
      .expect(201);

    expect(orderResponse.body.status).toBe('pending');

    // 4. Verificar pedido foi salvo
    const order = await database.query(
      'SELECT * FROM orders WHERE id = $1',
      [orderResponse.body.id]
    );

    expect(order.rows[0].user_id).toBe(userId);
  });
});
```

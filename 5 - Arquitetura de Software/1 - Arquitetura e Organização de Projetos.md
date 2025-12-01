# Arquitetura de Software e Organização de Projetos

A forma como um projeto é estruturado é crucial para sua manutenibilidade, escalabilidade e para a produtividade do time. Uma arquitetura bem definida e uma organização de arquivos consistente facilitam o entendimento do código, a adição de novas funcionalidades e a correção de bugs.

## Princípios Fundamentais

Antes de escolher uma estrutura, é importante entender alguns princípios que guiam a organização de software.

### 1. Separação de Responsabilidades (Separation of Concerns - SoC)

O princípio mais importante. Ele dita que um software deve ser dividido em partes distintas, onde cada parte é responsável por uma única funcionalidade. Em uma aplicação web, isso se traduz em separar:

- **Apresentação (UI):** O que o usuário vê.
- **Lógica de Negócio:** As regras e o funcionamento da aplicação.
- **Acesso a Dados:** A comunicação com o banco de dados.

### 2. Coesão e Acoplamento

- **Coesão (High Cohesion):** Módulos ou componentes devem ter responsabilidades bem definidas e focadas. Um módulo coeso agrupa funcionalidades relacionadas.
- **Acoplamento (Low Coupling):** Os componentes devem ser o mais independentes possível uns dos outros. Baixo acoplamento significa que uma mudança em um componente tem impacto mínimo em outros.

### 3. Software Modificável

**Software Modificável** é aquele que o custo de fazer uma alteração é baixa e constante ao longo do tempo. Ou seja, ele não possui overengineering, é simples e tem a complexidade técnica alinhada com os objetivos do negócio e com a habilidade do time.

Características de um software modificável:

- **Simplicidade:** Evita abstrações desnecessárias e soluções excessivamente complexas.
- **Alinhamento com o negócio:** A arquitetura reflete as reais necessidades do produto, sem antecipar requisitos futuros incertos.
- **Adequação ao time:** A complexidade técnica está de acordo com o nível de experiência e tamanho da equipe.
- **Custo constante de mudança:** Adicionar ou modificar funcionalidades não se torna progressivamente mais difícil com o tempo.

Este princípio nos lembra que uma boa arquitetura não é necessariamente a mais sofisticada, mas sim aquela que permite evolução sustentável do código.

## Estrutura de Pastas e Arquivos

Não existe uma única estrutura "certa" para todos os projetos. A escolha depende do tamanho, da complexidade e da tecnologia utilizada. No entanto, algumas abordagens são amplamente adotadas.

### Abordagem 1: Organização por Tipo de Arquivo

Comum em projetos menores ou frameworks que a incentivam (como o Express.js em sua forma mais básica).

```
/
├── controllers/
│   ├── userController.js
│   └── productController.js
├── models/
│   ├── user.js
│   └── product.js
├── views/
│   ├── user.html
│   └── product.html
├── routes/
│   ├── userRoutes.js
│   └── productRoutes.js
└── app.js
```

- **Prós:** Simples de entender no início.
- **Contras:** Conforme o projeto cresce, encontrar todos os arquivos relacionados a uma funcionalidade (ex: "produto") exige navegar por várias pastas. A coesão é baixa.

### Abordagem 2: Organização por Funcionalidade (Feature-Based)

Recomendada para projetos de médio a grande porte. Agrupa os arquivos por domínio ou funcionalidade de negócio.

```
/
├── features/
│   ├── user/
│   │   ├── userController.js
│   │   ├── userService.js
│   │   ├── userRepository.js
│   │   └── userRoutes.js
│   └── product/
│       ├── productController.js
│       ├── productService.js
│       ├── productRepository.js
│       └── productRoutes.js
├── shared/
│   ├── middleware/
│   ├── utils/
│   └── config/
└── app.js
```

- **Prós:** Alta coesão. Facilita encontrar e modificar o código de uma funcionalidade específica. Promove baixo acoplamento entre as features.
- **Contras:** Pode parecer excessivo para projetos muito pequenos.

## Camadas da Arquitetura (N-Tier Architecture)

Uma aplicação moderna geralmente é dividida em camadas lógicas. A estrutura de pastas pode refletir essas camadas.

### Camada de Apresentação (Presentation/UI Layer)

- **Responsabilidade:** Exibir a interface para o usuário e capturar suas interações. Em um backend, essa camada é representada pelos **Controllers** (em um padrão MVC) ou pelos **Routes**, que lidam com as requisições HTTP.
- **Exemplos:** Componentes React, templates HTML, `userController.js`.

### Camada de Serviço (Service/Business Logic Layer)

- **Responsabilidade:** Orquestrar a lógica de negócio da aplicação. Ela não sabe nada sobre HTTP ou o banco de dados. Apenas executa as regras e coordena as operações.
- **Exemplos:** `userService.js` (com métodos como `createUser` ou `updateUserProfile`).

### Camada de Acesso a Dados (Data Access Layer - DAL)

- **Responsabilidade:** Abstrair a comunicação com o banco de dados. Centraliza toda a lógica de queries (SQL, NoSQL, etc.). É também chamada de **Repository Pattern**.
- **Exemplos:** `userRepository.js` (com métodos como `findById` ou `save`).

**Fluxo de uma Requisição:**

1.  A requisição HTTP chega na camada de **Apresentação** (`routes` -> `controller`).
2.  O `controller` chama a camada de **Serviço** para executar a lógica de negócio.
3.  O `service` chama a camada de **Acesso a Dados** para buscar ou persistir informações.
4.  O `repository` interage com o banco de dados.
5.  O resultado volta pelo mesmo caminho até ser entregue como resposta HTTP.

## O que colocar na pasta `shared` ou `common`?

- **`config`:** Arquivos de configuração (conexão com banco, chaves de API, etc.).
- **`middleware`:** Funções que rodam no meio de uma requisição (autenticação, logging, tratamento de erros).
- **`utils`:** Funções utilitárias puras e reutilizáveis (formatação de datas, validações genéricas).
- **`lib`:** Configuração de bibliotecas externas (ex: `axios`, `winston`).

---

## Padrões de Design Essenciais

Padrões de design são soluções comprovadas para problemas comuns no desenvolvimento de software. Aqui estão os mais importantes para arquitetura:

### 1. Repository Pattern

**Problema:** Acesso direto ao banco de dados espalhado pelo código.

**Solução:** Centralizar toda lógica de acesso a dados em uma camada específica.

```javascript
// userRepository.js
class UserRepository {
  constructor(database) {
    this.db = database
  }

  async findById(id) {
    return await this.db.query('SELECT * FROM users WHERE id = $1', [id])
  }

  async findByEmail(email) {
    return await this.db.query('SELECT * FROM users WHERE email = $1', [email])
  }

  async create(userData) {
    const { name, email, password } = userData
    return await this.db.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, password]
    )
  }

  async update(id, userData) {
    const { name, email } = userData
    return await this.db.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
      [name, email, id]
    )
  }

  async delete(id) {
    return await this.db.query('DELETE FROM users WHERE id = $1', [id])
  }
}

module.exports = UserRepository
```

**Benefícios:**
- Fácil trocar de banco de dados
- Queries centralizadas (fácil de otimizar)
- Facilita testes (mock do repository)

### 2. Dependency Injection (DI)

**Problema:** Classes criam suas próprias dependências, dificultando testes e manutenção.

**Solução:** Injetar dependências via construtor ou parâmetros.

```javascript
// ❌ Sem Dependency Injection (ruim)
class UserService {
  constructor() {
    this.repository = new UserRepository() // Acoplamento forte
    this.emailService = new EmailService()
  }

  async createUser(userData) {
    const user = await this.repository.create(userData)
    await this.emailService.sendWelcome(user.email)
    return user
  }
}

// ✅ Com Dependency Injection (bom)
class UserService {
  constructor(userRepository, emailService) {
    this.repository = userRepository // Injetado
    this.emailService = emailService // Injetado
  }

  async createUser(userData) {
    const user = await this.repository.create(userData)
    await this.emailService.sendWelcome(user.email)
    return user
  }
}

// Uso
const userRepo = new UserRepository(database)
const emailSvc = new EmailService()
const userService = new UserService(userRepo, emailSvc)
```

**Benefícios:**
- Fácil criar mocks para testes
- Componentes desacoplados
- Flexibilidade para trocar implementações

### 3. Factory Pattern

**Problema:** Lógica complexa de criação de objetos espalhada.

**Solução:** Centralizar a criação em uma Factory.

```javascript
// factories/userFactory.js
class UserFactory {
  static createFromRequest(requestData) {
    return {
      name: requestData.name.trim(),
      email: requestData.email.toLowerCase(),
      password: this.hashPassword(requestData.password),
      createdAt: new Date(),
      role: requestData.role || 'user'
    }
  }

  static createFromDatabase(dbData) {
    return {
      id: dbData.id,
      name: dbData.name,
      email: dbData.email,
      role: dbData.role,
      createdAt: new Date(dbData.created_at)
    }
  }

  static hashPassword(password) {
    // Lógica de hash
    return bcrypt.hashSync(password, 10)
  }
}

// Uso no controller
const userData = UserFactory.createFromRequest(req.body)
const user = await userService.create(userData)
```

### 4. Middleware Pattern

**Problema:** Lógica repetitiva em várias rotas (autenticação, validação, logging).

**Solução:** Usar middlewares que interceptam requisições.

```javascript
// middleware/authenticate.js
async function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Token not provided' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next() // Continua para próximo middleware ou rota
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

// middleware/validate.js
function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body)
    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }
    next()
  }
}

// Uso nas rotas
router.post('/users',
  validate(userSchema),    // Valida primeiro
  authenticate,             // Depois autentica
  userController.create     // Por fim, executa
)
```

---

## Monolito vs Microserviços

### Monolito

**O que é:** Toda a aplicação em um único projeto/processo.

```
monolito/
├── features/
│   ├── users/
│   ├── products/
│   ├── orders/
│   └── payments/
└── app.js (tudo roda aqui)
```

**Quando usar:**
- ✅ Startup/MVP (time pequeno)
- ✅ Projeto novo sem escala definida
- ✅ Time com pouca experiência em distributed systems
- ✅ Domínio de negócio ainda não está claro

**Vantagens:**
- Simples de desenvolver e debugar
- Deploy único
- Sem complexidade de rede
- Transações ACID simples

**Desvantagens:**
- Difícil escalar partes específicas
- Deploy de tudo junto (risco maior)
- Tecnologia única (hard lock-in)

### Microserviços

**O que é:** Aplicação dividida em serviços pequenos e independentes.

```
sistema/
├── user-service/       (Node.js)
├── product-service/    (Python)
├── order-service/      (Go)
├── payment-service/    (Java)
└── api-gateway/        (agregador)
```

**Quando usar:**
- ✅ Empresa grande com múltiplos times
- ✅ Necessidade de escalar partes independentemente
- ✅ Domínios bem definidos e desacoplados
- ✅ Time experiente em arquitetura distribuída

**Vantagens:**
- Escala independente por serviço
- Times autônomos
- Stack tecnológico flexível
- Falha isolada

**Desvantagens:**
- Complexidade de rede
- Debugging difícil
- Transações distribuídas complexas
- Mais infraestrutura

### Decisão Prática

```
Comece com monolito → Cresce → Identifica gargalos → Extrai microserviços

Exemplo:
1. MVP: Monolito (users + products + payments)
2. Problema: Pagamentos sobrecarregam o servidor
3. Solução: Extrair payment-service
4. Resultado: Monolito modular + 1 microserviço
```

**Regra de ouro:** Não comece com microserviços. Comece com monolito bem modularizado.

---

## Domain-Driven Design (DDD) - Conceitos Básicos

DDD é uma abordagem que coloca o **domínio do negócio** no centro da arquitetura.

### Conceitos Principais

#### 1. Bounded Context (Contexto Delimitado)

Divisão do sistema por domínios de negócio.

```
E-commerce:
├── Sales Context (vendas)
│   └── Produto tem: preço, estoque, promoções
├── Catalog Context (catálogo)
│   └── Produto tem: descrição, imagens, categoria
└── Shipping Context (envio)
    └── Produto tem: peso, dimensões
```

**Mesmo conceito (Produto), dados diferentes por contexto.**

#### 2. Entities vs Value Objects

**Entity:** Tem identidade única (ID).
```javascript
class User {
  constructor(id, name, email) {
    this.id = id      // Identidade única
    this.name = name
    this.email = email
  }
}

// Dois users com mesmo nome são DIFERENTES
const user1 = new User(1, 'John', 'john@email.com')
const user2 = new User(2, 'John', 'john@email.com')
// user1 !== user2 (IDs diferentes)
```

**Value Object:** Sem identidade, definido por valores.
```javascript
class Money {
  constructor(amount, currency) {
    this.amount = amount
    this.currency = currency
  }

  equals(other) {
    return this.amount === other.amount &&
           this.currency === other.currency
  }
}

// Dois Money com mesmos valores são IGUAIS
const price1 = new Money(100, 'USD')
const price2 = new Money(100, 'USD')
// price1.equals(price2) === true
```

#### 3. Aggregates (Agregados)

Conjunto de entidades tratadas como unidade.

```javascript
// Order é a raiz do agregado
class Order {
  constructor(id, customerId) {
    this.id = id
    this.customerId = customerId
    this.items = []  // OrderItems pertencem a Order
    this.status = 'pending'
  }

  addItem(product, quantity) {
    // Validação no agregado
    if (this.status !== 'pending') {
      throw new Error('Cannot modify confirmed order')
    }

    this.items.push(new OrderItem(product, quantity))
  }

  // Regra de negócio centralizada
  calculateTotal() {
    return this.items.reduce((sum, item) => sum + item.subtotal(), 0)
  }
}

// OrderItem nunca existe sozinho, sempre dentro de Order
class OrderItem {
  constructor(product, quantity) {
    this.product = product
    this.quantity = quantity
  }

  subtotal() {
    return this.product.price * this.quantity
  }
}
```

**Regra:** Sempre acesse OrderItem através de Order, nunca diretamente.

#### 4. Domain Services

Lógica de negócio que não pertence a uma entidade específica.

```javascript
// domain/orderPricingService.js
class OrderPricingService {
  calculateShipping(order, address) {
    const weight = order.items.reduce((sum, item) =>
      sum + item.product.weight * item.quantity, 0
    )

    const distance = this.calculateDistance(address)

    return weight * 0.5 + distance * 0.1
  }

  applyDiscounts(order, customer) {
    let total = order.calculateTotal()

    // Cliente VIP tem 10% desconto
    if (customer.isVIP) {
      total *= 0.9
    }

    // Pedidos acima de R$100 têm frete grátis
    if (total > 100) {
      return { total, shipping: 0 }
    }

    return { total, shipping: this.calculateShipping(order, customer.address) }
  }
}
```

---

## Exemplo Prático: Implementando Arquitetura em Camadas

Vamos implementar uma funcionalidade completa: **Criar usuário**.

### Estrutura de pastas

```
src/
├── features/
│   └── users/
│       ├── user.entity.js
│       ├── user.repository.js
│       ├── user.service.js
│       ├── user.controller.js
│       ├── user.routes.js
│       ├── user.validator.js
│       └── __tests__/
└── shared/
    ├── errors/
    └── middleware/
```

### 1. Entity (Modelo de domínio)

```javascript
// user.entity.js
class User {
  constructor(data) {
    this.id = data.id
    this.name = data.name
    this.email = data.email
    this.password = data.password
    this.createdAt = data.createdAt || new Date()
  }

  // Regras de negócio do domínio
  isEmailValid() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(this.email)
  }

  // Não retorna a senha
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt
    }
  }
}

module.exports = User
```

### 2. Repository (Acesso a dados)

```javascript
// user.repository.js
const User = require('./user.entity')

class UserRepository {
  constructor(database) {
    this.db = database
  }

  async findByEmail(email) {
    const result = await this.db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )

    if (!result.rows[0]) return null
    return new User(result.rows[0])
  }

  async create(userData) {
    const result = await this.db.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [userData.name, userData.email, userData.password]
    )

    return new User(result.rows[0])
  }

  async findById(id) {
    const result = await this.db.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    )

    if (!result.rows[0]) return null
    return new User(result.rows[0])
  }
}

module.exports = UserRepository
```

### 3. Service (Lógica de negócio)

```javascript
// user.service.js
const bcrypt = require('bcrypt')
const { ValidationError, ConflictError } = require('../../shared/errors')

class UserService {
  constructor(userRepository) {
    this.repository = userRepository
  }

  async createUser(userData) {
    // Validação de negócio
    if (!userData.name || !userData.email || !userData.password) {
      throw new ValidationError('Name, email and password are required')
    }

    // Verifica se email já existe
    const existingUser = await this.repository.findByEmail(userData.email)
    if (existingUser) {
      throw new ConflictError('Email already in use')
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(userData.password, 10)

    // Cria usuário
    const user = await this.repository.create({
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: hashedPassword
    })

    return user
  }

  async getUserById(id) {
    const user = await this.repository.findById(id)
    if (!user) {
      throw new NotFoundError('User not found')
    }
    return user
  }
}

module.exports = UserService
```

### 4. Controller (Apresentação)

```javascript
// user.controller.js
class UserController {
  constructor(userService) {
    this.service = userService
  }

  async create(req, res, next) {
    try {
      const user = await this.service.createUser(req.body)

      return res.status(201).json(user.toJSON())
    } catch (error) {
      next(error) // Passa para middleware de erro
    }
  }

  async getById(req, res, next) {
    try {
      const user = await this.service.getUserById(req.params.id)

      return res.status(200).json(user.toJSON())
    } catch (error) {
      next(error)
    }
  }
}

module.exports = UserController
```

### 5. Routes

```javascript
// user.routes.js
const express = require('express')
const router = express.Router()

const { validateUserCreation } = require('./user.validator')
const UserController = require('./user.controller')
const UserService = require('./user.service')
const UserRepository = require('./user.repository')
const database = require('../../shared/database')

// Dependency Injection
const userRepository = new UserRepository(database)
const userService = new UserService(userRepository)
const userController = new UserController(userService)

router.post('/',
  validateUserCreation,
  (req, res, next) => userController.create(req, res, next)
)

router.get('/:id',
  (req, res, next) => userController.getById(req, res, next)
)

module.exports = router
```

### 6. Validator (Middleware)

```javascript
// user.validator.js
const Joi = require('joi')

const userCreationSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
})

function validateUserCreation(req, res, next) {
  const { error } = userCreationSchema.validate(req.body)

  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details[0].message
    })
  }

  next()
}

module.exports = { validateUserCreation }
```

**Fluxo completo:**
```
POST /users → Routes → Validator → Controller → Service → Repository → Database
                                                                        ↓
                                                                    User created
                                                                        ↓
Response ← Controller ← Service ← Repository ←──────────────────────────┘
```

---

## Onde Colocar os Testes

### Estrutura recomendada

```
src/
├── features/
│   └── users/
│       ├── user.entity.js
│       ├── user.repository.js
│       ├── user.service.js
│       ├── user.controller.js
│       └── __tests__/
│           ├── user.entity.test.js       # Testes unitários
│           ├── user.service.test.js      # Testes unitários
│           └── user.integration.test.js  # Testes de integração
└── __tests__/
    └── e2e/
        └── users.e2e.test.js             # Testes E2E
```

### Tipos de testes por camada

**Testes Unitários (Entity, Service):**
```javascript
// user.service.test.js
describe('UserService', () => {
  let userService
  let mockRepository

  beforeEach(() => {
    // Mock do repository
    mockRepository = {
      findByEmail: jest.fn(),
      create: jest.fn()
    }

    userService = new UserService(mockRepository)
  })

  it('should create user with valid data', async () => {
    mockRepository.findByEmail.mockResolvedValue(null)
    mockRepository.create.mockResolvedValue({
      id: 1,
      name: 'John',
      email: 'john@test.com'
    })

    const result = await userService.createUser({
      name: 'John',
      email: 'john@test.com',
      password: '12345678'
    })

    expect(result).toHaveProperty('id')
    expect(mockRepository.create).toHaveBeenCalled()
  })

  it('should throw error if email already exists', async () => {
    mockRepository.findByEmail.mockResolvedValue({ id: 1 })

    await expect(userService.createUser({
      name: 'John',
      email: 'existing@test.com',
      password: '12345678'
    })).rejects.toThrow('Email already in use')
  })
})
```

**Testes de Integração (Controller + Service + Repository):**
```javascript
// user.integration.test.js
describe('POST /users', () => {
  beforeEach(async () => {
    await database.migrate.latest()
  })

  afterEach(async () => {
    await database.migrate.rollback()
  })

  it('should create user and return 201', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'john@test.com',
        password: 'password123'
      })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.email).toBe('john@test.com')
  })
})
```

---

## Nomenclatura e Convenções

### Arquivos e Pastas

```
✅ Bom:
user.controller.js
user.service.js
product.repository.js
auth.middleware.js

❌ Ruim:
UserController.js    (PascalCase em nome de arquivo)
userCtrl.js          (abreviação)
user_service.js      (snake_case em JS)
```

### Classes

```javascript
// ✅ PascalCase para classes
class UserService {}
class ProductRepository {}

// ❌ Não use
class userService {}
class product_repository {}
```

### Funções e variáveis

```javascript
// ✅ camelCase
function createUser() {}
const userEmail = 'test@example.com'

// ❌ Não use
function CreateUser() {}
const user_email = 'test@example.com'
```

### Constantes

```javascript
// ✅ UPPER_SNAKE_CASE para constantes globais
const MAX_LOGIN_ATTEMPTS = 5
const API_BASE_URL = 'https://api.example.com'

// ✅ camelCase para constantes locais
const defaultConfig = { timeout: 3000 }
```

### Convenção de pastas

```
features/         (não feature/, não modules/)
shared/           (não common/, não utils/)
__tests__/        (não tests/, não spec/)
middleware/       (não middlewares/)
config/           (não configs/)
```

---

## Tratamento de Erros na Arquitetura

### Hierarquia de erros customizados

```javascript
// shared/errors/AppError.js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true // Erro esperado

    Error.captureStackTrace(this, this.constructor)
  }
}

// shared/errors/ValidationError.js
class ValidationError extends AppError {
  constructor(message) {
    super(message, 400)
    this.name = 'ValidationError'
  }
}

// shared/errors/NotFoundError.js
class NotFoundError extends AppError {
  constructor(message) {
    super(message, 404)
    this.name = 'NotFoundError'
  }
}

// shared/errors/ConflictError.js
class ConflictError extends AppError {
  constructor(message) {
    super(message, 409)
    this.name = 'ConflictError'
  }
}

module.exports = {
  AppError,
  ValidationError,
  NotFoundError,
  ConflictError
}
```

### Middleware global de erros

```javascript
// shared/middleware/errorHandler.js
const { AppError } = require('../errors')

function errorHandler(err, req, res, next) {
  // Erro operacional (esperado)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    })
  }

  // Erro de programação (não esperado)
  console.error('ERROR:', err)

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  })
}

module.exports = errorHandler
```

### Uso nas camadas

```javascript
// Service lança erros de domínio
class UserService {
  async getUserById(id) {
    const user = await this.repository.findById(id)

    if (!user) {
      throw new NotFoundError('User not found')
    }

    return user
  }
}

// Controller captura e passa para middleware
class UserController {
  async getById(req, res, next) {
    try {
      const user = await this.service.getUserById(req.params.id)
      return res.json(user)
    } catch (error) {
      next(error) // Middleware de erro trata
    }
  }
}

// App.js registra middleware de erro por último
app.use('/users', userRoutes)
app.use(errorHandler) // Sempre por último
```

### Try-catch global para async

```javascript
// shared/utils/catchAsync.js
function catchAsync(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

// Uso no controller (evita try-catch manual)
class UserController {
  getById = catchAsync(async (req, res) => {
    const user = await this.service.getUserById(req.params.id)
    return res.json(user)
  })
}
```

---

## Conclusão

Uma boa arquitetura e organização de pastas não é sobre seguir regras cegas, mas sobre aplicar princípios para criar um sistema mais organizado, coeso e com baixo acoplamento.

- **Para projetos pequenos:** Comece com uma estrutura simples (por tipo de arquivo).
- **Para projetos maiores:** Adote uma estrutura por funcionalidade e separe as responsabilidades em camadas (Controllers, Services, Repositories).

A consistência é a chave. Uma vez que um padrão é escolhido, ele deve ser seguido por todo o time de desenvolvimento.
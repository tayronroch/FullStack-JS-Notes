# Fundamentos de Infraestrutura e Qualidade de Código

Este guia cobre os pilares fundamentais para estruturar um projeto profissional. São decisões que tomamos no início do projeto e que impactam toda a equipe.

---

## 1. Proposta de Arquitetura e Pastas

### O que é?
É o planejamento da estrutura do projeto: como organizamos os arquivos, pastas e camadas da aplicação.

### Por que é importante?
- Facilita a navegação no código
- Define responsabilidades claras de cada módulo
- Permite que novos desenvolvedores entendam o projeto rapidamente
- Reduz conflitos de merge no Git

### Principais abordagens:

**Monolito Modular:**
```
src/
├── features/
│   ├── users/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.repository.ts
│   │   └── users.routes.ts
│   └── products/
│       ├── products.controller.ts
│       ├── products.service.ts
│       └── products.repository.ts
├── shared/
│   ├── middleware/
│   ├── utils/
│   └── config/
└── infra/
    ├── database/
    └── http/
```

**Clean Architecture (Camadas):**
```
src/
├── domain/          # Regras de negócio puras
├── application/     # Casos de uso
├── infrastructure/  # Banco, HTTP, etc
└── presentation/    # Controllers, views
```

### Dicas práticas:
- **Para projetos pequenos:** estrutura por tipo (controllers, services, models)
- **Para projetos médios/grandes:** estrutura por feature
- **O mais importante:** consistência! Defina e siga o padrão

---

## 2. Tipo da Licença

### O que é?
A licença define como outras pessoas podem usar, modificar e distribuir seu código.

### Principais licenças:

| Licença | Tipo | Permite uso comercial | Requer código aberto |
|---------|------|----------------------|----------------------|
| **MIT** | Permissiva | ✅ Sim | ❌ Não |
| **Apache 2.0** | Permissiva | ✅ Sim | ❌ Não |
| **GPL v3** | Copyleft | ✅ Sim | ✅ Sim |
| **BSD** | Permissiva | ✅ Sim | ❌ Não |

### Quando usar cada uma:

**MIT** - A mais comum e simples:
- Use quando quiser máxima liberdade para quem usa seu código
- Empresas preferem porque podem fechar o código depois

**Apache 2.0** - Proteção contra patentes:
- Similar à MIT, mas com proteções explícitas de patentes
- Boa para projetos corporativos

**GPL v3** - Código deve permanecer aberto:
- Garante que modificações do seu código também sejam abertas
- Use quando quiser proteger a filosofia open source

### Dica prática:
Para projetos pessoais e de aprendizado, use **MIT**. É simples e compatível com quase tudo.

---

## 3. Banco de Dados (Local)

### O que é?
O ambiente de desenvolvimento que cada desenvolvedor roda na própria máquina.

### Opções:

**1. Docker Compose (Recomendado):**
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: myapp_dev
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

**Vantagens:**
- Todos os devs têm o mesmo ambiente
- Não "suja" a máquina local
- Fácil de resetar: `docker-compose down -v`

**2. Instalação Local:**
- PostgreSQL, MySQL, MongoDB instalados diretamente
- **Contras:** versões diferentes entre devs, difícil de limpar

### Boas práticas:
- Use Docker sempre que possível
- Mantenha arquivo `.env.example` com variáveis necessárias
- Documente no README como subir o banco local
- Use um script de seed para popular dados de teste

---

## 4. Banco de Dados (Homologação e Produção)

### O que é?
Os ambientes de testes (staging/homologação) e produção (onde os usuários reais estão).

### Diferenças entre ambientes:

| Aspecto | Local | Homologação | Produção |
|---------|-------|-------------|----------|
| **Dados** | Fake/seed | Simulados | Reais |
| **Performance** | Não importa | Similar à prod | Crítica |
| **Backup** | Não necessário | Desejável | Obrigatório |
| **Monitoramento** | Logs simples | Logs + métricas | Full observability |

### Serviços recomendados:

**Para começar (grátis):**
- **Supabase** - PostgreSQL gerenciado
- **MongoDB Atlas** - MongoDB gerenciado
- **PlanetScale** - MySQL serverless
- **Railway** - Suporta vários bancos

**Para produção séria:**
- **AWS RDS** - Vários bancos, altamente configurável
- **Google Cloud SQL** - Boa integração com GCP
- **Azure Database** - Integração com Microsoft

### Boas práticas:
- **NUNCA** use as mesmas credenciais em ambientes diferentes
- Configure backups automáticos em produção
- Use conexões SSL/TLS
- Limite acesso por IP quando possível
- Monitore métricas (CPU, memória, conexões)

---

## 5. Migrations

### O que são?
Scripts versionados que modificam a estrutura do banco de dados (criar tabelas, adicionar colunas, etc.).

### Por que usar?

**Sem migrations:**
```sql
-- Desenvolvedor A cria tabela localmente
-- Como o desenvolvedor B vai saber?
-- Como aplicamos isso em produção?
-- Como desfazemos se der errado?
```

**Com migrations:**
```javascript
// 20240101_create_users_table.js
exports.up = (knex) => {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary()
    table.string('email').notNullable().unique()
    table.string('name').notNullable()
    table.timestamps(true, true)
  })
}

exports.down = (knex) => {
  return knex.schema.dropTable('users')
}
```

### Ferramentas populares:

**Node.js:**
- **Knex.js** - Funciona com qualquer banco SQL
- **TypeORM** - Integrado com TypeScript
- **Prisma Migrate** - Moderno e declarativo
- **Sequelize** - ORM tradicional

**Outras linguagens:**
- **Alembic** (Python)
- **Flyway** (Java)
- **Entity Framework Migrations** (.NET)

### Boas práticas:
1. **Nunca altere uma migration já aplicada em produção**
   - Crie uma nova migration para corrigir
2. **Sempre teste o `up` E o `down`**
   - O rollback precisa funcionar
3. **Migrations pequenas e focadas**
   - Uma mudança por migration
4. **Nomes descritivos:**
   ```
   20240115_add_email_verification_to_users.js
   20240116_create_products_table.js
   ```
5. **Commite as migrations junto com o código**
   - Sincroniza mudanças de banco com mudanças de código

### Workflow típico:
```bash
# Criar nova migration
npm run migration:create add_avatar_to_users

# Aplicar migrations pendentes
npm run migration:up

# Reverter última migration (se algo der errado)
npm run migration:down

# Ver status das migrations
npm run migration:status
```

---

## 6. Linter de Código

### O que é?
Ferramenta que analisa o código e identifica problemas de estilo, bugs potenciais e más práticas.

### ESLint (JavaScript/TypeScript)

**Instalação:**
```bash
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

**Configuração básica (.eslintrc.json):**
```json
{
  "parser": "@typescript-eslint/parser",
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error"
  }
}
```

### O que o linter verifica:

**Erros de lógica:**
```javascript
// ❌ Variável nunca usada
const user = await getUser()

// ❌ Comparação sempre falsa
if (x === true && x === false)

// ❌ Código após return
return result
console.log('nunca executa')
```

**Estilo inconsistente:**
```javascript
// ❌ Mistura de aspas
const name = "John"
const age = '30'

// ✅ Consistente
const name = 'John'
const age = '30'
```

### Boas práticas:
1. **Configure no início do projeto**
2. **Rode no pre-commit** (via Husky)
3. **Integre com o editor** (VSCode extension)
4. **Use configurações populares:**
   - Airbnb Style Guide
   - Standard JS
   - Google JavaScript Style Guide

**Scripts no package.json:**
```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.js",
    "lint:fix": "eslint . --ext .ts,.js --fix"
  }
}
```

---

## 7. Linter de Commits

### O que é?
Ferramenta que valida mensagens de commit seguindo um padrão.

### Conventional Commits

**Formato:**
```
<tipo>(<escopo>): <descrição>

[corpo opcional]

[rodapé opcional]
```

**Tipos comuns:**
```
feat:     Nova funcionalidade
fix:      Correção de bug
docs:     Mudanças na documentação
style:    Formatação (não afeta o código)
refactor: Refatoração (nem feat nem fix)
test:     Adiciona ou corrige testes
chore:    Manutenção (configs, deps)
perf:     Melhoria de performance
ci:       Mudanças no CI/CD
```

**Exemplos:**
```bash
# ✅ Bom
feat(auth): add JWT token refresh mechanism
fix(api): resolve race condition in user creation
docs: update installation guide for Docker

# ❌ Ruim
fix bug
updated stuff
asdfasdf
```

### Configuração (Commitlint)

**1. Instalar:**
```bash
npm install -D @commitlint/cli @commitlint/config-conventional
```

**2. Criar commitlint.config.js:**
```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat', 'fix', 'docs', 'style', 'refactor',
      'test', 'chore', 'perf', 'ci'
    ]],
    'subject-case': [2, 'never', ['upper-case']]
  }
}
```

**3. Integrar com Husky:**
```bash
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

### Por que usar?
- **Changelog automático** - Ferramentas geram changelog a partir dos commits
- **Versionamento semântico** - `feat` = minor, `fix` = patch
- **Histórico limpo** - Fácil entender o que mudou
- **Code review melhor** - Commits organizados facilitam revisão

---

## 8. Continuous Integration (CI)

### O que é?
Processo automatizado que roda a cada push/PR para validar o código.

### O que o CI deve fazer:

**1. Build**
```yaml
- Compilar o código TypeScript
- Verificar se não há erros de sintaxe
```

**2. Testes**
```yaml
- Rodar testes unitários
- Rodar testes de integração
- Gerar relatório de cobertura
```

**3. Linting**
```yaml
- ESLint
- Prettier
- Commitlint
```

**4. Análise de segurança**
```yaml
- Verificar vulnerabilidades nas dependências
- Análise estática de código
```

### GitHub Actions (exemplo)

**.github/workflows/ci.yml:**
```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

### Outras plataformas:
- **GitLab CI** - Integrado ao GitLab
- **CircleCI** - Rápido e configurável
- **Travis CI** - Histórico, mas ainda usado
- **Jenkins** - Self-hosted, muito configurável

### Boas práticas:
1. **CI rápido** - Devs não devem esperar 30min
2. **Feedback claro** - Erros fáceis de entender
3. **Cache de dependências** - Usa cache do npm/yarn
4. **Matriz de testes** - Testa em várias versões do Node
5. **Branch protection** - Só merge se CI passou

---

## 9. Testes Automatizados

### Por que testar?

**Sem testes:**
```
Desenvolvedor muda código → Deploy → Usuário encontra bug → Fix emergencial → Repeat
```

**Com testes:**
```
Desenvolvedor muda código → Testes falham → Fix antes de deploy → Deploy seguro
```

### Pirâmide de Testes

```
        /\
       /  \        E2E (poucos, lentos, caros)
      /____\
     /      \      Integration (médio)
    /________\
   /          \    Unit (muitos, rápidos, baratos)
  /__________\
```

### 1. Testes Unitários

**O que testa:** Funções isoladas, sem dependências externas.

**Exemplo (Jest):**
```javascript
// utils/calculateDiscount.ts
export function calculateDiscount(price: number, percentage: number): number {
  if (price < 0 || percentage < 0 || percentage > 100) {
    throw new Error('Invalid parameters')
  }
  return price * (1 - percentage / 100)
}

// utils/calculateDiscount.test.ts
import { calculateDiscount } from './calculateDiscount'

describe('calculateDiscount', () => {
  it('should calculate 10% discount correctly', () => {
    expect(calculateDiscount(100, 10)).toBe(90)
  })

  it('should throw error for negative price', () => {
    expect(() => calculateDiscount(-10, 10)).toThrow('Invalid parameters')
  })

  it('should throw error for percentage > 100', () => {
    expect(() => calculateDiscount(100, 150)).toThrow('Invalid parameters')
  })
})
```

### 2. Testes de Integração

**O que testa:** Interação entre camadas (API + Service + Database).

**Exemplo (Supertest):**
```javascript
// users.integration.test.ts
import request from 'supertest'
import { app } from '../app'
import { db } from '../database'

describe('POST /users', () => {
  beforeEach(async () => {
    await db.migrate.latest()
  })

  afterEach(async () => {
    await db.migrate.rollback()
  })

  it('should create a new user', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'john@example.com'
      })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.email).toBe('john@example.com')
  })

  it('should not create user with duplicate email', async () => {
    await request(app).post('/users').send({
      name: 'John',
      email: 'john@example.com'
    })

    const response = await request(app).post('/users').send({
      name: 'Jane',
      email: 'john@example.com'
    })

    expect(response.status).toBe(409)
  })
})
```

### 3. Testes E2E (End-to-End)

**O que testa:** Fluxo completo da aplicação, simulando usuário real.

**Ferramentas:**
- **Playwright** - Moderno, rápido
- **Cypress** - Popular, boa DX
- **Puppeteer** - Controle do Chrome

**Exemplo (Playwright):**
```javascript
import { test, expect } from '@playwright/test'

test('user can login and see dashboard', async ({ page }) => {
  // Navegar para login
  await page.goto('http://localhost:3000/login')

  // Preencher formulário
  await page.fill('input[name="email"]', 'user@test.com')
  await page.fill('input[name="password"]', 'password123')

  // Clicar em login
  await page.click('button[type="submit"]')

  // Verificar redirecionamento
  await expect(page).toHaveURL('http://localhost:3000/dashboard')

  // Verificar conteúdo
  await expect(page.locator('h1')).toHaveText('Dashboard')
})
```

### Configuração do Jest

**jest.config.js:**
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.test.ts',
    '!src/types/**'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
}
```

### Boas práticas:
1. **AAA Pattern:**
   ```javascript
   // Arrange (preparar)
   const user = { name: 'John', age: 25 }

   // Act (executar)
   const result = validateUser(user)

   // Assert (verificar)
   expect(result).toBe(true)
   ```

2. **Teste o comportamento, não a implementação**
   ```javascript
   // ❌ Ruim - testa implementação
   expect(userService.database.query).toHaveBeenCalled()

   // ✅ Bom - testa comportamento
   expect(result).toEqual({ id: 1, name: 'John' })
   ```

3. **Nomes descritivos:**
   ```javascript
   // ❌ Ruim
   it('test 1', () => {})

   // ✅ Bom
   it('should return 404 when user does not exist', () => {})
   ```

4. **Isolar testes:**
   - Use `beforeEach` para limpar estado
   - Não dependa da ordem de execução
   - Mock dependências externas

5. **Cobertura não é tudo:**
   - 100% de cobertura ≠ código sem bugs
   - Foque em testar caminhos críticos
   - Teste casos extremos (edge cases)

---

## 10. Variáveis de Ambiente e Gestão de Secrets

### O que são?

Variáveis de ambiente armazenam configurações sensíveis e específicas de cada ambiente (local, staging, produção).

### Por que usar?

```javascript
// ❌ Nunca faça isso (credenciais no código)
const db = new Database({
  host: 'prod-db.example.com',
  password: 'super-secret-123'
})

// ✅ Use variáveis de ambiente
const db = new Database({
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD
})
```

### Estrutura de arquivos

```
projeto/
├── .env                 # Local (nunca commitar!)
├── .env.example         # Template (commitar)
├── .env.development     # Desenvolvimento
├── .env.staging         # Homologação
├── .env.production      # Produção (apenas no servidor)
└── .gitignore           # Ignora .env*
```

### Exemplo de .env

```bash
# .env
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp_dev
DB_USER=postgres
DB_PASSWORD=postgres

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Email
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-username
SMTP_PASS=your-password

# AWS
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=us-east-1

# External APIs
STRIPE_SECRET_KEY=sk_test_51...
SENTRY_DSN=https://...
```

### Exemplo de .env.example (template)

```bash
# .env.example
NODE_ENV=development
PORT=3000

# Database
DB_HOST=
DB_PORT=5432
DB_NAME=
DB_USER=
DB_PASSWORD=

# JWT
JWT_SECRET=
JWT_EXPIRES_IN=7d

# Email
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

### Carregando variáveis (dotenv)

```javascript
// config/env.js
require('dotenv').config()

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,

  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN
  },

  // Validação: garantir que existam
  validate() {
    const required = ['DB_HOST', 'DB_PASSWORD', 'JWT_SECRET']

    for (const key of required) {
      if (!process.env[key]) {
        throw new Error(`Missing required env variable: ${key}`)
      }
    }
  }
}
```

### Gestão de Secrets em Produção

**Nunca use .env em produção!** Use serviços especializados:

**1. Variáveis de ambiente do servidor:**
```bash
# Heroku
heroku config:set DB_PASSWORD=secret-value

# Vercel
vercel env add DB_PASSWORD

# Docker
docker run -e DB_PASSWORD=secret-value myapp
```

**2. Serviços de secrets:**
- **AWS Secrets Manager** - Gerenciamento de secrets com rotação automática
- **HashiCorp Vault** - Secrets centralizados e criptografados
- **Google Secret Manager** - Integrado com GCP
- **Azure Key Vault** - Integrado com Azure

**Exemplo com AWS Secrets Manager:**
```javascript
const AWS = require('aws-sdk')
const client = new AWS.SecretsManager({ region: 'us-east-1' })

async function getSecret(secretName) {
  const data = await client.getSecretValue({ SecretId: secretName }).promise()
  return JSON.parse(data.SecretString)
}

// Uso
const dbCredentials = await getSecret('prod/database/credentials')
const db = new Database(dbCredentials)
```

### Boas práticas:

1. **Nunca commite .env**
   ```
   # .gitignore
   .env
   .env.local
   .env.*.local
   ```

2. **Sempre commite .env.example**
   - Serve como documentação
   - Facilita onboarding

3. **Valide variáveis no startup**
   ```javascript
   const config = require('./config/env')
   config.validate() // Falha rápido se faltando
   ```

4. **Use diferentes secrets por ambiente**
   - Desenvolvimento: valores fake
   - Staging: valores de teste
   - Produção: valores reais

5. **Rotacione secrets regularmente**
   - Senhas de banco: a cada 90 dias
   - API keys: quando um dev sair do time

---

## 11. Logging e Monitoramento

### Por que fazer logging?

```
Sem logs:
"A aplicação caiu" → Por quê? Não sabemos.

Com logs:
"A aplicação caiu" → Logs mostram: "OutOfMemory no módulo X"
```

### Níveis de Log

```javascript
logger.error('Erro crítico')    // Algo quebrou
logger.warn('Atenção')           // Potencial problema
logger.info('Informação')        // Eventos normais
logger.debug('Debug')            // Detalhes técnicos
```

### Winston (Node.js)

**Instalação:**
```bash
npm install winston
```

**Configuração:**
```javascript
// config/logger.js
const winston = require('winston')

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    // Console (desenvolvimento)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),

    // Arquivo (produção)
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),

    new winston.transports.File({
      filename: 'logs/combined.log'
    })
  ]
})

module.exports = logger
```

**Uso:**
```javascript
const logger = require('./config/logger')

// Informação
logger.info('User created', { userId: 123, email: 'user@example.com' })

// Erro
try {
  await processPayment(order)
} catch (error) {
  logger.error('Payment failed', {
    orderId: order.id,
    error: error.message,
    stack: error.stack
  })
  throw error
}

// Warning
if (user.loginAttempts > 3) {
  logger.warn('Multiple failed login attempts', {
    userId: user.id,
    attempts: user.loginAttempts
  })
}
```

### Logging estruturado (JSON)

```javascript
// ❌ Log não estruturado (difícil de buscar)
console.log(`User ${userId} logged in at ${new Date()}`)

// ✅ Log estruturado (fácil de buscar/filtrar)
logger.info('User login', {
  event: 'user_login',
  userId: 123,
  ip: '192.168.1.1',
  timestamp: new Date().toISOString()
})
```

### Middleware de logging HTTP

```javascript
// middleware/requestLogger.js
const logger = require('../config/logger')

function requestLogger(req, res, next) {
  const start = Date.now()

  // Log quando a resposta terminar
  res.on('finish', () => {
    const duration = Date.now() - start

    logger.info('HTTP Request', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('user-agent'),
      ip: req.ip
    })
  })

  next()
}

module.exports = requestLogger
```

### Serviços de Monitoramento

**1. Sentry (Rastreamento de Erros):**
```javascript
const Sentry = require('@sentry/node')

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
})

// Captura erros automaticamente
app.use(Sentry.Handlers.errorHandler())

// Captura erros manualmente
try {
  await riskyOperation()
} catch (error) {
  Sentry.captureException(error)
  throw error
}
```

**2. Datadog (APM - Application Performance Monitoring):**
```javascript
const tracer = require('dd-trace').init({
  service: 'my-api',
  env: process.env.NODE_ENV
})

// Rastreia automaticamente:
// - Requisições HTTP
// - Queries de banco
// - Chamadas externas
```

**3. New Relic (Performance):**
```javascript
require('newrelic')

// Coleta automaticamente:
// - Tempo de resposta
// - Throughput
// - Taxa de erro
// - Uso de CPU/memória
```

### Dashboards de métricas

**Prometheus + Grafana:**
```javascript
const promClient = require('prom-client')

// Métricas customizadas
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
})

// Middleware para coletar
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer()

  res.on('finish', () => {
    end({
      method: req.method,
      route: req.route?.path || req.url,
      status_code: res.statusCode
    })
  })

  next()
})

// Endpoint para Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType)
  res.end(await promClient.register.metrics())
})
```

---

## 12. Documentação de API (Swagger/OpenAPI)

### Por que documentar?

- Frontend sabe quais endpoints existem
- Evita perguntas: "Qual o formato do body?"
- Testável direto no navegador

### Swagger com Express

**Instalação:**
```bash
npm install swagger-ui-express swagger-jsdoc
```

**Configuração:**
```javascript
// config/swagger.js
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API Documentation',
      version: '1.0.0',
      description: 'REST API for My Application'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://api.example.com',
        description: 'Production server'
      }
    ]
  },
  apis: ['./src/**/*.js'] // Arquivos com comentários JSDoc
}

const specs = swaggerJsdoc(options)

module.exports = { swaggerUi, specs }
```

**Uso no app.js:**
```javascript
const { swaggerUi, specs } = require('./config/swagger')

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

// Acesse: http://localhost:3000/api-docs
```

### Documentando rotas com JSDoc

```javascript
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   example: john@example.com
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 */
router.post('/users', userController.create)
```

### Schemas reutilizáveis

```javascript
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - email
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     Error:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: error
 *         message:
 *           type: string
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
```

---

## 13. Docker Além do Desenvolvimento

### Dockerfile para Produção

```dockerfile
# Dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package.json e instalar dependências
COPY package*.json ./
RUN npm ci --only=production

# Copiar código fonte
COPY . .

# Stage 2: Produção (imagem final menor)
FROM node:18-alpine

WORKDIR /app

# Criar usuário não-root (segurança)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copiar apenas o necessário do build
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs . .

# Usar usuário não-root
USER nodejs

EXPOSE 3000

CMD ["node", "src/index.js"]
```

### Multi-stage build (otimizado)

```dockerfile
# Dockerfile com TypeScript
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build TypeScript → JavaScript
RUN npm run build

# Stage final (apenas JS compilado)
FROM node:18-alpine

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

USER nodejs

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

### .dockerignore

```
# .dockerignore
node_modules
npm-debug.log
.env
.env.local
.git
.gitignore
README.md
.vscode
coverage
.nyc_output
dist
build
```

### Docker Compose para Produção

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  app:
    image: myapp:latest
    restart: unless-stopped
    environment:
      NODE_ENV: production
    env_file:
      - .env.production
    ports:
      - "3000:3000"
    depends_on:
      - postgres
      - redis
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  postgres:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis-data:/data
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - app
    networks:
      - app-network

volumes:
  postgres-data:
  redis-data:

networks:
  app-network:
    driver: bridge
```

---

## 14. Segurança (OWASP Top 10)

### 1. Injection (SQL, NoSQL, Command)

```javascript
// ❌ SQL Injection vulnerável
const email = req.body.email
const query = `SELECT * FROM users WHERE email = '${email}'`
db.query(query) // email = "'; DROP TABLE users; --"

// ✅ Use prepared statements
const email = req.body.email
db.query('SELECT * FROM users WHERE email = $1', [email])
```

### 2. Autenticação Quebrada

```javascript
// ❌ Senha em plain text
user.password = req.body.password

// ✅ Hash com bcrypt
const bcrypt = require('bcrypt')
user.password = await bcrypt.hash(req.body.password, 10)

// ✅ Verificar senha
const isValid = await bcrypt.compare(inputPassword, user.password)
```

### 3. Exposição de Dados Sensíveis

```javascript
// ❌ Retorna senha no JSON
res.json(user) // { id: 1, email: '...', password: 'hash...' }

// ✅ Remove dados sensíveis
res.json({
  id: user.id,
  email: user.email
})

// ✅ Ou use toJSON()
class User {
  toJSON() {
    const { password, ...safe } = this
    return safe
  }
}
```

### 4. XSS (Cross-Site Scripting)

```javascript
// ❌ Renderiza input do usuário sem sanitizar
app.get('/search', (req, res) => {
  res.send(`Resultados para: ${req.query.q}`)
  // q = <script>alert('XSS')</script>
})

// ✅ Escape HTML
const escapeHtml = require('escape-html')
res.send(`Resultados para: ${escapeHtml(req.query.q)}`)

// ✅ Ou use template engine que escapa automaticamente (EJS, Pug)
```

### 5. Controle de Acesso Quebrado

```javascript
// ❌ Não valida se usuário pode acessar recurso
app.delete('/users/:id', async (req, res) => {
  await User.delete(req.params.id) // Qualquer um pode deletar qualquer usuário
})

// ✅ Valida autorização
app.delete('/users/:id', authenticate, async (req, res) => {
  if (req.user.id !== req.params.id && !req.user.isAdmin) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  await User.delete(req.params.id)
  res.status(204).send()
})
```

### 6. Configuração Incorreta de Segurança

```javascript
// ✅ Use helmet para headers de segurança
const helmet = require('helmet')
app.use(helmet())

// Headers aplicados:
// - X-Content-Type-Options: nosniff
// - X-Frame-Options: SAMEORIGIN
// - Strict-Transport-Security (HSTS)
// - etc.
```

### 7. CSRF (Cross-Site Request Forgery)

```javascript
// ✅ Proteção CSRF
const csrf = require('csurf')
const csrfProtection = csrf({ cookie: true })

app.get('/form', csrfProtection, (req, res) => {
  res.render('form', { csrfToken: req.csrfToken() })
})

app.post('/form', csrfProtection, (req, res) => {
  // Token validado automaticamente
  res.send('Data processed')
})
```

### 8. Limitação de Taxa (Rate Limiting)

```javascript
const rateLimit = require('express-rate-limit')

// Limita requisições por IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por janela
  message: 'Too many requests, please try again later'
})

app.use('/api/', limiter)

// Rate limit específico para login (previne brute force)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 tentativas
  message: 'Too many login attempts'
})

app.post('/login', loginLimiter, authController.login)
```

### 9. Validação de Input

```javascript
const Joi = require('joi')

const userSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(18).max(120)
})

function validateUser(req, res, next) {
  const { error } = userSchema.validate(req.body)

  if (error) {
    return res.status(400).json({ error: error.details[0].message })
  }

  next()
}
```

### 10. Sanitização de Dados

```javascript
// ✅ Remove caracteres perigosos
const sanitize = require('mongo-sanitize')

app.post('/users', (req, res) => {
  const clean = sanitize(req.body)

  // Previne: { email: { $gt: "" } } (NoSQL injection)
  User.findOne({ email: clean.email })
})
```

---

## 15. Cache e Performance

### Por que usar cache?

```
Sem cache:
Request → Banco de dados → Resposta (150ms)

Com cache:
Request → Redis (cache) → Resposta (5ms)
```

### Redis para Cache

**Instalação:**
```bash
npm install redis
```

**Configuração:**
```javascript
// config/redis.js
const redis = require('redis')

const client = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD
})

client.on('error', (err) => console.error('Redis error:', err))
client.on('connect', () => console.log('Redis connected'))

module.exports = client
```

### Middleware de cache

```javascript
// middleware/cache.js
const redis = require('../config/redis')

function cache(duration = 300) { // 5 minutos padrão
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`

    try {
      const cached = await redis.get(key)

      if (cached) {
        return res.json(JSON.parse(cached))
      }

      // Sobrescreve res.json para cachear
      const originalJson = res.json.bind(res)

      res.json = (data) => {
        redis.setex(key, duration, JSON.stringify(data))
        return originalJson(data)
      }

      next()
    } catch (error) {
      console.error('Cache error:', error)
      next() // Continua sem cache se der erro
    }
  }
}

module.exports = cache
```

**Uso:**
```javascript
// Rota com cache de 5 minutos
app.get('/products', cache(300), productController.list)

// Rota sem cache
app.get('/products/:id', productController.show)
```

### Invalidação de cache

```javascript
// Quando produto é atualizado, invalida cache
app.put('/products/:id', async (req, res) => {
  await Product.update(req.params.id, req.body)

  // Invalida cache da listagem
  await redis.del('cache:/products')

  res.json({ message: 'Updated' })
})
```

### Cache de sessões

```javascript
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const redis = require('./config/redis')

app.use(session({
  store: new RedisStore({ client: redis }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 // 24 horas
  }
}))
```

### Estratégias de cache

**1. Cache-Aside (Lazy Loading):**
```javascript
async function getUser(id) {
  // 1. Tenta buscar no cache
  const cached = await redis.get(`user:${id}`)
  if (cached) return JSON.parse(cached)

  // 2. Se não tem, busca no banco
  const user = await User.findById(id)

  // 3. Salva no cache para próxima vez
  await redis.setex(`user:${id}`, 3600, JSON.stringify(user))

  return user
}
```

**2. Write-Through (escreve nos dois):**
```javascript
async function updateUser(id, data) {
  // 1. Atualiza banco
  const user = await User.update(id, data)

  // 2. Atualiza cache
  await redis.setex(`user:${id}`, 3600, JSON.stringify(user))

  return user
}
```

---

## 16. Deploy e Continuous Deployment (CD)

### O que é CD?

```
CI → Testa e valida o código
CD → Deploy automático quando CI passar
```

### GitHub Actions para CD

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

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

      - name: Run tests
        run: npm test

      - name: Build Docker image
        run: docker build -t myapp:${{ github.sha }} .

      - name: Push to Docker Hub
        env:
          DOCKER_USERNAME: ${{ secrets.DOCKER_USERNAME }}
          DOCKER_PASSWORD: ${{ secrets.DOCKER_PASSWORD }}
        run: |
          echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin
          docker tag myapp:${{ github.sha }} myapp:latest
          docker push myapp:latest

      - name: Deploy to server via SSH
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /app
            docker pull myapp:latest
            docker-compose down
            docker-compose up -d
```

### Deploy para plataformas

**1. Heroku:**
```bash
# Instalar Heroku CLI
heroku login

# Criar app
heroku create myapp

# Push para deploy
git push heroku main

# Configurar variáveis
heroku config:set DB_PASSWORD=secret
```

**2. Vercel (para Next.js/Frontend):**
```bash
npm install -g vercel

# Deploy
vercel --prod
```

**3. Railway:**
```bash
# Conectar ao GitHub repo
# Deploy automático a cada push
```

### Health checks

```javascript
// routes/health.js
app.get('/health', async (req, res) => {
  try {
    // Verifica conexão com banco
    await database.query('SELECT 1')

    // Verifica Redis
    await redis.ping()

    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    })
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    })
  }
})
```

---

## 17. Observabilidade (Métricas, Traces, Logs)

### Os 3 Pilares

```
Logs      → O que aconteceu?
Métricas  → Como está performando?
Traces    → Onde está o gargalo?
```

### Métricas Importantes

**Métricas de aplicação:**
```javascript
const promClient = require('prom-client')

// 1. Taxa de requisições
const requestCounter = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status']
})

// 2. Duração de requisições
const requestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration',
  labelNames: ['method', 'route']
})

// 3. Requisições ativas
const activeRequests = new promClient.Gauge({
  name: 'http_requests_active',
  help: 'Number of active requests'
})

// Middleware
app.use((req, res, next) => {
  activeRequests.inc()
  const end = requestDuration.startTimer()

  res.on('finish', () => {
    activeRequests.dec()
    end({ method: req.method, route: req.route?.path || 'unknown' })
    requestCounter.inc({
      method: req.method,
      route: req.route?.path || 'unknown',
      status: res.statusCode
    })
  })

  next()
})
```

**Métricas de negócio:**
```javascript
// Registros de usuários
const signupCounter = new promClient.Counter({
  name: 'user_signups_total',
  help: 'Total user signups'
})

app.post('/signup', async (req, res) => {
  const user = await createUser(req.body)

  signupCounter.inc() // Incrementa métrica

  res.json(user)
})

// Valor de pedidos
const orderValue = new promClient.Histogram({
  name: 'order_value_dollars',
  help: 'Order value distribution',
  buckets: [10, 50, 100, 500, 1000]
})

app.post('/orders', async (req, res) => {
  const order = await createOrder(req.body)

  orderValue.observe(order.total)

  res.json(order)
})
```

### Distributed Tracing

**OpenTelemetry:**
```javascript
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node')
const { registerInstrumentations } = require('@opentelemetry/instrumentation')
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http')
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express')

const provider = new NodeTracerProvider()
provider.register()

registerInstrumentations({
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation()
  ]
})

// Rastreia automaticamente:
// Request → Controller → Service → Database
// Mostra quanto tempo cada camada levou
```

### Dashboard de observabilidade

**Grafana + Prometheus + Loki:**

```yaml
# docker-compose.monitoring.yml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin

  loki:
    image: grafana/loki
    ports:
      - "3100:3100"
```

**Alertas:**
```yaml
# prometheus-alerts.yml
groups:
  - name: app_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        annotations:
          summary: "High error rate detected"

      - alert: SlowRequests
        expr: http_request_duration_seconds{quantile="0.99"} > 1
        for: 10m
        annotations:
          summary: "99th percentile latency > 1s"
```

---

## Checklist: Iniciando um Projeto Profissional

```
[x] Estrutura de pastas definida (feature-based ou layered)
[x] Licença escolhida e arquivo LICENSE criado
[x] Banco local configurado (Docker Compose)
[x] Variáveis de ambiente documentadas (.env.example)
[x] Sistema de migrations configurado
[x] ESLint configurado
[x] Prettier configurado
[x] Commitlint + Husky instalados
[x] Testes unitários configurados (Jest)
[x] GitHub Actions (CI) configurado
[x] README com instruções de setup
[x] .gitignore configurado
```

## Recursos Adicionais

- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Jest Documentation](https://jestjs.io/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Choose a License](https://choosealicense.com/)

---

**Lembre-se:** Essas práticas não são burocráticas, elas economizam tempo e evitam bugs. Invista tempo no setup inicial para colher benefícios durante todo o projeto.

# Variáveis de Ambiente

## O que são Variáveis de Ambiente?

Variáveis de ambiente são valores dinâmicos que afetam o comportamento de processos em execução. São usadas para armazenar **configurações sensíveis** fora do código.

## Por que usar?

 **Segurança**: Credenciais fora do código
 **Flexibilidade**: Mesma aplicação, diferentes configurações
 **Separação de ambientes**: Dev, Staging, Production
 **Sem commits de secrets**: Não vão para o Git

## Uso Básico

### Acessar Variáveis

```javascript
// Node.js nativo
const port = process.env.PORT || 3000;
const dbUrl = process.env.DATABASE_URL;
const apiKey = process.env.API_KEY;

console.log(process.env.NODE_ENV); // development, production
```

### Definir Variáveis (Terminal)

```bash
# Linux/Mac
export PORT=3000
export DATABASE_URL="postgresql://localhost/mydb"

# Windows (CMD)
set PORT=3000

# Windows (PowerShell)
$env:PORT=3000

# Inline (uma vez)
PORT=3000 node server.js
```

## Arquivo .env

### Instalação do dotenv

```bash
npm install dotenv
```

### Criar arquivo .env

```env
# .env

# Application
NODE_ENV=development
PORT=3000
APP_NAME=MyApp

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mydb
DB_USER=user
DB_PASSWORD=password

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=super_secret_key_here
JWT_EXPIRES_IN=24h

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu@email.com
SMTP_PASSWORD=sua_senha

# APIs Externas
API_KEY=abc123xyz
STRIPE_SECRET_KEY=sk_test_...
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

# URLs
CLIENT_URL=http://localhost:3001
API_URL=http://localhost:3000/api
```

### Carregar no Código

```javascript
// No início do arquivo principal (server.js, app.js)
import dotenv from 'dotenv';

// Carregar variáveis
dotenv.config();

// Agora pode usar
const port = process.env.PORT;
const dbUrl = process.env.DATABASE_URL;
```

### Especificar caminho customizado

```javascript
dotenv.config({ path: '.env.production' });
```

## Múltiplos Ambientes

### Estrutura de arquivos

```
.env                 # Valores padrão (commitado)
.env.development     # Desenvolvimento (local)
.env.staging         # Homologação
.env.production      # Produção (NUNCA commitar)
.env.local           # Overrides locais (NUNCA commitar)
```

### .env (template - commitado)

```env
# .env - Template público

NODE_ENV=development
PORT=3000
DATABASE_URL=

# Comentários explicativos
JWT_SECRET=  # Gerado com: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### .env.development

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://localhost:5432/myapp_dev
JWT_SECRET=dev_secret_not_for_production
```

### .env.production

```env
NODE_ENV=production
PORT=80
DATABASE_URL=postgresql://prod-db.amazonaws.com:5432/myapp
JWT_SECRET=super_secure_production_secret_key
```

### Carregar baseado no ambiente

```javascript
import dotenv from 'dotenv';
import path from 'path';

const env = process.env.NODE_ENV || 'development';
const envFile = `.env.${env}`;

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

// Fallback para .env padrão
dotenv.config();
```

## Validação de Variáveis

### Validação Manual

```javascript
import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = [
  'NODE_ENV',
  'PORT',
  'DATABASE_URL',
  'JWT_SECRET'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

console.log(' All required environment variables are set');
```

### Com Joi

```bash
npm install joi
```

```javascript
import Joi from 'joi';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'staging')
    .default('development'),

  PORT: Joi.number()
    .default(3000),

  DATABASE_URL: Joi.string()
    .required(),

  JWT_SECRET: Joi.string()
    .min(32)
    .required(),

  JWT_EXPIRES_IN: Joi.string()
    .default('24h'),

  SMTP_HOST: Joi.string()
    .when('NODE_ENV', {
      is: 'production',
      then: Joi.required(),
      otherwise: Joi.optional()
    })
}).unknown();

const { error, value: env } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// Exportar configuração tipada
export const config = {
  env: env.NODE_ENV,
  port: env.PORT,
  database: {
    url: env.DATABASE_URL
  },
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN
  }
};
```

### Com envalid

```bash
npm install envalid
```

```javascript
import { cleanEnv, str, num, email, url } from 'envalid';
import dotenv from 'dotenv';

dotenv.config();

const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'production', 'staging'] }),
  PORT: num({ default: 3000 }),
  DATABASE_URL: url(),
  JWT_SECRET: str({ minLength: 32 }),
  SMTP_USER: email(),
  API_URL: url()
});

// Uso
console.log(env.PORT); // Já convertido para número
console.log(env.DATABASE_URL); // Validado como URL
```

## TypeScript

### Tipos para process.env

```typescript
// src/types/env.d.ts

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'staging';
      PORT: string;
      DATABASE_URL: string;
      JWT_SECRET: string;
      JWT_EXPIRES_IN: string;
      SMTP_HOST?: string;
      SMTP_PORT?: string;
      SMTP_USER?: string;
      SMTP_PASSWORD?: string;
    }
  }
}

export {};
```

```typescript
// Agora tem autocomplete e type checking
const port = process.env.PORT; // string
const dbUrl = process.env.DATABASE_URL; // string
```

### Config com TypeScript

```typescript
// config/config.ts

import dotenv from 'dotenv';

dotenv.config();

interface Config {
  env: string;
  port: number;
  database: {
    url: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
}

const config: Config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    url: process.env.DATABASE_URL!
  },
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  }
};

// Validação
if (!config.database.url) {
  throw new Error('DATABASE_URL is required');
}

if (!config.jwt.secret) {
  throw new Error('JWT_SECRET is required');
}

export default config;
```

```typescript
// Uso em outros arquivos
import config from './config/config';

console.log(config.port); // number
console.log(config.database.url); // string
```

## .gitignore

**IMPORTANTE**: Nunca commitar arquivos com secrets!

```gitignore
# .gitignore

# Environment variables
.env
.env.local
.env.production
.env.staging

# Manter template
!.env.example
```

## .env.example (Template)

```env
# .env.example - Template público para outros desenvolvedores

# Application
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/mydb

# JWT
JWT_SECRET=  # Generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_EXPIRES_IN=24h

# Email (optional)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=

# External APIs
API_KEY=
STRIPE_SECRET_KEY=
```

## Deploy (Variáveis em Produção)

### Heroku

```bash
# Definir variável
heroku config:set DATABASE_URL=postgresql://...

# Listar variáveis
heroku config

# Remover variável
heroku config:unset API_KEY
```

### Vercel

```bash
# CLI
vercel env add DATABASE_URL

# Dashboard: Settings → Environment Variables
```

### AWS Elastic Beanstalk

```bash
# CLI
eb setenv DATABASE_URL=postgresql://...

# Console: Configuration → Software → Environment properties
```

### Docker

```bash
# Passar ao executar
docker run -e DATABASE_URL=postgresql://... myapp

# Usar arquivo .env
docker run --env-file .env.production myapp
```

```yaml
# docker-compose.yml
services:
  app:
    environment:
      - DATABASE_URL=postgresql://...
    # ou
    env_file:
      - .env.production
```

### Kubernetes

```yaml
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  NODE_ENV: "production"
  PORT: "3000"

---
# secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  DATABASE_URL: cG9zdGdyZXNxbDovLy4uLg==  # base64 encoded
  JWT_SECRET: c3VwZXJfc2VjcmV0X2tleQ==
```

## Boas Práticas

###  Fazer

1. **Use .env para desenvolvimento**
   ```env
   DATABASE_URL=postgresql://localhost/myapp_dev
   ```

2. **Nunca commite secrets**
   ```gitignore
   .env
   .env.production
   ```

3. **Forneça .env.example**
   ```env
   # .env.example
   DATABASE_URL=
   JWT_SECRET=
   ```

4. **Valide variáveis no startup**
   ```javascript
   if (!process.env.DATABASE_URL) {
     throw new Error('DATABASE_URL is required');
   }
   ```

5. **Use valores padrão seguros**
   ```javascript
   const port = process.env.PORT || 3000;
   ```

6. **Documente variáveis necessárias**
   ```markdown
   ## Environment Variables
   - `DATABASE_URL`: PostgreSQL connection string
   - `JWT_SECRET`: Secret key for JWT (min 32 chars)
   ```

###  Evitar

1. **Não hardcode secrets**
   ```javascript
   //  NUNCA
   const apiKey = 'sk_live_abc123';

   // 
   const apiKey = process.env.API_KEY;
   ```

2. **Não commite .env**
3. **Não logue variáveis sensíveis**
   ```javascript
   // 
   console.log('JWT_SECRET:', process.env.JWT_SECRET);
   ```

4. **Não use para código/lógica**
   ```javascript
   //  Ruim
   const shouldFeatureBeEnabled = process.env.ENABLE_FEATURE === 'true';

   //  Melhor: Feature flags separados
   ```

## Gerar Secrets

```bash
# Gerar JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Gerar UUID
node -e "console.log(require('crypto').randomUUID())"

# Senha aleatória
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Exemplo Completo

```javascript
// config/index.js
import dotenv from 'dotenv';
import Joi from 'joi';

// Carregar .env baseado no ambiente
const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${env}` });
dotenv.config(); // Fallback

// Schema de validação
const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'staging').required(),
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('24h'),
  REDIS_URL: Joi.string().optional(),
  SMTP_HOST: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required()
  })
}).unknown();

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  database: {
    url: envVars.DATABASE_URL
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    expiresIn: envVars.JWT_EXPIRES_IN
  },
  redis: {
    url: envVars.REDIS_URL
  },
  email: {
    host: envVars.SMTP_HOST,
    port: envVars.SMTP_PORT,
    user: envVars.SMTP_USER,
    password: envVars.SMTP_PASSWORD
  }
};
```

```javascript
// server.js
import config from './config/index.js';

console.log(`Server running in ${config.env} mode on port ${config.port}`);
```

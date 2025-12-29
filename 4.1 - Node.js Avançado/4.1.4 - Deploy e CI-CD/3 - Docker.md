# Docker para Node.js

## O que é Docker?

Docker é uma plataforma de containerização que permite empacotar uma aplicação com todas as suas dependências em um **container** isolado e portátil.

## Por que usar Docker?

 **Consistência**: "Funciona na minha máquina" → Funciona em qualquer lugar
 **Isolamento**: Cada aplicação em seu próprio ambiente
 **Portabilidade**: Deploy fácil em qualquer servidor
 **Escalabilidade**: Fácil criar múltiplas instâncias
 **Versionamento**: Imagens versionadas

## Conceitos Básicos

### Imagem (Image)
Template read-only contendo a aplicação e dependências.

### Container
Instância em execução de uma imagem.

### Dockerfile
Arquivo com instruções para criar uma imagem.

```
Dockerfile → build → Image → run → Container
```

## Instalação

```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Verificar
docker --version
docker run hello-world
```

## Dockerfile para Node.js

### Básico

```dockerfile
# Dockerfile

# Imagem base
FROM node:18-alpine

# Diretório de trabalho
WORKDIR /app

# Copiar package*.json
COPY package*.json ./

# Instalar dependências
RUN npm ci --production

# Copiar código
COPY . .

# Expor porta
EXPOSE 3000

# Comando de inicialização
CMD ["node", "server.js"]
```

### Multi-stage Build (Otimizado)

```dockerfile
# Estágio 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Estágio 2: Production
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

# Copiar apenas o build do estágio anterior
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.js"]
```

### Com TypeScript

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json tsconfig.json ./
RUN npm ci

COPY src ./src
RUN npm run build

# Production
FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --production

COPY --from=builder /app/dist ./dist

USER node

EXPOSE 3000

CMD ["node", "dist/server.js"]
```

## Construir e Executar

```bash
# Construir imagem
docker build -t minha-app .

# Listar imagens
docker images

# Executar container
docker run -p 3000:3000 minha-app

# Executar em background
docker run -d -p 3000:3000 --name app minha-app

# Ver containers rodando
docker ps

# Ver todos os containers
docker ps -a

# Parar container
docker stop app

# Remover container
docker rm app

# Ver logs
docker logs app

# Logs em tempo real
docker logs -f app
```

## .dockerignore

```
# .dockerignore

node_modules
npm-debug.log
.env
.git
.gitignore
README.md
.vscode
.idea
dist
coverage
*.test.js
*.spec.js
```

## Docker Compose

Gerencia múltiplos containers.

### docker-compose.yml

```yaml
version: '3.8'

services:
  # Aplicação Node.js
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/myapp
    depends_on:
      - db
    volumes:
      - ./src:/app/src  # Para desenvolvimento
    command: npm run dev

  # Banco de dados PostgreSQL
  db:
    image: postgres:14-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=myapp
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  # Redis
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

### Comandos Docker Compose

```bash
# Iniciar todos os serviços
docker-compose up

# Em background
docker-compose up -d

# Rebuild das imagens
docker-compose up --build

# Parar serviços
docker-compose down

# Parar e remover volumes
docker-compose down -v

# Ver logs
docker-compose logs

# Logs de um serviço específico
docker-compose logs app

# Executar comando em um serviço
docker-compose exec app npm test

# Ver serviços rodando
docker-compose ps
```

## Variáveis de Ambiente

### .env

```env
# .env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://localhost/myapp
JWT_SECRET=my-secret
```

### docker-compose.yml

```yaml
services:
  app:
    env_file:
      - .env
    # ou
    environment:
      - NODE_ENV=production
      - PORT=3000
```

## Volumes

### Bind Mount (Desenvolvimento)

```yaml
services:
  app:
    volumes:
      - ./src:/app/src  # Sincroniza código local com container
      - /app/node_modules  # Evita sobrescrever node_modules
```

### Named Volume (Produção)

```yaml
services:
  db:
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:  # Volume persistente
```

## Networking

```yaml
services:
  app:
    networks:
      - app-network

  db:
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

## Health Checks

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node healthcheck.js || exit 1
```

```yaml
# docker-compose.yml
services:
  app:
    healthcheck:
      test: ["CMD", "node", "healthcheck.js"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 40s
```

```javascript
// healthcheck.js
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/health',
  method: 'GET'
};

const req = http.request(options, (res) => {
  process.exit(res.statusCode === 200 ? 0 : 1);
});

req.on('error', () => {
  process.exit(1);
});

req.end();
```

## Exemplo Completo

### Estrutura do Projeto

```
my-app/
├── src/
│   └── server.ts
├── dist/
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .env
├── package.json
└── tsconfig.json
```

### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json tsconfig.json ./
RUN npm ci

COPY src ./src
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

COPY package*.json ./
RUN npm ci --production

COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "dist/server.js"]
```

### docker-compose.yml (Desenvolvimento)

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@db:5432/myapp
      - REDIS_URL=redis://redis:6379
    volumes:
      - ./src:/app/src
      - /app/node_modules
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    command: npm run dev

  db:
    image: postgres:14-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=myapp
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

## Docker Hub

### Fazer Login

```bash
docker login
```

### Push de Imagem

```bash
# Tag da imagem
docker tag minha-app:latest usuario/minha-app:latest
docker tag minha-app:latest usuario/minha-app:1.0.0

# Push
docker push usuario/minha-app:latest
docker push usuario/minha-app:1.0.0
```

### Pull de Imagem

```bash
docker pull usuario/minha-app:latest
```

## Boas Práticas

###  Fazer

1. **Use imagens Alpine (menores)**
   ```dockerfile
   FROM node:18-alpine
   ```

2. **Multi-stage builds**
   ```dockerfile
   FROM node:18 AS builder
   # ...
   FROM node:18-alpine
   ```

3. **Execute como usuário não-root**
   ```dockerfile
   USER node
   ```

4. **Use .dockerignore**
   ```
   node_modules
   .git
   ```

5. **Cache de layers otimizado**
   ```dockerfile
   COPY package*.json ./  # Antes do código
   RUN npm ci
   COPY . .
   ```

6. **Defina NODE_ENV**
   ```dockerfile
   ENV NODE_ENV=production
   ```

###  Evitar

1. **Não use `latest` em produção**
   ```dockerfile
   FROM node:18-alpine  #  Específico
   FROM node:alpine     #  Genérico
   ```

2. **Não copie node_modules**
   ```dockerignore
   node_modules
   ```

3. **Não execute como root**
   ```dockerfile
   USER node  # 
   ```

## Comandos Úteis

```bash
# Remover containers parados
docker container prune

# Remover imagens não utilizadas
docker image prune

# Remover tudo não utilizado
docker system prune -a

# Ver espaço usado
docker system df

# Inspecionar container
docker inspect app

# Executar shell no container
docker exec -it app sh

# Ver processos no container
docker top app

# Copiar arquivo do container
docker cp app:/app/file.txt ./
```

## Troubleshooting

```bash
# Ver logs
docker logs app
docker logs -f app --tail 100

# Inspecionar container
docker inspect app

# Ver consumo de recursos
docker stats

# Executar shell
docker exec -it app sh

# Verificar networks
docker network ls
docker network inspect bridge
```

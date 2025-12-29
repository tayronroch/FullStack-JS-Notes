# CI/CD - Integração e Entrega Contínua

## O que é CI/CD?

### CI - Continuous Integration (Integração Contínua)

Prática de integrar código frequentemente ao repositório principal, com testes automatizados.

**Fluxo:**
```
Código → Commit → Push → Build → Testes → Merge
```

### CD - Continuous Delivery/Deployment

**Continuous Delivery (Entrega Contínua):**
Código sempre pronto para deploy, mas requer aprovação manual.

**Continuous Deployment (Implantação Contínua):**
Deploy automático em produção após passar nos testes.

```
Testes OK → Build → [Aprovação Manual] → Deploy → Produção  (Delivery)
Testes OK → Build → Deploy Automático → Produção            (Deployment)
```

## Benefícios

 **Detecta bugs cedo**
 **Reduz trabalho manual**
 **Deploy mais frequente e confiável**
 **Feedback rápido**
 **Menos erros em produção**

## Pipeline CI/CD

```
┌──────────────┐
│ 1. Commit    │
└──────┬───────┘
       │
┌──────▼───────┐
│ 2. Build     │ (npm install, compilar TypeScript)
└──────┬───────┘
       │
┌──────▼───────┐
│ 3. Test      │ (unit, integration, e2e)
└──────┬───────┘
       │
┌──────▼───────┐
│ 4. Quality   │ (lint, security scan)
└──────┬───────┘
       │
┌──────▼───────┐
│ 5. Deploy    │ (staging, production)
└──────────────┘
```

## GitHub Actions

### Arquivo de Configuração

```yaml
# .github/workflows/ci.yml

name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  # Job 1: Build e Test
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      # Checkout do código
      - uses: actions/checkout@v3

      # Configurar Node.js
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      # Instalar dependências
      - name: Install dependencies
        run: npm ci

      # Rodar linter
      - name: Run linter
        run: npm run lint

      # Rodar testes
      - name: Run tests
        run: npm test

      # Gerar build
      - name: Build
        run: npm run build

      # Upload de artefatos
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: dist/

  # Job 2: Deploy (apenas em main)
  deploy:
    needs: build-and-test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build
          path: dist/

      - name: Deploy to production
        env:
          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
        run: |
          echo "Deploying to production..."
          # Comandos de deploy aqui
```

### Exemplo com Docker

```yaml
name: Docker CI/CD

on:
  push:
    branches: [main]

jobs:
  build-and-push:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: user/app:latest

      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            docker pull user/app:latest
            docker stop app || true
            docker rm app || true
            docker run -d --name app -p 3000:3000 user/app:latest
```

### Testes com Cobertura

```yaml
- name: Run tests with coverage
  run: npm test -- --coverage

- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v3
  with:
    token: ${{ secrets.CODECOV_TOKEN }}
```

### Deploy Condicional

```yaml
deploy-staging:
  if: github.ref == 'refs/heads/develop'
  runs-on: ubuntu-latest
  steps:
    - name: Deploy to staging
      run: ./deploy-staging.sh

deploy-production:
  if: github.ref == 'refs/heads/main'
  runs-on: ubuntu-latest
  steps:
    - name: Deploy to production
      run: ./deploy-production.sh
```

## GitLab CI/CD

```yaml
# .gitlab-ci.yml

stages:
  - build
  - test
  - deploy

variables:
  NODE_VERSION: "18"

# Cache
cache:
  paths:
    - node_modules/

# Build
build:
  stage: build
  image: node:$NODE_VERSION
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour

# Tests
test:unit:
  stage: test
  image: node:$NODE_VERSION
  script:
    - npm ci
    - npm run test:unit
  coverage: '/Statements\s*:\s*(\d+\.\d+)%/'

test:integration:
  stage: test
  image: node:$NODE_VERSION
  services:
    - postgres:14
  variables:
    POSTGRES_DB: test_db
    POSTGRES_USER: test_user
    POSTGRES_PASSWORD: test_password
  script:
    - npm ci
    - npm run test:integration

# Lint
lint:
  stage: test
  image: node:$NODE_VERSION
  script:
    - npm ci
    - npm run lint

# Deploy Staging
deploy:staging:
  stage: deploy
  only:
    - develop
  script:
    - echo "Deploying to staging..."
    - ./deploy-staging.sh

# Deploy Production
deploy:production:
  stage: deploy
  only:
    - main
  when: manual  # Requer aprovação manual
  script:
    - echo "Deploying to production..."
    - ./deploy-production.sh
```

## CircleCI

```yaml
# .circleci/config.yml

version: 2.1

orbs:
  node: circleci/node@5.0

workflows:
  build-test-deploy:
    jobs:
      - build-and-test
      - deploy:
          requires:
            - build-and-test
          filters:
            branches:
              only: main

jobs:
  build-and-test:
    docker:
      - image: cimg/node:18.0
    steps:
      - checkout
      - node/install-packages
      - run:
          name: Run tests
          command: npm test
      - run:
          name: Build
          command: npm run build
      - persist_to_workspace:
          root: .
          paths:
            - dist

  deploy:
    docker:
      - image: cimg/node:18.0
    steps:
      - checkout
      - attach_workspace:
          at: .
      - run:
          name: Deploy to production
          command: |
            echo "Deploying..."
            ./deploy.sh
```

## Secrets e Variáveis de Ambiente

### GitHub Actions

```yaml
# Usar secrets
- name: Deploy
  env:
    API_KEY: ${{ secrets.API_KEY }}
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
  run: ./deploy.sh
```

**Configurar no GitHub:**
`Settings → Secrets and variables → Actions → New repository secret`

### GitLab CI

```yaml
# Usar variáveis
deploy:
  script:
    - echo $API_KEY
    - ./deploy.sh
```

**Configurar no GitLab:**
`Settings → CI/CD → Variables → Add variable`

## Ambientes

### GitHub Actions

```yaml
deploy:
  runs-on: ubuntu-latest
  environment:
    name: production
    url: https://meusite.com

  steps:
    - name: Deploy
      run: ./deploy.sh
```

## Notifications

### Slack

```yaml
- name: Slack notification
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Deploy completed!'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
  if: always()
```

### Discord

```yaml
- name: Discord notification
  uses: sarisia/actions-status-discord@v1
  if: always()
  with:
    webhook: ${{ secrets.DISCORD_WEBHOOK }}
    status: ${{ job.status }}
    title: 'Deploy Status'
```

## Boas Práticas

###  Fazer

1. **Rodar testes antes de fazer merge**
   ```yaml
   pull_request:
     branches: [main]
   ```

2. **Cachear dependências**
   ```yaml
   - uses: actions/cache@v3
     with:
       path: ~/.npm
       key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
   ```

3. **Usar matriz de testes**
   ```yaml
   strategy:
     matrix:
       node-version: [16, 18, 20]
   ```

4. **Deploy apenas após sucesso**
   ```yaml
   deploy:
     needs: [build, test, lint]
   ```

5. **Proteger branch main**
   - Require pull request reviews
   - Require status checks to pass

6. **Usar ambientes separados**
   ```yaml
   deploy-staging:
     environment: staging
   deploy-production:
     environment: production
   ```

###  Evitar

1. **Secrets no código**
2. **Deploy sem testes**
3. **Pipelines muito longos**
4. **Não usar cache**

## Exemplo Completo

```yaml
# .github/workflows/main.yml

name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'

jobs:
  # ===== QUALITY CHECKS =====
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  # ===== TESTS =====
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [16, 18, 20]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      - run: npm ci
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v3
        if: matrix.node-version == 18

  # ===== SECURITY =====
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm audit --audit-level=high

  # ===== BUILD =====
  build:
    needs: [lint, test, security]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v3
        with:
          name: build
          path: dist/

  # ===== DEPLOY STAGING =====
  deploy-staging:
    needs: build
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    environment:
      name: staging
      url: https://staging.meusite.com
    steps:
      - uses: actions/checkout@v3
      - uses: actions/download-artifact@v3
        with:
          name: build
          path: dist/
      - name: Deploy to staging
        env:
          STAGING_SERVER: ${{ secrets.STAGING_SERVER }}
          SSH_KEY: ${{ secrets.SSH_KEY }}
        run: ./scripts/deploy-staging.sh

  # ===== DEPLOY PRODUCTION =====
  deploy-production:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://meusite.com
    steps:
      - uses: actions/checkout@v3
      - uses: actions/download-artifact@v3
        with:
          name: build
          path: dist/
      - name: Deploy to production
        env:
          PRODUCTION_SERVER: ${{ secrets.PRODUCTION_SERVER }}
          SSH_KEY: ${{ secrets.SSH_KEY }}
        run: ./scripts/deploy-production.sh
      - name: Notify team
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Production deploy completed!'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## Ferramentas Populares

| Ferramenta | Tipo | Gratuito | Melhor para |
|------------|------|----------|-------------|
| GitHub Actions | Cloud | Sim | Projetos no GitHub |
| GitLab CI/CD | Cloud/Self-hosted | Sim | GitLab |
| CircleCI | Cloud | Sim (limitado) | Configuração simples |
| Travis CI | Cloud | Sim (OSS) | Open source |
| Jenkins | Self-hosted | Sim | Controle total |
| Vercel | Platform | Sim (limitado) | Frontend |
| Netlify | Platform | Sim (limitado) | Jamstack |

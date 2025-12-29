# Conceitos de Deploy

## O que é Deploy?

**Deploy** (implantação) é o processo de disponibilizar uma aplicação em um ambiente de produção, tornando-a acessível aos usuários finais.

## Ambientes

### 1. Desenvolvimento (Development)
- Máquina local do desenvolvedor
- Dados de teste
- Debug habilitado
- Hot reload

```bash
NODE_ENV=development npm run dev
```

### 2. Homologação/Staging
- Réplica do ambiente de produção
- Testes finais antes do deploy
- QA (Quality Assurance)

```bash
NODE_ENV=staging npm start
```

### 3. Produção (Production)
- Ambiente real dos usuários
- Dados reais
- Performance otimizada
- Logs e monitoramento

```bash
NODE_ENV=production npm start
```

## Tipos de Deploy

### 1. Manual Deploy

Processo manual de envio de código para produção.

```bash
# Conectar ao servidor
ssh user@servidor.com

# Atualizar código
cd /var/www/app
git pull origin main

# Instalar dependências
npm install --production

# Reiniciar aplicação
pm2 restart app
```

**Problemas:**
-  Propenso a erros humanos
-  Lento
-  Não escalável
-  Difícil de reverter

### 2. Automated Deploy (CI/CD)

Processo automatizado de build, teste e deploy.

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: npm test
      - name: Deploy to production
        run: ./deploy.sh
```

**Vantagens:**
-  Consistente
-  Rápido
-  Rastreável
-  Fácil rollback

## Estratégias de Deploy

### 1. Recreate (Recriar)

Para a aplicação antiga e inicia a nova.

```
V1  ███████████ → ⬛⬛⬛⬛⬛ (downtime) → ███████████ V2
```

**Características:**
-  Simples
-  Downtime
-  Arriscado

**Quando usar:** Ambientes de desenvolvimento/staging

### 2. Rolling Update

Atualiza instâncias gradualmente.

```
Instance 1: V1 → V2
Instance 2: V1 → V2
Instance 3: V1 → V2
```

**Características:**
-  Zero downtime
-  Duas versões rodando simultaneamente
-  Rollback possível

**Quando usar:** Aplicações stateless

### 3. Blue-Green

Mantém dois ambientes idênticos (Blue e Green).

```
Blue (V1)  → Tráfego 100%
Green (V2) → Tráfego 0%

[Deploy]

Blue (V1)  → Tráfego 0%
Green (V2) → Tráfego 100%
```

**Características:**
-  Zero downtime
-  Rollback instantâneo
-  Custo dobrado (dois ambientes)

**Quando usar:** Aplicações críticas

### 4. Canary

Libera gradualmente para uma pequena porcentagem de usuários.

```
V1 → 90% dos usuários
V2 → 10% dos usuários

[Monitorar]

V1 → 0% dos usuários
V2 → 100% dos usuários
```

**Características:**
-  Baixo risco
-  Testa em produção com segurança
-  Complexo de implementar

**Quando usar:** Grandes aplicações com muitos usuários

## Checklist Pré-Deploy

### Código

- [ ] Testes passando
- [ ] Code review aprovado
- [ ] Merge na branch principal
- [ ] Versão atualizada (semver)

### Configuração

- [ ] Variáveis de ambiente configuradas
- [ ] Secrets/credenciais seguras
- [ ] Database migrations prontas
- [ ] Dependências atualizadas

### Infraestrutura

- [ ] Servidor configurado
- [ ] SSL/TLS configurado
- [ ] DNS apontando corretamente
- [ ] Load balancer configurado (se aplicável)

### Monitoramento

- [ ] Logs configurados
- [ ] Métricas sendo coletadas
- [ ] Alertas configurados
- [ ] Health checks funcionando

## Build de Produção

### package.json

```json
{
  "scripts": {
    "start": "node dist/server.js",
    "build": "tsc",
    "dev": "nodemon src/server.ts",
    "test": "jest"
  }
}
```

### Processo de Build

```bash
# 1. Instalar dependências de produção
npm ci --production

# 2. Build (se TypeScript)
npm run build

# 3. Iniciar aplicação
npm start
```

## Process Managers

### PM2

```bash
# Instalar
npm install -g pm2

# Iniciar aplicação
pm2 start dist/server.js --name "app"

# Configuração avançada
pm2 start ecosystem.config.js

# Gerenciar
pm2 list          # Listar processos
pm2 restart app   # Reiniciar
pm2 stop app      # Parar
pm2 delete app    # Remover
pm2 logs app      # Ver logs

# Iniciar no boot
pm2 startup
pm2 save
```

**ecosystem.config.js:**
```javascript
module.exports = {
  apps: [{
    name: 'api',
    script: './dist/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

## Reverse Proxy (Nginx)

```nginx
# /etc/nginx/sites-available/app

server {
  listen 80;
  server_name meusite.com;

  location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

```bash
# Ativar site
sudo ln -s /etc/nginx/sites-available/app /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

## SSL/TLS com Let's Encrypt

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d meusite.com -d www.meusite.com

# Renovação automática (já configurada)
sudo certbot renew --dry-run
```

## Health Checks

```javascript
// server.js
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});

// Com verificações
app.get('/health', async (req, res) => {
  try {
    // Verificar banco de dados
    await db.query('SELECT 1');

    res.status(200).json({
      status: 'healthy',
      database: 'connected'
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      database: 'disconnected'
    });
  }
});
```

## Rollback

### Reverter Deploy

```bash
# PM2
pm2 deploy ecosystem.config.js production revert 1

# Git
git revert HEAD
git push origin main

# Docker
docker service update --rollback my-service
```

### Estratégia de Rollback

1. **Detectar problema**
   - Monitoramento/alertas
   - Aumento de erros

2. **Reverter para versão anterior**
   - Automaticamente (CI/CD)
   - Manualmente (se necessário)

3. **Investigar e corrigir**
   - Análise de logs
   - Reproduzir em staging

4. **Redeploy com correção**
   - Após testes

## Variáveis de Ambiente

```bash
# .env.production (NÃO commitar!)
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=super_secret_key_here
```

```javascript
// Validar variáveis
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
```

## Boas Práticas

###  Fazer

1. **Automatizar deploy**
2. **Testar antes de fazer deploy**
3. **Usar variáveis de ambiente**
4. **Implementar health checks**
5. **Configurar logs e monitoramento**
6. **Ter plano de rollback**
7. **Fazer deploy em horários de baixo tráfego**
8. **Documentar processo de deploy**

###  Evitar

1. **Deploy manual em produção**
2. **Credenciais no código**
3. **Deploy sem testes**
4. **Sem backup do banco de dados**
5. **Sem monitoramento**

## Próximos Passos

- Configurar **CI/CD** (GitHub Actions, GitLab CI)
- Aprender **Docker** e containerização
- Estudar **Kubernetes** para orquestração
- Implementar **monitoramento** (Prometheus, Grafana)

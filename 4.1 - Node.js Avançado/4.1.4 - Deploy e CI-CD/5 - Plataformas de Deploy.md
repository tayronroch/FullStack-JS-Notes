# Plataformas de Deploy

## Comparação de Plataformas

| Plataforma | Tipo | Gratuito | Melhor para | Dificuldade |
|------------|------|----------|-------------|-------------|
| Vercel | Serverless | Sim | Frontend, Next.js | Fácil |
| Netlify | Serverless | Sim | Frontend, Jamstack | Fácil |
| Heroku | PaaS | Limitado | Full-stack | Fácil |
| Railway | PaaS | Sim | Full-stack, Node.js | Fácil |
| Render | PaaS | Sim | Full-stack | Fácil |
| Fly.io | PaaS | Sim | Global edge | Médio |
| AWS Elastic Beanstalk | PaaS | Não | Enterprise | Médio |
| DigitalOcean App Platform | PaaS | Não | Full-stack | Médio |
| AWS EC2 | IaaS | Não | Controle total | Difícil |
| GCP Compute Engine | IaaS | Não | Escalabilidade | Difícil |

## 1. Vercel

**Ideal para:** Frontend (React, Next.js, Vue)

### Deploy

```bash
# Instalar CLI
npm install -g vercel

# Deploy
vercel

# Deploy em produção
vercel --prod
```

### Configuração

```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Variáveis de Ambiente

```bash
# CLI
vercel env add DATABASE_URL

# Dashboard: Settings → Environment Variables
```

**Limites do plano gratuito:**
-  Domínio customizado
-  SSL automático
-  Deploy ilimitados
-  Serverless functions com timeout curto (10s)

---

## 2. Netlify

**Ideal para:** Frontend, Jamstack, sites estáticos

### Deploy

```bash
# Instalar CLI
npm install -g netlify-cli

# Deploy
netlify deploy

# Deploy em produção
netlify deploy --prod
```

### Configuração

```toml
# netlify.toml

[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

### Functions (Backend)

```javascript
// netlify/functions/hello.js

exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello from Netlify!' })
  };
};

// Acessível em: https://site.netlify.app/.netlify/functions/hello
```

**Limites do plano gratuito:**
-  100GB bandwidth/mês
-  Functions com timeout de 10s
-  Deploy automático do Git

---

## 3. Heroku

**Ideal para:** Full-stack Node.js, Python, Ruby

### Deploy

```bash
# Instalar CLI
npm install -g heroku

# Login
heroku login

# Criar app
heroku create meu-app

# Deploy
git push heroku main

# Abrir app
heroku open

# Ver logs
heroku logs --tail
```

### Procfile

```procfile
# Procfile

web: node dist/server.js
worker: node worker.js
```

### Variáveis de Ambiente

```bash
# Definir
heroku config:set DATABASE_URL=postgresql://...

# Listar
heroku config

# Remover
heroku config:unset API_KEY
```

### Add-ons

```bash
# Adicionar PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Adicionar Redis
heroku addons:create heroku-redis:hobby-dev

# Listar add-ons
heroku addons
```

**Limites do plano gratuito (Eco):**
-  Dorme após 30 min de inatividade
-  550 horas/mês
-  Plano gratuito terminando em 2022

---

## 4. Railway

**Ideal para:** Node.js, databases, full-stack

### Deploy

```bash
# Instalar CLI
npm install -g @railway/cli

# Login
railway login

# Criar projeto
railway init

# Deploy
railway up

# Abrir
railway open
```

### Configuração

```toml
# railway.toml

[build]
  builder = "NIXPACKS"

[deploy]
  startCommand = "npm start"
  healthcheckPath = "/health"
  restartPolicyType = "ON_FAILURE"
```

### Variáveis

Via dashboard: Variables → Add Variable

**Vantagens:**
-  $5 créditos grátis/mês
-  PostgreSQL, MySQL, Redis inclusos
-  Não dorme
-  Deploy automático do Git

---

## 5. Render

**Ideal para:** Full-stack, Web Services, Databases

### Configuração

```yaml
# render.yaml

services:
  - type: web
    name: api
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: mydb
          property: connectionString

databases:
  - name: mydb
    plan: free
    databaseName: myapp
    user: myapp
```

### Deploy

1. Conecte repositório GitHub
2. Configure variáveis de ambiente
3. Deploy automático em cada push

**Limites do plano gratuito:**
-  750 horas/mês
-  SSL automático
-  Dorme após 15 min de inatividade

---

## 6. Fly.io

**Ideal para:** Apps globais, baixa latência

### Deploy

```bash
# Instalar CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Criar app
fly launch

# Deploy
fly deploy

# Ver status
fly status

# Abrir
fly open
```

### Configuração

```toml
# fly.toml

app = "meu-app"

[build]
  builder = "heroku/buildpacks:20"

[env]
  PORT = "8080"
  NODE_ENV = "production"

[[services]]
  internal_port = 8080
  protocol = "tcp"

  [[services.ports]]
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443
```

**Vantagens:**
-  Deploy global (edge)
-  3 VMs gratuitas
-  PostgreSQL gratuito

---

## 7. DigitalOcean App Platform

**Ideal para:** Apps Node.js, Python, Go

### Configuração

```yaml
# .do/app.yaml

name: meu-app

services:
  - name: api
    github:
      repo: usuario/repositorio
      branch: main
    build_command: npm run build
    run_command: npm start
    environment_slug: node-js
    envs:
      - key: NODE_ENV
        value: "production"
    http_port: 3000

databases:
  - name: db
    engine: PG
    version: "14"
```

**Preços:**
- Basic: $5/mês
- Professional: $12/mês

---

## 8. AWS Elastic Beanstalk

**Ideal para:** Enterprise, escalabilidade

### Deploy

```bash
# Instalar EB CLI
pip install awsebcli

# Inicializar
eb init

# Criar ambiente
eb create production

# Deploy
eb deploy

# Abrir
eb open

# Logs
eb logs
```

### Configuração

```yaml
# .ebextensions/nodecommand.config

option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "npm start"
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: production
```

**Vantagens:**
-  Escalabilidade automática
-  Load balancing
-  Integração com AWS
-  Mais caro
-  Mais complexo

---

## 9. VPS (Servidor Próprio)

### DigitalOcean Droplet

```bash
# Criar droplet (via dashboard ou CLI)
# Conectar via SSH
ssh root@SEU_IP

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2
npm install -g pm2

# Clone do repositório
git clone https://github.com/usuario/repo.git
cd repo

# Instalar dependências
npm install --production

# Build
npm run build

# Iniciar com PM2
pm2 start dist/server.js --name api
pm2 startup
pm2 save

# Nginx reverse proxy
sudo apt install nginx
sudo nano /etc/nginx/sites-available/app
```

**Nginx config:**
```nginx
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
sudo nginx -t
sudo systemctl restart nginx

# SSL com Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d meusite.com
```

**Preços DigitalOcean:**
- Basic: $6/mês (1GB RAM)
- Standard: $12/mês (2GB RAM)

---

## Escolhendo a Plataforma

### Frontend estático
→ **Vercel** ou **Netlify**

### Full-stack Node.js (Hobby)
→ **Railway** ou **Render**

### Full-stack Node.js (Produção pequena)
→ **Render** ou **Fly.io**

### Enterprise/Escalável
→ **AWS Elastic Beanstalk** ou **GCP**

### Máximo controle
→ **VPS** (DigitalOcean, Linode)

### Global/Edge
→ **Fly.io** ou **Cloudflare Workers**

## Checklist de Deploy

- [ ] Código em repositório Git
- [ ] Testes passando
- [ ] Build funciona localmente
- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados provisionado
- [ ] Domínio customizado (opcional)
- [ ] SSL/TLS configurado
- [ ] Logs e monitoramento
- [ ] Health check implementado
- [ ] Backup configurado (produção)

## Boas Práticas

###  Fazer

1. **Use CI/CD** para deploy automático
2. **Configure variáveis** de ambiente na plataforma
3. **Monitore logs** e métricas
4. **Configure alertas** para erros
5. **Faça backup** do banco de dados
6. **Use domínio customizado** em produção
7. **Habilite SSL/HTTPS**

###  Evitar

1. **Deploy manual** sem CI/CD
2. **Credenciais no código**
3. **Sem monitoramento**
4. **Sem health checks**
5. **Ignorar logs de erro**

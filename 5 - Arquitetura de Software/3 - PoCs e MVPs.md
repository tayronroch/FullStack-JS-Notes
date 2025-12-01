# PoCs e MVPs: Validação de Ideias e Produtos

No desenvolvimento de software, é fundamental validar ideias antes de investir tempo e recursos significativos. Dois conceitos essenciais para isso são **PoC (Proof of Concept)** e **MVP (Minimum Viable Product)**.

---

## O que é PoC (Proof of Concept)?

### Definição

**PoC** é um experimento técnico criado para validar se uma solução ou tecnologia específica é viável para resolver um problema. O objetivo é **responder perguntas técnicas**, não criar um produto final.

### Objetivos de uma PoC

- **Validar viabilidade técnica:** "Essa tecnologia consegue fazer o que precisamos?"
- **Comparar alternativas:** "Redis é melhor que PostgreSQL para este caso?"
- **Reduzir riscos:** "Vamos conseguir integrar com essa API externa?"
- **Estimar complexidade:** "Quanto esforço vai dar implementar isso de verdade?"

### Características

| Aspecto | PoC |
|---------|-----|
| **Objetivo** | Validar viabilidade técnica |
| **Qualidade do código** | Baixa (código descartável) |
| **Escopo** | Muito focado (uma funcionalidade específica) |
| **Tempo de desenvolvimento** | Horas a poucos dias |
| **Usuários** | Nenhum (apenas desenvolvedores testam) |
| **Deploy** | Não vai para produção |

### Quando fazer uma PoC?

✅ **Quando usar:**
- Testar uma tecnologia nova que o time nunca usou
- Validar integração com sistemas externos
- Comparar diferentes abordagens técnicas
- Provar que algo "difícil" é possível antes de vender a ideia

❌ **Quando NÃO usar:**
- Para funcionalidades simples que você já sabe como fazer
- Quando a decisão já está tomada e você só precisa implementar
- Para mostrar o produto para usuários finais (use MVP)

---

## Exemplos Práticos de PoC

### Exemplo 1: Sistema de Notificações em Tempo Real

**Problema:** Precisamos adicionar notificações em tempo real na aplicação.

**PoCs a serem feitas:**

**PoC A: WebSockets (Socket.io)**
```javascript
// Código rápido e sujo só para testar
const io = require('socket.io')(3000)

io.on('connection', (socket) => {
  console.log('Cliente conectado')

  // Simular notificação
  setInterval(() => {
    socket.emit('notification', { msg: 'Nova mensagem!' })
  }, 5000)
})
```

**PoC B: Server-Sent Events (SSE)**
```javascript
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')

  setInterval(() => {
    res.write(`data: ${JSON.stringify({ msg: 'Nova mensagem!' })}\n\n`)
  }, 5000)
})
```

**PoC C: Polling tradicional**
```javascript
// Cliente faz requisições a cada X segundos
setInterval(async () => {
  const notifications = await fetch('/api/notifications')
  // Atualiza UI
}, 5000)
```

**Resultado da PoC:**
- WebSockets: Bidirecional, mas requer infraestrutura especial
- SSE: Mais simples, mas unidirecional
- Polling: Funciona em qualquer lugar, mas gera muito tráfego

**Decisão:** Escolher com base nos requisitos do projeto e infraestrutura disponível.

### Exemplo 2: Upload de Arquivos Grandes

**Problema:** Usuários precisam fazer upload de vídeos de até 2GB.

**PoCs:**
- **A:** Upload direto para servidor (Node.js)
- **B:** Upload direto para S3 (pre-signed URLs)
- **C:** Upload em chunks (multipart)

**Perguntas a responder:**
- Qual aguenta 2GB sem timeout?
- Qual tem melhor UX (barra de progresso)?
- Qual é mais barato em infraestrutura?

### Exemplo 3: Escolha de Banco de Dados

**Problema:** Criar um sistema de logs que armazena milhões de eventos por dia.

**PoCs:**
- **PostgreSQL:** Testar performance de insert com 100k registros
- **MongoDB:** Testar o mesmo volume
- **ClickHouse:** Banco otimizado para analytics
- **Elasticsearch:** Busca e agregações

**Script de teste (exemplo PostgreSQL):**
```javascript
const { performance } = require('perf_hooks')

async function testInsertPerformance() {
  const start = performance.now()

  // Inserir 100k registros
  for (let i = 0; i < 100000; i++) {
    await db.query('INSERT INTO logs (message, level) VALUES ($1, $2)',
      [`Log ${i}`, 'info'])
  }

  const end = performance.now()
  console.log(`Tempo: ${end - start}ms`)
}
```

**Resultado:** Escolher o banco que melhor atende aos requisitos de performance e custo.

---

## O que é MVP (Minimum Viable Product)?

### Definição

**MVP** é a versão mais simples de um produto que pode ser lançada para usuários reais, contendo apenas as funcionalidades essenciais para resolver o problema principal.

### Objetivos de um MVP

- **Validar hipóteses de negócio:** "As pessoas vão usar isso?"
- **Testar market fit:** "Estamos resolvendo o problema certo?"
- **Coletar feedback real:** "O que os usuários realmente precisam?"
- **Minimizar desperdício:** Não construir funcionalidades que ninguém vai usar

### Características

| Aspecto | MVP |
|---------|-----|
| **Objetivo** | Validar hipótese de produto/negócio |
| **Qualidade do código** | Boa (vai para produção) |
| **Escopo** | Mínimo viável (core value do produto) |
| **Tempo de desenvolvimento** | Semanas a poucos meses |
| **Usuários** | Usuários reais (early adopters) |
| **Deploy** | Vai para produção |

### Quando fazer um MVP?

✅ **Quando usar:**
- Validar se o produto resolve um problema real
- Testar hipóteses de negócio com dados reais
- Entrar no mercado rapidamente
- Aprender com feedback de usuários reais

❌ **Quando NÃO usar:**
- Sistemas críticos (bancários, médicos) que exigem robustez desde o início
- Quando você já tem certeza do que construir e só precisa executar
- Para substituir sistemas legados complexos (precisa de mais planejamento)

---

## Exemplos Práticos de MVP

### Exemplo 1: Status Page (Monitoramento de Serviços)

**Problema:** Empresas precisam mostrar o status de seus serviços para clientes.

**Funcionalidades possíveis:**
- ✅ **MVP:** Exibir status manual (up/down) de 5 serviços
- ✅ **MVP:** Página pública com histórico de 7 dias
- ✅ **MVP:** Atualização manual via dashboard simples
- ❌ **Não é MVP:** Monitoramento automático a cada 30s
- ❌ **Não é MVP:** Alertas por email/SMS
- ❌ **Não é MVP:** Integrações com Slack, Discord, etc.
- ❌ **Não é MVP:** Métricas de uptime e SLA

**Stack do MVP:**
```
Frontend: HTML/CSS/JS puro (sem frameworks)
Backend: Node.js + Express
Banco: SQLite (arquivo local, sem servidor)
Deploy: Heroku free tier
Tempo estimado: 2 semanas
```

**Após validar com usuários reais:**
- Se ninguém usar → pivotar ou abandonar
- Se usar mas pedir feature X → adicionar incrementalmente
- Se viralizar → refatorar para escalar

### Exemplo 2: To-Do List Colaborativo

**MVP (Dropbox Paper estilo):**
```
✅ Criar lista de tarefas
✅ Marcar como concluída
✅ Compartilhar lista por link público (read-only)
✅ Persistência no navegador (localStorage)

❌ Edição colaborativa em tempo real
❌ Sistema de usuários/login
❌ Anexos e comentários
❌ Notificações
```

**Evolução pós-MVP:**
- **Versão 1.1:** Adicionar backend para salvar na nuvem
- **Versão 1.2:** Login simples (email/senha)
- **Versão 2.0:** Colaboração em tempo real (se usuários pedirem)

### Exemplo 3: API de Pagamentos

**MVP:**
```
✅ Endpoint POST /payments (criar pagamento)
✅ Endpoint GET /payments/:id (consultar)
✅ Integração com 1 gateway (ex: Stripe)
✅ Suporte a 1 método (cartão de crédito)
✅ Webhook básico (confirmar pagamento)

❌ Suporte a PIX, boleto, etc.
❌ Retry automático de webhooks
❌ Dashboard de analytics
❌ Sistema de refund
```

---

## PoC vs MVP: Comparação Direta

| Aspecto | PoC | MVP |
|---------|-----|-----|
| **Pergunta principal** | "Conseguimos fazer?" | "Alguém vai usar?" |
| **Foco** | Técnico | Produto/Negócio |
| **Código** | Descartável | Produção |
| **Testes** | Apenas desenvolvedores | Usuários reais |
| **Métricas de sucesso** | Viabilidade técnica provada | Usuários engajados, feedback positivo |
| **Duração** | Horas a dias | Semanas a meses |
| **Resultado** | Decisão técnica | Decisão de produto |

---

## Fluxo Completo: Da Ideia ao Produto

### Fase 1: Ideação
```
Problema identificado → Hipóteses levantadas
```

### Fase 2: PoC (Se necessário)
```
Testar viabilidade técnica → Comparar alternativas → Escolher stack
```

**Exemplo:**
- PoC A: Testar Redis para cache
- PoC B: Testar PostgreSQL com materialized views
- **Decisão:** PostgreSQL atende e é mais simples

### Fase 3: MVP
```
Construir funcionalidade mínima → Deploy → Coletar feedback
```

**Exemplo:**
- Lançar com apenas login e dashboard básico
- Monitorar uso e métricas
- Conversar com primeiros usuários

### Fase 4: Iteração
```
Analisar dados → Priorizar features → Incrementar produto
```

**Exemplo:**
- 70% dos usuários pediram export em PDF
- 30% pediram integração com API
- **Decisão:** Fazer export primeiro (maior demanda)

---

## Boas Práticas para PoCs

### 1. Defina perguntas claras
```
❌ "Testar MongoDB"
✅ "MongoDB aguenta 10k writes/segundo com nosso schema?"
```

### 2. Estabeleça critérios de sucesso
```
PoC de performance:
- Precisa processar 1000 requisições/seg
- Latência < 100ms no p95
- Uso de memória < 512MB
```

### 3. Documente os resultados
```markdown
# PoC: Redis vs PostgreSQL para cache

## Teste realizado
- Inserção de 100k registros
- Leitura aleatória de 10k registros

## Resultados
- Redis: 0.8s insert, 0.2s read
- PostgreSQL: 2.1s insert, 0.5s read

## Decisão
Redis para cache de sessões (curta duração)
PostgreSQL para dados persistentes
```

### 4. Descarte o código
- PoC não vai para produção
- Reescreva com qualidade depois

---

## Boas Práticas para MVPs

### 1. Identifique o Core Value

**Uber (exemplo histórico):**
```
Core value: "Chamar um carro com 1 clique"

✅ MVP tinha:
- Botão para chamar
- Ver localização do motorista
- Pagamento automático

❌ MVP NÃO tinha:
- Agendamento
- Compartilhamento de corrida
- Múltiplas paradas
- Programa de fidelidade
```

### 2. Use o Princípio 80/20
```
80% do valor com 20% das funcionalidades
```

### 3. Aceite "gambiarras temporárias"
```
✅ No MVP:
- Envio de email manual (copiar texto e enviar via Gmail)
- Processamento de pagamento com planilha
- Suporte via WhatsApp pessoal

❌ Não precisa (ainda):
- Sistema de emails automatizado
- Gateway de pagamento personalizado
- Chat support integrado
```

### 4. Defina métricas claras
```javascript
// Exemplo de métricas para validar MVP
const metricsToValidate = {
  signup: 100,        // 100 cadastros em 30 dias
  activation: 0.4,    // 40% completam onboarding
  retention: 0.3,     // 30% voltam na semana seguinte
  revenue: 1000       // R$ 1000 em receita
}

// Se atingir → continuar investindo
// Se não atingir → pivotar ou abandonar
```

---

## Erros Comuns

### ❌ Fazer PoC sem objetivo claro
```
"Vamos testar GraphQL" → Para quê? Qual problema resolver?
```

### ❌ Gastar muito tempo na PoC
```
PoC de 2 semanas → Já era para ser MVP
```

### ❌ MVP com muitas funcionalidades
```
"MVP com login social, chat, notificações, admin panel..."
→ Isso não é Minimum
```

### ❌ Código de PoC vai para produção
```
"Só vou dar um jeito nesse código de teste..."
→ Débito técnico garantido
```

### ❌ Nunca validar com usuários reais
```
"Vou adicionar mais uma feature antes de mostrar..."
→ Ciclo infinito, nunca lança
```

---

## Casos de Uso Reais

### Exemplo 1: Dropbox

**PoC (2007):**
- Vídeo no Hacker News mostrando a ideia
- Sem produto real, apenas animação
- Objetivo: Validar interesse

**MVP (2008):**
- Sincronização básica de arquivos
- Apenas Linux
- Convite por email (scarcity)

**Resultado:**
- 75.000 cadastros em 1 dia com o vídeo
- MVP validou que pessoas pagariam
- Hoje: empresa bilionária

### Exemplo 2: Airbnb

**MVP (2008):**
- Site simples: "Alugue seu colchão inflável"
- Apenas São Francisco
- Fotos tiradas pelos próprios fundadores
- Pagamento fora da plataforma

**Não era perfeito, mas validou:**
- Pessoas alugam casas de estranhos
- Existe demanda por hospedagem alternativa

### Exemplo 3: Twitter

**MVP (2006):**
- Apenas mensagens de 140 caracteres
- Sem fotos, vídeos, DMs
- Interface super simples

**Core value validado:**
- "Saber o que está acontecendo agora"

---

## Checklist: Quando Sua PoC está Pronta?

```
[ ] Respondeu a pergunta técnica principal?
[ ] Comparou as alternativas necessárias?
[ ] Documentou os resultados?
[ ] Tem dados concretos (métricas, benchmarks)?
[ ] O time concorda com a decisão tomada?
```

## Checklist: Quando Seu MVP está Pronto?

```
[ ] Resolve o problema principal do usuário?
[ ] Tem apenas funcionalidades essenciais?
[ ] Está funcional (sem bugs críticos)?
[ ] Pode ser usado por usuários reais?
[ ] Tem forma de coletar feedback?
[ ] Consegue medir as métricas definidas?
[ ] Pode ser lançado em < 3 meses?
```

---

## Resumo Executivo

### PoC (Proof of Concept)
- **Objetivo:** Validar viabilidade técnica
- **Quando:** Incerteza sobre "como fazer"
- **Duração:** Horas a dias
- **Resultado:** Decisão técnica fundamentada

### MVP (Minimum Viable Product)
- **Objetivo:** Validar hipótese de negócio
- **Quando:** Incerteza sobre "se vale a pena fazer"
- **Duração:** Semanas a meses
- **Resultado:** Produto inicial para usuários reais

### Mantra
> "PoC responde: **Conseguimos?**
> MVP responde: **Devemos?**"

---

## Recursos Adicionais

- [The Lean Startup - Eric Ries](https://theleanstartup.com/)
- [Running Lean - Ash Maurya](https://leanstack.com/books/runninglean)
- [How to Build a Minimum Viable Product](https://www.ycombinator.com/library/4Q-a-minimum-viable-product-is-not-a-product-it-s-a-process)

---

**Lembre-se:** O objetivo de PoCs e MVPs é **aprender rápido** e **evitar desperdício**. Não tenha medo de descartar código ou pivotar ideias. Falhar rápido e barato é melhor que falhar depois de meses de trabalho.

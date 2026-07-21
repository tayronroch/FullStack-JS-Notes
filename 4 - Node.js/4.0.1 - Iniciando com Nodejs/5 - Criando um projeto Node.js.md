# 5 - Criando um Projeto Node.js na Prática

Nas aulas anteriores, aprendemos sobre módulos, NPM e o funcionamento interno do Node.js. Agora, vamos juntar esses conceitos para criar e configurar a estrutura de um **projeto Node.js profissional do zero**, seguindo as melhores práticas do mercado.

---

## 1. Passo a Passo do Setup Inicial

### Passo 1: Criar a pasta do projeto
Crie uma pasta exclusiva para o seu projeto no seu computador e entre nela através do terminal:

```bash
mkdir meu-app-node
cd meu-app-node
```

### Passo 2: Inicializar o projeto com o NPM
Inicie o gerenciamento de pacotes criando o arquivo `package.json`. Usaremos a flag `-y` para aceitar todas as configurações padrão automaticamente:

```bash
npm init -y
```

### Passo 3: Criar a estrutura básica de diretórios
Para manter o projeto organizado, colocamos todo o nosso código-fonte dentro de uma pasta chamada `src` (source). Crie a pasta `src` e o arquivo de entrada da aplicação (`index.js`):

```bash
mkdir src
touch src/index.js
```

---

## 2. Configurações Essenciais de Ambiente

### A. O Arquivo `.gitignore` (Super Importante)
Nunca devemos enviar a pasta `node_modules` (que armazena as dependências instaladas) para o repositório Git, pois ela é extremamente pesada e pode ser facilmente recriada rodando `npm install`.

Crie um arquivo `.gitignore` na raiz do projeto:
```bash
touch .gitignore
```

Adicione as seguintes linhas dentro dele:
```text
node_modules/
.env
```

---

### B. Gerenciando Variáveis de Ambiente (`dotenv`)
Dados sensíveis como senhas de banco de dados, chaves de API ou portas de servidores não devem ser escritos diretamente no código (hardcoded). Em vez disso, usamos variáveis de ambiente através da biblioteca **`dotenv`**.

#### 1. Instale o dotenv:
```bash
npm install dotenv
```

#### 2. Crie o arquivo `.env` (onde ficam as variáveis locais reais):
Crie o arquivo `.env` na raiz do projeto:
```bash
touch .env
```
Adicione a configuração da porta:
```text
PORT=3000
DB_HOST=localhost
```

#### 3. Crie o arquivo `.env.example` (modelo público para outros desenvolvedores):
Como o arquivo `.env` real está listado no `.gitignore` por segurança, criamos um arquivo modelo para que outros desenvolvedores saibam quais variáveis configurar:
```bash
touch .env.example
```
Adicione apenas as chaves (sem os valores confidenciais):
```text
PORT=
DB_HOST=
```

---

## 3. Facilitando o Desenvolvimento com Nodemon

Durante o desenvolvimento, ter que parar o servidor no terminal (`Ctrl + C`) e rodar `node src/index.js` toda vez que alteramos uma linha de código é extremamente cansativo. O **`nodemon`** resolve isso reiniciando o servidor automaticamente a cada salvamento de arquivo.

### DevDependencies vs Dependencies
* **Dependencies (`--save` ou padrão):** Bibliotecas necessárias para a aplicação rodar em produção (ex: `dotenv`, banco de dados).
* **DevDependencies (`-D` ou `--save-dev`):** Ferramentas necessárias apenas durante a fase de desenvolvimento (ex: `nodemon`, testadores de código, linters). Elas são descartadas quando o projeto vai para produção.

Instale o `nodemon` como uma dependência de desenvolvimento:
```bash
npm install -D nodemon
```

---

## 4. Criando e Configurando Scripts Customizados

No arquivo `package.json`, podemos criar atalhos para comandos longos na seção `"scripts"`. Abra o seu `package.json` e modifique-o para incluir os scripts de inicialização:

```json
{
  "name": "meu-app-node",
  "version": "1.0.0",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  },
  "dependencies": {
    "dotenv": "^16.4.5"
  },
  "devDependencies": {
    "nodemon": "^3.1.0"
  }
}
```

* **`npm start`**: Comando padrão usado em servidores de produção. Roda a aplicação uma única vez usando o `node` puro.
* **`npm run dev`**: Comando que você utilizará no dia a dia. Roda o `nodemon` observando suas mudanças em tempo real.

---

## 5. Estrutura de Pastas Recomendada (Boas Práticas)

Um projeto Node.js profissional geralmente adota a seguinte estrutura na raiz:

```text
meu-app-node/
├── node_modules/       # Instalado automaticamente via npm install
├── src/                # Código fonte da aplicação
│   ├── config/         # Configurações de serviços (banco de dados, etc.)
│   └── index.js        # Arquivo de entrada (Entrypoint)
├── .env                # Variáveis confidenciais (Ignorado no Git)
├── .env.example        # Modelo de variáveis de ambiente (Enviado ao Git)
├── .gitignore          # Arquivos e pastas que o Git deve ignorar
├── package.json        # Arquivo de configuração de pacotes e scripts
└── package-lock.json   # Log de versões exatas das dependências
```

---

## 6. Codificando e Testando a Estrutura

Escreva o seguinte código de exemplo em `src/index.js` para testar o carregamento das variáveis de ambiente e o reinício automático:

```javascript
// src/index.js

// Importa e carrega as variáveis do arquivo .env em process.env
require('dotenv').config();

const port = process.env.PORT || 4000;

console.log("=== INICIANDO SERVIDOR ===");
console.log(`Servidor configurado para rodar na porta: ${port}`);
console.log(`Conectando ao banco de dados em: ${process.env.DB_HOST}`);

// Exemplo de execução contínua para testar o Nodemon
setInterval(() => {
  console.log("Servidor ativo e aguardando requisições...");
}, 5000);
```

### Executando o Projeto

1. No terminal, inicie o modo de desenvolvimento:
   ```bash
   npm run dev
   ```
2. Abra o arquivo `src/index.js` e altere a string `"=== INICIANDO SERVIDOR ==="` para `"=== SERVIDOR ONLINE ==="` e salve o arquivo.
3. Observe o terminal: o `nodemon` detectará a alteração imediatamente, limpará o console e reiniciará o script exibindo a nova mensagem sem que você precise fazer nada!

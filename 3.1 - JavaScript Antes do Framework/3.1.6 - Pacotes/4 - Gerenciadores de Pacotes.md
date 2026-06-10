# 3 - Gerenciadores de Pacotes

Um **Gerenciador de Pacotes** é uma ferramenta que automatiza o processo de instalar, atualizar, configurar e remover bibliotecas (pacotes) em um projeto. No ecossistema JavaScript, eles são peças centrais para gerenciar as dependências.

---

## 1. O que eles fazem?

Basicamente, o gerenciador lê um arquivo de configuração (como o `package.json`) e garante que todas as ferramentas que seu projeto precisa para rodar sejam baixadas e organizadas corretamente na pasta `node_modules`.

---

## 2. Os Principais Gerenciadores

Existem três opções principais no mercado hoje:

### 📦 NPM (Node Package Manager)
- **O Padrão:** Vem instalado junto com o Node.js.
- **Vantagem:** Maior ecossistema e suporte oficial.
- **Comando:** `npm install`

### 🧶 Yarn
- **História:** Criado pelo Facebook para resolver problemas de performance e segurança do antigo NPM.
- **Vantagem:** Muito rápido e possui um arquivo `yarn.lock` muito estável.
- **Comando:** `yarn add`

### ⚡ PNPM (Performant NPM)
- **Inovação:** Ao invés de baixar o mesmo pacote para cada projeto no seu computador, ele usa *links* para uma única cópia global.
- **Vantagem:** Economiza gigabytes de espaço em disco e é extremamente rápido.
- **Comando:** `pnpm add`

---

## 3. Comandos Essenciais

Embora os gerenciadores sejam diferentes, os comandos são muito parecidos:

| Ação | NPM | Yarn | PNPM |
| :--- | :--- | :--- | :--- |
| Iniciar projeto | `npm init -y` | `yarn init -y` | `pnpm init` |
| Instalar dependência | `npm install <pkg>` | `yarn add <pkg>` | `pnpm add <pkg>` |
| Instalar p/ Desenvolvimento | `npm install -D <pkg>` | `yarn add -D <pkg>` | `pnpm add -D <pkg>` |
| Remover pacote | `npm uninstall <pkg>` | `yarn remove <pkg>` | `pnpm remove <pkg>` |
| Instalar tudo do projeto | `npm install` | `yarn` | `pnpm install` |

---

## 4. Dependências de Produção vs. Desenvolvimento

Um dos conceitos mais importantes ao gerenciar pacotes é saber separar o que o seu projeto precisa para **rodar** do que ele precisa apenas para ser **desenvolvido**.

### 🚀 Dependências de Produção (`dependencies`)
São bibliotecas que o seu código chama diretamente e que precisam estar presentes quando o site ou sistema estiver "no ar" (em produção).
- **Exemplos:** React, Day.js, Axios, Express.
- **Como instalar:** `npm install <nome>`

### 🛠️ Dependências de Desenvolvimento (`devDependencies`)
São ferramentas que ajudam você a escrever, testar ou buildar o código, mas que não são necessárias para o usuário final. Separar essas dependências deixa o pacote final mais leve e seguro.
- **Exemplos:** Vite, TypeScript, ESLint (corretor de código), Jest (testes).
- **Como instalar:** `npm install -D <nome>` (ou `--save-dev`)

---

## 5. O Arquivo `package.json`

Independente de qual gerenciador você use, o `package.json` é o coração do projeto. Ele contém:
- **Nome e versão** do seu projeto.
- **Scripts:** Atalhos para comandos (ex: `npm run dev`).
- **dependencies:** Listagem das bibliotecas de produção.
- **devDependencies:** Listagem das ferramentas de desenvolvimento.

---

## 6. Arquivos de Lock (`package-lock.json`, `yarn.lock`)

Esses arquivos são gerados automaticamente e garantem que **todas as pessoas do time** instalem exatamente a mesma versão de cada biblioteca, evitando o clássico erro: *"Na minha máquina funciona!"*.

---

## Conclusão

Hoje em dia, o **NPM** evoluiu muito e é excelente, mas o **PNPM** tem ganhado muito espaço por sua eficiência em disco. A escolha depende da preferência da equipe, mas o funcionamento básico é o mesmo para todos.

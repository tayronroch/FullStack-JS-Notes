# 5 - Conhecendo o Node e o NPM

Para trabalhar com pacotes no JavaScript, é essencial entender as duas ferramentas base que rodam no seu computador: o **Node.js** e o **NPM**.

---

## 1. O que é o Node.js?

O **Node.js** não é uma linguagem de programação, mas sim um **ambiente de execução** (runtime) que permite rodar JavaScript fora do navegador (no servidor, na sua máquina local, etc.).

- **Engine V8:** Ele utiliza o mesmo motor do Google Chrome para processar o código com alta performance.
- **Ecossistema:** É o que possibilita a existência de ferramentas como o Vite, Webpack e servidores back-end em JS.

---

## 2. O que é o NPM?

O **NPM (Node Package Manager)** é o gerenciador de pacotes padrão que vem instalado junto com o Node.js. Ele tem duas funções principais:

1. **Repositório Online:** Uma biblioteca gigante na nuvem com milhões de pacotes prontos para uso.
2. **Ferramenta de CLI:** Um programa que você usa no terminal para baixar e gerenciar esses pacotes no seu projeto.

---

## 3. Versões do Node: LTS vs. Current

Ao baixar o Node.js, você encontrará duas opções principais. Escolher a certa é crucial para a estabilidade do seu projeto.

### 🟢 LTS (Long Term Support)
É a versão recomendada para a maioria dos usuários e para ambientes de **produção**.
- **Prós:** Extremamente estável, possui suporte de segurança por longo prazo (geralmente 3 anos) e raramente apresenta bugs críticos ou mudanças que quebram o código.
- **Contras:** Não possui os recursos mais recentes e experimentais da linguagem assim que saem.

### 🔵 Current
É a versão com os recursos mais recentes que acabaram de ser adicionados ao Node.js.
- **Prós:** Ideal para testar novas funcionalidades, APIs experimentais e acompanhar a evolução do motor JavaScript.
- **Contras:** Menos estável. Pode conter bugs e passar por mudanças frequentes que exigem que você atualize seu código para não parar de funcionar.

> **Regra de ouro:** Use **LTS** para projetos reais e profissionais. Use **Current** apenas para estudo ou se precisar desesperadamente de um recurso muito novo.

---

## 4. Como verificar as versões?

O fluxo comum de um desenvolvedor ao usar essas ferramentas é:

1. **Node.js** executa os scripts e ferramentas de build.
2. **NPM** baixa as dependências listadas no `package.json`.
3. As dependências ficam na pasta `node_modules`.

---

## 5. NPM vs. Outros Gerenciadores

Embora o NPM seja o padrão, como vimos na aula anterior, ele divide o espaço com o **Yarn** e o **PNPM**. No entanto, todos eles utilizam o mesmo repositório do NPM para baixar os pacotes; o que muda é a forma como eles gerenciam os arquivos localmente.

---

## Conclusão

Node.js e NPM são o "feijão com arroz" do desenvolvimento moderno. Sem o Node, você não tem onde rodar suas ferramentas; sem o NPM, você teria que escrever cada linha de código do zero, sem poder usar bibliotecas da comunidade.

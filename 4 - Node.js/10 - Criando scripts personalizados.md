# 10 - Criando Scripts Personalizados no package.json

Os scripts do **`package.json`** são muito mais do que simples atalhos de digitação. Eles funcionam como um poderoso **gerenciador de tarefas (Task Runner)** embutido no ecossistema do Node.js, eliminando a necessidade de usar ferramentas externas complexas para automatizar testes, compilações, formatação de código, migrações e deploys.

Nesta aula, aprenderemos a criar, configurar e utilizar os scripts NPM em um nível profissional.

---

## 1. Estrutura e Execução Básica de um Script

Todos os scripts personalizados vivem dentro do objeto `"scripts"` no seu arquivo `package.json`:

```json
{
  "name": "meu-projeto",
  "version": "1.0.0",
  "scripts": {
    "dev": "node --watch src/index.js",
    "falar-ola": "echo 'Olá, estudante!'"
  }
}
```

### Como Executar:
Para rodar qualquer script personalizado, usamos o comando `npm run` seguido do nome do script no terminal:

```bash
npm run dev
npm run falar-ola
```

### 💡 Atalhos Especiais (Sem a palavra `run`)
O NPM possui uma lista de scripts de ciclo de vida nativos que **não necessitam** da palavra `run` para serem executados. Os mais comuns são:
* **`npm start`**: (Equivale a `npm run start`)
* **`npm test`**: (Equivale a `npm run test`)
* **`npm stop`** e **`npm restart`**

---

## 2. Ciclos de Vida (Pre e Post Scripts)

O NPM possui um mecanismo inteligente que permite disparar ações automáticas antes ou depois de qualquer script. Basta prefixar o nome do seu script com **`pre`** ou **`post`**.

Se criarmos um script chamado `build`, o NPM executará a seguinte ordem se os scripts auxiliares existirem:
1. **`prebuild`** (Ações de preparação, limpeza, etc.)
2. **`build`** (A tarefa principal)
3. **`postbuild`** (Mensagens de sucesso, compactação, etc.)

### Exemplo Prático:

```json
"scripts": {
  "prebuild": "echo 'Limpando pasta de distribuição antiga...'",
  "build": "echo 'Compilando arquivos JS/TS...'",
  "postbuild": "echo 'Processamento finalizado com sucesso!'"
}
```

Ao executar no terminal:
```bash
npm run build
```
O console mostrará a execução automática e sequencial dos três comandos na ordem exata.

---

## 3. Passando Parâmetros para Scripts (O Separador `--`)

Às vezes, temos um script base configurado no `package.json` mas queremos passar parâmetros adicionais para a ferramenta por trás dele sem ter que alterar o arquivo de configuração.

Para fazer isso, usamos o separador **`--`** no terminal. Qualquer argumento digitado *depois* do `--` será repassado diretamente ao comando interno.

### Exemplo:
Se o seu script de teste está definido assim:
```json
"scripts": {
  "test": "jest"
}
```

Se você quiser rodar o Jest no modo watch monitorando alterações, você não precisa criar um script `"test:watch"`. Basta rodar no terminal:
```bash
npm test -- --watch
```
O comando que o NPM de fato executará por baixo dos panos será: `jest --watch`.

---

## 4. Executando Múltiplos Comandos

Podemos encadear vários comandos dentro de um único script usando operadores de terminal:

### A. Execução Sequencial (Operador `&&`)
O segundo comando só será executado **se o primeiro terminar com sucesso** (código de saída zero). Excelente para fluxos de validação de qualidade:

```json
"scripts": {
  "checar-codigo": "eslint src/** && npm test"
}
```
*Se o linter (`eslint`) acusar algum erro, a execução para ali e os testes (`npm test`) não serão executados.*

---

### B. Execução em Paralelo (Concurrently)
No desenvolvimento backend, frequentemente precisamos rodar mais de um processo simultaneamente (ex: rodar nossa API Node e paralelamente compilar arquivos CSS ou TypeScript).

Embora o terminal use o operador `&` para paralelismo, ele não é multiplataforma (falha no Windows). Para resolver isso de forma profissional, instalamos o pacote **`concurrently`**:

```bash
npm install -D concurrently
```

Em seguida, configuramos o script:
```json
"scripts": {
  "dev:api": "node --watch src/index.js",
  "dev:css": "sass --watch src/styles:dist/styles",
  "dev": "concurrently \"npm run dev:api\" \"npm run dev:css\""
}
```

Ao rodar `npm run dev`, ambos os comandos serão executados juntos no mesmo terminal, com logs coloridos diferenciando cada processo.

---

## 5. Variáveis de Metadados no NPM

Quando executamos um script, o NPM injeta no escopo do processo variáveis de ambiente contendo os metadados do seu arquivo `package.json`. Você pode usá-las para criar scripts dinâmicos.

* No Linux/macOS, use: **`$npm_package_<propriedade>`**
* No Windows (CMD), use: **`%npm_package_<propriedade>%`**

### Exemplo:
```json
"scripts": {
  "versao": "echo 'O projeto '$npm_package_name' está na versão '$npm_package_version"
}
```

---

## 6. Lista de Scripts para um Projeto Profissional

Aqui está um modelo de configurações de scripts que você encontrará frequentemente em APIs e projetos backend no mercado:

```json
"scripts": {
  "clean": "rimraf dist",
  "prebuild": "npm run clean",
  "build": "tsc",
  "start": "node dist/index.js",
  "dev": "node --watch src/index.js",
  "lint": "eslint src/**/*.js",
  "lint:fix": "npm run lint -- --fix",
  "test": "jest",
  "test:watch": "npm test -- --watch",
  "db:migrate": "prisma migrate dev"
}
```

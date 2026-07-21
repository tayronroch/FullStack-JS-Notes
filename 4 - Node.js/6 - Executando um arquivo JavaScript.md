# 6 - Executando um Arquivo JavaScript no Node.js

Executar um arquivo JavaScript no Node.js vai muito além de apenas digitar `node arquivo.js` no terminal. O Node.js oferece uma série de flags, parâmetros e modos interativos de execução que facilitam o desenvolvimento e são cruciais no dia a dia. Nesta aula, vamos explorar as diferentes maneiras de rodar seu código JavaScript com o Node.js.

---

## 1. Execução Simples de Arquivos

A forma clássica de rodar um script é passando o caminho do arquivo para o executável do Node:

```bash
node src/index.js
```

### Dicas de Execução:
* **Extensão Opcional:** Você não precisa digitar a extensão `.js`. O comando `node src/index` funciona perfeitamente, pois o Node.js assume a extensão `.js` por padrão.
* **Resolução de Caminhos:** O caminho passado para o comando `node` é sempre relativo ao **diretório onde você está no terminal** (CWD - Current Working Directory), e não ao arquivo em si.

---

## 2. Passando Argumentos para os Scripts (`process.argv`)

Muitas vezes, precisamos passar parâmetros diretamente na linha de comando ao rodar um script (ex: passar um nome, um valor ou uma configuração de ambiente). 

O Node.js expõe todos os argumentos digitados no terminal através do array global **`process.argv`**.

### Exemplo Prático

Crie um arquivo chamado `calculadora.js` com o seguinte código:

```javascript
// calculadora.js

// O process.argv contém todo o comando digitado no terminal dividido em um array
console.log(process.argv);

// Os argumentos customizados começam a partir do índice 2
const num1 = Number(process.argv[2]);
const num2 = Number(process.argv[3]);

if (isNaN(num1) || isNaN(num2)) {
  console.log("Por favor, forneça dois números válidos. Exemplo: node calculadora 5 10");
} else {
  console.log(`A soma de ${num1} e ${num2} é: ${num1 + num2}`);
}
```

Ao executar `node calculadora 15 25` no terminal, o array `process.argv` conterá:
1. `process.argv[0]`: O caminho absoluto para o executável do Node.js.
2. `process.argv[1]`: O caminho absoluto do arquivo sendo executado (`calculadora.js`).
3. `process.argv[2]`: `"15"` (Sempre recebido como string).
4. `process.argv[3]`: `"25"` (Sempre recebido como string).

---

## 3. Modo Interativo: O REPL

Se você digitar apenas `node` no terminal e pressionar `Enter`, você entrará no modo **REPL** (*Read-Eval-Print-Loop*).

```bash
$ node
Welcome to Node.js v20.x.
>
```

Ele funciona como o console do inspetor do navegador. Você pode digitar código JavaScript diretamente e pressionar `Enter` para vê-lo executar imediatamente:

```javascript
> const soma = (a, b) => a + b;
undefined
> soma(10, 5)
15
```

### Como sair do REPL:
* Digite `.exit` e pressione `Enter`.
* Ou pressione `Ctrl + C` duas vezes seguidas.

---

## 4. Executando Código Inline (Flag `-e` ou `--eval`)

Para testes extremamente rápidos onde você não quer entrar no REPL ou criar um arquivo físico, você pode usar a flag `-e` para avaliar e rodar uma linha de JavaScript direto no terminal:

```bash
node -e "console.log('Data atual:', new Date().toLocaleDateString())"
```

---

## 5. Modo Watch Nativo: Sem dependências externas (`--watch`)

A partir da versão **Node.js 18.11.0+** (estabilizado na versão 20.x+), o Node.js possui um modo de reinício automático embutido nativamente, eliminando a necessidade de instalar ferramentas de terceiros (como o `nodemon`) para scripts simples.

Para rodar seu script monitorando alterações nos arquivos:

```bash
node --watch src/index.js
```

Qualquer alteração salva em `index.js` ou nos arquivos importados por ele fará com que o Node.js reinicie o script de forma instantânea.
> [!TIP]
> Em projetos profissionais maiores, o `nodemon` ainda é amplamente usado por permitir configurações mais complexas (como ignorar pastas específicas), mas o `--watch` nativo é excelente para scripts rápidos de teste ou utilitários.

---

## 6. O Desafio dos Módulos: CommonJS vs. ES Modules

Dependendo de como o arquivo JavaScript está configurado, o comando `node` pode dar erro ao tentar rodar `import` ou `require`.

1. **CommonJS (Padrão do Node):** Usa `require` e `module.exports`. Funciona por padrão em qualquer arquivo `.js`.
2. **ES Modules (Moderno):** Usa `import` e `export`. Para rodar um arquivo que usa essa sintaxe diretamente com o comando `node`, você precisa:
   * Mudar a extensão do arquivo de `.js` para **`.mjs`**.
   * Ou adicionar `"type": "module"` no `package.json` do projeto.

Se você tentar executar um arquivo `.js` com `import` sem fazer as configurações acima, o Node gerará o erro:
`SyntaxError: Cannot use import statement outside a module`

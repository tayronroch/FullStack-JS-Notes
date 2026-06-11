# 3 - Instalando o Babel

## O que e o Babel

Babel e o compilador JavaScript mais usado no ecossistema frontend. Ele recebe codigo moderno (ES2015+, JSX, TypeScript) e entrega codigo compativel com os ambientes que voce precisa suportar. Frameworks como React, Vue e Next.js dependem do Babel ou de ferramentas equivalentes para funcionar.

## Pre-requisitos

- Node.js instalado (versao 14 ou superior recomendada).
- Um projeto com `package.json`. Se ainda nao tiver, crie com:

```bash
npm init -y
```

## Instalando os pacotes essenciais

O Babel e dividido em pacotes separados. O minimo necessario para usar o compilador via linha de comando sao dois:

```bash
npm install --save-dev @babel/core @babel/cli
```

- **`@babel/core`**: o motor do Babel. Faz a leitura, transformacao e geracao do codigo.
- **`@babel/cli`**: permite executar o Babel diretamente no terminal com o comando `babel`.

## Instalando um preset

O Babel sozinho nao transforma nada. Ele precisa de **plugins** para saber quais transformacoes aplicar. Um **preset** e um conjunto de plugins agrupados.

O preset mais comum para transpilar JavaScript moderno e o `@babel/preset-env`:

```bash
npm install --save-dev @babel/preset-env
```

Ele analisa o codigo e converte apenas o que o ambiente-alvo nao suporta, baseado em uma lista de browsers ou versoes do Node.

## Criando o arquivo de configuracao

O Babel precisa de um arquivo de configuracao para saber quais presets e plugins usar. Crie um arquivo chamado `babel.config.json` na raiz do projeto:

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "node": "current"
        }
      }
    ]
  ]
}
```

- **`targets.node: "current"`**: instrui o Babel a transpilar apenas o que a versao atual do Node nao suporta. Util para projetos backend ou scripts locais.
- Para projetos web, substitua por `"targets": "> 0.5%, last 2 versions, not dead"` para cobrir os navegadores mais usados.

## Rodando o Babel

Com a configuracao pronta, compile um arquivo:

```bash
npx babel src/index.js --out-file dist/index.js
```

Ou compile uma pasta inteira:

```bash
npx babel src --out-dir dist
```

O Babel vai ler os arquivos de `src`, aplicar as transformacoes e gravar o resultado em `dist`.

## Adicionando um script no package.json

Para nao precisar digitar o comando completo sempre, adicione um script:

```json
{
  "scripts": {
    "build": "babel src --out-dir dist"
  }
}
```

Agora basta rodar:

```bash
npm run build
```

## Verificando o resultado

Dado o arquivo de entrada em `src/index.js`:

```js
const soma = (a, b) => a + b;

const numeros = [1, 2, 3];
const dobrados = numeros.map(n => n * 2);

console.log(soma(1, 2));
console.log(dobrados);
```

Apos a compilacao com alvo ES5, o arquivo gerado em `dist/index.js` ficaria similar a:

```js
"use strict";

var soma = function soma(a, b) {
  return a + b;
};

var numeros = [1, 2, 3];
var dobrados = numeros.map(function (n) {
  return n * 2;
});

console.log(soma(1, 2));
console.log(dobrados);
```

Arrow functions viram funcoes normais, `const` vira `var` — tudo compativel com ambientes mais antigos.

## Estrutura do projeto apos a instalacao

```
meu-projeto/
├── dist/
│   └── index.js        (codigo gerado pelo Babel)
├── src/
│   └── index.js        (codigo que voce escreve)
├── babel.config.json
├── package.json
└── node_modules/
```

## Quando voce nao precisa instalar o Babel

Frameworks e ferramentas modernas ja cuidam da compilacao internamente. Entender isso evita instalar coisas desnecessarias.

### Next.js

- **Next.js 11 e anteriores**: Babel configurado automaticamente, com suporte a JSX e TypeScript sem nenhuma config adicional.
- **Next.js 12+**: substituiu o Babel pelo **SWC** como compilador padrao — escrito em Rust, ate 17x mais rapido. O Babel so e ativado novamente se voce criar um arquivo `babel.config.js` ou `.babelrc` na raiz do projeto.

### Vite

O Vite usa o **esbuild** por padrao para transpilar JavaScript moderno e TypeScript. Para projetos React, o plugin oficial ja inclui o Babel internamente para o Fast Refresh:

```bash
npm install --save-dev @vitejs/plugin-react
```

Voce nao precisa instalar ou configurar o Babel diretamente. Se precisar de um plugin customizado do Babel, ele pode ser passado dentro do proprio plugin:

```js
// vite.config.js
plugins: [
  react({
    babel: {
      plugins: ['seu-plugin-customizado']
    }
  })
]
```

### React puro (sem framework)

O React sozinho nao vem com nenhum compilador. O **Create React App (CRA)**, que historicamente era a forma oficial de criar projetos React e ja vinha com Babel configurado, foi **descontinuado em 2023**. Hoje o caminho recomendado e usar o **Vite + plugin-react**, que resolve a compilacao sem precisar configurar o Babel manualmente.

### Tabela resumo

| Ferramenta | Compilador padrao | Precisa instalar Babel? |
|---|---|---|
| Next.js 12+ | SWC | Nao |
| Vite + React | esbuild + plugin-react | Nao |
| Projeto manual | Nenhum | Sim, voce configura |

## Resumo

Instalar o Babel exige tres passos: instalar `@babel/core` e `@babel/cli`, instalar um preset como `@babel/preset-env` e criar o arquivo `babel.config.json` apontando o alvo. A partir dai, o comando `babel src --out-dir dist` ja e suficiente para transformar o codigo. Na pratica, frameworks modernos como Next.js e Vite ja abstraem essa configuracao — mas entender o Babel manualmente e o que permite compreender o que essas ferramentas fazem por baixo. As proximas aulas mostram como usar o Babel com JSX e como integra-lo a um bundler.

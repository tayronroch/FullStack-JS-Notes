# 2 - Criando Modulos

## O que significa criar um modulo

Criar um modulo e separar responsabilidades em arquivos diferentes e exportar o que precisa ser reutilizado. Isso deixa o codigo mais organizado e facil de manter.

## Estrutura basica de um modulo

### Exportando funcoes e constantes

```javascript
// utils.js
export function formatarNome(nome) {
  return nome.trim().toLowerCase();
}

export const VERSAO = "1.0.0";
```

### Importando em outro arquivo

```javascript
// main.js
import { formatarNome, VERSAO } from "./utils.js";

console.log(formatarNome("Ana"));
console.log(VERSAO);
```

## Export default

Quando o modulo tem um unico item principal:

```javascript
// logger.js
export default function log(msg) {
  console.log("[LOG]", msg);
}
```

```javascript
// main.js
import log from "./logger.js";
log("OK");
```

## Modulos por responsabilidade

Uma boa pratica e dividir por dominio:

- `api.js` para chamadas de API
- `dom.js` para manipulacao de DOM
- `state.js` para estado da aplicacao

## Funcoes privadas vs compartilhadas

Dentro de um modulo, tudo que **nao e exportado** fica privado ao arquivo. Isso e util para esconder detalhes internos.

```javascript
// math.js
function arredondar(valor) {
  return Math.round(valor);
}

export function calcularTotal(preco, taxa) {
  return arredondar(preco + preco * taxa);
}
```

Neste exemplo, `arredondar` e **privada** e so `calcularTotal` e compartilhada.

### Funcoes compartilhadas (exports)

Para compartilhar, use `export`:

```javascript
// format.js
export function formatarMoeda(valor) {
  return `R$ ${valor.toFixed(2)}`;
}
```

### Organizando o que exporta

Uma boa pratica e exportar apenas o que o modulo realmente precisa expor:

```javascript
// user.js
function validarEmail(email) {
  return email.includes("@");
}

export function criarUsuario(nome, email) {
  if (!validarEmail(email)) return null;
  return { nome, email };
}
```

## Sugestao de estrutura de pastas (HTML, CSS e JS puro)

Exemplo simples e escalavel:

```
meu-projeto/
├─ index.html
└─ assets/
   ├─ css/
   │  └─ styles.css
   └─ js/
      ├─ main.js
      └─ modules/
         ├─ api.js
         ├─ dom.js
         ├─ state.js
         └─ utils.js
```

### Exemplo de `index.html`

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="./assets/css/styles.css" />
    <title>Projeto com Modulos</title>
  </head>
  <body>
    <h1>App</h1>
    <script type="module" src="./assets/js/main.js"></script>
  </body>
</html>
```

### Exemplo de `main.js`

```javascript
import { renderApp } from "./modules/dom.js";
import { carregarDados } from "./modules/api.js";

async function init() {
  const dados = await carregarDados();
  renderApp(dados);
}

init();
```

## Boas praticas ao criar modulos

- Prefira arquivos pequenos e objetivos.
- Evite circular imports.
- Nomeie arquivos pelo que fazem.
- Use `index.js` apenas para exportar um "pacote" de modulos.

## Resumo

Criar modulos e dividir o codigo em arquivos reutilizaveis. Com uma boa estrutura de pastas, seu projeto fica mais limpo e facil de escalar.

## Exercicios avancados (com respostas)

### 1) Criar modulo de calculo

**Enunciado:** Crie um modulo `calc.js` com `somar` e `subtrair`.

**Resposta:**

```javascript
// calc.js
export function somar(a, b) {
  return a + b;
}

export function subtrair(a, b) {
  return a - b;
}
```

### 2) Importar no main

**Enunciado:** Importe `somar` e use em `main.js`.

**Resposta:**

```javascript
import { somar } from "./calc.js";
console.log(somar(2, 3));
```

### 3) Criar modulo DOM

**Enunciado:** Crie `dom.js` com uma funcao `renderTitulo`.

**Resposta:**

```javascript
export function renderTitulo(texto) {
  document.querySelector("h1").textContent = texto;
}
```

## Resumo final em tabela

| Situacao | Exemplo | Observacao |
| --- | --- | --- |
| Criar modulo | `export function x()` | Reutilizavel |
| Importar | `import { x } from "./x.js"` | Caminho relativo |
| Default | `export default` | Um item principal |
| Estrutura | `assets/js/modules` | Separacao por responsabilidade |

# 1 - Modulos ES

## O que sao modulos ES

Modulos ES (ECMAScript Modules) sao o padrao moderno para organizar codigo JavaScript em arquivos reutilizaveis. Eles permitem **importar** e **exportar** funcoes, objetos e variaveis de forma clara.

## Por que usar modulos

- **Organizacao**: separa responsabilidades em arquivos.
- **Reuso**: facilita compartilhar codigo.
- **Escopo isolado**: cada modulo tem seu proprio escopo.
- **Manutencao**: torna o projeto mais legivel e escalavel.

## Como usar em navegadores

Em HTML, use `type="module"`:

```html
<script type="module" src="./main.js"></script>
```

## Exportacao basica

### Export nomeado

```javascript
// math.js
export function somar(a, b) {
  return a + b;
}

export const PI = 3.14;
```

### Import nomeado

```javascript
// main.js
import { somar, PI } from "./math.js";
```

## Export default

```javascript
// user.js
export default function criarUsuario(nome) {
  return { nome };
}
```

```javascript
// main.js
import criarUsuario from "./user.js";
```

## Renomear imports

```javascript
import { somar as somaTotal } from "./math.js";
```

## Importar tudo

```javascript
import * as math from "./math.js";
console.log(math.PI);
```

## Modulos tem escopo proprio

Variaveis de um modulo nao vazam para o escopo global:

```javascript
// a.js
const secreto = 123;
export default secreto;
```

```javascript
// b.js
import segredo from "./a.js";
// secreto nao existe aqui
```

## Importacao dinamica

```javascript
if (condicao) {
  const modulo = await import("./modulo.js");
  modulo.funcao();
}
```

## Diferenca entre ES Modules e CommonJS

- **ESM** usa `import/export`.
- **CommonJS** usa `require/module.exports`.
- ESM e assincrono e suporta tree-shaking.

## Boas praticas

- Use nomes claros de arquivo.
- Evite ciclos de dependencia.
- Prefira exports nomeados quando houver mais de um item.
- Use default quando exportar um unico item principal.

## Resumo

Modulos ES organizam codigo com import/export, isolam escopo e facilitam manutencao. Sao o padrao moderno em navegadores e Node.js.

## Exercicios avancados (com respostas)

### 1) Exportar constante e funcao

**Enunciado:** Crie um modulo que exporta `PI` e `areaCirculo`.

**Resposta:**

```javascript
// area.js
export const PI = 3.14;
export function areaCirculo(r) {
  return PI * r * r;
}
```

### 2) Importar e renomear

**Enunciado:** Importe `areaCirculo` com nome `area`.

**Resposta:**

```javascript
import { areaCirculo as area } from "./area.js";
```

### 3) Export default

**Enunciado:** Crie um export default para `criarUsuario`.

**Resposta:**

```javascript
export default function criarUsuario(nome) {
  return { nome };
}
```

## Resumo final em tabela

| Situacao | Exemplo | Observacao |
| --- | --- | --- |
| Export nomeado | `export function x()` | Import com `{}` |
| Export default | `export default x` | Import sem `{}` |
| Import tudo | `import * as m` | Agrupa exports |
| Import dinamico | `import("./a.js")` | Assincrono |

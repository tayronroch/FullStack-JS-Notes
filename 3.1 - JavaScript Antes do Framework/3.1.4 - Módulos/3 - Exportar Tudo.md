# 3 - Exportar Tudo

## O que significa exportar tudo

Exportar tudo significa **repassar exports** de outros modulos a partir de um unico arquivo, geralmente um `index.js`. Isso cria um **ponto central** de importacao.

## Por que usar

- Simplifica imports.
- Centraliza a API do modulo.
- Facilita manutencao e refatoracao.

## Exportar tudo de um arquivo

```javascript
// math.js
export function somar(a, b) {
  return a + b;
}

export function subtrair(a, b) {
  return a - b;
}
```

```javascript
// index.js
export * from "./math.js";
```

```javascript
// main.js
import { somar, subtrair } from "./index.js";
```

## Exportar tudo de varios arquivos

```javascript
// index.js
export * from "./math.js";
export * from "./string.js";
export * from "./date.js";
```

Agora voce pode importar tudo de um unico lugar.

## Exportar default junto com tudo

`export *` **nao** exporta o default. Para isso, voce precisa reexportar explicitamente:

```javascript
// user.js
export default function criarUsuario(nome) {
  return { nome };
}
```

```javascript
// index.js
export * from "./user.js";
export { default as criarUsuario } from "./user.js";
```

## Reexportar com novo nome

```javascript
// index.js
export { somar as soma } from "./math.js";
```

## Cuidados importantes

- `export *` **nao traz** o `default`.
- Pode gerar **conflitos de nomes** se dois modulos exportarem a mesma coisa.
- Evite ciclos de dependencia (modulo importando e reexportando do mesmo lugar).

## Quando usar exportar tudo

- Em bibliotecas internas.
- Em pastas com varios modulos pequenos.
- Para criar uma API publica limpa.

## Resumo

Exportar tudo cria um ponto central de importacao, reduz a repeticao de caminhos e deixa o codigo mais organizado. Use `export *` com cuidado para evitar conflitos e lembre de reexportar `default` manualmente.

## Exercicios avancados (com respostas)

### 1) Reexportar funcoes de dois modulos

**Enunciado:** Crie um `index.js` que reexporta `math.js` e `string.js`.

**Resposta:**

```javascript
export * from "./math.js";
export * from "./string.js";
```

### 2) Reexportar default

**Enunciado:** Reexporte o default de `user.js` como `criarUsuario`.

**Resposta:**

```javascript
export { default as criarUsuario } from "./user.js";
```

### 3) Evitar conflitos

**Enunciado:** Dois modulos exportam `formatar`. Renomeie um deles no index.

**Resposta:**

```javascript
export { formatar as formatarData } from "./date.js";
export { formatar as formatarTexto } from "./string.js";
```

## Resumo final em tabela

| Situacao | Exemplo | Observacao |
| --- | --- | --- |
| Exportar tudo | `export * from "./a.js"` | Nao exporta default |
| Reexportar default | `export { default as x }` | Necessario manualmente |
| Varios modulos | `export * from "./a"` | Centraliza imports |
| Renomear | `export { x as y }` | Evita conflitos |

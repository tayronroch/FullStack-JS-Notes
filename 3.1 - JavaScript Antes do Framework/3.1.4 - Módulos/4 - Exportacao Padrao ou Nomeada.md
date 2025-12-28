# 4 - Exportacao Padrao ou Nomeada

## O que e exportacao padrao (default)

Exportacao padrao serve quando o modulo tem **um unico item principal**. Ele pode ser importado com qualquer nome.

```javascript
// logger.js
export default function log(msg) {
  console.log("[LOG]", msg);
}
```

```javascript
// main.js
import log from "./logger.js";
```

## O que e exportacao nomeada

Exportacao nomeada permite exportar **varios itens** no mesmo modulo. Na importacao, os nomes precisam corresponder.

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
// main.js
import { somar, subtrair } from "./math.js";
```

## Principais diferencas

- **Default**: um item principal, import sem `{}`.
- **Nomeada**: varios itens, import com `{}`.
- Default pode ser renomeado livremente.

## Renomear imports

```javascript
import { somar as somaTotal } from "./math.js";
```

```javascript
import log from "./logger.js"; // nome livre
```

## Usar default + nomeadas no mesmo arquivo

```javascript
// user.js
export default function criarUsuario(nome) {
  return { nome };
}

export function validarEmail(email) {
  return email.includes("@");
}
```

```javascript
// main.js
import criarUsuario, { validarEmail } from "./user.js";
```

## Boas praticas

- Use **default** quando houver um unico item principal.
- Use **nomeadas** quando houver varios itens.
- Evite misturar sem necessidade para nao confundir.

## Erros comuns

### 1) Importar default como nomeado

```javascript
// errado
import { log } from "./logger.js";
```

### 2) Importar nomeado como default

```javascript
// errado
import somar from "./math.js";
```

## Resumo

Exportacao padrao e ideal para um item principal. Exportacao nomeada e ideal para varios itens. Entender a diferenca evita erros de importacao.

## Exercicios avancados (com respostas)

### 1) Criar modulo com default

**Enunciado:** Exporte uma funcao default `mensagem`.

**Resposta:**

```javascript
export default function mensagem(texto) {
  return texto.toUpperCase();
}
```

### 2) Criar modulo com nomeadas

**Enunciado:** Exporte `somar` e `subtrair` como nomeadas.

**Resposta:**

```javascript
export function somar(a, b) {
  return a + b;
}

export function subtrair(a, b) {
  return a - b;
}
```

### 3) Importar ambos

**Enunciado:** Importe default e nomeada juntos.

**Resposta:**

```javascript
import criarUsuario, { validarEmail } from "./user.js";
```

## Resumo final em tabela

| Situacao | Exemplo | Observacao |
| --- | --- | --- |
| Default | `export default x` | Um item principal |
| Nomeada | `export function x()` | Varios itens |
| Import default | `import x from` | Sem `{}` |
| Import nomeada | `import { x } from` | Com `{}` |

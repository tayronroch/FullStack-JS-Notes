# 7 - Renomeando as Importações

A renomeação na importação (também conhecida como *Import Alias*) é uma das funcionalidades mais utilizadas no dia a dia do desenvolvimento. Ela nos permite mudar o nome de um item assim que o trazemos para o nosso arquivo.

Utilizamos a mesma palavra-chave: **`as`**.

---

## 1. Por que renomear no Import?

Existem três motivos principais para você usar um alias no import:

### ✅ 1. Resolver Conflitos de Nomes
Este é o motivo número 1. Imagine que você tem duas funções com o mesmo nome vindas de lugares diferentes.

```javascript
import { validar } from "./validacoes/email.js";
import { validar } from "./validacoes/senha.js"; // ERRO: Nome duplicado!
```

Para resolver, renomeamos no momento da importação:

```javascript
import { validar as validarEmail } from "./validacoes/email.js";
import { validar as validarSenha } from "./validacoes/senha.js";

validarEmail("teste@email.com");
validarSenha("123456");
```

### ✅ 2. Dar Mais Contexto
Às vezes o nome exportado é muito genérico (ex: `get`, `data`, `config`). Renomear ajuda a saber exatamente do que se trata aquele dado no arquivo atual.

```javascript
import { get as getUser } from "./api/users.js";
import { get as getProduct } from "./api/products.js";
```

### ✅ 3. Melhorar a Legibilidade
Se uma biblioteca exporta uma função com um nome muito longo ou estranho, você pode encurtá-la para facilitar o uso no seu código.

---

## 2. Renomeando com o Import Todo (`*`)

Quando usamos o asterisco para importar tudo de um módulo, somos **obrigados** a dar um nome para esse conjunto (Namespace).

```javascript
// math.js
export const somar = (a, b) => a + b;
export const subtrair = (a, b) => a - b;

// main.js
import * as Calculos from "./math.js";

console.log(Calculos.somar(10, 5));
```

Aqui, `Calculos` funciona como um apelido para todo o arquivo `math.js`.

---

## 3. Misturando Import Default e Nomeado com Alias

Você pode renomear itens nomeados mesmo quando está importando um item default junto.

```javascript
import Usuario, { login as entrar } from "./servicos/auth.js";
```

---

## Exercícios de Fixação

### 1) Resolvendo conflito
**Enunciado:** Você precisa importar a função `render` da biblioteca `React` e uma função `render` da sua própria pasta de `utils`. Como faria os imports?

**Resposta:**
```javascript
import { render } from "react";
import { render as meuRender } from "./utils/render.js";
```

### 2) Usando Namespace
**Enunciado:** Importe todas as exportações do arquivo `constantes.js` em um objeto chamado `Config`.

**Resposta:**
```javascript
import * as Config from "./constantes.js";
```

---

## Resumo Final

- Use `as` para renomear o que entra no seu arquivo.
- Isso é essencial para evitar que nomes de arquivos diferentes "batam de frente" (colisão de nomes).
- Ajuda a deixar o código mais autodocumentado.

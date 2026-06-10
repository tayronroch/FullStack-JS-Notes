# 6 - Renomeando as Exportações

Às vezes, por questões de organização, padronização ou para evitar expor nomes internos complexos, precisamos renomear um item no momento em que ele é exportado do módulo.

Para isso, utilizamos a palavra-chave **`as`** dentro de um bloco de exportação.

---

## 1. Como funciona a renomeação no Export

Diferente da exportação direta na linha da declaração, para renomear precisamos primeiro declarar o item e depois exportá-lo usando um objeto de exportação.

```javascript
// calculos.js
const somaInternaMuitoComplexa = (a, b) => a + b;
const subtracaoInterna = (a, b) => a - b;

// Renomeando para nomes mais simples e públicos
export { 
  somaInternaMuitoComplexa as somar,
  subtracaoInterna as subtrair 
};
```

---

## 2. Por que renomear no Export?

### ✅ Encapsulamento
Você pode usar nomes técnicos e descritivos dentro do seu arquivo (ex: `validarCpfComAlgoritmoX`) e expor para o usuário do módulo um nome mais amigável (ex: `validarCpf`).

### ✅ Padronização de Bibliotecas
Se você está criando uma biblioteca, pode querer que todas as funções sigam um padrão específico (ex: começar sempre com `get...`), mesmo que internamente elas tenham nomes diferentes.

---

## 3. Exemplo Prático: Módulo de Usuário

```javascript
// auth.js
const db_user_auth_check = (user) => { ... };

export { db_user_auth_check as autenticar };
```

Quem for utilizar este módulo, nem saberá que o nome original era `db_user_auth_check`. Eles importarão apenas o nome público:

```javascript
import { autenticar } from "./auth.js";
```

---

## Exercício de Fixação

**Enunciado:** No arquivo `api.js`, você tem uma função chamada `executarRequisicaoHttp`. Exporte-a com o nome público de `enviar`.

**Resposta:**
```javascript
const executarRequisicaoHttp = () => { ... };

export { executarRequisicaoHttp as enviar };
```

---

## Resumo

Renomear na exportação com **`as`** serve para criar uma "casca" pública em cima dos seus nomes internos, melhorando a interface que outros desenvolvedores usarão ao consumir seu código.

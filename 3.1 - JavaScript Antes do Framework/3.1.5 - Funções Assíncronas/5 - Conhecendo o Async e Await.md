# 5 - Conhecendo o Async e Await (Aprofundamento)

Agora que você já entende o que são **Promises** (Aula 4), podemos dominar a forma mais moderna e poderosa de trabalhar com elas: o **Async/Await**. Esta sintaxe é apenas um "açúcar sintático" em cima das Promises, tornando o código muito mais limpo.

---

## 1. De Promise para Async/Await

Observe como transformamos o consumo de uma Promise (usando `.then`) para a sintaxe `async/await`.

### ❌ Usando `.then()` (Antigo)
```javascript
function buscarDados() {
  return new Promise(resolve => setTimeout(() => resolve("Dados OK!"), 1000));
}

buscarDados().then(res => console.log(res));
```

### ✅ Usando `async/await` (Moderno)
```javascript
async function iniciar() {
  const res = await buscarDados(); // Espera a Promise resolver
  console.log(res);
}

iniciar();
```

---

## 2. A regra de ouro: Onde usar o `await`?

Você **só pode usar** o `await` dentro de uma função que tenha a palavra-chave `async` antes dela. Se tentar usar fora, o JavaScript emitirá um erro de sintaxe (exceto em casos especiais como o *Top-level await* em módulos modernos).

```javascript
// ERRO!
// const dados = await buscarDados(); 

// CORRETO
async function main() {
  const dados = await buscarDados();
}
```

---

## 3. Execução Paralela com `Promise.all`

Um erro comum é usar `await` em sequência para tarefas que poderiam rodar ao mesmo tempo, o que torna o app lento.

```javascript
async function carregarLoja() {
  // ❌ Errado: Espera um acabar para começar o outro (Lento)
  // const produtos = await buscarProdutos();
  // const categorias = await buscarCategorias();

  // ✅ Correto: Dispara os dois ao mesmo tempo e espera ambos (Rápido)
  const [produtos, categorias] = await Promise.all([
    buscarProdutos(),
    buscarCategorias()
  ]);
  
  console.log("Loja carregada!");
}
```

---

## 4. Retorno de Valores Assíncronos

Lembre-se: toda função `async` retorna uma **Promise**. Se você retornar um valor simples, o JavaScript o embrulha em uma Promise resolvida automaticamente.

```javascript
async function obterNumero() {
  return 42;
}

// Para pegar o valor, você precisa de outro await ou .then
obterNumero().then(n => console.log(n));
```

---

## Exercícios de Fixação

### 1) Refatoração
**Enunciado:** Transforme o código abaixo para usar `async/await`:
```javascript
obterPreco("iPhone").then(preco => console.log(preco));
```

**Resposta:**
```javascript
async function mostrarPreco() {
  const preco = await obterPreco("iPhone");
  console.log(preco);
}
```

### 2) Várias Promises
**Enunciado:** Você precisa carregar o `Perfil` e as `Fotos` do usuário. Ambas as funções retornam Promises. Como carregar as duas ao mesmo tempo usando `await`?

**Resposta:**
```javascript
const [perfil, fotos] = await Promise.all([buscarPerfil(), buscarFotos()]);
```

---

## Resumo

- O `await` "desembrulha" o valor de uma Promise.
- O código fica com aparência de síncrono, facilitando a leitura.
- Use `Promise.all` com `await` para ganhar performance em tarefas independentes.
- O tratamento de erro ideal é sempre com `try/catch`.

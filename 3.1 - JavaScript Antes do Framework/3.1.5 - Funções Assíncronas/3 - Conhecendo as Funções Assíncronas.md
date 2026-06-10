# 3 - Conhecendo as Funções Assíncronas (Async/Await)

As funções assíncronas, introduzidas no ES2017, são uma forma muito mais elegante e legível de lidar com operações que levam tempo (como buscar dados de uma API ou ler um arquivo). Elas utilizam as palavras-chave `async` e `await`.

---

## 1. O que é uma função `async`?

Ao adicionar a palavra `async` antes de uma função, você está dizendo ao JavaScript que essa função **sempre retornará uma Promise**.

```javascript
async function saudacao() {
  return "Olá, mundo!";
}

// Isso retorna uma Promise resolvida com o valor "Olá, mundo!"
saudacao().then(console.log);
```

---

## 2. A palavra-chave `await`

O `await` só pode ser usado dentro de uma função `async`. Ele faz com que o JavaScript **espere** que uma operação termine antes de seguir para a próxima linha, mas **sem travar o navegador**.

```javascript
// Simulando uma função que demora (Promise)
function buscarDados() {
  return new Promise((resolve) => {
    setTimeout(() => resolve("Dados recebidos!"), 2000);
  });
}

async function executar() {
  console.log("Iniciando busca...");
  
  // O código "para" aqui por 2 segundos, mas o Event Loop continua livre
  const resultado = await buscarDados();
  
  console.log(resultado);
  console.log("Fim da execução.");
}

executar();
```

---

## 3. Tratamento de Erros com try/catch

Diferente dos `callbacks` ou `.then()`, nas funções assíncronas usamos o bloco `try/catch`, que é o padrão do JavaScript para lidar com erros em código síncrono.

```javascript
async function baixarArquivo() {
  try {
    console.log("Baixando...");
    // Simula um erro
    throw new Error("Falha na conexão!"); 
  } catch (error) {
    console.error("Ops! Algo deu errado:", error.message);
  } finally {
    console.log("Processo finalizado.");
  }
}

baixarArquivo();
```

---

## 4. Por que usar Async/Await?

### ❌ Sem Async/Await (Callback Hell / Chaining)
O código começa a "andar para a direita" e fica difícil de ler.
```javascript
buscarUsuario(id)
  .then(user => buscarPosts(user))
  .then(posts => buscarComentarios(posts))
  .catch(err => console.log(err));
```

### ✅ Com Async/Await
O código parece síncrono (uma linha após a outra), o que facilita muito a manutenção.
```javascript
async function carregarTudo(id) {
  try {
    const user = await buscarUsuario(id);
    const posts = await buscarPosts(user);
    const comentarios = await buscarComentarios(posts);
  } catch (err) {
    console.log(err);
  }
}
```

---

## Exercícios de Fixação

### 1) Simulação de Login
**Enunciado:** Crie uma função assíncrona `fazerLogin` que espere 1.5 segundos e retorne "Usuário Logado". Chame essa função e exiba o resultado.

**Resposta:**
```javascript
async function fazerLogin() {
  return new Promise((resolve) => {
    setTimeout(() => resolve("Usuário Logado"), 1500);
  });
}

async function app() {
  const status = await fazerLogin();
  console.log(status);
}

app();
```

### 2) Capturando Erros
**Enunciado:** Como você trataria um erro caso a função `await carregarDados()` falhasse?

**Resposta:** Envolvendo a chamada em um bloco `try { ... } catch (error) { ... }`.

---

## Resumo

- `async`: Transforma a função em assíncrona (retorna Promise).
- `await`: Pausa a execução da função até a Promise ser resolvida.
- `try/catch`: Forma padrão de lidar com erros nestas funções.
- Melhora drasticamente a leitura e manutenção do código.

# JavaScript Assíncrono (Callbacks, Promises, async/await)

Por padrão, o JavaScript é uma linguagem **síncrona**, o que significa que ele executa uma operação de cada vez, em ordem. Se uma tarefa demora muito (ex: carregar um arquivo grande de um servidor), todo o resto para, e a página congela. O JavaScript Assíncrono resolve esse problema.

## O Problema: Sincronicidade

Imagine:

```javascript
console.log("Primeiro");
alert("Isso vai pausar tudo!"); // Nenhuma linha abaixo executa até você clicar em OK
console.log("Terceiro");
```

## 1. Callbacks (O Jeito Antigo)

Um callback é uma função que é passada como argumento para outra função, para ser "chamada de volta" (called back) mais tarde, quando a operação assíncrona terminar.

```javascript
console.log("Início");

setTimeout(function() {
  console.log("Isso executou depois de 2 segundos");
}, 2000);

console.log("Fim");
// Ordem no console: Início, Fim, Isso executou depois de 2 segundos
```

O problema surge quando temos múltiplos callbacks aninhados, criando o famoso **"Callback Hell"**, um código difícil de ler e manter.

## 2. Promises (A Solução Moderna)

Uma `Promise` (Promessa) é um objeto que representa a eventual conclusão (ou falha) de uma operação assíncrona. Ela pode estar em um de três estados:

- **Pending:** Estado inicial, nem cumprida, nem rejeitada.
- **Fulfilled:** A operação foi concluída com sucesso.
- **Rejected:** A operação falhou.

Usamos os métodos `.then()` para lidar com o sucesso e `.catch()` para lidar com a falha.

```javascript
const minhaPromise = new Promise((resolve, reject) => {
  const sucesso = true;
  if (sucesso) {
    resolve("A operação foi um sucesso!");
  } else {
    reject("A operação falhou.");
  }
});

minhaPromise
  .then((resultado) => {
    console.log(resultado); // Executa se a promessa for resolvida
  })
  .catch((erro) => {
    console.error(erro); // Executa se a promessa for rejeitada
  });
```

## 3. `async/await` (A Sintaxe Mais Limpa)

`async/await` é uma forma mais moderna e legível de trabalhar com Promises. É "açúcar sintático" por cima das Promises, o que significa que torna o código mais fácil de escrever e ler.

- **`async`**: A palavra-chave `async` antes de uma função faz com que ela retorne uma Promise.
- **`await`**: A palavra-chave `await` pausa a execução da função `async` até que a Promise seja resolvida ou rejeitada. Só pode ser usada dentro de uma função `async`.

### Exemplo com `fetch`

A API `fetch` é a forma moderna de fazer requisições de rede (como buscar dados de um servidor). Ela retorna uma Promise.

Vamos buscar dados de uma API pública de teste:

```javascript
// Função assíncrona para buscar dados de um usuário
async function buscarUsuario() {
  try {
    // Await pausa a execução até a requisição de rede terminar
    const resposta = await fetch('https://jsonplaceholder.typicode.com/users/1');
    
    // Await pausa novamente até o corpo da resposta ser convertido para JSON
    const dados = await resposta.json();
    
    console.log(dados.name); // Saída: Leanne Graham

  } catch (erro) {
    // Se qualquer um dos 'await' falhar, o erro é capturado aqui
    console.error("Ocorreu um erro ao buscar os dados:", erro);
  }
}

buscarUsuario();
```

Este código é muito mais parecido com o código síncrono que estamos acostumados, tornando-o mais intuitivo e fácil de depurar.

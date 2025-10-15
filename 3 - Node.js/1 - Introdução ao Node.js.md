# 1 - Introdução ao Node.js

## O que é Node.js?

Node.js é um **ambiente de execução de JavaScript do lado do servidor (server-side)**. Em termos simples, ele permite que você execute código JavaScript fora de um navegador.

Até o surgimento do Node.js, o JavaScript era usado quase exclusivamente no front-end (nos navegadores) para manipular páginas web. O Node.js abriu a possibilidade de usar a mesma linguagem para o desenvolvimento do back-end, permitindo a criação de servidores, APIs, ferramentas de linha de comando e muito mais.

## Por que usar Node.js?

- **Linguagem Unificada:** Você pode usar JavaScript tanto no front-end quanto no back-end, o que simplifica o desenvolvimento (Full Stack JavaScript).
- **Alto Desempenho:** É construído sobre o motor V8 do Google Chrome, que é extremamente rápido. Sua arquitetura orientada a eventos e não-bloqueante (non-blocking I/O) o torna ideal para aplicações que precisam lidar com muitas conexões simultâneas (como chats, APIs, etc.).
- **Ecossistema Gigante:** O **NPM (Node Package Manager)** é o maior registro de pacotes de software do mundo. Você pode encontrar bibliotecas prontas para quase qualquer tarefa que imaginar.

## JavaScript no Browser vs. no Node.js

Embora a linguagem seja a mesma, o ambiente é diferente.

| No Browser...                               | No Node.js...                                      |
| ------------------------------------------- | -------------------------------------------------- |
| Tem acesso ao objeto `window` e `document`. | **Não** tem acesso a `window` ou `document` (DOM). |
| Usado para interagir com o usuário.         | Usado para interagir com o sistema.                |
| Lida com eventos do DOM (cliques, etc.).    | Tem acesso a APIs do sistema (arquivos, rede, etc.). |

## Executando seu Primeiro Script

1.  **Crie um arquivo:** Crie um arquivo chamado `app.js`.

2.  **Escreva o código:** Adicione o seguinte código ao arquivo.

    ```javascript
    // app.js
    const saudacao = "Olá, Mundo a partir do Node.js!";
    console.log(saudacao);
    ```

3.  **Execute no terminal:** Abra seu terminal, navegue até a pasta onde você salvou o arquivo e execute o seguinte comando:

    ```bash
    node app.js
    ```

4.  **Resultado:** Você verá a mensagem `Olá, Mundo a partir do Node.js!` impressa no seu terminal.

Parabéns, você executou seu primeiro código JavaScript no back-end com Node.js!

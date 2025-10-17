# 3 - Módulos Nativos Essenciais do Node.js

O Node.js vem com uma biblioteca padrão de módulos incorporados que fornecem funcionalidades essenciais para aplicações de back-end, sem a necessidade de instalar pacotes externos. Vamos conhecer alguns dos mais importantes.

## O Módulo `http`

Este é o módulo fundamental para a criação de servidores web. Ele permite que o Node.js transfira dados sobre o protocolo HTTP (HyperText Transfer Protocol).

### Exemplo: Criando um Servidor Básico

Este código cria um servidor simples que escuta na porta 3000 e responde a todas as requisições com "Olá, Mundo!".

```javascript
// 1. Importa o módulo http
const http = require('http');

// 2. Define a porta em que o servidor vai rodar
const PORTA = 3000;

// 3. Cria o servidor
const servidor = http.createServer((req, res) => {
  // req: objeto de requisição (o que o cliente pede)
  // res: objeto de resposta (o que o servidor devolve)

  res.writeHead(200, { 'Content-Type': 'text/plain' }); // Define o status e o tipo de conteúdo
  res.end('Olá, Mundo!\n'); // Finaliza a resposta, enviando o corpo
});

// 4. Inicia o servidor para escutar na porta definida
servidor.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}/`);
});
```

Para testar, salve o código como `servidor.js` e execute `node servidor.js` no terminal. Depois, acesse `http://localhost:3000` no seu navegador.

## O Módulo `fs` (File System)

O módulo `fs` permite que você interaja com o sistema de arquivos do computador.

### Exemplo: Lendo um Arquivo

O `fs` possui métodos síncronos e assíncronos. A forma assíncrona é quase sempre preferível para não bloquear a execução do programa.

```javascript
const fs = require('fs');

// Leitura assíncrona de um arquivo
fs.readFile('./meu-arquivo.txt', 'utf8', (erro, dados) => {
  if (erro) {
    console.error("Erro ao ler o arquivo:", erro);
    return;
  }
  console.log("Conteúdo do arquivo:", dados);
});

console.log("Isso será impresso antes do conteúdo do arquivo.");
```

## O Módulo `path`

O módulo `path` fornece utilitários para trabalhar com caminhos de arquivos e diretórios. Ele é essencial para garantir que seu código funcione em diferentes sistemas operacionais (Windows, macOS, Linux), que usam separadores de caminho diferentes (`\` vs. `/`).

### Exemplo: Juntando Caminhos

Use `path.join()` para construir caminhos de forma segura.

```javascript
const path = require('path');

const pasta = 'documentos';
const arquivo = 'relatorio.pdf';

// Cria um caminho de forma segura, independente do SO
const caminhoCompleto = path.join(__dirname, pasta, arquivo);

console.log(caminhoCompleto);
// No Linux/macOS: /caminho/do/projeto/documentos/relatorio.pdf
// No Windows: C:\caminho\do\projeto\documentos\relatorio.pdf

// __dirname é uma variável global do Node que contém o caminho do diretório do arquivo atual.
```

## O Módulo `os`

O módulo `os` fornece informações sobre o sistema operacional em que o Node.js está rodando.

```javascript
const os = require('os');

console.log('Plataforma:', os.platform()); // ex: 'linux', 'win32'
console.log('Arquitetura:', os.arch()); // ex: 'x64'
console.log('Número de CPUs:', os.cpus().length);
console.log('Diretório Home:', os.homedir());
```

Estes são apenas alguns dos módulos nativos. Explorá-los permite que você construa aplicações de back-end complexas e robustas diretamente com as ferramentas que o Node.js oferece.


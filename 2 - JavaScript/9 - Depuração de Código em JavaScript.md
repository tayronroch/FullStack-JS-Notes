# Guia de Depuração (Debugging) de Código em JavaScript

Depurar código é a arte de encontrar e consertar erros (bugs). Um código raramente funciona perfeitamente na primeira tentativa. Saber como depurá-lo de forma eficiente é uma das habilidades mais importantes para um desenvolvedor.

## 1. Por que a Depuração é Essencial?

-   **Economiza Tempo:** Tentar adivinhar o erro é lento e frustrante. Ferramentas de depuração mostram exatamente o que está acontecendo.
-   **Entendimento do Código:** Depurar força você a seguir o fluxo de execução do seu código linha por linha, ajudando a entender o que ele realmente faz, não apenas o que você *acha* que ele faz.
-   **Identifica Problemas Lógicos:** Muitos erros não são de sintaxe (que o console geralmente aponta), mas de lógica. O depurador ajuda a encontrar esses problemas.

---

## Método 1: `console.log()` - O Básico Indispensável

Este é o método mais simples e rápido para "inspecionar" o estado do seu código em um determinado ponto.

-   **Uso Principal:** Verificar o valor de uma variável ou confirmar se um trecho de código está sendo executado.

```javascript
function calcularArea(largura, altura) {
  console.log('Valores recebidos:', largura, altura); // Verifica os parâmetros
  
  const area = largura * altura;
  console.log('Área calculada:', area); // Verifica o resultado
  
  return area;
}

calcularArea(10, 5);
```

### Dicas para o `console`:

-   **`console.log({ variavel })`**: Envolver a variável em chaves `{}` mostra tanto o nome da variável quanto o seu valor, facilitando a identificação no console.
-   **`console.warn('Aviso')`**: Mostra uma mensagem de aviso (geralmente em amarelo).
-   **`console.error('Erro grave')`**: Mostra uma mensagem de erro (geralmente em vermelho).
-   **`console.table(arrayOuObjeto)`**: Exibe dados de arrays ou objetos em um formato de tabela, muito mais legível.

```javascript
const usuarios = [
  { nome: 'Ana', idade: 25 },
  { nome: 'Bruno', idade: 30 }
];
console.table(usuarios);
```

---

## Método 2: O Depurador do Navegador (Browser Debugger)

Esta é a ferramenta profissional para depuração. Todos os navegadores modernos (Chrome, Firefox, Edge) possuem um depurador embutido nas "Ferramentas de Desenvolvedor" (geralmente acessado com F12).

### Como Usar:

1.  **Abra as Ferramentas de Desenvolvedor (F12)** e vá para a aba **"Sources"** (Fontes).
2.  Encontre o seu arquivo JavaScript na lista de arquivos.
3.  **Crie um Breakpoint (Ponto de Pausa):** Clique no número da linha onde você quer que a execução do código pause. Um marcador azul aparecerá.

Quando o código for executado e atingir essa linha, a execução será congelada, e você poderá inspecionar tudo.

### A Palavra-chave `debugger;`

Alternativamente, você pode escrever a palavra-chave `debugger;` diretamente no seu código. Se as Ferramentas de Desenvolvedor estiverem abertas, a execução pausará naquela linha como se fosse um breakpoint.

```javascript
function somarArray(arr) {
  let soma = 0;
  for (let i = 0; i < arr.length; i++) {
    soma += arr[i];
    
    // A execução vai pausar aqui a cada iteração do loop
    debugger; 
  }
  return soma;
}
```

### Navegando pelo Código Pausado

Uma vez que a execução está pausada, você pode usar os controles do depurador:

-   **Resume (F8):** Continua a execução até o próximo breakpoint.
-   **Step Over (F10):** Executa a linha atual e pausa na próxima. Se a linha atual for uma chamada de função, ele **não entra** na função, apenas a executa e pausa depois.
-   **Step Into (F11):** Similar ao Step Over, mas se a linha for uma chamada de função, ele **entra** na função, permitindo que você a depure linha por linha.
-   **Step Out (Shift+F11):** Se você entrou em uma função, executa o restante dela e pausa na linha logo após a chamada original.

### Inspecionando o Estado

Com o código pausado, a aba do depurador oferece painéis cruciais:

-   **Scope (Escopo):** Mostra todas as variáveis e seus valores no escopo atual (local e global). É aqui que você verifica se suas variáveis têm os valores que você espera.
-   **Watch (Observar):** Você pode adicionar variáveis ou expressões que deseja monitorar. Elas serão atualizadas a cada passo da depuração.
-   **Call Stack (Pilha de Chamadas):** Mostra a "trilha" de funções que foram chamadas para chegar ao ponto atual. Ajuda a entender como o código chegou ali.

---

## Método 3: `try...catch` para Depuração de Erros

Às vezes, um erro inesperado quebra seu código. Você pode usar um bloco `try...catch` para "capturar" o erro sem quebrar a aplicação, e então inspecionar o objeto de erro.

```javascript
try {
  // Código que pode dar erro
  const usuario = null;
  console.log(usuario.nome); // Isso vai gerar um TypeError
} catch (erro) {
  console.error('Ocorreu um erro, mas a aplicação não quebrou!');
  
  // O objeto 'erro' contém informações valiosas
  console.log('Nome do erro:', erro.name);     // ex: 'TypeError'
  console.log('Mensagem:', erro.message); // ex: 'Cannot read properties of null (reading \'nome\')'
  console.log('Pilha de execução:', erro.stack); // Mostra o caminho do erro no código
}

console.log('O código continua executando...');
```

---

## Dicas Finais

-   **"Depuração do Pato de Borracha":** Tente explicar o seu código e o problema em voz alta para outra pessoa (ou para um pato de borracha). Muitas vezes, o simples ato de verbalizar a lógica ajuda a encontrar o erro.
-   **Isole o Problema:** Se você tem um bug complexo, tente recriá-lo na menor porção de código possível. Isso remove distrações e ajuda a focar na causa raiz.
-   **Sempre Verifique o Console:** Antes de tudo, olhe o console do navegador. Muitos erros de sintaxe e outros problemas comuns são reportados lá.

---

## Técnicas Avançadas de Depuração

Dominar o básico é ótimo, mas essas técnicas avançadas podem acelerar drasticamente seu fluxo de trabalho de depuração.

### 1. Breakpoints Condicionais

Um breakpoint normal pausa a execução *toda vez* que é atingido. Em um loop que executa 1000 vezes, isso é impraticável. Um breakpoint condicional só pausa se uma condição específica for verdadeira.

**Como usar:**
1.  Crie um breakpoint normal.
2.  Clique com o botão direito sobre ele e selecione "Edit breakpoint" (Editar breakpoint).
3.  Insira uma expressão JavaScript que resulte em `true` ou `false`. A execução só pausará quando a expressão for `true`.

**Caso de uso:** Depurar um loop em uma iteração específica.

```javascript
for (let i = 0; i < 1000; i++) {
  // Condição no breakpoint: i === 500
  // O código só vai pausar quando 'i' for exatamente 500.
  console.log('Iteração número:', i);
}
```

### 2. Logpoints (Pontos de Log)

Logpoints são a evolução do `console.log()`. Eles permitem que você envie informações para o console sem precisar modificar seu código-fonte. É como um "breakpoint que não pausa", apenas registra uma mensagem.

**Como usar:**
1.  Clique com o botão direito na margem de uma linha (onde você colocaria um breakpoint).
2.  Selecione "Add logpoint" (Adicionar logpoint).
3.  Digite a mensagem que você quer logar, que pode incluir variáveis do escopo.

**Vantagens:**
-   Seu código-fonte permanece limpo, sem `console.log` temporários.
-   Você não precisa se lembrar de remover os logs depois. Eles vivem apenas nas Ferramentas de Desenvolvedor.

```javascript
// Em vez de adicionar a linha abaixo no seu código:
// console.log('O valor de x é:', x);

// Crie um logpoint na linha seguinte com a expressão: 'O valor de x é:', x
let x = processarValor(); 
```

### 3. Blackboxing de Scripts

Ao depurar, é comum que o depurador entre em código de bibliotecas de terceiros (como React, Vue, jQuery, etc.) que você não escreveu e não quer depurar. O "Blackboxing" resolve isso.

**Como usar:**
1.  Vá para as Configurações (ícone de engrenagem) das Ferramentas de Desenvolvedor.
2.  Encontre a seção "Blackboxing".
3.  Adicione o nome do arquivo ou uma pasta inteira da biblioteca que você deseja ignorar (ex: `jquery.min.js` ou `/node_modules/`).

Agora, quando você usar "Step Into" (F11), o depurador pulará automaticamente qualquer função dentro desses scripts "caixa-preta".

### 4. Análise de Performance (Profiling)

Se o seu problema não é um erro, mas lentidão, a aba **"Performance"** é sua melhor amiga.

**Como usar (visão geral):**
1.  Vá para a aba "Performance".
2.  Clique no botão "Record" (Gravar).
3.  Execute a ação na sua página que está lenta.
4.  Clique em "Stop" (Parar).

O navegador exibirá um "Flame Chart" (gráfico de chama) detalhado, mostrando quais funções levaram mais tempo para executar. Funções com barras longas são as "gargalos" (bottlenecks) e candidatas a otimização.

### 5. Depuração de Código Assíncrono

Depurar código com `Promises`, `async/await` ou `setTimeout` pode ser confuso, pois a pilha de chamadas (Call Stack) tradicional é reiniciada a cada nova "tarefa" no event loop.

**A Solução:**
A maioria dos depuradores modernos tem uma checkbox chamada **"Async"** no painel da Call Stack. Ao ativá-la, o depurador reconstrói uma "pilha de chamadas assíncrona" lógica, mostrando a cadeia de eventos que levou à execução da função atual, mesmo através de limites assíncronos. Isso torna o rastreamento de bugs em código assíncrono imensamente mais fácil.

```javascript

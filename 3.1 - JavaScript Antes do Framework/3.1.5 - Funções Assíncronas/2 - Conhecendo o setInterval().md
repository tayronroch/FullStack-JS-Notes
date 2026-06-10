# 2 - Conhecendo o setInterval()

Enquanto o `setTimeout` executa uma tarefa **uma única vez** após um atraso, o `setInterval()` executa uma função **repetidamente**, a cada intervalo de tempo fixo.

---

## 1. Sintaxe Básica

A sintaxe é idêntica ao `setTimeout`, mas o comportamento é contínuo.

```javascript
setInterval(() => {
  console.log("Isso aparece a cada 2 segundos!");
}, 2000);
```

---

## 2. Parando a Repetição com clearInterval()

Diferente do `setTimeout` (onde o cancelamento é opcional), no `setInterval` o cancelamento é **quase sempre obrigatório** em algum momento. Se você não parar o intervalo, ele continuará rodando para sempre, consumindo memória e processamento.

```javascript
let contador = 0;

const intervalo = setInterval(() => {
  contador++;
  console.log(`Repetição número: ${contador}`);

  if (contador === 5) {
    clearInterval(intervalo);
    console.log("Intervalo parado!");
  }
}, 1000);
```

---

## 3. Aplicação Prática: Relógio Simples

O `setInterval` é perfeito para situações que precisam de atualização constante, como relógios ou cronômetros.

```javascript
function mostrarHora() {
  const agora = new Date();
  const hora = agora.toLocaleTimeString();
  console.log(hora);
}

// Atualiza a hora no console a cada segundo
const timerRelogio = setInterval(mostrarHora, 1000);

// Para o relógio após 10 segundos para não poluir o console
setTimeout(() => clearInterval(timerRelogio), 10000);
```

---

## 4. Exemplo Clássico: Contagem Regressiva de Ano Novo

Este exemplo combina o uso do `setInterval` para a contagem e o `clearInterval` para finalizar com uma mensagem especial.

```javascript
let segundos = 10;

console.log("Contagem regressiva para o Ano Novo!");

const contagem = setInterval(() => {
  if (segundos > 0) {
    console.log(`${segundos}...`);
    segundos--;
  } else {
    console.log("🎆 FELIZ ANO NOVO! 🎆");
    clearInterval(contagem);
  }
}, 1000);
```

---

## 5. Diferença importante: setTimeout vs setInterval

Muitas vezes, desenvolvedores preferem usar um `setTimeout` que chama a si mesmo (recursivo) em vez de `setInterval`.

- **setInterval:** Se a função demorar mais para executar do que o tempo do intervalo, elas podem começar a se "atropelar".
- **setTimeout Recursivo:** Garante que a próxima execução só comece **depois** que a atual terminou, respeitando o tempo de espera entre elas.

---

## 5. Dicas de Ouro

1. **Evite intervalos muito curtos:** Usar intervalos de 1ms ou 10ms pode sobrecarregar o navegador e deixar a interface lenta.
2. **Sempre guarde o ID:** Sempre atribua o `setInterval` a uma variável (ex: `const id = setInterval(...)`) para que você possa pará-lo depois.
3. **Limpeza em Componentes:** Em frameworks como React ou Vue, é vital limpar o intervalo quando o componente é destruído para evitar "vazamentos de memória" (memory leaks).

---

## Exercícios de Fixação

### 1) Contador Regressivo
**Enunciado:** Crie um contador que comece em 10 e diminua de 1 em 1 a cada segundo. Quando chegar a 0, deve exibir "FOGO! 🚀" e parar.

**Resposta:**
```javascript
let tempo = 10;

const contagemRegressiva = setInterval(() => {
  console.log(tempo);
  
  if (tempo === 0) {
    console.log("FOGO! 🚀");
    clearInterval(contagemRegressiva);
  }
  
  tempo--;
}, 1000);
```

### 2) Alerta Repetitivo
**Enunciado:** Como você faria para exibir um alerta no console a cada 5 segundos, mas garantir que ele pare após a 3ª vez?

**Resposta:**
```javascript
let vezes = 0;
const id = setInterval(() => {
  vezes++;
  console.log("Alerta!");
  if (vezes === 3) clearInterval(id);
}, 5000);
```

---

## Resumo

- `setInterval` repete uma tarefa infinitamente a cada X milissegundos.
- Use `clearInterval(id)` para parar a execução.
- Essencial para relógios, contadores e verificações periódicas de dados.
- Cuidado com o acúmulo de tarefas se a função for pesada.

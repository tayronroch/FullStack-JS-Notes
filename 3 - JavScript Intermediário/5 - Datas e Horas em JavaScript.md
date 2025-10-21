# Datas e Horas em JavaScript (O Objeto `Date`)

Lidar com datas e horas é uma das tarefas mais comuns e, surpreendentemente, uma das mais complexas na programação. JavaScript fornece o objeto nativo `Date` como a principal ferramenta para esse trabalho. Embora funcional, ele possui peculiaridades que todo desenvolvedor deve conhecer.

---

## 1. A Natureza do Objeto `Date`

-   **Baseado em Timestamp:** Internamente, um objeto `Date` armazena um único número: a quantidade de milissegundos que se passaram desde a "época UNIX" (UTC de 1º de janeiro de 1970).
-   **Fuso Horário (Timezone):** Por padrão, o `Date` opera no fuso horário do ambiente onde o código está rodando (o navegador do cliente ou o servidor). Isso é uma fonte comum de confusão e bugs.
-   **Mês Baseado em Zero:** A peculiaridade mais famosa: os meses são contados de 0 (Janeiro) a 11 (Dezembro).

---

## 2. Criando Datas (`new Date()`)

Existem quatro maneiras principais de instanciar um objeto `Date`.

### a. Data e Hora Atuais
A forma mais simples, captura o momento exato da sua execução.

```javascript
const agora = new Date();
console.log(agora); // Ex: 2023-10-27T10:30:00.123Z (formato ISO 8601 em UTC)
```

### b. A partir de um Timestamp
Usando o valor em milissegundos desde a época UNIX.

```javascript
const inicioDosTempos = new Date(0);
console.log(inicioDosTempos.toUTCString()); // "Thu, 01 Jan 1970 00:00:00 GMT"
```

### c. A Partir de Strings: A Opção Perigosa

Embora o `Date` possa ser instanciado a partir de uma string, essa é uma das áreas mais problemáticas do JavaScript. O comportamento do "parsing" (análise da string) pode ser drasticamente diferente entre navegadores e ambientes, levando a bugs difíceis de rastrear.

**O ÚNICO FORMATO SEGURO: ISO 8601**

A especificação ECMAScript garante o suporte a uma versão simplificada do formato ISO 8601: `YYYY-MM-DDTHH:mm:ss.sssZ`.

-   `YYYY-MM-DD`: Ano, mês e dia.
-   `T`: Um separador literal que indica o início da seção de tempo.
-   `HH:mm:ss.sss`: Horas, minutos, segundos e milissegundos.
-   `Z`: **Crucial.** Indica que a data/hora está em UTC (Zulu time). Se omitido, ou se um offset como `-03:00` for usado, a data será tratada como local ou com o offset especificado.

```javascript
// SEGURO: Data e hora em UTC. Inequívoco em qualquer ambiente.
const dataUtc = new Date('2025-12-25T12:00:00Z');

// SEGURO: Data e hora com offset de fuso horário.
const dataComOffset = new Date('2025-12-25T09:00:00-03:00'); // 9 da manhã no Brasil (GMT-3)

// dataUtc e dataComOffset representam O MESMO momento no tempo.
console.log(dataUtc.getTime() === dataComOffset.getTime()); // true
```

**Os Formatos Ambíguos (A SEREM EVITADOS)**

> **Nota de Engenharia:** Nunca confie no parsing de strings que não sejam ISO 8601 em uma aplicação. O que funciona na sua máquina pode quebrar na do usuário ou no servidor, dependendo das configurações de localidade.

```javascript
// AMBÍGUO: 10 de Novembro ou 11 de Outubro?
// Depende da localidade do motor JavaScript!
const dataBugada1 = new Date('10-11-2025');

// AMBÍGUO: Funciona em ambientes de língua inglesa, mas pode falhar em outros.
const dataBugada2 = new Date('October 11, 2025');
```

### d. A Partir de Componentes: A Opção Explícita e Segura

Esta é a forma mais robusta de criar uma data específica, pois não há ambiguidade.

`new Date(ano, mesIndex, dia, hora, minuto, segundo, ms)`

**As Especificidades Cruciais:**

1.  **`mesIndex` é Baseado em Zero:** Este é o erro mais comum. **0 é Janeiro, 11 é Dezembro.**
2.  **Valores Mínimos:** Apenas `ano` e `mesIndex` são obrigatórios. `dia` assume o padrão `1`. `hora`, `minuto`, etc., assumem o padrão `0`.
3.  **Fuso Horário Local:** Ao contrário de strings ISO com `Z`, os componentes são interpretados no **fuso horário local do ambiente de execução**.

**Exemplo Detalhado:**

```javascript
// Criando o Natal de 2025, meio-dia.
// Mês 11 = Dezembro.
const natal = new Date(2025, 11, 25, 12, 0, 0);

console.log(natal.toString());
// Se executado no Brasil (GMT-3), a saída será:
// "Wed Dec 25 2025 12:00:00 GMT-0300 (Horário Padrão de Brasília)"

// Criando apenas com ano e mês
const primeiroDeDezembro = new Date(2025, 11);
console.log(primeiroDeDezembro.toString());
// "Mon Dec 01 2025 00:00:00 GMT-0300 (Horário Padrão de Brasília)"
```

**UTC vs. Local na Criação:**

A diferença de fuso horário na criação é fundamental.

```javascript
// Meio-dia de 25/12/2025 no fuso horário LOCAL
const dataLocal = new Date(2025, 11, 25, 12, 0, 0);

// Meio-dia de 25/12/2025 em UTC
const dataUtc = new Date('2025-12-25T12:00:00Z');

// Estes são momentos DIFERENTES no tempo.
console.log(dataLocal.getTime() === dataUtc.getTime()); // false
```
Para criar uma data com componentes em UTC, use o método estático `Date.UTC()`:

```javascript
const timestampUtc = Date.UTC(2025, 11, 25, 12, 0, 0);
const dataCriadaDeUtc = new Date(timestampUtc);

console.log(dataCriadaDeUtc.toISOString()); // "2025-12-25T12:00:00.000Z"
```

---

## 3. Aula 3: Métodos para Trabalhar com Data e Hora

Uma vez que um objeto `Date` é criado, o trabalho real começa: ler, modificar, formatar e calcular. Esta seção cobre os métodos essenciais para essas operações.

### a. Lendo e Modificando Componentes (Getters & Setters)

#### Getters: Lendo os Componentes

Os "getters" são os métodos que leem as partes de uma data. Como detalhado anteriormente, eles existem nas versões de fuso horário local (`getFullYear`, `getMonth`) e UTC (`getUTCFullYear`, `getUTCMonth`). A escolha entre eles é uma das decisões mais críticas ao se trabalhar com datas.

#### Setters: Modificando a Data

Os "setters" modificam a data no local (`in-place`).

-   `setFullYear(ano, [mes], [dia])`
-   `setMonth(mes, [dia])`
-   `setDate(dia)`
-   `setHours(hora, [min], [seg], [ms])`
-   E assim por diante.

**Comportamento de Overflow (Transbordamento):** A característica mais importante dos setters é que eles recalculam a data se você passar valores fora do intervalo normal. Isso pode ser útil, mas também perigoso se não for o que você espera.

```javascript
const data = new Date(2024, 0, 31); // 31 de Janeiro de 2024 (ano bissexto)

// Adicionando 1 mês a 31 de Janeiro.
// Fevereiro não tem 31 dias, então o motor "transborda" para Março.
data.setMonth(data.getMonth() + 1);

// O resultado não é 29 de Fevereiro, mas sim 2 de Março!
// (31 de Jan + 1 mês = 31 de Fev -> 29 de Fev + 2 dias = 2 de Março)
console.log(data.toLocaleDateString('pt-BR')); // "02/03/2024"
```
> **Nota de Engenharia:** O comportamento de overflow é um dos principais motivos para usar bibliotecas como `date-fns` ou `Day.js` para aritmética de datas. Elas oferecem funções como `addMonths()` que têm um comportamento mais previsível e configurável para esses casos extremos.

**Retorno dos Setters:** Os métodos `set` geralmente retornam o timestamp (equivalente a `getTime()`) da data *após* a modificação.

### b. Formatação de Datas: Do Básico ao Profissional

Apresentar datas para o usuário é uma tarefa de UI/UX crucial. O JavaScript nativo oferece duas abordagens.

**1. Métodos de String Legados (Uso Limitado)**

- `toString()`: Formato longo e dependente do ambiente.
- `toDateString()`: Apenas a porção da data.
- `toLocaleDateString()`: Formato de data curto baseado na localidade. **Útil para prototipagem rápida.**
- `toISOString()`: **Essencial para comunicação com APIs.** Retorna o padrão `YYYY-MM-DDTHH:mm:ss.sssZ` em UTC.

**2. A Abordagem Profissional: `Intl.DateTimeFormat`**

Para qualquer aplicação séria, esta é a única ferramenta que você deve usar para formatação de datas.

`new Intl.DateTimeFormat([locales], [options])`

- **`locales`**: Uma string ou array de strings de localidade (ex: `'pt-BR'`, `'en-US'`).
- **`options`**: Um objeto que define quais componentes mostrar e como.

**Principais Opções (`options`):**

| Propriedade | Valores Possíveis | Exemplo (`pt-BR`) |
| :--- | :--- | :--- |
| `dateStyle` | `'full'`, `'long'`, `'medium'`, `'short'` | `'terça-feira, 21 de outubro de 2025'` |
| `timeStyle` | `'full'`, `'long'`, `'medium'`, `'short'` | `'14:30:00 Horário Padrão de Brasília'` |
| `weekday` | `'long'`, `'short'`, `'narrow'` | `'terça-feira'`, `'ter.'`, `'T'` |
| `month` | `'long'`, `'short'`, `'numeric'`, `'2-digit'` | `'outubro'`, `'out.'`, `'10'`, `'10'` |
| `day` | `'numeric'`, `'2-digit'` | `'21'`, `'21'` |
| `year` | `'numeric'`, `'2-digit'` | `'2025'`, `'25'` |
| `hour`, `minute`, `second` | `'numeric'`, `'2-digit'` | `'14'`, `'30'`, `'05'` |
| `timeZone` | Um nome de fuso IANA (ex: `'America/Sao_Paulo'`) | (Aplica o fuso na formatação) |

**Exemplo Prático:**
```javascript
const evento = new Date('2025-10-21T14:30:00Z');

// Formato para um card de evento
const optsCard = { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
const fmtCard = new Intl.DateTimeFormat('pt-BR', optsCard);
console.log(fmtCard.format(evento)); // "out. 21, 11:30"

// Formato para um cabeçalho
const optsHeader = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const fmtHeader = new Intl.DateTimeFormat('pt-BR', optsHeader);
console.log(fmtHeader.format(evento)); // "terça-feira, 21 de outubro de 2025"
```

> **Dica de Performance:** A criação de um `Intl.DateTimeFormat` é relativamente cara. Se você for formatar muitas datas em um loop, crie o formatador **fora** do loop e reutilize a mesma instância.

### c. Manipulação e Cálculos: A Aritmética das Datas

**1. Comparações**

- **CERTO:** Use os operadores `>`, `<`, `>=`, `<=` para comparar se uma data veio antes ou depois de outra. Eles comparam os timestamps internos.
- **ERRADO:** **Nunca use `==` ou `===` para comparar dois objetos `Date`** . Eles comparam a referência do objeto, não seu valor. Duas variáveis `Date` com o mesmo valor de tempo são objetos diferentes e a comparação será `false`.

```javascript
const d1 = new Date(2025, 0, 1);
const d2 = new Date(2025, 0, 1);

console.log(d1 === d2); // false! São objetos diferentes.
console.log(d1.getTime() === d2.getTime()); // true! Os valores internos são iguais.
```

**2. Cálculos Baseados em Timestamps**

A forma mais segura de fazer aritmética é converter as datas para timestamps, calcular e depois, se necessário, converter de volta.

**Exemplo:** Calculando a diferença de dias entre duas datas.

```javascript
function diferencaEmDias(dataFim, dataInicio) {
  const msPorDia = 1000 * 60 * 60 * 24;
  const timestampFim = dataFim.getTime();
  const timestampInicio = dataInicio.getTime();

  const diffMs = timestampFim - timestampInicio;

  return Math.floor(diffMs / msPorDia);
}

const hoje = new Date();
const natal = new Date(hoje.getFullYear(), 11, 25);

console.log(`Faltam ${diferencaEmDias(natal, hoje)} dias para o Natal.`);
```

---

## 4. Aula 4: Modificando Datas e Horas (Os Setters em Detalhe)

Se os "getters" são para leitura, os "setters" são para escrita. E é na escrita que a maioria dos cuidados devem ser tomados.

### a. Mutabilidade: Uma Faca de Dois Gumes

A primeira coisa a entender é que objetos `Date` em JavaScript são **mutáveis**. Isso significa que quando você usa um método `set`, você não está criando uma nova data, mas sim **alterando o objeto original**.

```javascript
const dataOriginal = new Date('2025-01-15T12:00:00Z');
const referencia = dataOriginal; // 'referencia' aponta para o mesmo objeto

referencia.setFullYear(2030);

// O objeto original foi modificado!
console.log(dataOriginal.getFullYear()); // 2030
```
Esse comportamento pode causar bugs difíceis de rastrear em aplicações grandes, onde a mesma instância de data pode ser passada por várias funções.

### b. A Lista de Setters

- `setFullYear(ano, [mes], [dia])`
- `setMonth(mes, [dia])`
- `setDate(dia)`
- `setHours(hora, [min], [seg], [ms])`
- `setMinutes(min, [seg], [ms])`
- `setSeconds(sec, [ms])`
- `setMilliseconds(ms)`
- `setTime(timestamp)`: Este é poderoso. Ele redefine o objeto `Date` inteiro para o valor de um timestamp em milissegundos.
- **Variantes UTC:** Todos os métodos acima (exceto `setTime`) têm uma contraparte UTC: `setUTCFullYear()`, `setUTCMonth()`, etc., que operam sobre os componentes de tempo universal.

### c. Dominando o "Overflow" (Transbordamento)

O recurso mais poderoso e, ao mesmo tempo, perigoso dos setters é o "overflow".

**Adicionando e Subtraindo Tempo:**

```javascript
const hoje = new Date(); // Digamos que seja 21 de Outubro de 2025

// Adicionar 15 dias
hoje.setDate(hoje.getDate() + 15);
console.log(hoje.toLocaleDateString('pt-BR')); // 05/11/2025

// Subtrair 2 meses
hoje.setMonth(hoje.getMonth() - 2);
console.log(hoje.toLocaleDateString('pt-BR')); // 05/09/2025
```

**O Truque do Dia Zero:**

Um dos truques mais úteis é usar o dia `0` para descobrir o último dia do mês anterior.

```javascript
// Qual o último dia de Fevereiro de 2024 (ano bissexto)?
// Vamos para o dia 0 de Março de 2024
const ultimoDiaFevereiro = new Date(2024, 2, 0); // Mês 2 = Março

console.log(ultimoDiaFevereiro.getDate()); // 29
console.log(ultimoDiaFevereiro.toLocaleDateString('pt-BR')); // 29/02/2024
```

### d. Armadilhas de Engenharia

**1. Aritmética de Meses:** Como já mencionado, `setMonth` pode não funcionar como o esperado. Adicionar 1 mês a 31 de Janeiro não resulta em 28/29 de Fevereiro, mas sim no começo de Março. Para lógica de negócios (ex: assinaturas mensais), isso é quase sempre um bug.

**2. Horário de Verão (Daylight Saving Time - DST):** Esta é a maior armadilha. Se você adicionar 24 horas a uma data, pode não cair no mesmo horário do dia seguinte se houver uma mudança de DST no meio.

```javascript
// Exemplo em um país que adota DST (pode variar no seu ambiente)
const antesDoDst = new Date('2023-03-12T01:00:00-05:00'); // 1 da manhã

// Adiciona 24 horas
antesDoDst.setHours(antesDoDst.getHours() + 24);

// O relógio pulou para frente, então o resultado pode ser 3 da manhã, não 2!
console.log(antesDoDst.toString()); // A saída pode ser inesperada
```

### e. O Padrão de Imutabilidade (A Prática Recomendada)

Para evitar os problemas da mutabilidade, a prática recomendada em engenharia de software é tratar objetos `Date` como se fossem imutáveis. Em vez de alterar a data original, crie uma cópia e modifique a cópia.

**Forma Incorreta (Mutável):**
```javascript
function adicionarUmDia(data) {
  data.setDate(data.getDate() + 1); // Modifica o objeto original!
  return data;
}
```

**Forma Correta (Imutável):**
```javascript
function adicionarUmDia(data) {
  const novaData = new Date(data); // 1. Cria uma cópia
  novaData.setDate(novaData.getDate() + 1); // 2. Modifica a cópia
  return novaData; // 3. Retorna a cópia modificada
}

const hoje = new Date();
const amanha = adicionarUmDia(hoje);

console.log(hoje);   // A data de hoje permanece intacta
console.log(amanha); // A nova data é retornada
```
Este padrão torna seu código mais previsível, mais fácil de depurar e previne uma classe inteira de bugs de "efeitos colaterais" (side effects).

## Recomendação Final

O objeto `Date` nativo é a base, mas pode ser complicado.
1.  **Para formatação:** Use **`Intl.DateTimeFormat`** sempre. É o padrão moderno.
2.  **Para manipulação complexa:** (Adicionar/subtrair dias/meses/anos, lidar com fusos horários de forma avançada, parsing de formatos variados), não reinvente a roda. Use bibliotecas consagradas e mantidas pela comunidade, como `date-fns` ou `Day.js`. Elas já resolveram os inúmeros casos extremos e bugs que você encontraria ao tentar fazer manualmente.

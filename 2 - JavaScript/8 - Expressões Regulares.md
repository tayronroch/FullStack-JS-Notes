# Compreendendo Expressões Regulares (RegEx) em JavaScript

Expressões Regulares (ou "RegEx") são padrões usados para encontrar combinações de caracteres em strings. Elas são uma ferramenta extremamente poderosa para validação de dados, busca, extração e substituição de texto.

## 1. Criando uma Expressão Regular

Existem duas maneiras de criar uma RegEx em JavaScript:

**a) Literal:** A forma mais comum. O padrão é colocado entre duas barras `/`.

```javascript
const regexLiteral = /abc/;
```

**b) Construtor:** Usando o construtor `RegExp`. É útil quando o padrão é dinâmico e vem de uma variável.

```javascript
const padrao = 'abc';
const regexConstrutor = new RegExp(padrao);
```

## 2. Métodos Principais com RegEx

Existem métodos tanto na RegEx quanto na String para trabalhar com esses padrões.

-   `regex.test(string)`: O método mais simples. Retorna `true` se encontrar o padrão na string, e `false` caso contrário. É perfeito para validações.

    ```javascript
    const regex = /gato/;
    console.log(regex.test('Eu tenho um gato.')); // true
    console.log(regex.test('Eu tenho um cachorro.')); // false
    ```

-   `regex.exec(string)`: Executa uma busca pela correspondência na string. Retorna um array com informações detalhadas da primeira correspondência (ou `null` se não encontrar).

-   `string.match(regex)`: Similar ao `exec`, mas o comportamento muda com a flag `g` (veja abaixo).

-   `string.search(regex)`: Retorna o índice (posição) da primeira correspondência encontrada na string, ou `-1` se não encontrar.

-   `string.replace(regex, 'novaString')`: Procura pelo padrão e o substitui pela `novaString`.

-   `string.split(regex)`: Divide a string em um array, usando o padrão como delimitador.

## 3. Sintaxe e Padrões Fundamentais

### Metacaracteres Simples

-   `.` (ponto): Corresponde a qualquer caractere, exceto quebra de linha.
-   `\d`: Corresponde a qualquer dígito (0-9). Equivalente a `[0-9]`.
-   `\w`: Corresponde a qualquer caractere alfanumérico (letras, números) e o underscore `_`. Equivalente a `[A-Za-z0-9_]`.
-   `\s`: Corresponde a qualquer caractere de espaço em branco (espaço, tab, quebra de linha).
-   `\D`, `\W`, `\S`: As versões maiúsculas são a negação das minúsculas. `\D` é qualquer caractere que **não** é um dígito, por exemplo.

### Âncoras

-   `^`: Corresponde ao início da string.
-   `$`: Corresponde ao final da string.

```javascript
const regexInicio = /^A/; // A string começa com 'A'?
console.log(regexInicio.test('Ana')); // true
console.log(regexInicio.test('Mariana')); // false

const regexFim = /a$/; // A string termina com 'a'?
console.log(regexFim.test('Ana')); // true
console.log(regexFim.test('Anel')); // false
```

### Quantificadores

Controlam quantas vezes um caractere ou grupo pode aparecer.

-   `*`: Zero ou mais vezes.
-   `+`: Uma ou mais vezes.
-   `?`: Zero ou uma vez (torna o item opcional).
-   `{n}`: Exatamente `n` vezes.
-   `{n,}`: No mínimo `n` vezes.
-   `{n,m}`: No mínimo `n` e no máximo `m` vezes.

```javascript
const regex = /a{2,3}/; // Procura por 'aa' ou 'aaa'
console.log(regex.test('caasa')); // true (encontrou 'aa')
console.log(regex.test('caasaa')); // true (encontrou 'aaa')
console.log(regex.test('casa')); // false
```

### Grupos e Conjuntos

-   `[...]`: Define um conjunto de caracteres permitidos. `[abc]` corresponde a 'a', 'b' ou 'c'.
-   `[^...]`: Um conjunto negado. `[^abc]` corresponde a qualquer caractere que não seja 'a', 'b' ou 'c'.
-   `(...)`: Cria um grupo de captura. Permite aplicar quantificadores a um grupo inteiro ou capturar partes específicas da correspondência.
-   `(a|b)`: Corresponde a 'a' **ou** 'b'.

## 4. Flags (Modificadores)

Flags são adicionadas após a segunda barra no formato literal (ex: `/padrão/g`) ou como segundo argumento do construtor (`new RegExp('padrão', 'g')`).

-   `g` (Global): Não para na primeira correspondência. Encontra todas as correspondências na string.
-   `i` (Case-Insensitive): Ignora a diferença entre maiúsculas e minúsculas.
-   `m` (Multiline): Permite que as âncoras `^` e `$` funcionem no início e fim de cada linha, não apenas da string inteira.

## 5. Exemplo Prático: Validando um Email

```javascript
// Padrão:
// 1. Começa com um ou mais caracteres alfanuméricos (\w+)
// 2. Seguido de um '@'
// 3. Seguido de um ou mais caracteres alfanuméricos (\w+)
// 4. Seguido de um ponto literal (\.)
// 5. Seguido de 2 ou 3 letras ([a-z]{2,3})
// 6. Pode ter um grupo opcional para o final (ex: .br)
const regexEmail = /^\w+@\w+\.[a-z]{2,3}(\.[a-z]{2})?$/i;

function validarEmail(email) {
  if (regexEmail.test(email)) {
    console.log(`'${email}' é um email válido.`);
  } else {
    console.log(`'${email}' NÃO é um email válido.`);
  }
}

validarEmail('teste@email.com');       // válido
validarEmail('teste@email.com.br');    // válido
validarEmail('teste@email');           // NÃO é válido
validarEmail('teste.email.com');       // NÃO é válido
validarEmail('TESTE@EMAIL.COM');       // válido (por causa da flag 'i')
```

## 6. Exemplo Prático: Usando `replace` com Grupos

Grupos de captura `()` são muito úteis com `replace`. Você pode referenciar o texto capturado por cada grupo usando `$1`, `$2`, etc.

```javascript
const data = '2023-10-27'; // Formato AAAA-MM-DD

// Captura 3 grupos: ano, mês e dia
const regexData = /(\d{4})-(\d{2})-(\d{2})/;

// Reorganiza os grupos para o formato DD/MM/AAAA
const dataFormatada = data.replace(regexData, '$3/$2/$1');

console.log(dataFormatada); // "27/10/2023"
```

---

## 7. Tópicos Avançados de RegEx

### Lookarounds (Lookahead e Lookbehind)

Lookarounds são um tipo especial de grupo que verifica a existência de um padrão, mas sem incluí-lo na correspondência final. Eles são "zero-length assertions", ou seja, não consomem caracteres da string.

-   **Positive Lookahead: `(?=...)`**
    -   Verifica se o padrão principal é seguido por `...`.
    -   *Exemplo:* Encontrar o preço de um produto, mas apenas se ele for seguido pelo símbolo de Euro (€).

    ```javascript
    const texto = 'O produto custa 30€, não $30.';
    const regex = /\d+(?=€)/; // Corresponde a dígitos que são seguidos por '€'
    
    const resultado = texto.match(regex);
    console.log(resultado[0]); // "30" (o '€' não faz parte da correspondência)
    ```

-   **Negative Lookahead: `(?!...)`**
    -   Verifica se o padrão principal **não** é seguido por `...`.
    -   *Exemplo:* Encontrar todos os números que **não** são seguidos por "px".

    ```javascript
    const css = 'font-size: 16px; margin: 20; padding: 10px;';
    const regex = /\d+\b(?!px)/g; // \b é uma fronteira de palavra (word boundary)
    
    const resultados = css.match(regex);
    console.log(resultados); // ["20"]
    ```

-   **Positive Lookbehind: `(?<=...)`**
    -   Verifica se o padrão principal é precedido por `...`.
    -   *Exemplo:* Encontrar um número que vem depois do símbolo de dólar ($).

    ```javascript
    const texto = 'O preço é $40.';
    const regex = /(?<=\$)\d+/; // Corresponde a dígitos que são precedidos por '$'
    
    const resultado = texto.match(regex);
    console.log(resultado[0]); // "40"
    ```

-   **Negative Lookbehind: `(?<!...)`**

### Quantificadores Gulosos (Greedy) vs. Preguiçosos (Lazy)

Por padrão, os quantificadores (`*`, `+`, `{}`) são **gulosos (greedy)**: eles tentam corresponder à maior string possível.

```javascript
const html = '<p>Primeiro</p><p>Segundo</p>';
const regexGuloso = /<p>.*<\/p>/; // O '.*' é guloso
console.log(html.match(regexGuloso)[0]); // "<p>Primeiro</p><p>Segundo</p>"
```

Para torná-los **preguiçosos (lazy)**, ou seja, para que correspondam à menor string possível, adicione um `?` após o quantificador.

```javascript
const html = '<p>Primeiro</p><p>Segundo</p>';
const regexPreguicoso = /<p>.*?<\/p>/; // O '.*?' é preguiçoso
console.log(html.match(regexPreguicoso)[0]); // "<p>Primeiro</p>"
```

### Grupos Não-Capturáveis: `(?:...)`

Às vezes, você precisa agrupar uma parte da sua expressão (para aplicar um quantificador, por exemplo), mas não tem interesse em "capturar" o resultado desse grupo para uso posterior (como em um `replace`). Usar um grupo não-capturável pode ser um pouco mais eficiente.

```javascript
const texto = 'telefone-123, celular-456';
// Queremos encontrar 'telefone' ou 'celular' seguido de um hífen
const regex = /(?:telefone|celular)-\d+/g;

// Sem o '?: ', 'telefone' ou 'celular' seria o grupo de captura $1.
// Com '?: ', não há grupos de captura.
console.log(texto.match(regex)); // ["telefone-123", "celular-456"]
```

### Backreferences (Referências Retrógradas): `\1`

Backreferences permitem que você se refira a um grupo capturado anteriormente dentro da mesma expressão regular. `\1` se refere ao primeiro grupo capturado, `\2` ao segundo, e assim por diante.

**Exemplo: Encontrar palavras repetidas**

```javascript
const texto = 'Olá olá mundo, como vai vai você?';
// \b -> fronteira de palavra
// (\w+) -> captura uma ou mais letras/números (grupo 1)
// \s+ -> um ou mais espaços
// \1 -> corresponde exatamente ao que foi capturado no grupo 1
const regex = /\b(\w+)\s+\1\b/gi;

const resultados = texto.match(regex);
console.log(resultados); // ["Olá olá", "vai vai"]
```
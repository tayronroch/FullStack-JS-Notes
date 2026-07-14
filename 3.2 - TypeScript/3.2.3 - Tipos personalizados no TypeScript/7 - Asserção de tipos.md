# Asserção de Tipos (Type Assertion)

Nesta aula, vamos estudar a **Asserção de Tipos** no TypeScript. Esse recurso permite informar manualmente ao compilador qual é o tipo específico de uma variável quando nós, desenvolvedores, temos certeza absoluta sobre ele, mas o TypeScript não consegue inferi-lo automaticamente.

---

## 1. O que é Asserção de Tipos?

Diferente de linguagens como C#, Java ou C++, onde o processo de *Type Casting* (conversão de tipos) pode realizar transformações físicas nos dados em tempo de execução (runtime), no TypeScript a **Asserção de Tipos** é um conceito **puramente de tempo de compilação**.

> [!IMPORTANT]
> A asserção de tipos não altera o valor real em runtime. Ela serve apenas para calar o compilador do TypeScript (dizendo *"confie em mim, eu sei o que estou fazendo"*), mas não impede falhas no navegador se os dados reais forem diferentes.

---

## 2. Sintaxes de Asserção

O TypeScript oferece duas formas sintáticas de declarar uma asserção de tipo:

### A. O Operador `as` (Recomendado)
É a sintaxe mais comum e amplamente aceita no mercado.

```typescript
const elementoHtml = document.getElementById("meu-input") as HTMLInputElement;
elementoHtml.value = "Texto inicial"; // Sem o 'as HTMLInputElement', a propriedade 'value' não existiria
```

### B. Sintaxe de Colchetes Angulares (`<Tipo>`)
Uma forma alternativa que insere o tipo antes do valor.

```typescript
const elementoHtml = <HTMLInputElement>document.getElementById("meu-input");
elementoHtml.value = "Texto inicial";
```

> [!WARNING]
> A sintaxe `<Tipo>` **não deve ser usada** em projetos React ou arquivos `.tsx`, pois entra em conflito direto com as tags JSX (HTML no JavaScript). Por esse motivo, prefira sempre o operador `as`.

---

## 3. Casos de Uso Comuns

### A. Manipulação de Elementos do DOM
Por padrão, métodos como `document.getElementById` retornam o tipo genérico `HTMLElement | null`. Se você sabe que o elemento é um botão ou um input, a asserção permite acessar propriedades específicas desses elementos:

```typescript
const botao = document.getElementById("btn-submit") as HTMLButtonElement;
botao.disabled = true; // 'disabled' é específico de botões
```

### B. Consumindo Dados de APIs ou `JSON.parse`
O método `JSON.parse` retorna o tipo `any`. Para começar a usufruir de segurança de tipos a partir desse ponto, realizamos uma asserção:

```typescript
interface Usuario {
  id: number;
  nome: string;
}

const dadosJson = '{"id": 1, "nome": "Tayron"}';
const usuario = JSON.parse(dadosJson) as Usuario;

console.log(usuario.nome); // Autocompleta corretamente!
```

---

## 4. Regras e Restrições de Asserção

O compilador do TypeScript impede asserções que pareçam impossíveis ou absurdas. Você só pode fazer uma asserção para um tipo que seja **mais específico** ou **menos específico** que o tipo original.

```typescript
const texto = "Olá Mundo";
const numero = texto as number; // ERRO: Conversion of type 'string' to type 'number' may be a mistake...
```

### A Asserção Dupla (Double Assertion)
Se por algum motivo de força maior você precisar forçar uma asserção entre dois tipos completamente incompatíveis, você deve passar primeiro pelo tipo genérico `unknown` ou `any`:

```typescript
const texto = "Olá Mundo";
const numero = (texto as unknown) as number; // Compila sem erros (mas cuidado!)
```

> [!CAUTION]
> A asserção dupla é considerada um **code smell** (indicador de código ruim). Quase sempre indica que o design do seu código está com problemas de tipagem ou que você deveria utilizar *Type Guards* ou validações no runtime (como bibliotecas de schema, ex: Zod).

---

## 5. O Operador de Asserção Não-Nula (`!`)

Quando uma variável pode ser de um tipo ou `null`/`undefined`, você pode usar o caractere `!` ao final dela para afirmar ao TypeScript que o valor **definitivamente não é nulo ou indefinido**.

```typescript
function processarTexto(texto: string | null) {
  // Com o '!', dizemos que texto não é nulo neste ponto
  const tamanho = texto!.length; 
  console.log(tamanho);
}
```

> [!TIP]
> Use o operador `!` com extrema cautela. Se a variável realmente vier nula durante o uso, o código quebrará com um erro clássico do JavaScript: `Cannot read properties of null`. Sempre que possível, prefira o uso de *Optional Chaining* (`texto?.length`) ou verificações condicionais explícitas.

---

## 6. Const Assertions (`as const`)

O `as const` é um tipo especial de asserção introduzido no TypeScript 3.4. Ele é usado para indicar ao compilador que um objeto ou array deve ser tratado de forma **completamente literal e somente leitura (readonly)**.

Ao aplicar `as const`:
1. Strings, números ou booleanos não são ampliados para seus tipos genéricos (ex: `"admin"` não vira `string`, continua `"admin"`).
2. Arrays tornam-se tuplas de leitura (Readonly Tuples).
3. Todas as propriedades de objetos passam a ser `readonly`.

### Exemplo sem `as const`:
```typescript
const config = {
  api: "https://api.exemplo.com",
  tentativas: 3
};
// TypeScript infere: { api: string, tentativas: number }
config.api = "outro-link"; // Permitido!
```

### Exemplo com `as const`:
```typescript
const config = {
  api: "https://api.exemplo.com",
  tentativas: 3
} as const;

// TypeScript infere: { readonly api: "https://api.exemplo.com", readonly tentativas: 3 }
config.api = "outro-link"; // ERRO: Cannot assign to 'api' because it is a read-only property.
```

---

## Resumo e Boas Práticas

1. **Evite abusar:** Asserções mascaram erros do compilador, mas não corrigem bugs reais em runtime.
2. **Priorize Type Guards:** Sempre que os dados forem incertos (ex: APIs), prefira verificar o tipo usando condicionais (`typeof`, `instanceof`) ou validadores como `Zod`.
3. **Use `as const` para objetos de configuração:** Excelente para criar objetos de chaves/valores que servem de referência no sistema e não devem sofrer mutações.

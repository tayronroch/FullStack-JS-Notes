# Generics (Genéricos)

Nesta aula, vamos aprender sobre **Generics** (Genéricos) no TypeScript. Este é um dos recursos mais poderosos e essenciais para a criação de componentes, funções e estruturas de dados reutilizáveis, permitindo flexibilidade de tipos sem abrir mão da segurança (tipo `any`).

---

## 1. O que são Generics?

Em programação, muitas vezes queremos criar funções ou classes que funcionem com diferentes tipos de dados. 

Sem Generics, poderíamos ter a tentação de usar `any`:

```typescript
function retornarDado(dado: any): any {
  return dado;
}

const texto = retornarDado("Olá"); // Retorna 'any'
const numero = retornarDado(10);    // Retorna 'any'
```

O problema de usar `any` é que **perdemos a tipagem**. O TypeScript não sabe mais que `texto` é uma `string` e que `numero` é um `number`.

**Generics** resolvem isso ao permitir passar o tipo como um parâmetro (uma variável de tipo), mantendo a relação de tipo entre o dado de entrada e o de saída:

```typescript
// O <T> indica que a função é genérica. T é a variável de tipo.
function retornarDadoGenerico<T>(dado: T): T {
  return dado;
}

// O TypeScript infere automaticamente o tipo de T com base no argumento passado:
const texto = retornarDadoGenerico("Olá"); // T é inferido como 'string'
const numero = retornarDadoGenerico(10);    // T é inferido como 'number'

// Você também pode definir o tipo explicitamente se necessário:
const outroTexto = retornarDadoGenerico<string>("TypeScript");
```

---

## 2. Generics em Funções

Vamos ver um exemplo real. Imagine uma função que retorna o primeiro elemento de um array (uma função `first`):

```typescript
function obterPrimeiroElemento<T>(lista: T[]): T {
  return lista[0];
}

const primeiroNome = obterPrimeiroElemento(["Ana", "Carlos", "Beatriz"]); 
// O TypeScript sabe que primeiroNome é do tipo 'string'

const primeiroNumero = obterPrimeiroElemento([42, 10, 5]); 
// O TypeScript sabe que primeiroNumero é do tipo 'number'
```

---

## 3. Exemplo Prático: Generics vs. Union Types (Caso useState)

Para entender perfeitamente a diferença entre um tipo fixo com União (Union Types) e um tipo Genérico, vamos analisar uma implementação simplificada da função `useState` (muito comum no React e no desenvolvimento frontend em geral).

### Abordagem com Union Types (Sem Generics)
Imagine declarar a função definindo uma união fixa, por exemplo, aceitando apenas `number | string`:

```typescript
function useState() {
  let state: number | string;

  function get() {
    return state;
  }

  function set(newValue: number | string) {
    state = newValue;
  }

  return { get, set };
}

let newState = useState();
newState.get();          // Retorna 'number | string'
newState.set('Rodrigo'); // Válido
newState.set(123);       // Válido
```

#### Problemas desta abordagem:
1. **Falta de Acoplamento Estrito:** A instância criada não fica "presa" ao tipo inicial. Você pode chamar `.set('Rodrigo')` e logo depois `.set(123)` na mesma instância, o que pode gerar inconsistências de dados se seu código espera apenas um deles.
2. **Escalabilidade Ruim:** Se mais tarde você precisar de um estado do tipo `boolean` ou de um objeto customizado, teria que alterar a assinatura da função `useState` para incluir mais itens na união (`number | string | boolean | ...`), poluindo a função utilitária global.

---

### Abordagem com Generics (Ideal)
Com Generics, a nossa função torna-se totalmente dinâmica. Ela aceita **qualquer** tipo de dado (`T`), mas "tranca" a instância criada para trabalhar estritamente com aquele tipo:

```typescript
function useStateGenerico<T>() {
  let state: T;

  function get(): T {
    return state;
  }

  function set(newValue: T) {
    state = newValue;
  }

  return { get, set };
}

// 1. Criando um estado exclusivamente de STRING
const stateTexto = useStateGenerico<string>();
stateTexto.set("Rodrigo"); // Válido
// stateTexto.set(123);    // ERRO! O compilador bloqueia números aqui.

// 2. Criando um estado exclusivamente de NUMBER
const stateNumero = useStateGenerico<number>();
stateNumero.set(42);       // Válido

// 3. E se você REALMENTE precisar de um estado que misture strings e números?
// Basta passar a união desejada como parâmetro genérico na inicialização!
const stateMisto = useStateGenerico<string | number>();
stateMisto.set("Rodrigo"); // Válido
stateMisto.set(123);       // Válido
```

Com Generics, a decisão de qual tipo o estado deve aceitar é delegada a quem **consome** a função, preservando a segurança e o auto-complete do TypeScript para cada instância.

---

## 4. Generics em Interfaces e Types

Podemos usar genéricos para criar contratos de dados flexíveis. Um caso de uso clássico é padronizar respostas de APIs:

```typescript
interface RespostaApi<T> {
  status: number;
  mensagem: string;
  dados: T; // O tipo de dados muda dependendo de cada rota da API
}

// Interface para um Usuário
interface Usuario {
  id: number;
  nome: string;
}

// Interface para um Produto
interface Produto {
  sku: string;
  preco: number;
}

// Uso da RespostaApi genérica para Usuários
const respostaUsuario: RespostaApi<Usuario> = {
  status: 200,
  mensagem: "Usuário encontrado com sucesso",
  dados: { id: 1, nome: "João" }
};

// Uso da RespostaApi genérica para Produtos
const respostaProduto: RespostaApi<Produto> = {
  status: 200,
  mensagem: "Produto listado",
  dados: { sku: "ABC-123", preco: 99.90 }
};
```

---

## 5. Restrições de Genéricos (Generic Constraints)

Às vezes, não queremos aceitar absolutamente qualquer tipo no genérico. Queremos que o tipo genérico possua propriedades específicas. Para isso, usamos a palavra-chave `extends`.

Imagine que queremos criar uma função para exibir o tamanho (propriedade `length`) de qualquer objeto:

```typescript
interface TemComprimento {
  length: number;
}

// T deve estender a interface TemComprimento
function mostrarComprimento<T extends TemComprimento>(elemento: T): void {
  console.log(`O comprimento é: ${elemento.length}`);
}

mostrarComprimento("Texto grande"); // Válido! (String possui a propriedade length)
mostrarComprimento([1, 2, 3]);       // Válido! (Array possui a propriedade length)
mostrarComprimento({ length: 10, valor: "teste" }); // Válido!

mostrarComprimento(123); // ERRO! Number não possui propriedade length
```

---

## 6. Valor Padrão para Genéricos (Default Generics)

Você também pode fornecer um tipo padrão para o parâmetro genérico, assim como fazemos com parâmetros de funções comuns.

```typescript
interface Caixa<T = string> {
  conteudo: T;
}

const caixaPadrao: Caixa = { conteudo: "Uma string por padrão" }; // T é inferido como string
const caixaNumerica: Caixa<number> = { conteudo: 1234 };           // Sobrescreve T para number
```

---

## 7. Convenção de Nomes para Parâmetros Genéricos

No desenvolvimento de software, a comunidade adotou certas letras padrões para representar tipos genéricos. Embora o compilador do TypeScript aceite qualquer caractere ou palavra, seguir a convenção torna seu código instantaneamente legível por outros programadores:

* **`T` (Type):** A letra mais utilizada e padrão da indústria para representar um tipo genérico geral (ex: `useState<T>`, `Identity<T>`).
* **`U`, `V`, `W`:** Usados quando uma função ou classe possui múltiplos parâmetros genéricos (ex: `function merge<T, U>(a: T, b: U): T & U`).
* **`K` (Key):** Usado para representar **chaves** de um objeto (ex: `keyof T` ou em funções que extraem propriedades `get<T, K extends keyof T>`).
* **`V` (Value):** Usado para representar **valores** associados a uma chave (muito usado em mapas/dicionários, ex: `Map<K, V>`).
* **`E` (Element):** Usado para representar os **elementos** de uma coleção ou array (ex: `Array<E>`).
* **`S` (State):** Comumente usado em bibliotecas de frontend para designar o tipo do **estado** (ex: gerenciamento de estados, Redux, hooks).
* **`R` (Return):** Usado para indicar o tipo de **retorno** de uma função.

### Nomes Completos / Descritivos (Alternativa Moderna)
Em aplicações de grande porte, quando as assinaturas de tipos começam a ficar complexas, recomenda-se usar nomes descritivos começados com a letra `T` maiúscula, para facilitar a distinção entre tipos concretos e genéricos:

```typescript
// Legível e autoexplicativo em sistemas complexos:
interface CacheService<TRecord, TIdentifier> {
  save(id: TIdentifier, data: TRecord): void;
}
```

---

## Resumo e Boas Práticas

1. **Siga a convenção de letras únicas** (`T`, `K`, `V`, `S`) para utilitários simples.
2. **Use prefixos de tipo (`TData`, `TState`)** quando houver múltiplos parâmetros genéricos complexos na mesma estrutura, evitando que o código vire uma "sopa de letrinhas".
3. **Evite excesso de complexidade:** Não use genéricos se o tipo fixo resolver o problema de forma clara. Genéricos devem simplificar a reutilização, e não tornar a assinatura de tipos ilegível.
4. **Segurança em primeiro lugar:** Prefira sempre restringir genéricos com `extends` se você for acessar propriedades internas do argumento genérico.

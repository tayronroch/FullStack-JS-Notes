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

## 3. Generics em Interfaces e Types

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

## 4. Restrições de Genéricos (Generic Constraints)

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

## 5. Valor Padrão para Genéricos (Default Generics)

Você também pode fornecer um tipo padrão para o parâmetro genérico, assim como fazemos com parâmetros de funções comuns.

```typescript
interface Caixa<T = string> {
  conteudo: T;
}

const caixaPadrao: Caixa = { conteudo: "Uma string por padrão" }; // T é inferido como string
const caixaNumerica: Caixa<number> = { conteudo: 1234 };           // Sobrescreve T para number
```

---

## Resumo e Boas Práticas

1. **Use nomes legíveis:** A convenção dita o uso de letras maiúsculas únicas como `T` (Type), `U`, `V`. No entanto, se o genérico tiver um significado muito específico, sinta-se à vontade para usar nomes completos, ex: `<UserType extends Usuario>`.
2. **Evite excesso de complexidade:** Não use genéricos se o tipo fixo resolver o problema de forma clara. Genéricos devem simplificar a reutilização, e não tornar a assinatura de tipos ilegível.
3. **Segurança em primeiro lugar:** Prefira sempre restringir genéricos com `extends` se você for acessar propriedades internas do argumento genérico.

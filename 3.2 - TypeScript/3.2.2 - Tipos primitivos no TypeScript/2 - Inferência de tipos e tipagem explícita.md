# Inferência de Tipos e Tipagem Explícita

Nesta aula, vamos nos aprofundar na mecânica de atribuição de tipos no TypeScript. Embora o TypeScript traga segurança com a tipagem estática, ele foi projetado para não ser excessivamente verboso. Para atingir esse equilíbrio, a linguagem utiliza dois conceitos fundamentais: **Tipagem Explícita (Type Annotations)** e **Inferência de Tipos (Type Inference)**.

---

## 1. Tipagem Explícita (Type Annotations)

A tipagem explícita ocorre quando você, desenvolvedor(a), declara manualmente qual tipo uma variável, parâmetro de função ou retorno de função deve ter. Usamos a sintaxe de dois pontos (`:`) seguida do tipo correspondente.

### Sintaxe Básica:
```typescript
let nome: string = "Tayron";
let idade: number = 28;
let ativo: boolean = true;
```

### Quando a Tipagem Explícita é Altamente Recomendada (ou Obrigatória)?

#### A. Parâmetros de Funções
O TypeScript não consegue adivinhar de forma confiável o que uma função espera receber do mundo externo. Portanto, você deve declarar explicitamente os tipos dos parâmetros.

```typescript
// Sem tipagem explícita, o TS acusará erro (com noImplicitAny ativado)
function saudar(nome: string) {
  return `Olá, ${nome}!`;
}
```

#### B. Variáveis Declaradas sem Valor Inicial
Se você declarar uma variável sem atribuir um valor imediato, o TypeScript não terá pistas para deduzir o tipo. Sem a anotação explícita, ela receberá o tipo `any` (desligando a segurança).

```typescript
// Correto: Tipo declarado explicitamente
let preco: number;

preco = 10.99; // Permitido
preco = "dez"; // Erro: Type 'string' is not assignable to type 'number'.
```

#### C. Retorno de Funções de APIs ou Lógicas Complexas
Embora o TypeScript consiga inferir o retorno da maioria das funções, explicitar o tipo do retorno serve como um **contrato**. Se você alterar a lógica da função acidentalmente e mudar o tipo do retorno, o TypeScript avisará na hora.

```typescript
function somar(a: number, b: number): number {
  return a + b;
}
```

---

## 2. Inferência de Tipos (Type Inference)

A inferência de tipos é a habilidade do TypeScript de deduzir automaticamente o tipo de uma expressão sem que você precise digitá-lo. Isso torna o código mais limpo e próximo do JavaScript puro.

```typescript
let mensagem = "Estou aprendendo TypeScript!";
// O TypeScript infere automaticamente: let mensagem: string
```
Se você tentar reatribuir outro tipo, o validador agirá da mesma forma:
```typescript
mensagem = 123; // Erro: Type 'number' is not assignable to type 'string'.
```

### O Comportamento da Inferência com `let` vs `const`

O compilador do TypeScript analisa se a variável pode ser alterada (`let`) ou se é constante (`const`) para inferir tipos mais amplos ou mais restritos:

```typescript
// 1. Com let: O tipo é inferido de forma ampla (primitivo)
let fruta = "Maçã";
// Tipo inferido: string (pois 'let' pode mudar de valor no futuro)

// 2. Com const: O tipo é inferido de forma literal e restrita
const cor = "Azul";
// Tipo inferido: "Azul" (tipo literal, pois a constante nunca mudará de valor)
```

> [!NOTE]
> Um **Tipo Literal** é um tipo que aceita apenas um valor específico. No exemplo acima, a variável `cor` não é apenas do tipo `string`, seu tipo é literalmente `"Azul"`.

---

## 3. O Perigo do `any` Implícito

Se o TypeScript não consegue inferir o tipo de uma variável e nenhuma tipagem explícita foi fornecida, o compilador recorre ao tipo `any` (que aceita qualquer valor). 

```typescript
let dados; // Tipo inferido implicitamente: any

dados = "Texto"; // OK
dados = 42;      // OK (nenhuma validação de tipo acontece aqui)
```

Para evitar que tipos `any` acidentais enfraqueçam sua base de código, garanta que a flag `noImplicitAny` esteja ativada no seu arquivo `tsconfig.json`.

```json
{
  "compilerOptions": {
    "noImplicitAny": true
  }
}
```
Com isso, o compilador emitirá um erro de compilação sempre que encontrar uma variável ou parâmetro com `any` implícito.

---

## 4. Guia Rápido: Quando usar cada uma?

| Cenário | O que usar? | Exemplo |
| :--- | :--- | :--- |
| Inicializar variável na mesma linha | **Inferência** (Deixe o TS deduzir) | `const total = 100;` |
| Declarar variável para usar depois | **Explícita** | `let resultado: string;` |
| Parâmetros de funções | **Explícita** (Obrigatório) | `(id: number)` |
| Retornos de funções simples | **Inferência** | `function dobro(n: number) { return n * 2; }` |
| Retornos de funções complexas | **Explícita** (Bom para documentação) | `function obterInfo(): UserResponse` |

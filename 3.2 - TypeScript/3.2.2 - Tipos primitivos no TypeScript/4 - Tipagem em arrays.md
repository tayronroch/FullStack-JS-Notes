# Tipagem em Arrays

Nesta aula, vamos aprender como trabalhar com **Arrays** no TypeScript. Como os arrays são uma das estruturas de dados mais utilizadas no desenvolvimento de software, saber como tipá-los corretamente é fundamental para garantir a integridade dos dados e o autocomplete preciso.

---

## 1. Duas Sintaxes de Declaração

O TypeScript oferece duas sintaxes equivalentes para tipar arrays: a sintaxe de colchetes (`type[]`) e a sintaxe genérica (`Array<type>`).

### A. Sintaxe com Colchetes (Recomendada)
É a sintaxe mais comum, limpa e amplamente utilizada pela comunidade.

```typescript
let numeros: number[] = [1, 2, 3, 4, 5];
let nomes: string[] = ["Ana", "Carlos", "Beatriz"];
```

### B. Sintaxe com Generics (`Array<T>`)
Funcionalmente idêntica à sintaxe anterior, mas utiliza a notação de tipos genéricos. Muito comum em bases de código que fazem uso intensivo de Generics ou no desenvolvimento de frameworks.

```typescript
let numeros: Array<number> = [1, 2, 3, 4, 5];
let nomes: Array<string> = ["Ana", "Carlos", "Beatriz"];
```

---

## 2. A Proteção do Compilador em Operações de Array

Ao definir o tipo de um array, o compilador do TypeScript impede que você insira elementos de tipos incompatíveis, protegendo métodos nativos como `.push()`, `.unshift()`, ou reatribuições diretas de índices.

```typescript
let frutas: string[] = ["Maçã", "Banana"];

// O TypeScript impedirá estas operações:
frutas.push(10); // Erro: Argument of type 'number' is not assignable to parameter of type 'string'.
frutas[0] = true; // Erro: Type 'boolean' is not assignable to type 'string'.
```

---

## 3. Inferência de Tipos em Arrays

Se você inicializar um array passando valores na declaração, o TypeScript inferirá o tipo automaticamente:

```typescript
let notas = [8.5, 9.0, 7.5]; // O TypeScript infere como: number[]
```

### O Perigo do Array Vazio Inicial
Ao declarar um array vazio sem tipagem explícita, o TypeScript o inferirá inicialmente como `any[]`. Dependendo da versão e configuração, adicionar itens depois pode fazer o tipo mudar (*evolved array types*), mas declarar explicitamente é a melhor prática para evitar comportamentos inesperados.

```typescript
// Evite:
let listaCompras = []; // Inferido como any[]

// Prefira:
let listaCompras: string[] = []; // Seguro
```

---

## 4. Arrays Multitipo (Union Types em Arrays)

Nem sempre um array conterá apenas um tipo de dado. Se você precisar que um array armazene múltiplos tipos (como strings e números), você pode usar **Union Types** combinados com a tipagem de array.

### Sintaxe:
```typescript
let misto: (string | number)[] = [1, "dois", 3, "quatro"];
// Ou na sintaxe genérica:
let mistoGenerico: Array<string | number> = [1, "dois", 3, "quatro"];
```

> [!CAUTION]
> **Cuidado com os Parênteses!**
> Há uma grande diferença de sintaxe e semântica aqui:
> * `(string | number)[]` representa um **array que pode conter strings e/ou números**.
> * `string | number[]` representa um valor que ou é uma **única string** ou é um **array contendo apenas números**.

---

## 5. Arrays de Somente Leitura (`readonly`)

Caso queira garantir que um array não sofra modificações acidentais após sua criação (imutabilidade), você pode usar a palavra-chave `readonly` ou o tipo `ReadonlyArray`.

Isso desativará todos os métodos modificadores (como `.push()`, `.pop()`, `.splice()`, `.reverse()`, etc.).

```typescript
const numerosImutaveis: readonly number[] = [1, 2, 3];
// Ou: const numerosImutaveis: ReadonlyArray<number> = [1, 2, 3];

numerosImutaveis.push(4); // Erro: Property 'push' does not exist on type 'readonly number[]'.
numerosImutaveis[0] = 10; // Erro: Index signature in type 'readonly number[]' only permits reading.
```

---

## 6. Tuplas (Uma introdução rápida)

Se você precisa de um array com um **número fixo de elementos** e onde **cada posição possui um tipo específico**, você deve usar uma **Tupla**.

```typescript
// Uma tupla que representa coordenadas geográficas [latitude, longitude]
let coordenadas: [number, number] = [-23.55052, -46.633308];

// Uma tupla que representa um registro de usuário [id, nome, ativo]
let usuario: [number, string, boolean] = [1, "Tayron", true];
```
*(Nota: Estudaremos Tuplas em detalhes em uma aula dedicada).*

---

## Resumo

1. Use `tipo[]` (preferencial) ou `Array<tipo>` para declarar arrays homogêneos.
2. Evite inicializar arrays vazios sem anotação explícita para não cair no tipo `any[]`.
3. Use parênteses para arrays com tipos misturados: `(string | number)[]`.
4. Use `readonly` para proteger os dados do array contra alterações acidentais.

# Arrays e Objetos em JavaScript

Para lidar com dados mais complexos e agrupados, JavaScript nos oferece duas estruturas de dados fundamentais: Arrays e Objetos.

## Objetos (Objects)

Um objeto é uma coleção não ordenada de pares **chave-valor**. É ideal para representar uma "coisa" com suas propriedades.

### Criando um Objeto

A forma mais comum é a notação literal.

```javascript
const pessoa = {
  nome: "Ana",
  idade: 28,
  cidade: "São Paulo",
  temHabilitacao: true
};
```

### Acessando Propriedades

Você pode acessar os valores de um objeto usando a notação de ponto (`.`) ou de colchetes (`[]`).

```javascript
// Notação de ponto (mais comum)
console.log(pessoa.nome); // Saída: Ana

// Notação de colchetes (útil para chaves dinâmicas)
console.log(pessoa['idade']); // Saída: 28
```

### Modificando um Objeto

Você pode adicionar novas propriedades ou modificar as existentes.

```javascript
// Modificando uma propriedade
pessoa.idade = 29;

// Adicionando uma nova propriedade
pessoa.profissao = "Desenvolvedora";

console.log(pessoa);
// Saída: { nome: 'Ana', idade: 29, cidade: 'São Paulo', temHabilitacao: true, profissao: 'Desenvolvedora' }
```

## Arrays

Um array é uma coleção **ordenada** de valores. É uma lista onde cada item tem um índice numérico, começando do zero.

### Criando um Array

```javascript
const frutas = ["Maçã", "Banana", "Laranja"];
const numeros = [1, 2, 3, 4, 5];
const misturado = ["Texto", 10, true, { chave: 'valor' }]; // Pode conter tipos diferentes
```

### Acessando Elementos

Os elementos são acessados pelo seu **índice** (posição), que começa em `0`.

```javascript
console.log(frutas[0]); // Saída: Maçã
console.log(frutas[2]); // Saída: Laranja
```

### Propriedades e Métodos Comuns

- **`.length`**: Retorna o número de elementos no array.
  ```javascript
  console.log(frutas.length); // Saída: 3
  ```

- **`.push()`**: Adiciona um ou mais elementos ao **final** do array.
  ```javascript
  frutas.push("Uva");
  console.log(frutas); // Saída: [ 'Maçã', 'Banana', 'Laranja', 'Uva' ]
  ```

- **`.pop()`**: Remove o **último** elemento do array.
  ```javascript
  frutas.pop();
  console.log(frutas); // Saída: [ 'Maçã', 'Banana', 'Laranja' ]
  ```

### Iterando sobre um Array

Você pode percorrer todos os itens de um array usando um loop.

**Usando `for`:**
```javascript
for (let i = 0; i < frutas.length; i++) {
  console.log(frutas[i]);
}
```

**Usando `forEach` (mais moderno):**
```javascript
frutas.forEach(function(fruta) {
  console.log(fruta);
});
```

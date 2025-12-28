# 3 - Shallow e Deep Copy

## O que e shallow copy

Shallow copy e uma **copia rasa**: apenas o primeiro nivel e copiado. Objetos internos continuam compartilhando a **mesma referencia**.

## O que e deep copy

Deep copy e uma **copia profunda**: todos os niveis internos sao copiados, criando estruturas totalmente independentes.

## Diferenca na pratica

```javascript
const original = { perfil: { nome: "Ana" } };
const shallow = { ...original };

shallow.perfil.nome = "Bia";
console.log(original.perfil.nome); // Bia (mesma referencia)
```

```javascript
const original = { perfil: { nome: "Ana" } };
const deep = { ...original, perfil: { ...original.perfil } };

deep.perfil.nome = "Bia";
console.log(original.perfil.nome); // Ana (copia profunda do nivel interno)
```

## Exemplo classico de copia rasa

Mesmo usando spread no objeto externo, o array interno continua como referencia.

```javascript
const htmlCourse = {
  course: "HTML",
  students: [{ name: "Rodrigo", email: "rodrigo@email.com" }],
};

const jsCourse = {
  ...htmlCourse,
  course: "Javascript",
};

// students ainda e referencia, nao copia
jsCourse.students.push({ name: "Joao", email: "joao@email.com" });

console.log(htmlCourse, jsCourse);
```

### Explicacao detalhada

Quando voce faz `const jsCourse = { ...htmlCourse }`, o JavaScript copia apenas o **primeiro nivel** do objeto. Isso significa que a propriedade `students` **aponta para o mesmo array** nas duas variaveis.

Por isso, quando voce executa:

```javascript
jsCourse.students.push({ name: "Joao", email: "joao@email.com" });
```

o array `students` e modificado **no mesmo lugar da memoria**, e as duas variaveis enxergam a alteracao. Ou seja: `htmlCourse.students` e `jsCourse.students` sao o **mesmo array**.

Para evitar essa pegadinha, voce precisa copiar o array interno:

```javascript
const jsCourse = {
  ...htmlCourse,
  course: "Javascript",
  students: [...htmlCourse.students],
};
```

Se os itens dentro de `students` forem objetos e voce tambem quiser isolá-los, e necessario copiar **um nivel a mais**:

```javascript
const jsCourse = {
  ...htmlCourse,
  course: "Javascript",
  students: htmlCourse.students.map((s) => ({ ...s })),
};
```

Para evitar isso, copie o array interno:

```javascript
const jsCourse = {
  ...htmlCourse,
  course: "Javascript",
  students: [...htmlCourse.students],
};
```

## Exemplo de deep copy a partir do mesmo cenario

Aqui fazemos uma copia profunda do curso, garantindo que **o array e os objetos internos** sejam novos:

```javascript
const htmlCourse = {
  course: "HTML",
  students: [{ name: "Rodrigo", email: "rodrigo@email.com" }],
};

const jsCourse = {
  ...htmlCourse,
  course: "Javascript",
  students: htmlCourse.students.map((s) => ({ ...s })),
};

jsCourse.students[0].name = "Joao";

console.log(htmlCourse.students[0].name); // Rodrigo
console.log(jsCourse.students[0].name);   // Joao
```

Nesse exemplo, `students` e cada aluno sao copiados, entao alterar `jsCourse` nao afeta `htmlCourse`.

## Outro modo de deep copy (criando novos itens)

Neste exemplo, voce cria um **novo array** de estudantes e adiciona um novo aluno. Isso evita compartilhar o mesmo array do curso original.

```javascript
const htmlCourse = {
  course: "HTML",
  students: [{ name: "Rodrigo", email: "rodrigo@email.com" }],
};

const jsCourse = {
  ...htmlCourse,
  course: "Javascript",
  students: [
    ...htmlCourse.students,
    { name: "Maria", email: "maria@email.com" },
  ],
};

jsCourse.students.push({ name: "Joao", email: "joao@email.com" });

console.log(htmlCourse, jsCourse);
```

Obs: Esse exemplo copia o **array** e adiciona novos itens. Se voce precisar copiar os objetos internos, combine com `map((s) => ({ ...s }))`.

## Quando usar cada um

- **Shallow copy**: dados simples ou quando voce nao altera niveis internos.
- **Deep copy**: quando voce precisa alterar objetos/arrays internos sem afetar o original.

## Formas de fazer shallow copy

### Objetos

```javascript
const obj = { a: 1, b: 2 };
const copia = { ...obj };
```

### Arrays

```javascript
const arr = [1, 2, 3];
const copia = [...arr];
```

### Object.assign

```javascript
const obj = { a: 1 };
const copia = Object.assign({}, obj);
```

## Formas de fazer deep copy

### 1) Copiar manualmente (recomendado para casos simples)

```javascript
const original = { perfil: { nome: "Ana", idade: 28 } };
const copia = {
  ...original,
  perfil: { ...original.perfil },
};
```

### 2) structuredClone (moderno)

```javascript
const original = { perfil: { nome: "Ana" }, lista: [1, 2] };
const copia = structuredClone(original);
```

Observacao: `structuredClone` funciona bem para objetos, arrays, Map, Set, Date, mas nao copia funcoes.

### 3) JSON.parse(JSON.stringify)

```javascript
const original = { nome: "Ana", idade: 28 };
const copia = JSON.parse(JSON.stringify(original));
```

Limitacoes:

- perde funcoes;
- perde `Date` (vira string);
- perde `undefined`;
- nao suporta `Map`, `Set`, `BigInt`.

## Exemplos praticos do dia a dia

### 1) Atualizar item interno em carrinho

```javascript
const carrinho = [
  { id: 1, produto: { nome: "Mouse", preco: 50 } },
];

const novoCarrinho = carrinho.map((item) => ({
  ...item,
  produto: { ...item.produto, preco: 60 },
}));
```

### 2) Copiar e editar configuracao

```javascript
const config = { tema: { cor: "azul" }, idioma: "pt" };
const novaConfig = {
  ...config,
  tema: { ...config.tema, cor: "verde" },
};
```

## Cuidados e boas praticas

- Shallow copy nao protege objetos internos.
- Deep copy pode ser mais custoso; use apenas quando necessario.
- Para estruturas complexas, prefira copiar somente os caminhos que mudam.
- Documente se a funcao retorna copia rasa ou profunda.

## Erros comuns

### 1) Achar que spread faz deep copy

```javascript
const original = { perfil: { nome: "Ana" } };
const copia = { ...original }; // apenas raso
```

### 2) Usar JSON em dados complexos

```javascript
const original = { data: new Date() };
const copia = JSON.parse(JSON.stringify(original));
console.log(typeof copia.data); // string
```

## Resumo

Shallow copy copia apenas o primeiro nivel; deep copy cria uma copia completa. Escolha com base em quanto do objeto precisa ser independente.

## Exercicios avancados (com respostas)

### 1) Copia rasa de array

**Enunciado:** Crie uma copia rasa de `[1, 2, 3]`.

**Resposta:**

```javascript
const arr = [1, 2, 3];
const copia = [...arr];
```

### 2) Copia profunda de objeto com nested

**Enunciado:** Copie `{ perfil: { nome: "Ana" } }` sem manter referencia interna.

**Resposta:**

```javascript
const original = { perfil: { nome: "Ana" } };
const copia = { ...original, perfil: { ...original.perfil } };
```

### 3) Usar structuredClone

**Enunciado:** Copie um objeto com arrays usando `structuredClone`.

**Resposta:**

```javascript
const original = { itens: [1, 2, 3] };
const copia = structuredClone(original);
```

## Resumo final em tabela

| Situacao | Exemplo | Observacao |
| --- | --- | --- |
| Shallow copy | `{ ...obj }` | Copia 1 nivel |
| Deep copy manual | `{ ...obj, nested: { ...obj.nested } }` | Copia niveis internos |
| structuredClone | `structuredClone(obj)` | Copia profunda moderna |
| JSON stringify | `JSON.parse(JSON.stringify(obj))` | Perde tipos e funcoes |

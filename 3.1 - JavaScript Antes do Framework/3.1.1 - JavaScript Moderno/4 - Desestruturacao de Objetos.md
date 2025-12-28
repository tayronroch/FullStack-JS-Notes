# 4 - Desestruturacao de Objetos

## O que e desestruturacao

Desestruturacao de objetos e uma sintaxe que permite extrair propriedades de um objeto e atribuir em variaveis de forma direta. Em vez de `obj.nome`, voce "abre" o objeto e pega as chaves que precisa.

Ela e muito usada quando:

- as propriedades tem nomes conhecidos;
- voce quer evitar repeticao de `obj.` no codigo;
- precisa renomear ou definir valores padrao.

## Sintaxe basica

```javascript
const usuario = { nome: "Ana", idade: 28, cidade: "SP" };
const { nome, idade, cidade } = usuario;

console.log(nome);   // Ana
console.log(idade);  // 28
console.log(cidade); // SP
```

Leitura mental: "pegue as propriedades `nome`, `idade` e `cidade` do objeto `usuario` e coloque em variaveis com o mesmo nome".

Se a propriedade nao existir, o resultado e `undefined`:

```javascript
const pessoa = { nome: "Leo" };
const { nome, altura } = pessoa;

console.log(altura); // undefined
```

## Renomeando variaveis

Voce pode extrair uma propriedade e dar outro nome a variavel:

```javascript
const produto = { id: 10, descricao: "Teclado" };
const { id: codigo, descricao: nomeProduto } = produto;

console.log(codigo);      // 10
console.log(nomeProduto); // Teclado
```

## Valores padrao

Se a propriedade nao existir, voce pode definir um valor padrao:

```javascript
const config = { tema: "claro" };
const { tema, idioma = "pt-BR" } = config;

console.log(tema);   // claro
console.log(idioma); // pt-BR
```

O padrao so entra quando o valor e `undefined`. Se a propriedade for `null`, o `null` permanece.

## Rest operator (resto do objeto)

O rest operator `...` captura as propriedades restantes em um novo objeto:

```javascript
const aluno = { nome: "Ana", idade: 20, turma: "A", nota: 9 };
const { nome, idade, ...resto } = aluno;

console.log(resto); // { turma: "A", nota: 9 }
```

## Desestruturacao aninhada

Quando o objeto tem objetos internos, voce pode abrir niveis:

```javascript
const pedido = {
  id: 1,
  cliente: { nome: "Ana", cidade: "SP" },
};

const { cliente: { nome, cidade } } = pedido;

console.log(nome);   // Ana
console.log(cidade); // SP
```

## Desestruturacao em parametros de funcao

Muito comum em callbacks e funcoes com muitos dados:

```javascript
function imprimirUsuario({ nome, idade }) {
  console.log(`${nome} tem ${idade} anos`);
}

imprimirUsuario({ nome: "Ana", idade: 28 });
```

Voce pode combinar com valores padrao:

```javascript
function criarConta({ nome, tipo = "padrao", saldo = 0 }) {
  return { nome, tipo, saldo };
}
```

Para evitar erro quando o argumento nao vem, defina um objeto padrao:

```javascript
function criarConta(dados = {}) {
  const { nome, tipo = "padrao", saldo = 0 } = dados;
  return { nome, tipo, saldo };
}
```

## Exemplos praticos do dia a dia

### 1) Resposta de API

```javascript
const resposta = {
  status: "ok",
  data: { id: 1, nome: "Ana" },
};

const { status, data } = resposta;
```

### 2) Configuracoes com padrao

```javascript
function conectar({ host = "localhost", porta = 5432 } = {}) {
  console.log(host, porta);
}
```

### 3) Renomear para evitar conflito

```javascript
const usuario = { nome: "Ana" };
const { nome: nomeUsuario } = usuario;
```

## Cuidados e boas praticas

- Desestruturacao depende de **nomes** das propriedades, nao da ordem.
- Use valores padrao para evitar `undefined`.
- Evite desestruturar muito profundo sem necessidade.
- Se muitas propriedades forem usadas, considere manter o objeto.

## Comparacao rapida com acesso direto

```javascript
const usuario = { nome: "Ana", idade: 28 };

// acesso direto
const nome = usuario.nome;
const idade = usuario.idade;

// com desestruturacao
const { nome: nome2, idade: idade2 } = usuario;
```

Com desestruturacao, o codigo fica mais curto e expressivo, mas depende dos nomes corretos.

## Detalhes avancados

### 1) Rest e spread com objetos aninhados

```javascript
const dados = { id: 1, perfil: { nome: "Ana", idade: 28 }, ativo: true };
const { perfil: { nome, ...restoPerfil }, ...resto } = dados;

console.log(nome);         // Ana
console.log(restoPerfil);  // { idade: 28 }
console.log(resto);        // { id: 1, ativo: true }
```

### 2) Desestruturacao com `for...of` em `Object.entries`

```javascript
const permissoes = { ler: true, escrever: false };

for (const [chave, valor] of Object.entries(permissoes)) {
  console.log(chave, valor);
}
```

### 3) Valores padrao + renomear

```javascript
const config = {};
const { tema: uiTema = "claro" } = config;
```

### 4) `undefined` vs `null`

```javascript
const dados = { nome: null };
const { nome = "Anonimo" } = dados;

console.log(nome); // null
```

### 5) Desestruturacao com propriedades computadas

```javascript
const chave = "email";
const usuario = { email: "a@a.com" };
const { [chave]: valor } = usuario;

console.log(valor); // a@a.com
```

### 6) Armadilhas comuns (pitfalls)

- **Propriedade inexistente**: recebe `undefined`.
- **Erro ao acessar aninhado**: se o caminho nao existir, ocorre erro.
- **Renomear com cuidado**: `const { a: b }` cria `b`, nao `a`.

```javascript
const dados = {};
// const { usuario: { nome } } = dados; // TypeError

const { usuario = {} } = dados;
const { nome } = usuario; // seguro
```

## Resumo

Desestruturacao de objetos deixa o codigo mais direto e reduz repeticao. Ela e ideal para trabalhar com configuracoes, respostas de API e parametros de funcoes. O ponto principal e lembrar que **os nomes das propriedades importam**.

## Exercicios avancados (com respostas)

### 1) Extraindo propriedades com renomear

**Enunciado:** Dado `{ id: 1, nome: "Ana" }`, crie variaveis `codigo` e `nomeUsuario`.

**Resposta:**

```javascript
const dados = { id: 1, nome: "Ana" };
const { id: codigo, nome: nomeUsuario } = dados;
```

### 2) Parametros com default

**Enunciado:** Crie uma funcao que receba `{ host, porta }` com padroes `"localhost"` e `3000`.

**Resposta:**

```javascript
function iniciarServidor({ host = "localhost", porta = 3000 } = {}) {
  return `${host}:${porta}`;
}
```

### 3) Desestruturacao aninhada

**Enunciado:** Extraia `nome` e `cidade` do objeto `cliente` interno.

**Resposta:**

```javascript
const pedido = { cliente: { nome: "Ana", cidade: "SP" } };
const { cliente: { nome, cidade } } = pedido;
```

### 4) Object.entries

**Enunciado:** Imprima `"chave: valor"` para cada propriedade.

**Resposta:**

```javascript
const obj = { a: 1, b: 2 };
for (const [chave, valor] of Object.entries(obj)) {
  console.log(`${chave}: ${valor}`);
}
```

### 5) Protegendo caminho aninhado

**Enunciado:** Extraia `nome` de `usuario`, evitando erro se `usuario` nao existir.

**Resposta:**

```javascript
const dados = {};
const { usuario = {} } = dados;
const { nome } = usuario;
```

## Resumo final em tabela

| Situacao | Exemplo | Observacao |
| --- | --- | --- |
| Basico | `const { a } = { a: 1 }` | Nome da propriedade importa |
| Renomear | `const { a: b } = { a: 1 }` | Variavel criada e `b` |
| Valor padrao | `const { a = 1 } = {}` | So aplica com `undefined` |
| Rest | `const { a, ...r } = obj` | `r` recebe o resto |
| Aninhado | `const { a: { b } } = obj` | Cuidado com caminho inexistente |
| Entries | `for (const [k, v] of Object.entries(obj))` | Loop de pares |

# Diferença entre Type e Interface

Nesta aula, vamos analisar detalhadamente as **diferenças entre `type` (Type Aliases) e `interface`**. Esta é uma das perguntas conceituais mais comuns do universo TypeScript. Embora ambos sirvam para definir a estrutura de objetos e contratos em seu código, eles possuem comportamentos, capacidades e desempenhos distintos.

---

## 1. Comparação Sintática Básica

A primeira diferença visível está na sintaxe de declaração:
* **`type`** exige o sinal de atribuição (`=`).
* **`interface`** é declarada diretamente como um bloco, sem o sinal de `=`.

```typescript
// Sintaxe com Type
type UsuarioType = {
  nome: string;
};

// Sintaxe com Interface
interface UsuarioInterface {
  nome: string;
}
```

---

## 2. Extensão e Composição (Herança)

A forma como estendemos contratos é diferente:

* **Interfaces** utilizam a palavra-chave **`extends`** (sintaxe limpa de herança tradicional de POO).
* **Types** utilizam o operador de **Interseção (`&`)**.

```typescript
// Estendendo com Interface
interface Animal {
  nome: string;
}
interface Gato extends Animal {
  miar(): void;
}

// Estendendo com Type Alias
type Veiculo = {
  marca: string;
};
type Moto = Veiculo & {
  cilindradas: number;
};
```

---

## 3. Mesclagem de Declarações (Declaration Merging)

Esta é a diferença de comportamento mais significativa no dia a dia:

* **Interfaces:** Permitem mesclagem automática. Se você declarar duas interfaces com o mesmo nome no mesmo escopo, o compilador do TypeScript vai juntar as suas propriedades.
* **Types:** São fechados. Tentar criar outro `type` com o mesmo nome gera um erro de compilação imediato.

```typescript
// Interfaces se fundem:
interface Livro {
  titulo: string;
}
interface Livro {
  autor: string;
}
const meuLivro: Livro = { titulo: "Clean Code", autor: "Uncle Bob" }; // OK!

// Types geram erro:
type Filme = { titulo: string };
type Filme = { diretor: string }; // Erro: Duplicate identifier 'Filme'.
```

*Por que isso é útil?* A mesclagem de interfaces permite estender as tipagens de bibliotecas externas (como Express, React, etc.) para adicionar propriedades customizadas a middlewares, requisições ou componentes globais.

---

## 4. O que o `type` faz que a `interface` NÃO consegue fazer?

O `type` é muito mais flexível no que ele pode representar. Uma `interface` é estritamente limitada a descrever **objetos, funções e classes**.

O `type` permite:

### A. Tipar Primitivos
```typescript
type Cpf = string;
```

### B. Criar Union Types
```typescript
type Status = "ativo" | "inativo" | "pendente";
```

### C. Criar Tuplas
```typescript
type Coordenadas = [number, number];
```

---

## 5. Performance de Compilação

Em bases de código muito grandes (centenas de milhares de linhas de código), o TypeScript compila projetos baseados em **`interface`** de forma ligeiramente mais rápida do que projetos baseados em **`type` com interseções (`&`)**.

* **Por que?** O compilador cria um índice interno de propriedades para interfaces (`extends`) e consegue fazer o cache desses tipos na memória com facilidade. Com interseções (`&`), o TypeScript é obrigado a calcular a fusão recursivamente a cada checagem, consumindo mais CPU do computador.

---

## Tabela Comparativa Resumida

| Recurso | `interface` | `type` (Type Alias) |
| :--- | :---: | :---: |
| Descrever Objetos | Sim | Sim |
| Descrever Funções | Sim | Sim |
| Estender outro tipo | Sim (`extends`) | Sim (`&`) |
| Tipar Primitivos diretamente | Não | Sim |
| Criar Union Types (`|`) | Não | Sim |
| Declarar Tuplas | Não | Sim |
| Mesclagem Automática (Merging) | Sim | Não |
| Performance em grandes builds | Ligeiramente melhor | Ligeiramente inferior |

---

## Resumo (Qual usar?)

1. **Use `interface`** por padrão para descrever objetos comuns da sua aplicação, contratos de APIs ou classes.
2. **Use `type`** quando precisar criar Uniões de tipos literais, tuplas, tipos utilitários ou quando precisar mapear primitivos.

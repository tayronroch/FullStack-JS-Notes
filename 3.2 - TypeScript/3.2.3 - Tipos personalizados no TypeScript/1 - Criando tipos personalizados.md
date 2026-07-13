# Criando Tipos Personalizados (Type Aliases e Interfaces)

Nesta aula, vamos aprender como criar os nossos próprios tipos no TypeScript. À medida que os aplicativos crescem, os tipos primitivos não são suficientes para descrever estruturas de dados complexas de negócios (como usuários, produtos, pedidos, etc.). Para modelar essas estruturas de forma clara e reutilizável, o TypeScript oferece duas ferramentas poderosas: **Type Aliases** e **Interfaces**.

---

## 1. Type Aliases (`type`)

Um **Type Alias** (Alias de Tipo) cria um novo nome (apelido) para qualquer tipo existente. Ele é declarado usando a palavra-chave `type`.

### Sintaxe Básica:
```typescript
type ID = string | number; // Alias para um Union Type
type Usuario = {           // Alias para um objeto
  nome: string;
  email: string;
};

const userId: ID = "usr_123";
const cliente: Usuario = { nome: "Tayron", email: "tayron@email.com" };
```

Os Type Aliases são muito flexíveis e podem representar objetos, primitivos, uniões de tipos, tuplas e funções.

---

## 2. Interfaces (`interface`)

Uma **Interface** é outra maneira de definir a estrutura de um objeto (ou de uma função/classe). É uma declaração de contrato que descreve a "forma" que o objeto deve ter.

### Sintaxe Básica:
```typescript
interface Livro {
  titulo: string;
  autor: string;
  paginas: number;
}

const meuLivro: Livro = {
  titulo: "Código Limpo",
  autor: "Robert C. Martin",
  paginas: 425
};
```

---

## 3. Principais Diferenças: `type` vs `interface`

Embora ambos possam ser usados para tipar objetos e tenham comportamentos parecidos na maioria dos cenários diários, eles possuem diferenças fundamentais importantes:

### A. Herança e Extensão
* **Interfaces** estendem outras interfaces usando a palavra-chave **`extends`**.
* **Type Aliases** estendem outros tipos usando o operador de **Interseção (`&`)**.

```typescript
// Extensão com Interface
interface Animal {
  nome: string;
}

interface Cachorro extends Animal {
  raca: string;
}

// Extensão com Type (Interseção)
type Veiculo = {
  marca: string;
};

type Carro = Veiculo & {
  portas: number;
};
```

### B. Mesclagem de Declarações (Declaration Merging)
Esta é a maior diferença prática:
* **Interfaces** com o mesmo nome no mesmo escopo são **automaticamente mescladas** pelo compilador.
* **Type Aliases** com o mesmo nome geram um **erro de nome duplicado**.

```typescript
// Mesclagem de Interfaces: Válido e comum em bibliotecas de terceiros
interface Janela {
  largura: number;
}
interface Janela {
  altura: number;
}

const windowSize: Janela = { largura: 1920, altura: 1080 }; // Funciona!

// Com Type Alias:
type Botao = { cor: string };
type Botao = { tamanho: number }; // Erro: Duplicate identifier 'Botao'.
```

### C. Flexibilidade de Tipagem
* **Type Aliases** podem descrever tipos não-objeto (como uniões de tipos literais, tuplas e tipos primitivos mapeados).
* **Interfaces** são estritamente limitadas a descrever objetos, funções e classes.

```typescript
type CorFavorita = "azul" | "verde" | "preto"; // Permitido apenas com type
```

---

## 4. Guia Rápido: Qual escolher?

A própria documentação oficial do TypeScript recomenda uma regra geral muito simples:

> [!TIP]
> **Use `interface` por padrão** sempre que estiver modelando a estrutura de um objeto, contratos de classes ou APIs públicas, pois elas oferecem melhor legibilidade, suporte a herança limpa (`extends`) e melhor performance de compilação.
>
> **Use `type`** quando precisar de recursos específicos como **Union Types**, **Tuplas**, **aliases de primitivos** ou quando precisar realizar **operações avançadas de tipo** (como Mapped Types).

---

## Resumo

* **Type Aliases (`type`)** criam apelidos para qualquer tipo existente e estendem usando interseção (`&`).
* **Interfaces (`interface`)** criam contratos de estrutura para objetos e classes, estendendo com `extends`.
* Interfaces suportam **Declaration Merging** (mesclagem automática de declarações com o mesmo nome).
* Use `interface` para objetos e classes; use `type` para uniões, primitivos e estruturas avançadas.

# Pick

Nesta aula, vamos aprender sobre o utility type **`Pick<T, Keys>`**. Ele nos permite criar um novo tipo selecionando apenas um conjunto específico de propriedades (chaves) de um tipo ou interface existente.

---

## 1. O que é o `Pick<T, Keys>`?

O `Pick<T, Keys>` permite "garimpar" ou "escolher a dedo" quais propriedades de um tipo `T` queremos aproveitar. O segundo argumento (`Keys`) deve ser uma chave única ou uma união de chaves (separadas por `|`) que pertencem a `T`.

### Por que usar `Pick` em vez de criar uma nova Interface/Type?

Usar `Pick` traz duas grandes vantagens cruciais em projetos reais:

1. **Evita Duplicação de Código (DRY - Don't Repeat Yourself)**: 
   Sem o `Pick`, se você precisasse de uma versão resumida de um usuário apenas com `name` e `email`, você provavelmente criaria uma nova interface manual:
   ```typescript
   interface UserContactInfo {
     name: string;
     email: string;
   }
   ```
   Com o `Pick`, você reutiliza a interface principal `User` e diz: *"Quero uma tipagem com as chaves 'name' e 'email' do `User`"*:
   ```typescript
   type UserContactInfo = Pick<User, "name" | "email">;
   ```

2. **Segurança em Refatorações (Single Source of Truth / Fonte Única da Verdade)**:
   Se amanhã o tipo do campo `name` mudar de `string` para um objeto estruturado (ex: `{ first: string; last: string }`):
   * **Sem `Pick`:** Você teria que caçar manualmente todas as outras interfaces duplicadas (`UserContactInfo`, `UserSummary`, etc.) e atualizar o tipo do `name` em cada uma delas.
   * **Com `Pick`:** Você altera apenas na interface original `User`. Como o `Pick` aponta diretamente para o tipo de `User`, todas as tipagens derivadas são **atualizadas automaticamente** em cascata!

3. **Uso Inline (Sem necessidade de criar novos nomes de tipos)**:
   Muitas vezes você não quer criar um novo apelido (`type NovoTipo = ...`) apenas para uma função. Você pode usar o `Pick` diretamente inline onde define a tipagem:
   ```typescript
   function enviarEmail(destinatario: Pick<User, "name" | "email">) {
     // ...
   }
   ```

---

## 2. Por baixo dos panos (Under the hood)

A assinatura interna do `Pick` no TypeScript é definida assim:

```typescript
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```
* **`K extends keyof T`:** Garante que a união de chaves `K` que estamos tentando escolher de fato existe dentro das propriedades de `T`. Se tentarmos escolher uma chave inexistente, o TypeScript gerará um erro.
* **`[P in K]`:** Percorre apenas as chaves fornecidas no conjunto `K`.
* **`T[P]`:** Copia os tipos originais dessas propriedades.

---

## 3. Exemplos Práticos

### Exemplo 1: Declaração de Objeto com Pick (Caso de Uso Simples)

O exemplo mais básico é criar um tipo contendo apenas os campos necessários para uma determinada ação ou exibição.

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
  registeredAt: Date;
}

// Criando um tipo apenas com nome e email a partir de User
type UserContactInfo = Pick<User, "name" | "email">;

const contact: UserContactInfo = {
  name: "Rodrigo",
  email: "rodrigo@email.com"
  // id, isAdmin, registeredAt não podem ser inseridos aqui!
};
```

---

### Exemplo 2: Exibindo Informações Simplificadas no Frontend

Imagine que sua aplicação tem uma interface `Produto` com dados detalhados e pesados para a página de detalhes, mas em uma página de listagem você precisa apenas desenhar um card básico com foto, título e preço.

```typescript
interface Produto {
  id: string;
  titulo: string;
  preco: number;
  descricao: string;
  categoria: string;
  imagemUrl: string;
  estoque: number;
  avaliacoes: number[];
}

// Criamos um tipo otimizado para o card de listagem
type CardProdutoInfo = Pick<Produto, "titulo" | "preco" | "imagemUrl">;

const cardProduto: CardProdutoInfo = {
  titulo: "Teclado Mecânico RGB",
  preco: 299.90,
  imagemUrl: "https://imagens.com/teclado.jpg"
};
```

---

### Exemplo 3: Passando Argumentos em Funções Auxiliares

Em vez de passar o objeto completo para funções que fazem apenas tarefas simples, podemos limitar a entrada da função usando `Pick`.

```typescript
interface Artigo {
  id: string;
  titulo: string;
  conteudo: string;
  autor: string;
  visualizacoes: number;
  tags: string[];
}

// Função que só precisa do id e do título para gerar o link do artigo
function gerarLinkDoArtigo(artigo: Pick<Artigo, "id" | "titulo">): string {
  const slug = artigo.titulo.toLowerCase().replace(/ /g, "-");
  return `/artigos/${artigo.id}-${slug}`;
}

const artigoCompleto: Artigo = {
  id: "art_991",
  titulo: "Como usar TypeScript",
  conteudo: "Conteúdo longo aqui...",
  autor: "Taylor",
  visualizacoes: 1540,
  tags: ["typescript", "js"]
};

// Válido! Passamos o artigo completo e o TS extrai apenas o que o Pick exige
const link = gerarLinkDoArtigo(artigoCompleto);
console.log(link); // "/artigos/art_991-como-usar-typescript"
```

---

## 4. Diferença Crucial: Pick vs Omit

* O **`Pick`** é focado em **incluir** propriedades. É a melhor escolha quando você quer poucas chaves de um tipo grande.
* O **`Omit`** (que veremos na sequência) é focado em **excluir** propriedades. É a melhor escolha quando você quer quase todas as chaves, exceto uma ou duas.

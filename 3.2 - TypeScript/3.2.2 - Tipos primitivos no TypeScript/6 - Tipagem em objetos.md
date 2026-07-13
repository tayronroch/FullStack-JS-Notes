# Tipagem em Objetos

Nesta aula, vamos aprender como tipar **Objetos** no TypeScript. No JavaScript, os objetos são a forma principal de agrupar e passar dados. No TypeScript, podemos definir contratos rígidos sobre quais propriedades um objeto possui, quais são obrigatórias, opcionais ou de somente leitura.

---

## 1. Tipagem Inline (Inline Types)

A forma mais direta de tipar um objeto é declarar a sua estrutura logo após a declaração da variável.

```typescript
const usuario: { nome: string; idade: number; ativo: boolean } = {
  nome: "Tayron",
  idade: 28,
  ativo: true
};
```
Com essa definição, o compilador do TypeScript garante dois fatores:
* **Exatidão de Propriedades:** Você não pode omitir propriedades obrigatórias e nem adicionar propriedades que não foram declaradas.
* **Segurança de Tipo:** Cada propriedade deve possuir exatamente o tipo correspondente.

```typescript
// O TypeScript bloqueará estas operações:
usuario.nome = 123; // Erro: Type 'number' is not assignable to type 'string'.
usuario.endereco = "Rua A"; // Erro: Property 'endereco' does not exist...
```

---

## 2. Propriedades Opcionais (`?`)

Nem todas as propriedades de um objeto são obrigatórias em todos os momentos. Para tornar uma propriedade opcional, usamos o ponto de interrogação (`?`).

```typescript
let produto: {
  nome: string;
  preco: number;
  descricao?: string; // Propriedade opcional
};

// Válido (sem descrição):
produto = {
  nome: "Teclado Mecânico",
  preco: 299.90
};

// Válido (com descrição):
produto = {
  nome: "Mouse Gamer",
  preco: 150.00,
  descricao: "Mouse com 16000 DPI"
};
```

> [!WARNING]
> Ao ler uma propriedade opcional, o TypeScript lembrará você de que o valor dela pode ser `undefined`. Use o operador de encadeamento opcional (`?.`) ou verificações condicionais para evitar erros em tempo de execução.
> ```typescript
> console.log(produto.descricao?.toUpperCase());
> ```

---

## 3. Propriedades de Somente Leitura (`readonly`)

Você pode marcar propriedades de um objeto para que elas não possam ser alteradas após o objeto ter sido criado. Para isso, usamos a palavra-chave `readonly` antes do nome da propriedade.

```typescript
const configuracao: {
  readonly porta: number;
  url: string;
} = {
  porta: 3000,
  url: "localhost"
};

configuracao.url = "api.meusite.com"; // Permitido (propriedade comum)
configuracao.porta = 8080; // Erro: Cannot assign to 'porta' because it is a read-only property.
```

---

## 4. Reutilizando Estruturas com `type` (Type Alias)

Escrever tipos inline para objetos deixa o código poluído e difícil de manter se você precisar usar a mesma estrutura em vários lugares do seu projeto. A melhor prática é definir a estrutura uma vez usando a palavra-chave `type` (Alias de Tipo) e depois reutilizá-la.

```typescript
// Criando a definição do tipo (Contrato)
type Endereco = {
  rua: string;
  numero: number;
  bairro: string;
  cidade: string;
};

// Utilizando o tipo em múltiplos objetos
const enderecoResidencial: Endereco = {
  rua: "Av. Paulista",
  numero: 1000,
  bairro: "Bela Vista",
  cidade: "São Paulo"
};

const enderecoComercial: Endereco = {
  rua: "Faria Lima",
  numero: 500,
  bairro: "Itaim Bibi",
  cidade: "São Paulo"
};
```

---

## 5. Propriedades Dinâmicas (Index Signatures)

Às vezes, você não sabe o nome exato de todas as propriedades que um objeto terá, mas sabe o formato geral delas. Por exemplo, um objeto de dicionário ou cache de dados.

Podemos tipar isso usando uma **assinatura de índice** (`[key: tipo]: tipo`):

```typescript
// Um dicionário onde as chaves são strings e os valores são strings
type DicionarioSinonimos = {
  [palavra: string]: string;
};

const sinonimos: DicionarioSinonimos = {
  bonito: "belo",
  rapido: "veloz",
  feliz: "contente"
};

sinonimos.triste = "melancólico"; // Permitido dinamicamente
sinonimos.quantidade = 10; // Erro: Type 'number' is not assignable to type 'string'.
```

---

## Resumo

1. **Tipagem Inline:** Útil para objetos rápidos e isolados `{ propriedade: tipo }`.
2. **Propriedades Opcionais (`?`):** Permitem flexibilidade nos dados, mas exigem cuidado com valores `undefined`.
3. **`readonly`:** Garante que propriedades específicas do objeto sejam imutáveis após a criação.
4. **Type Aliases (`type`):** A melhor prática para declarar, organizar e reutilizar a estrutura de objetos.
5. **Index Signatures (`[key: string]: tipo`):** Para lidar com dicionários e objetos de propriedades dinâmicas.

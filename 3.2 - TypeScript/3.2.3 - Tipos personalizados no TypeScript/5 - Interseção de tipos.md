# Interseção de Tipos (Intersection Types)

Nesta aula, vamos estudar as **Intersecções de Tipos** (Intersection Types) no TypeScript. Enquanto os Union Types (`|`) nos dão uma escolha de "um ou outro", as Intersecções (`&`) nos permitem **mesclar/combinar** múltiplos tipos em um único tipo completo. O tipo resultante terá todas as características de todos os tipos combinados.

---

## 1. O que é uma Interseção de Tipos?

Representada pelo caractere comercial **`&`**, a interseção cria um novo tipo que exige a presença de todos os membros (propriedades e métodos) dos tipos originais. Funciona como um operador lógico "E" (`AND`) para tipos.

```typescript
type Logavel = {
  logar: () => void;
};

type Imprimivel = {
  imprimir: () => void;
};

// O tipo 'DocumentoSeguro' DEVE possuir ambos os métodos
type DocumentoSeguro = Logavel & Imprimivel;

const meuDoc: DocumentoSeguro = {
  logar: () => console.log("Acessando documento..."),
  imprimir: () => console.log("Imprimindo documento...")
};
```

---

## 2. Diferença Crucial: Union (`|`) vs Intersection (`&`)

| Operador | Nome | Comportamento Lógico | Exigência |
| :--- | :--- | :--- | :--- |
| **`|`** | Union Type | Operação de "OU" | Deve satisfazer pelo menos **um** dos tipos. |
| **`&`** | Intersection Type | Operação de "E" | Deve satisfazer **todos** os tipos combinados. |

### Exemplo Comparativo:
```typescript
type A = { nome: string };
type B = { idade: number };

// União: ou tem nome, ou tem idade, ou ambos
let uniao: A | B = { nome: "Ana" }; 

// Interseção: DEVE ter nome E idade obrigatoriamente
let intersecao: A & B = { nome: "Ana", idade: 25 }; 
```

---

## 3. Conflitos de Propriedades na Interseção

Um ponto de atenção muito importante ocorre quando tentamos intersectar dois tipos que possuem uma propriedade com o **mesmo nome, mas com tipos diferentes**.

```typescript
type TipoX = {
  id: string;
};

type TipoY = {
  id: number;
};

// O TypeScript tentará mesclar: id: string & number
type TipoConflito = TipoX & TipoY;
```

Como nenhum valor no JavaScript pode ser simultaneamente uma `string` e um `number`, o TypeScript resolve o tipo da propriedade `id` como **`never`**.

```typescript
// Erro de Compilação!
const objeto: TipoConflito = {
  id: "123" // Erro: Type 'string' is not assignable to type 'never'.
};
```

> [!WARNING]
> Tenha muito cuidado ao fazer interseções de tipos de fontes de dados diferentes para garantir que não existam propriedades com nomes idênticos e tipos incompatíveis, pois isso inutilizará o tipo resultante gerando propriedades `never`.

---

## 4. Interseção de Interfaces e Types Misturados

Você pode intersectar qualquer combinação de tipos: um `type` com outro `type`, uma `interface` com um `type`, ou até duas `interfaces`.

```typescript
interface Usuario {
  nome: string;
}

type Permissoes = {
  admin: boolean;
};

// Intersectando uma Interface com um Type Alias
type Administrador = Usuario & Permissoes;

const adm: Administrador = {
  nome: "Lucas",
  admin: true
};
```

---

## Resumo

1. Use o operador **`&`** para unir as propriedades de múltiplos tipos em uma única estrutura.
2. O objeto resultante de uma interseção deve implementar **todas** as propriedades e métodos dos tipos mesclados.
3. Se houver propriedades com o mesmo nome e tipos incompatíveis na interseção, o TypeScript reduzirá o tipo da propriedade a **`never`**, impedindo a atribuição de valores.

# Usando Type (Type Aliases)

Nesta aula, vamos estudar profundamente os **Type Aliases** (usando a palavra-chave `type`). Embora interfaces sejam excelentes para objetos e classes, o `type` é a ferramenta de tipagem mais versátil do TypeScript, permitindo criar apelidos para primitivos, uniões, tuplas, funções e fazer transformações complexas de tipo.

---

## 1. O que é o Type Alias?

Um Type Alias cria um nome de referência para qualquer tipo. Pense nele como uma variável, mas em vez de armazenar um valor, ele armazena uma definição de tipo.

```typescript
type Cpf = string; // Apelido para um tipo primitivo
type Idade = number;

let meuCpf: Cpf = "123.456.789-00";
```

---

## 2. Casos de Uso onde o `type` é Obrigatório (ou Superior)

Existem várias situações onde você **não pode utilizar interfaces** e é obrigado a usar o `type`:

### A. Uniões de Tipos Primitivos ou Literais
Você não pode criar uma união diretamente usando uma interface.

```typescript
type RespostaUsuario = "sim" | "não" | "talvez";
type CodigoStatus = 200 | 404 | 500;
```

### B. Tuplas
Interfaces não podem declarar estruturas com tamanhos e tipos específicos por posição de maneira limpa.

```typescript
type LinhaTabela = [number, string, boolean];

const registro: LinhaTabela = [1, "Produto A", true];
```

### C. Assinatura de Funções complexas
Embora interfaces possam definir funções de objetos ou métodos, o `type` é a melhor ferramenta para definir callbacks isolados de forma concisa.

```typescript
type CallbackRequisicao = (erro: Error | null, dados?: object) => void;
```

---

## 3. Extensão via Interseção (`&`)

Enquanto interfaces usam `extends`, os Type Aliases usam o operador de **Interseção (`&`)** para combinar múltiplas definições de tipos em uma só.

```typescript
type DadosPessoais = {
  nome: string;
  idade: number;
};

type DadosContato = {
  email: string;
  telefone: string;
};

// Combinando os dois tipos usando interseção (&)
type PerfilCompleto = DadosPessoais & DadosContato;

const usuario: PerfilCompleto = {
  nome: "Tayron",
  idade: 28,
  email: "tayron@email.com",
  telefone: "(11) 99999-9999"
};
```

---

## 4. Diferenças Cruciais de Comportamento

1. **Sem Mesclagem Automática (No Merging):** Se você declarar dois `type` com o mesmo nome, o compilador acusará erro. O tipo é imutável após ser declarado.
2. **Substituição Fácil:** Você pode usar `type` para apelidar qualquer tipo primitivo ou composto, enquanto interfaces servem apenas para formatos de objetos e estruturas de classes.

---

## Resumo

1. Use **`type`** para criar apelidos para uniões (`|`), tuplas (`[...]`) e tipos primitivos.
2. Estenda tipos usando a **Interseção (`&`)**.
3. Diferente de interfaces, tipos **não se mesclam** automaticamente quando duplicados no mesmo escopo.

# Union Types

Nesta aula, vamos estudar os **Union Types** (Tipos de União) no TypeScript. Este recurso permite que declaramos que uma variável, parâmetro ou retorno de função pode aceitar mais de um tipo de dado válido, trazendo flexibilidade ao nosso código sem abrir mão da segurança estática.

---

## 1. O que são Union Types?

Um Union Type é uma maneira de combinar múltiplos tipos usando o caractere pipe (`|`). Ele funciona como um operador lógico "OU" (`OR`) para tipos.

```typescript
let identificador: string | number;

identificador = "ABC-123"; // Válido
identificador = 456789;    // Válido
identificador = true;      // Erro: Type 'boolean' is not assignable to type 'string | number'.
```

---

## 2. Casos de Uso Comuns

Os Union Types são extremamente úteis em cenários do mundo real:

### A. Funções Flexíveis
Imagine uma função que busca dados de um usuário. O ID do usuário no banco de dados pode ser uma string auto-incrementada ou um número.

```typescript
function buscarUsuario(id: string | number) {
  console.log(`Buscando usuário com o ID: ${id}`);
}

buscarUsuario(101);          // Funciona
buscarUsuario("usr_9981a");  // Funciona
```

### B. Estados de Componentes ou Requisições
Ao invés de usar strings livres, você pode limitar as opções que uma variável pode assumir combinando **Tipos Literais** com Union Types.

```typescript
type StatusRequisicao = "idle" | "loading" | "success" | "error";

let statusAtual: StatusRequisicao = "idle";

statusAtual = "loading"; // Válido
statusAtual = "finished"; // Erro: Type '"finished"' is not assignable to type 'StatusRequisicao'.
```

---

## 3. A Regra de Acesso e o Estreitamento de Tipos (Type Narrowing)

Quando você usa um Union Type, o TypeScript só permite que você acesse propriedades e métodos que sejam **comuns a todos os tipos** da união por padrão.

```typescript
function formatar(valor: string | number) {
  // O compilador impede o acesso direto:
  valor.toUpperCase(); // Erro: Property 'toUpperCase' does not exist on type 'number'.
  valor.toFixed(2);    // Erro: Property 'toFixed' does not exist on type 'string'.
}
```

Para realizar operações específicas de um dos tipos, você precisa fazer o **Estreitamento de Tipo (Type Narrowing)**. Isso significa usar verificações lógicas em tempo de execução para provar ao TypeScript qual tipo a variável possui naquele bloco de código.

### Estreitando com `typeof`:
```typescript
function formatar(valor: string | number): string {
  if (typeof valor === "string") {
    // Aqui dentro, o TS sabe que 'valor' é estritamente string
    return valor.toUpperCase(); 
  } else {
    // Aqui dentro, o TS sabe que 'valor' só pode ser number
    return valor.toFixed(2);
  }
}
```

---

## 4. Union Types em Arrays

Vimos anteriormente na aula de arrays, mas vale a pena reforçar a sintaxe correta quando misturamos as duas funcionalidades:

```typescript
// Um array que aceita strings E/OU números:
const respostas: (string | number)[] = ["Sim", 1, "Não", 0];
```

---

## Resumo

1. Use o pipe (`|`) para criar uniões de tipos (`tipoA | tipoB`).
2. Útil para aceitar entradas flexíveis em funções ou limitar valores usando uniões de literais (ex: `"ativo" | "inativo"`).
3. Para acessar métodos específicos de um tipo contido na união, realize o **Type Narrowing** (usando `typeof`, condicionais, etc.).

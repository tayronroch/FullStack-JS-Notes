# Null e Undefined

Nesta aula, vamos nos aprofundar nos tipos **`null`** e **`undefined`** no TypeScript. Embora pareçam conceitos simples, a forma como lidamos com a ausência de valores é uma das maiores fontes de bugs em qualquer linguagem de programação. Vamos ver como o TypeScript nos ajuda a tornar essa manipulação segura através de regras rígidas e operadores modernos.

---

## 1. Diferenças Semânticas (JavaScript)

Antes do TypeScript, o próprio JavaScript já definia estes dois valores primitivos com intenções diferentes:

* **`undefined`**: Representa uma ausência *involuntária* ou *padrão* de valor. É o valor que o runtime atribui automaticamente a variáveis que foram declaradas mas não inicializadas, ou ao tentar acessar propriedades inexistentes em um objeto.
* **`null`**: Representa uma ausência *intencional* de valor. É um valor atribuído explicitamente pelo desenvolvedor para indicar que a variável está vazia ou sem valor associado naquele momento.

```typescript
let nome; // O JavaScript atribui implicitamente: undefined
let sobrenome = null; // O desenvolvedor atribui explicitamente: null
```

---

## 2. A Flag `strictNullChecks` (O Coração da Segurança)

No TypeScript antigo (ou quando a flag de verificação estrita está desativada), os valores `null` e `undefined` podiam ser atribuídos a qualquer tipo de variável.

```typescript
// PERIGOSO: Sem strictNullChecks ativado, isso compila normalmente!
let idade: number = 25;
idade = null; // Sem erro
idade.toFixed(2); // Quebra o sistema em runtime (Cannot read properties of null)
```

Por essa razão, a flag **`strictNullChecks`** (que vem ativada por padrão com `"strict": true` no `tsconfig.json`) é considerada indispensável no desenvolvimento moderno.

Com `strictNullChecks` ativado:
* `null` e `undefined` se tornam tipos independentes e estritos.
* Você não pode atribuir `null` ou `undefined` a variáveis de outros tipos (como `string` ou `number`) a menos que use um **Union Type**.

```typescript
// Correto: Usando Union Type para permitir ausência de valor
let usuarioLogado: string | null = null;

usuarioLogado = "Tayron Rocha"; // Permitido
usuarioLogado = null;           // Permitido
```

---

## 3. Operadores Essenciais para Lidar com Null/Undefined

Para evitar códigos cheios de `if` aninhados ao lidar com possíveis valores nulos ou indefinidos, o TypeScript/JavaScript moderno oferece operadores excelentes:

### A. Encadeamento Opcional (Optional Chaining - `?.`)
Permite ler propriedades ou chamar métodos de objetos que podem ser `null` ou `undefined` de forma segura. Se o objeto for nulo/indefinido, a expressão simplesmente para a execução e retorna `undefined`, em vez de estourar um erro.

```typescript
type Usuario = {
  nome: string;
  contato?: {
    telefone?: string;
  };
};

const user: Usuario = { nome: "Ana" };

// Sem o ?. isso quebraria caso 'contato' fosse undefined
const telefone = user.contato?.telefone; // Retorna undefined com segurança
```

### B. Coalescência Nula (Nullish Coalescing - `??`)
Retorna o operando do lado direito quando o operando do lado esquerdo é **especificamente** `null` ou `undefined`. Se o lado esquerdo for qualquer outro valor (inclusive falsy como `0` ou `""`), ele será mantido.

```typescript
let nomeUsuario: string | null = null;
let nomeExibicao = nomeUsuario ?? "Usuário Anônimo"; // "Usuário Anônimo"

// Diferença em relação ao OR (||):
let score = 0;
let scoreExibido1 = score || 10; // Retorna 10 (pois 0 é falsy no JavaScript)
let scoreExibido2 = score ?? 10; // Retorna 0 (pois 0 NÃO é null nem undefined!)
```

### C. Operador de Asserção Não-Nula (Non-null Assertion - `!`)
Usado quando você tem certeza absoluta de que um valor não será nulo ou indefinido naquele ponto do código, mesmo que o compilador não consiga provar isso sozinho.

```typescript
function processar(texto: string | null) {
  // O '!' diz ao compilador: "Eu garanto que 'texto' não é nulo aqui"
  const maiusculo = texto!.toUpperCase(); 
}
```

> [!CAUTION]
> **Use o `!` com muita moderação!**
> Se você usar o operador `!` e a variável for de fato nula durante a execução do programa, o seu código quebrará. Prefira usar estreitamento de tipos (*Type Narrowing*).

---

## 4. Estreitamento de Tipo (Type Narrowing)

A forma mais recomendada e segura de tratar valores nulos ou indefinidos é usar verificações simples (como estruturas condicionais `if`). O compilador do TypeScript é inteligente o suficiente para entender que, dentro do bloco `if`, a variável está garantida de não ser nula.

```typescript
function obterComprimento(texto: string | null): number {
  if (texto === null) {
    return 0; // Se caiu aqui, é nulo
  }
  
  // Daqui para baixo, o TypeScript sabe que 'texto' é garantidamente 'string'
  return texto.length; // Permitido sem erros ou operadores adicionais
}
```

---

## Resumo

1. **`undefined`** indica ausência padrão/indefinida; **`null`** indica ausência intencional.
2. Mantenha **`strictNullChecks`** ativado para forçar o tratamento explícito de nulos no código.
3. Use **Union Types** (ex: `string | null`) para declarar variáveis que podem iniciar sem valor.
4. Utilize **`?.`** para acesso seguro e **`??`** para prover valores padrão sem mascarar falsys legítimos (como `0` ou `""`).
5. Prefira **Type Narrowing** (condicionais `if`) ao invés do operador de asserção `!`.

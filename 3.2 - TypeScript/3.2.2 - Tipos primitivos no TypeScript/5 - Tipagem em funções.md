# Tipagem em Funções

Nesta aula, vamos aprender como aplicar a tipagem em **Funções** no TypeScript. Como as funções são as principais unidades de comportamento em JavaScript, tipá-las corretamente é crucial para definir contratos claros de entrada (parâmetros) e saída (retorno).

---

## 1. Tipagem Básica de Parâmetros e Retorno

Para tipar uma função, declaramos o tipo de cada parâmetro entre parênteses e o tipo do retorno logo após os parênteses.

```typescript
function somar(x: number, y: number): number {
  return x + y;
}
```
* **Parâmetros (`x: number`, `y: number`)**: Garantem que a função só receba números.
* **Retorno (`: number`)**: Garante que o valor retornado seja sempre um número.

### A importância de explicitar o retorno (Evitando o Efeito Dominó)

Embora o TypeScript consiga inferir o retorno de funções simples, deixar de explicitar o retorno em funções importantes pode criar problemas sérios durante refatorações.

#### Exemplo sem retorno explícito (Apenas Inferência):
```typescript
// O compilador infere o retorno como: number
function calcularDesconto(preco: number) {
  return preco * 0.1;
}

// Em outro arquivo do projeto:
const precoFinal = 100 - calcularDesconto(100); // 100 - 10 = 90
```

Se outro programador alterar a função `calcularDesconto` para retornar um texto formatado, sem perceber o impacto:
```typescript
function calcularDesconto(preco: number) {
  return `R$ ${preco * 0.1}`; // Agora o compilador infere o retorno como: string
}

// O erro agora estoura no outro arquivo:
const precoFinal = 100 - calcularDesconto(100); 
// Erro aqui: The right-hand side of an arithmetic operation must be of type 'any', 'number'...
```
Note que o erro foi acusado **no arquivo que consome a função**, e não na função onde o erro de lógica de fato aconteceu. Em sistemas grandes, isso dificulta muito a depuração.

#### Exemplo com retorno explícito (Contrato Seguro):
Se você tivesse explicitado o tipo de retorno na assinatura da função:
```typescript
function calcularDesconto(preco: number): number {
  return `R$ ${preco * 0.1}`; 
  // Erro imediato na função: Type 'string' is not assignable to type 'number'.
}
```
O compilador barra a alteração incorreta **diretamente na fonte**, protegendo o restante do sistema contra quebras de contrato.

---

## 2. Parâmetros Opcionais e Padrões

No JavaScript, os parâmetros de uma função são sempre opcionais por padrão (se não passados, assumem `undefined`). No TypeScript, por padrão, **todos os parâmetros declarados são obrigatórios**.

### Parâmetros Opcionais (`?`)
Para tornar um parâmetro opcional, adicionamos um ponto de interrogação (`?`) após seu nome.

```typescript
function saudar(nome: string, saudacao?: string): string {
  if (saudacao) {
    return `${saudacao}, ${nome}!`;
  }
  return `Olá, ${nome}!`;
}

console.log(saudar("Tayron")); // Válido: "Olá, Tayron!"
console.log(saudar("Tayron", "Bom dia")); // Válido: "Bom dia, Tayron!"
```

> [!IMPORTANT]
> **Ordem dos parâmetros:**
> Os parâmetros opcionais devem sempre vir **depois** de todos os parâmetros obrigatórios.

### Parâmetros com Valor Padrão (Default Parameters)
Você também pode atribuir um valor padrão para um parâmetro caso ele não seja enviado. O TypeScript infere automaticamente o tipo do parâmetro com base nesse valor padrão.

```typescript
function criarUsuario(nome: string, isAdmin: boolean = false) {
  // 'isAdmin' é inferido como boolean e é opcional na chamada da função
  console.log(`Usuário: ${nome}, Admin: ${isAdmin}`);
}

criarUsuario("Ana"); // Saída: Usuário: Ana, Admin: false
criarUsuario("Carlos", true); // Saída: Usuário: Carlos, Admin: true
```

---

## 3. Retornos Especiais: `void` e `never`

### O Tipo `void`
O tipo `void` é utilizado para indicar que uma função **não retorna nenhum valor** (ou retorna `undefined` sem um `return` explícito). É muito comum em funções que apenas realizam ações secundárias, como gravar em um banco de dados ou fazer um `console.log`.

> [!WARNING]
> **Comportamento do `return` com `void`:**
> * O TypeScript **impede** você de retornar qualquer valor real dentro de uma função `void` (isso gerará um erro de compilação).
> * No entanto, você **pode** usar um `return;` vazio para sair antecipadamente (early exit) da função.

```typescript
// Exemplo Válido: Sem retorno
function exibirMensagem(texto: string): void {
  console.log(texto);
}

// Exemplo Válido: Usando return vazio para saída antecipada
function salvarDados(dados: any): void {
  if (!dados) {
    return; // Permitido: sai da função sem retornar valor
  }
  // lógica de salvar...
}

// Exemplo Inválido (Erro de Compilação):
function calcular(a: number, b: number): void {
  return a + b; 
  // Erro: Type 'number' is not assignable to type 'void'.
}
```

#### O Comportamento de `void` em Aliases de Tipo (`type`)

Quando definimos a assinatura de uma função que retorna `void` utilizando um **Alias de Tipo (`type`)**, o TypeScript aplica regras específicas:

1. **Vedação de Uso (Proteção de Chamada):** Se a função atribuída retornar algum valor, o TypeScript considerará que o retorno é `void` e **impedirá/vedará** você de utilizar o resultado em qualquer lugar do código.
2. **Substitutabilidade (Compatibilidade):** O TypeScript permite atribuir uma função que retorne valores apenas para compatibilidade de callbacks (como passar um retorno no `.forEach`), mas descarta o valor retornado.
3. **Vedação na Implementação:** Se você declarar explicitamente o tipo do retorno da função interna como `void`, o compilador bloqueará o retorno de valores imediatamente.

```typescript
type OperacaoSilenciosa = () => void;

// Exemplo 1: O compilador veda o uso do valor retornado
const salvar: OperacaoSilenciosa = () => {
  return "Sucesso!"; // Permitido apenas para compatibilidade de callback
};

const statusRetorno = salvar(); // 'statusRetorno' é do tipo void
console.log(statusRetorno.toUpperCase()); 
// Erro: Property 'toUpperCase' does not exist on type 'void'.


// Exemplo 2: Se tiparmos a implementação interna como void, o valor é vedado de imediato
const deletar: OperacaoSilenciosa = (): void => {
  return "Deletado"; 
  // Erro: Type 'string' is not assignable to type 'void'.
};
```

### O Tipo `never`
O tipo `never` indica que uma função **nunca retorna nada** porque ela nunca chega ao final de sua execução. Isso ocorre em duas situações principais:
1. A função lança uma exceção/erro.
2. A função possui um loop infinito (como um loop de escuta de eventos).

```typescript
function lancarErro(mensagem: string): never {
  throw new Error(mensagem); // A execução é interrompida aqui
}

function processamentoInfinito(): never {
  while (true) {
    // Loop que nunca termina
  }
}
```

---

## 4. Tipando Funções como Variáveis (Function Types)

Assim como variáveis de texto ou numéricas, você pode declarar variáveis que armazenam funções e definir qual deve ser o formato (assinatura) dessa função.

### Sintaxe de Arrow Function Type:
```typescript
// Declarando o tipo da variável usando a assinatura de arrow function
let calcular: (a: number, b: number) => number;

// Atribuindo uma função compatível com o tipo definido acima
calcular = (x, y) => x + y; 

// Erro: O tipo da função atribuída é incompatível
calcular = (x, y) => "Resultado: " + (x + y); 
```

### Criando Tipos com `type`
Para reaproveitar assinaturas de funções em múltiplos locais, podemos criar um atalho usando a palavra-chave `type`:

```typescript
type OperacaoMatematica = (x: number, y: number) => number;

const somarValores: OperacaoMatematica = (a, b) => a + b;
const subtrairValores: OperacaoMatematica = (a, b) => a - b;
```

---

## 5. Parâmetros Rest (Rest Parameters)

Quando uma função aceita múltiplos argumentos que são agrupados em um array, tipamos o parâmetro rest como um array.

```typescript
function somarNumeros(mensagem: string, ...numeros: number[]): string {
  const total = numeros.reduce((acc, curr) => acc + curr, 0);
  return `${mensagem}: ${total}`;
}

console.log(somarNumeros("O resultado é", 1, 2, 3, 4)); // "O resultado é: 10"
```

---

## Resumo

1. Tipe parâmetros individuais `(param: tipo)` e retornos `(): tipo`.
2. Parâmetros com `?` são opcionais e devem ficar por último.
3. Funções sem retorno de valor são tipadas como `void`.
4. Funções que interrompem a execução ou rodam indefinidamente retornam `never`.
5. Podemos criar aliases de tipo (`type`) para reaproveitar assinaturas de funções.

# Typeof

No TypeScript, o operador **`typeof`** tem um papel duplo extremamente poderoso. Embora você já o conheça do JavaScript tradicional como uma forma de descobrir o tipo de um dado em tempo de execução, o TypeScript estende o seu comportamento para o **tempo de compilação**, permitindo capturar e extrair o tipo de qualquer variável, constante ou objeto existente para reutilizá-lo na tipagem do código.

---

## 1. O Duplo Papel do `typeof`

É fundamental entender em qual "espaço" do código você está utilizando o `typeof`:

1. **Espaço de Valor (JavaScript Runtime):** Usado em expressões de código comum para verificar o tipo em tempo de execução. Retorna uma string (como `"string"`, `"number"`, `"object"`).
2. **Espaço de Tipo (TypeScript Compile-time):** Usado onde declaramos tipos. Ele "lê" a estrutura do valor e a transforma em um tipo TypeScript reutilizável.

```typescript
const usuario = { nome: "Tayron", idade: 30 };

// 1. Usando no runtime (JavaScript)
if (typeof usuario === "object") {
  console.log("É um objeto!");
}

// 2. Usando no compile-time (TypeScript)
type PerfilUsuario = typeof usuario; 
/*
  O tipo 'PerfilUsuario' agora é:
  {
    nome: string;
    idade: number;
  }
*/
```

---

## 2. Exemplos Práticos

### Exemplo 1: Tipagem Baseada em Configurações (Single Source of Truth)

Imagine que você tem um objeto padrão com as configurações de sua aplicação. Você quer garantir que qualquer nova configuração inserida siga exatamente o mesmo formato, sem ter que escrever e atualizar uma interface manualmente.

```typescript
const configuracaoPadrao = {
  porta: 3000,
  host: "localhost",
  habilitarLogs: true,
  tema: "escuro"
};

// Captura a estrutura do objeto automaticamente
type AppConfig = typeof configuracaoPadrao;

// Qualquer nova configuração agora é forçada a seguir a estrutura original:
const configuracaoProducao: AppConfig = {
  porta: 80,
  host: "api.meusite.com",
  habilitarLogs: false,
  tema: "claro"
};
```

---

### Exemplo 2: O Combo Poderoso (`keyof typeof`)

Um dos padrões mais comuns e úteis no desenvolvimento TypeScript é combinar o `keyof` (que extrai as chaves de um tipo) com o `typeof` e a asserção `as const` (que torna as propriedades imutáveis e com valores literais).

```typescript
const CORES = {
  PRIMARY: "#007bff",
  SECONDARY: "#6c757d",
  SUCCESS: "#28a745"
} as const; // O 'as const' torna os valores literais fixos

// 1. typeof CORES gera o tipo do objeto com valores literais
// 2. keyof extrai as chaves desse tipo: "PRIMARY" | "SECONDARY" | "SUCCESS"
type CoresDisponiveis = keyof typeof CORES;

function aplicarCor(cor: CoresDisponiveis) {
  console.log(`Aplicando a cor hexadecimal: ${CORES[cor]}`);
}

aplicarCor("PRIMARY"); // Válido!
// aplicarCor("DANGER"); // ❌ ERRO! Tipo '"DANGER"' não é aceito.
```

---

### Exemplo 3: Capturando Assinaturas de Funções

Se você precisa passar uma função como callback ou criar uma classe mock que imita o comportamento de uma função existente, o `typeof` extrai a assinatura exata (parâmetros e retorno) dela.

```typescript
function enviarMensagem(destinatario: string, conteudo: string): boolean {
  console.log(`Enviando para ${destinatario}: ${conteudo}`);
  return true;
}

// Captura a assinatura da função: (destinatario: string, conteudo: string) => boolean
type FuncaoEnviar = typeof enviarMensagem;

const mockEnviar: FuncaoEnviar = (para, texto) => {
  console.log(`[MOCK] Enviando para ${para}`);
  return false;
};
```

---

## 3. Cuidados e Limitações

### A. Não funciona com chamadas de função ou expressões
O `typeof` do TypeScript só pode ser usado em **identificadores** (nomes de variáveis, constantes, funções ou classes). Você não pode ler o tipo resultante de uma execução direta.

```typescript
function calcularTotal(preco: number) {
  return { preco, imposto: preco * 0.1 };
}

// ❌ ERRO de sintaxe! Não é possível capturar o retorno dessa forma:
// type Resultado = typeof calcularTotal(100); 
```

#### Como contornar isso?
Para extrair o tipo do retorno de uma função, você deve combinar o `typeof` com outro utilitário nativo chamado **`ReturnType`**:

```typescript
// ✅ VÁLIDO! Extrai o tipo retornado pela função: { preco: number; imposto: number }
type Resultado = ReturnType<typeof calcularTotal>;
```

---

### B. O impacto do `as const` no `typeof`

Se você omitir o `as const` em objetos usados com o `typeof`, o TypeScript infere tipos genéricos (como `string` ou `number`), em vez dos valores literais específicos.

```typescript
// Sem 'as const'
const niveisDeAcesso = {
  admin: "ADMINISTRADOR",
  usuario: "USUARIO_COMUM"
};
type TipagemGenerica = typeof niveisDeAcesso;
// Tipo: { admin: string; usuario: string }

// Com 'as const'
const niveisDeAcessoFixos = {
  admin: "ADMINISTRADOR",
  usuario: "USUARIO_COMUM"
} as const;
type TipagemEstrita = typeof niveisDeAcessoFixos;
// Tipo: { readonly admin: "ADMINISTRADOR"; readonly usuario: "USUARIO_COMUM" }
```
Use sempre `as const` ao criar objetos de mapeamento estático se o seu objetivo for extrair tipos literais e exatos com `typeof`.

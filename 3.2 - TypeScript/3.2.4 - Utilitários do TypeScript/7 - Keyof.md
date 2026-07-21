# Keyof

O operador **`keyof`** é um dos recursos fundamentais do TypeScript para manipulação de tipos. Ele atua no espaço de tipos (em tempo de compilação) e serve para **extrair as chaves (propriedades)** de um tipo de objeto (interface ou type alias) e agrupá-las em uma nova **união de strings literais**.

---

## 1. O que é o operador `keyof`?

Ao aplicar o `keyof` em um tipo `T`, o TypeScript varre todas as propriedades públicas desse tipo e retorna uma união contendo os nomes dessas propriedades como literais de string (ou number/symbol).

```typescript
interface Carro {
  marca: string;
  modelo: string;
  ano: number;
  flex: boolean;
}

// O TypeScript extrai as propriedades de 'Carro'
type PropriedadesCarro = keyof Carro; 
// O tipo resultante é: "marca" | "modelo" | "ano" | "flex"
```

Se tentarmos atribuir qualquer valor fora dessa união, o compilador acusará um erro:

```typescript
const minhaPropriedade: PropriedadesCarro = "modelo"; // ✅ Válido
// const propriedadeInvalida: PropriedadesCarro = "cor"; // ❌ ERRO! '"cor"' não existe em 'Carro'.
```

---

## 2. Casos de Uso Práticos

### Exemplo 1: Acessando Propriedades de Forma Segura (Lookup de Objetos)

Um problema clássico em JavaScript é criar funções utilitárias que buscam valores dentro de objetos de forma dinâmica, correndo o risco de passar chaves que não existem. Com `keyof` e Generics, garantimos segurança absoluta:

```typescript
function obterValor<T, K extends keyof T>(objeto: T, chave: K): T[K] {
  return objeto[chave];
}

const pessoa = {
  nome: "Tayron",
  idade: 30,
  cidade: "São Paulo"
};

// O compilador infere os tipos:
// T = typeof pessoa
// K = "nome" | "idade" | "cidade"
const nome = obterValor(pessoa, "nome");   // ✅ Válido (retorna string)
const idade = obterValor(pessoa, "idade"); // ✅ Válido (retorna number)

// const erro = obterValor(pessoa, "sobrenome"); // ❌ ERRO! '"sobrenome"' não existe no tipo.
```
> [!NOTE]
> O tipo de retorno `T[K]` é chamado de **Indexed Access Type** (Tipo de Acesso Indexado). Ele garante que o TypeScript retorne exatamente o tipo correspondente àquela chave específica (ex: retorna `string` para `"nome"` e `number` para `"idade"`).

---

### Exemplo 2: Atualização de Propriedades Específicas

Similar ao exemplo anterior, podemos usar o `keyof` para criar funções de atualização de estado onde apenas chaves existentes podem ser alteradas, com valores do tipo correto:

```typescript
interface Config {
  porta: number;
  ssl: boolean;
  pastaPublica: string;
}

const configuracao: Config = {
  porta: 8080,
  ssl: false,
  pastaPublica: "/dist"
};

function atualizarConfig<K extends keyof Config>(chave: K, valor: Config[K]): void {
  configuracao[chave] = valor;
  console.log(`Configuração '${chave}' atualizada para:`, valor);
}

atualizarConfig("porta", 3000); // ✅ Válido
atualizarConfig("ssl", true);   // ✅ Válido

// atualizarConfig("porta", "3000"); // ❌ ERRO! Esperava 'number', recebeu 'string'
// atualizarConfig("tema", "escuro"); // ❌ ERRO! 'tema' não existe em 'Config'
```

---

### Exemplo 3: Usando `keyof` com Index Signatures (Chaves Dinâmicas)

Se usarmos o `keyof` em um tipo que aceita chaves dinâmicas genéricas através de uma *Index Signature*, o `keyof` retornará os tipos permitidos para as chaves (normalmente `string | number`):

```typescript
type DicionarioDeNumeros = {
  [chave: string]: number;
};

type ChavesDicionario = keyof DicionarioDeNumeros;
// Tipo: string | number
```
> [!TIP]
> O TypeScript inclui `number` em chaves de indexação de strings porque, no JavaScript, acessar um objeto via índice numérico (ex: `objeto[0]`) é implicitamente convertido para string (`objeto["0"]`).

---

## 3. Comparações e Combinações Importantes

### A. A diferença entre `keyof` e `in`

É muito comum confundir os operadores `keyof` e `in` ao começar a estudar manipulação de tipos no TypeScript:

* **`keyof`:** É um operador de **consulta**. Ele lê um tipo existente e **extrai** suas chaves em uma união.
  ```typescript
  type Chaves = keyof { a: 1; b: 2 }; // "a" | "b"
  ```
* **`in`:** É um operador de **iteração**. Ele é usado dentro de *Mapped Types* para **percorrer** uma união de chaves e mapeá-las para criar um novo tipo.
  ```typescript
  type NovoTipo<K extends string> = {
    [P in K]: string; // Percorre cada chave em K para criar as propriedades
  };
  ```

---

### B. O Combo `keyof typeof`

Como visto na aula anterior, objetos reais (valores) não possuem tipo diretamente acessível no espaço de tipos. Portanto, se você tem uma constante em JavaScript e quer extrair suas chaves, deve usar o combo:

```typescript
const CONFIG_TEMA = {
  escuro: "dark",
  claro: "light"
} as const;

// 1. typeof CONFIG_TEMA -> Obtém o tipo do objeto
// 2. keyof -> Obtém as chaves do tipo obtido: "escuro" | "claro"
type TemasValidos = keyof typeof CONFIG_TEMA;
```

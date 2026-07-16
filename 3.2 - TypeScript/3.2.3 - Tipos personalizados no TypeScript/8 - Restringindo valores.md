# Restringindo Valores (Tipos Literais)

Nesta aula, vamos aprender como **restringir valores** no TypeScript utilizando **Tipos Literais** (Literal Types). Esse é um dos recursos mais poderosos do TypeScript para aumentar a segurança do código, permitindo que variáveis, propriedades ou parâmetros de funções aceitem apenas valores específicos, em vez de tipos genéricos como `string`, `number` ou `boolean`.

---

## 1. O que são Tipos Literais?

Por padrão, quando declaramos uma variável usando `let`, o TypeScript infere um tipo amplo (como `string` ou `number`), permitindo que ela mude para qualquer valor desse tipo:

```typescript
let statusRequisicao = "pendente"; // O tipo inferido é 'string'
statusRequisicao = "qualquer outra string"; // Válido!
```

No entanto, no mundo real, muitas vezes queremos limitar os valores possíveis. Por exemplo, o status de uma requisição só pode ser `"pendente"`, `"sucesso"` ou `"erro"`. 

Um **Tipo Literal** permite que o valor em si seja o próprio tipo:

```typescript
let statusRestrito: "pendente" | "sucesso" | "erro";

statusRestrito = "pendente"; // Válido!
statusRestrito = "sucesso";  // Válido!
statusRestrito = "invalido"; // ERRO: Type '"invalido"' is not assignable to type '"pendente" | "sucesso" | "erro"'.
```

---

## 2. Tipos de Literais

Podemos restringir valores usando diferentes tipos primitivos:

### A. Literais de String
A forma mais comum de restringir valores, muito usada para status, modos de exibição, etc.

```typescript
type ModoExibicao = "dark" | "light" | "system";
let tema: ModoExibicao = "dark";
```

### B. Literais de Número
Muito útil para restringir números a um conjunto fixo de opções, como notas, códigos de erro HTTP permitidos, portas, etc.

```typescript
type NotasPermitidas = 1 | 2 | 3 | 4 | 5;
const avaliacao: NotasPermitidas = 5;

type StatusHttpSucesso = 200 | 201 | 204;
```

### C. Literais de Booleano
Embora menos comum (já que booleanos só possuem dois valores), você pode restringir uma propriedade a aceitar *apenas* um dos lados:

```typescript
type ApenasAtivo = true;
let statusUsuario: ApenasAtivo = true; // Não pode ser alterado para false
```

---

## 3. Restringindo Parâmetros de Funções

Um dos melhores casos de uso para a restrição de valores é na assinatura de funções. Isso evita que desenvolvedores passem argumentos inválidos por engano.

```typescript
type Alinhamento = "left" | "center" | "right";

function renderizarTexto(texto: string, alinhar: Alinhamento) {
  console.log(`Renderizando: "${texto}" com alinhamento "${alinhar}"`);
}

// Uso correto
renderizarTexto("Olá, TypeScript!", "center");

// Erro de compilação! Evita passar strings incorretas como "centro" ou "direita"
renderizarTexto("Olá, TypeScript!", "centro"); 
// ERRO: Argument of type '"centro"' is not assignable to parameter of type 'Alinhamento'.
```

> [!TIP]
> Graças ao autocomplete das IDEs modernas (como o VS Code), ao digitar o segundo parâmetro da função `renderizarTexto`, a IDE sugere automaticamente as opções `"left"`, `"center"` e `"right"`. Isso melhora drasticamente a experiência de desenvolvimento (DX).

---

## 4. Combinando Tipos Literais com Tipos Genéricos

Você pode misturar tipos literais com tipos amplos usando uniões (`|`). Por exemplo, você pode aceitar um tamanho pré-definido como string ou um valor numérico customizado em pixels:

```typescript
type Medida = "pequeno" | "medio" | "grande" | number;

let larguraJanela: Medida;

larguraJanela = "medio"; // Válido
larguraJanela = 800;     // Válido (representa 800px, por exemplo)
larguraJanela = "gigante"; // ERRO: Type '"gigante"' is not assignable to type 'Medida'.
```

---

## 5. Template Literal Types (Tipos de Gabarito de String)

A partir da versão 4.1, o TypeScript introduziu os **Template Literal Types**, que funcionam exatamente como os *Template Strings* do JavaScript, mas em nível de tipos. Eles permitem criar novas restrições de string combinando tipos existentes.

```typescript
type PosicaoVertical = "top" | "bottom";
type PosicaoHorizontal = "left" | "right";

// Gera a união de todas as combinações possíveis: "top-left" | "top-right" | "bottom-left" | "bottom-right"
type PosicaoAncoragem = `${PosicaoVertical}-${PosicaoHorizontal}`;

let tooltipPosicao: PosicaoAncoragem = "top-left"; // Válido!
tooltipPosicao = "bottom-right"; // Válido!
tooltipPosicao = "center-left";  // ERRO: Type '"center-left"' is not assignable to type 'PosicaoAncoragem'.
```

---

## 6. A Relação com `as const`

Na aula anterior, estudamos o `as const`. A principal diferença entre definir um **Tipo Literal manual** e usar `as const` é:

1. **Tipo Literal manual:** Você define uma união explícita de opções aceitáveis e a atribui a um tipo personalizado (`type`).
2. **`as const` (Const Assertion):** Você sinaliza ao TypeScript para inferir o tipo do objeto ou array de forma literal e somente leitura automaticamente, sem precisar definir um `type` manual para cada propriedade.

```typescript
// Exemplo com as const
const opcoesConfig = {
  porta: 8080,
  protocolo: "https"
} as const;

// O TypeScript infere 'opcoesConfig.protocolo' como o tipo literal '"https"' (e não 'string')
```

---

## Resumo e Boas Práticas

1. **Evite `string` genérica para states/modos:** Sempre que uma variável ou propriedade tiver um conjunto conhecido e limitado de valores, use Tipos Literais.
2. **Excelente DX:** A restrição de valores cria códigos autodescritivos e melhora o autocomplete da IDE.
3. **Erros no lugar certo:** Erros de valores inválidos são capturados imediatamente em tempo de compilação, antes de irem para produção.

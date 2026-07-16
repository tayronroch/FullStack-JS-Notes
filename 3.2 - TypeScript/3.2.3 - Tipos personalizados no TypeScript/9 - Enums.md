# Enums (Enumerações)

Nesta aula, vamos aprender sobre os **Enums** (Enumerações) no TypeScript. O Enum é um dos poucos recursos do TypeScript que não é apenas um recurso de tipagem em tempo de compilação, mas que também **gera código JavaScript real em runtime**. Ele é ideal para definir um conjunto de constantes nomeadas, facilitando a legibilidade e a manutenção do código.

---

## 1. O Problema dos Números Mágicos (Magic Numbers)

Antes de entender o Enum, imagine que você está desenvolvendo um sistema de controle de acesso e tem três perfis de usuários salvos no banco de dados como números inteiros: `1` para Administrador, `2` para Cliente e `3` para Vendedor.

Sem enums, seu código de verificação e tipagem seria confuso:

```typescript
function verificarAcesso(usuario: { perfil: number }) {
  if (usuario.perfil === 1) { // O que significa '1'?
    console.log("Acesso concedido à administração");
  } else if (usuario.perfil === 3) { // O que significa '3'?
    console.log("Acesso concedido ao painel de vendas");
  }
}
```

O número `1` e `3` no exemplo acima são chamados de **Números Mágicos** (Magic Numbers). Eles funcionam, mas tornam o código obscuro, de difícil manutenção e sem nenhuma validação contra valores inesperados (como `4` ou `99`).

---

## 2. Resolução com Enums

Os **Enums** resolvem esse problema ao dar nomes legíveis a esses valores numéricos. 

Veja a declaração usando o exemplo clássico de perfis:

```typescript
enum Profile {
  Admin = 1,
  Client = 2,
  Seller = 3
}

// Declaração de variável tipada com o Enum
let profile: number = Profile.Admin;

console.log(Profile.Seller); // Saída: 3
```

Agora, o nosso código de validação fica extremamente legível e autoexplicativo:

```typescript
function verificarAcesso(usuario: { perfil: Profile }) {
  if (usuario.perfil === Profile.Admin) {
    console.log("Acesso concedido à administração");
  } else if (usuario.perfil === Profile.Seller) {
    console.log("Acesso concedido ao painel de vendas");
  }
}
```

---

## 3. Estratégias de Melhor Legibilidade com Enums

Para tirar o máximo de proveito dos Enums e manter o seu código limpo, siga estas estratégias de boas práticas:

### A. Nomeação no Singular e PascalCase
Como um Enum representa um tipo estruturado para uma única opção por vez, nomeie-o no **singular** e com a inicial maiúscula (**PascalCase**).
* **Certo:** `enum Profile { ... }` ou `enum Status { ... }`
* **Errado:** `enum profiles { ... }` ou `enum Statuses { ... }`

### B. Evite Valores Implícitos se o Significado For Importante
Embora o TypeScript auto-incremente enums numéricos a partir do `0`, é uma boa prática declarar os valores explicitamente, principalmente se eles forem mapeados para valores persistidos em banco de dados ou APIs externas. Isso evita que uma mudança na ordem dos elementos altere os valores numéricos acidentalmente.

### C. Prefira Enums de String para Depuração (Debugging)
Se o valor for impresso em logs, no console, ou trafegado na rede, usar números pode ser confuso. Prefira String Enums para que os logs mostrem o texto real e não apenas números sem contexto.
* **Com Enum Numérico:** `console.log(Profile.Seller)` exibe `3`
* **Com Enum de String:** `console.log(MetodoHttp.GET)` exibe `"GET"`

---

## 4. Tipos de Enums

O TypeScript suporta três tipos principais de enums: **Numéricos**, **Strings** e **Heterogêneos**.

### A. Enums Numéricos (Numeric Enums)
Por padrão, se você não atribuir valores aos membros de um enum, o TypeScript começará do `0` e incrementará automaticamente de 1 em 1 para cada membro subsequente.

```typescript
enum StatusUsuario {
  Ativo,    // 0
  Inativo,  // 1
  Pendente  // 2
}
```

#### Definindo um valor inicial personalizado
Você pode definir o valor do primeiro elemento, e os seguintes continuarão o incremento a partir dele:

```typescript
enum StatusPedido {
  Criado = 1, // 1
  Pago,       // 2
  Enviado,    // 3
  Entregue    // 4
}
```

Você também pode atribuir valores numéricos arbitrários a cada um individualmente.

#### Mapeamento Reverso (Reverse Mapping)
Apenas os enums numéricos possuem um recurso chamado **Mapeamento Reverso**. Isso significa que você pode obter o nome do membro do enum a partir de seu valor numérico:

```typescript
enum DiaDaSemana {
  Segunda = 1,
  Terca,
  Quarta
}

console.log(DiaDaSemana.Segunda); // Saída: 1
console.log(DiaDaSemana[1]);       // Saída: "Segunda" (Mapeamento Reverso)
```

---

### B. Enums de String (String Enums)
Os Enums de String não possuem comportamento autoincrementável ou mapeamento reverso, mas são excelentes para depuração (debugging). Cada membro deve ser inicializado individualmente com um valor string.

```typescript
enum MetodoHttp {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE"
}

const requisicao = MetodoHttp.GET;
console.log(requisicao); // Saída: "GET" (Muito melhor para logs do que um número)
```

---

### C. Enums Heterogêneos
Você pode misturar membros numéricos e de string no mesmo enum.

```typescript
enum BooleanoMisto {
  Nao = 0,
  Sim = "SIM"
}
```

> [!CAUTION]
> A menos que você esteja tentando tirar proveito de algum comportamento muito específico em bibliotecas legadas, **evite enums heterogêneos**. Eles dificultam a leitura do código e a consistência das tipagens.

---

## 5. Const Enums (`const enum`)

Os enums comuns geram um objeto JavaScript real em tempo de execução. Se você deseja evitar o custo de desempenho ou o overhead de código gerado no build final, pode usar **Const Enums** declarando o enum com a palavra-chave `const`:

```typescript
const enum DirecoesConst {
  Cima,
  Baixo
}

let irPara = DirecoesConst.Cima;
```

### O que acontece na compilação?
Ao compilar o código acima para JavaScript, o enum `DirecoesConst` é completamente removido, e suas referências são substituídas diretamente pelo valor literal:

```javascript
// JavaScript compilado:
let irPara = 0; /* Cima */
```

> [!WARNING]
> Como os `const enum` são apagados em tempo de compilação, eles **não possuem mapeamento reverso** e não podem ser iterados em runtime (como usando `Object.keys()`). Use-os apenas quando precisar estritamente de performance e inline de constantes.

---

## 6. Enum vs. Tipos Literais de União

Uma dúvida muito comum no TypeScript é: **Quando usar Enum e quando usar Tipos Literais (Ex: `'admin' | 'user'`)?**

| Característica | Enum | Tipo Literal de União |
| :--- | :--- | :--- |
| **Runtime** | Existe como objeto real no JS (a menos que seja `const enum`). | Desaparece completamente após a compilação. |
| **Sintaxe** | Mais verboso e precisa de importação se usado em outros arquivos. | Mais enxuto e simples de declarar. |
| **Uso no código** | `Status.Ativo` | `"ativo"` |
| **Validação** | Ideal quando os valores vêm de fora ou se você precisa iterá-los. | Ideal para controle interno de fluxo de dados. |

### Exemplo de recomendação:
Se você precisa apenas restringir valores de parâmetros de funções, prefira **Tipos Literais** por serem mais leves e idiomáticos. 
Se você precisa de uma estrutura de constantes mapeadas onde os nomes dos membros diferem de seus valores, ou se precisa iterar sobre os valores possíveis no runtime, prefira **Enums**.

---

## Resumo e Boas Práticas

1. **Prefira Enums de String** em vez de numéricos quando os valores precisarem ser exibidos ou gravados em logs, pois eles mantêm o significado textual em runtime.
2. **Use `const enum`** quando a performance for crítica e você não precisar do objeto enum em tempo de execução.
3. **Mantenha-os focados:** Enums devem representar conjuntos estritamente fechados de valores (como dias da semana, status de sistema, códigos de erro).

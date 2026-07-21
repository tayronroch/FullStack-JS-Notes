# Record

Nesta aula, vamos aprender sobre o utility type **`Record<Keys, Type>`**. Ele é a ferramenta perfeita para mapear propriedades de um tipo para outro, sendo amplamente utilizado para criar dicionários, tabelas de tradução, agrupamentos e mapeamentos estruturados de dados no TypeScript.

---

## 1. O que é o `Record<Keys, Type>`?

O `Record<Keys, Type>` constrói um tipo de objeto no qual as **chaves** são do tipo `Keys` e os **valores** são do tipo `Type`. 

* **`Keys`:** Define quais serão as chaves do objeto. Geralmente é uma união de strings literais (`"home" | "sobre"`), números ou símbolos.
* **`Type`:** Define o tipo dos valores que cada uma dessas chaves irá armazenar.

---

## 2. Por baixo dos panos (Under the hood)

A assinatura interna do `Record` no TypeScript é extremamente simples e elegante, baseando-se em **Mapped Types**:

```typescript
type Record<K extends keyof any, T> = {
  [P in K]: T;
};
```
* **`K extends keyof any`:** Garante que o primeiro argumento genérico seja algo válido para chaves de objetos (`string | number | symbol`).
* **`[P in K]`:** Percorre todas as chaves fornecidas na união `K`.
* **`T`:** Associa o tipo `T` a cada propriedade percorrida, sem modificá-lo.

---

## 3. Exemplos Práticos

### Exemplo 1: Dicionário de Configurações de Rotas (Mapeamento Simples)

Imagine que você está construindo a navegação do seu app e quer garantir que todas as telas possíveis tenham uma configuração associada:

```typescript
type RotasApp = "Home" | "Perfil" | "Configuracoes" | "Carrinho";

interface InfoTela {
  titulo: string;
  requerAutenticacao: boolean;
}

// Garante que TODAS as rotas declaradas em 'RotasApp' tenham um 'InfoTela'
const configuracaoDeRotas: Record<RotasApp, InfoTela> = {
  Home: { titulo: "Página Inicial", requerAutenticacao: false },
  Perfil: { titulo: "Meu Perfil", requerAutenticacao: true },
  Configuracoes: { titulo: "Ajustes", requerAutenticacao: true },
  Carrinho: { titulo: "Meu Carrinho", requerAutenticacao: false }
};
```

---

### Exemplo 2: Tabelas de Tradução (i18n)

Para sistemas multi-idiomas, o `Record` é ideal para estruturar chaves de tradução em múltiplos idiomas de forma aninhada:

```typescript
type Idioma = "pt" | "en" | "es";
type ChavesDeTexto = "boasVindas" | "entrar" | "sair";

// Dicionário com chaves e suas respectivas traduções por idioma
const traducoes: Record<Idioma, Record<ChavesDeTexto, string>> = {
  pt: {
    boasVindas: "Bem-vindo de volta!",
    entrar: "Entrar",
    sair: "Sair"
  },
  en: {
    boasVindas: "Welcome back!",
    entrar: "Sign In",
    sair: "Sign Out"
  },
  es: {
    boasVindas: "¡Bienvenido de nuevo!",
    entrar: "Iniciar sesión",
    sair: "Cerrar sesión"
  }
};
```

---

### Exemplo 3: Agrupando Dados (Group By / Indexação por ID)

Quando consumimos APIs, muitas vezes recebemos listas de dados. Para buscar um item rapidamente sem percorrer o array inteiro com `.find()`, podemos transformar a lista em um dicionário indexado pelo `id`:

```typescript
interface Usuario {
  id: string;
  nome: string;
  email: string;
}

const listaDeUsuarios: Usuario[] = [
  { id: "usr_1", nome: "Taylor", email: "taylor@email.com" },
  { id: "usr_2", nome: "Rodrigo", email: "rodrigo@email.com" }
];

// Mapeando usuários por suas strings de ID
const usuariosPorId: Record<string, Usuario> = {};

listaDeUsuarios.forEach(usuario => {
  usuariosPorId[usuario.id] = usuario;
});

// Busca O(1) super rápida:
console.log(usuariosPorId["usr_1"].nome); // "Taylor"
```

---

## 4. Diferença Crucial: Record vs Index Signatures

No TypeScript, você pode definir objetos dinâmicos usando assinaturas de índice (Index Signatures):

```typescript
// Index Signature
interface DicionarioComum {
  [key: string]: number;
}
```

Apesar de parecerem iguais, há uma diferença crucial: **Index signatures não suportam uniões de literais específicos**.

```typescript
// ❌ ERRO de sintaxe! Não compila.
interface DicionarioInvalido {
  [key: "a" | "b"]: number;
}

//  VÁLIDO! Record suporta uniões literais perfeitamente:
type DicionarioValido = Record<"a" | "b", number>;
```

Portanto, utilize `Record` sempre que as chaves pertencerem a um conjunto pré-definido e fechado de opções. Use Index Signatures apenas quando o nome da chave puder ser literalmente qualquer string genérica.

---

## 5. Limitação e Cuidado Avançado: Chaves Dinâmicas e `undefined`

Ao usar chaves dinâmicas genéricas como `string` no `Record`, o TypeScript assume por padrão que qualquer chave acessada existe e retornará o tipo definido:

```typescript
const pontuacoes: Record<string, number> = {
  taylor: 100,
  rodrigo: 80
};

// O TypeScript acha que pontuacoes["inexistente"] é do tipo 'number'
const pontuacao = pontuacoes["inexistente"]; 
console.log(pontuacao.toFixed(2)); // ❌ Erro em tempo de execução: Cannot read properties of undefined
```

### Como resolver isso?

1. **Definindo explicitamente a possibilidade de `undefined`:**
   Mapeie os valores para incluir `undefined`, forçando você a validar a existência antes de usar:
   ```typescript
   const pontuacoesSeguras: Record<string, number | undefined> = {
     taylor: 100
   };
   
   const pontuacao = pontuacoesSeguras["inexistente"]; // Tipo: number | undefined
   
   if (pontuacao !== undefined) {
     console.log(pontuacao.toFixed(2)); // ✅ Seguro!
   }
   ```

2. **Habilitando o `noUncheckedIndexedAccess` no `tsconfig.json`:**
   Esta configuração global do compilador faz com que todo acesso dinâmico por índice (seja em objetos ou arrays) automaticamente adicione `| undefined` ao tipo retornado:
   ```json
   {
     "compilerOptions": {
       "noUncheckedIndexedAccess": true
     }
   }
   ```

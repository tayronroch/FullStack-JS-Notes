# Omit

Nesta aula, vamos nos aprofundar no utility type **`Omit<T, Keys>`**. Ele funciona de maneira oposta ao `Pick`, permitindo criar um novo tipo **removendo** propriedades específicas de um tipo ou interface existente.

---

## 1. O que é o `Omit<T, Keys>`?

O `Omit<T, Keys>` é ideal para quando queremos aproveitar quase toda a estrutura de um tipo, com exceção de algumas poucas propriedades que desejamos descartar ou ocultar.

* **`T`:** O tipo original de onde as propriedades serão retiradas.
* **`Keys`:** A chave (ou união de chaves com `|`) que desejamos omitir/remover da estrutura.

---

## 2. Por baixo dos panos (Under the hood)

A implementação do `Omit` no TypeScript é muito inteligente e combina outros dois utilitários: **`Pick`** e **`Exclude`**.

```typescript
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

* **`Exclude<keyof T, K>`:** Filtra a união com todas as chaves de `T` (`keyof T`), removendo as chaves passadas em `K`.
* **`Pick<T, ...>`:** Cria o novo tipo contendo apenas as chaves resultantes desse filtro.
* **`K extends keyof any`:** Permite que qualquer tipo que possa ser uma chave de objeto (`string | number | symbol`) seja passado no segundo argumento.

---

## 3. Exemplos Práticos

### Exemplo 1: Omitindo Senhas ou Dados Confidenciais (Camada de API)

Um dos casos de uso mais comuns é no backend: você tem uma interface representando o modelo de usuário do banco de dados, mas não quer que a senha trafegue nas respostas HTTP para o frontend.

```typescript
interface DBUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "admin" | "user";
  createdAt: Date;
}

// Criando um tipo seguro para enviar dados ao cliente
type CleanUser = Omit<DBUser, "passwordHash">;

const responseUser: CleanUser = {
  id: "usr_1020",
  name: "Tayron Rocha",
  email: "tayron@email.com",
  role: "admin",
  createdAt: new Date()
  // passwordHash não está disponível e gerará erro se for inserido aqui!
};
```

---

### Exemplo 2: Formulários de Criação (Removendo chaves autogeradas)

Quando vamos criar um novo item (como um produto), a requisição que o frontend envia para o backend não deve conter o `id` ou a data de criação `createdAt`, pois estas propriedades são geradas automaticamente pelo banco de dados ou backend.

```typescript
interface Produto {
  id: string;
  nome: string;
  preco: number;
  categoria: string;
  createdAt: Date;
}

// O tipo de dados necessário para a criação do produto
type CriarProdutoDTO = Omit<Produto, "id" | "createdAt">;

const novoProduto: CriarProdutoDTO = {
  nome: "Mouse Sem Fio",
  preco: 120.00,
  categoria: "Periféricos"
  // id e createdAt foram removidos!
};
```

---

### Exemplo 3: Uso Inline em Funções

Assim como o `Pick`, você pode usar o `Omit` diretamente na tipagem de parâmetros de funções, sem necessidade de declarar uma nova interface.

```typescript
interface Contrato {
  codigo: number;
  cliente: string;
  valor: number;
  assinado: boolean;
  observacoes: string;
}

function processarContrato(dados: Omit<Contrato, "assinado" | "observacoes">) {
  console.log(`Processando contrato ${dados.codigo} do cliente ${dados.cliente}`);
}

processarContrato({
  codigo: 48822,
  cliente: "Empresa XPTO",
  valor: 15000
});
```

---

## 4. Comparativo Prático: Pick vs Omit

A escolha entre `Pick` e `Omit` é puramente estratégica sobre qual caminho exige menos código escrito:

* **Use `Pick`** se a interface original tiver **muitos** campos e você quiser **apenas alguns**.
  * Exemplo: Interface com 20 propriedades, você quer apenas 2.
  * `Pick<T, "prop1" | "prop2">` (curto e direto).
  
* **Use `Omit`** se a interface original tiver **muitos** campos e você quiser **quase todos, removendo apenas alguns**.
  * Exemplo: Interface com 20 propriedades, você quer 18 (removendo 2).
  * `Omit<T, "propExcluida1" | "propExcluida2">` (curto e direto).

---

## 5. Limitações e Comportamentos Importantes do `Omit`

### A. O `Omit` não valida se a chave existe (Falta de Type Safety)

Ao contrário do `Pick`, que gera um erro se você tentar selecionar uma chave que não existe no tipo original, o `Omit` **não reclama** se você tentar omitir uma chave inexistente.

```typescript
interface Usuario {
  id: number;
  nome: string;
}

// O TypeScript compila isso sem erros, mesmo que "idade" não exista em Usuario!
type UsuarioSemIdade = Omit<Usuario, "idade">; 
```

Isso acontece porque a definição interna do `Omit` usa `K extends keyof any` (permitindo qualquer `string | number | symbol` no segundo argumento). Devido a isso, o editor de código (IDE) também não consegue sugerir o **autocomplete** das chaves disponíveis de `Usuario` ao preencher o segundo parâmetro.

#### Solução: Criando um `StrictOmit` personalizado
Se você deseja que o compilador acuse um erro caso tente omitir uma propriedade que não existe no tipo original, e também deseja ter o autocomplete das chaves, você pode definir seu próprio tipo utilitário:

```typescript
type StrictOmit<T, K extends keyof T> = Omit<T, K>;

// Agora o TypeScript gera um erro:
// type Teste = StrictOmit<Usuario, "idade">; 
// ❌ Error: Type '"idade"' does not satisfy the constraint 'keyof Usuario'.
```

---

### B. O `Omit` é "Raso" (Shallow)

Assim como o `Partial`, o `Omit` opera apenas no **primeiro nível** do objeto. Se você precisar remover uma propriedade de um objeto aninhado, você não pode simplesmente passar caminhos separados por ponto como `"endereco.numero"`.

```typescript
interface Endereco {
  rua: string;
  numero: number;
}

interface Cliente {
  nome: string;
  endereco: Endereco;
}

// Isso NÃO remove o 'numero' de dentro de 'endereco':
type ClienteSemNumero = Omit<Cliente, "endereco.numero">; // Não funciona!
```

#### Solução: Omitindo em níveis aninhados
Para resolver isso, você precisa omitir a propriedade inteira do objeto principal e depois redeclará-la aplicando o `Omit` no tipo interno:

```typescript
type ClienteSemNumero = Omit<Cliente, "endereco"> & {
  endereco: Omit<Endereco, "numero">;
};

const cliente: ClienteSemNumero = {
  nome: "Taylor",
  endereco: {
    rua: "Av. Paulista"
    // numero foi omitido com sucesso!
  }
};
```

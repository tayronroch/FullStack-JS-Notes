# Utilitários de Tipo (Utility Types)

Nesta aula, vamos conhecer os **Utility Types** (Utilitários de Tipo) nativos do TypeScript. O TypeScript fornece diversos utilitários globais que facilitam a transformação e a manipulação de tipos existentes, evitando que você precise reescrever ou duplicar interfaces e tipos manualmente.

---

## 1. O que são Utility Types?

Os **Utility Types** funcionam como "funções de tipo" internas. Você passa um tipo existente para eles como parâmetro genérico, e eles retornam um **novo tipo modificado** com base em alguma regra específica (como tornar todas as propriedades opcionais, remover campos ou selecionar apenas alguns).

Eles são extremamente úteis para manter o código limpo, DRY (Don't Repeat Yourself) e altamente tipado.

---

## 2. Utilitários Mais Comuns

Abaixo estão os principais utilitários integrados ao TypeScript e como eles transformam seus tipos:

### A. `Partial<T>`
Torna **todas as propriedades** de um tipo `T` opcionais (`?`). 

* **Caso de uso típico:** Atualização parcial de dados (ex: rotas `PATCH` de APIs).

```typescript
interface Usuario {
  id: number;
  nome: string;
  email: string;
}

// Sem o Partial, teríamos que passar todos os campos do usuário para atualizar:
function atualizarUsuario(id: number, dadosAtualizados: Partial<Usuario>) {
  // dadosAtualizados agora tem o tipo: { nome?: string; email?: string; id?: number }
  console.log(`Atualizando usuário ${id}`, dadosAtualizados);
}

atualizarUsuario(1, { nome: "Novo Nome" }); // Válido! (email e id não são obrigatórios aqui)
```

---

### B. `Required<T>`
Faz o oposto do `Partial`. Torna **todas as propriedades** de um tipo `T` obrigatórias, removendo qualquer indicador de opcionalidade (`?`).

```typescript
interface Carro {
  marca: string;
  modelo: string;
  ano?: number; // Opcional
}

// O tipo abaixo exige todas as propriedades, incluindo 'ano'
const carroCompleto: Required<Carro> = {
  marca: "Toyota",
  modelo: "Corolla",
  ano: 2024 // Agora 'ano' é obrigatório!
};
```

---

### C. `Readonly<T>`
Torna **todas as propriedades** de um tipo `T` somente leitura. Qualquer tentativa de reatribuir um valor a uma propriedade resultará em um erro de compilação.

```typescript
interface Config {
  apiUrl: string;
  timeout: number;
}

const config: Readonly<Config> = {
  apiUrl: "https://api.exemplo.com",
  timeout: 5000
};

// config.timeout = 10000; // ERRO! Não é possível atribuir a 'timeout' porque é uma propriedade de leitura.
```

---

### D. `Pick<T, Keys>`
Cria um novo tipo selecionando apenas um conjunto específico de chaves (`Keys`) de um tipo existente `T`.

* **Caso de uso típico:** Exibir dados parciais em tabelas ou listas sem carregar campos pesados ou sensíveis.

```typescript
interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
}

// Queremos apenas o nome e o preço para exibir em um card simples
type CardProduto = Pick<Produto, "nome" | "preco">;

const card: CardProduto = {
  nome: "Mouse Gamer",
  preco: 150.00
};
```

---

### E. `Omit<T, Keys>`
O oposto do `Pick`. Cria um novo tipo removendo chaves específicas (`Keys`) de um tipo existente `T`.

* **Caso de uso típico:** Remover informações confidenciais (como senhas) antes de retornar dados do usuário para o frontend.

```typescript
interface CadastroUsuario {
  id: number;
  nome: string;
  email: string;
  senhaHash: string; // Informação sensível
}

// Remove o campo 'senhaHash' para segurança
type PerfilPublico = Omit<CadastroUsuario, "senhaHash">;

const perfil: PerfilPublico = {
  id: 1,
  nome: "Ana",
  email: "ana@email.com"
  // senhaHash não pode ser adicionada aqui
};
```

---

### F. `Record<Keys, Type>`
Constrói um tipo de objeto cujas chaves de propriedade são `Keys` e cujos valores de propriedade são do tipo `Type`. É excelente para criar dicionários tipados de forma limpa.

```typescript
type Paginas = "home" | "sobre" | "contato";

interface InfoPagina {
  titulo: string;
}

const rotas: Record<Paginas, InfoPagina> = {
  home: { titulo: "Página Inicial" },
  sobre: { titulo: "Quem Somos" },
  contato: { titulo: "Fale Conosco" }
};
```

---

## Resumo

| Utilitário | O que faz |
| :--- | :--- |
| `Partial<T>` | Torna todas as propriedades opcionais. |
| `Required<T>` | Torna todas as propriedades obrigatórias. |
| `Readonly<T>` | Torna todas as propriedades somente leitura. |
| `Pick<T, K>` | Seleciona apenas as propriedades especificadas em `K`. |
| `Omit<T, K>` | Remove as propriedades especificadas em `K`. |
| `Record<K, T>` | Mapeia chaves do tipo `K` para valores do tipo `T`. |

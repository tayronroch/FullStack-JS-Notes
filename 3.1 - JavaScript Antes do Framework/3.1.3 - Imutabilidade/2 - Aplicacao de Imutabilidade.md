# 2 - Aplicacao de Imutabilidade

## O que e aplicacao de imutabilidade

Aplicar imutabilidade significa **tratar dados como somente leitura** e sempre criar novas versoes ao atualizar estado, listas e objetos. Isso evita efeitos colaterais, melhora previsibilidade e facilita testes.

## Onde a imutabilidade aparece na pratica

- **Estado de UI** (React, Vue, etc.).
- **Dados vindos de API** (evitar alterar a resposta original).
- **Listas e filtros** (ordenar, filtrar e mapear sem mutar).
- **Logs e historico** (manter versoes anteriores).

## Boas praticas essenciais

### 1) Copiar antes de alterar

```javascript
const usuario = { nome: "Ana", idade: 28 };
const atualizado = { ...usuario, idade: 29 };
```

### 2) Atualizar arrays com map/filter

```javascript
const lista = [1, 2, 3];
const novaLista = lista.map((n) => (n === 2 ? 20 : n));
```

```javascript
const semDois = lista.filter((n) => n !== 2);
```

### 3) Evitar metodos mutaveis

Evite usar `push`, `splice`, `sort`, `reverse` diretamente no array original.

```javascript
const nums = [3, 1, 2];
const ordenado = [...nums].sort((a, b) => a - b);
```

### 4) Copiar niveis internos (shallow vs deep)

```javascript
const usuario = { perfil: { nome: "Ana" } };
const novo = { ...usuario, perfil: { ...usuario.perfil, nome: "Bia" } };
```

## Exemplos praticos do dia a dia

### 1) Atualizar item de carrinho

```javascript
const carrinho = [
  { id: 1, nome: "Mouse", qtd: 1 },
  { id: 2, nome: "Teclado", qtd: 1 },
];

const novoCarrinho = carrinho.map((item) =>
  item.id === 2 ? { ...item, qtd: item.qtd + 1 } : item
);
```

### 2) Remover item por id

```javascript
const usuarios = [
  { id: 1, nome: "Ana" },
  { id: 2, nome: "Bia" },
];

const semBia = usuarios.filter((u) => u.id !== 2);
```

### 3) Adicionar item no inicio e no fim

```javascript
const tarefas = ["estudar", "treinar"];
const comNova = ["ler", ...tarefas, "descansar"];
```

### 4) Atualizar estado de formulario

```javascript
const state = { nome: "Ana", email: "a@a.com" };
const novoState = { ...state, email: "ana@a.com" };
```

## Boas praticas em funcoes

### Funcoes puras

```javascript
function atualizarIdade(usuario, idade) {
  return { ...usuario, idade };
}
```

Funcoes puras tornam o comportamento previsivel e testavel.

### Evitar efeitos colaterais

```javascript
const base = [1, 2, 3];

function dobrar(lista) {
  return lista.map((n) => n * 2);
}

const novo = dobrar(base);
```

## Erros comuns (nao faca)

### 1) Mutar direto

```javascript
const usuario = { nome: "Ana" };
usuario.nome = "Bia"; // mutacao
```

### 2) Usar sort no array original

```javascript
const nums = [3, 2, 1];
nums.sort(); // muta
```

### 3) Copia rasa sem cuidado

```javascript
const obj = { perfil: { nome: "Ana" } };
const copia = { ...obj };
copia.perfil.nome = "Bia"; // altera o original
```

## Quando nao precisa de imutabilidade

- Scripts pequenos e temporarios.
- Dados que nao vao ser reutilizados.
- Quando performance extrema exige mutacao controlada.

Mesmo nesses casos, deixe claro no codigo quando houver mutacao.

## Imutabilidade em performance

Imutabilidade cria novos objetos, o que pode gerar custo. O ideal e:

- alterar apenas o que precisa;
- evitar copias profundas desnecessarias;
- usar estruturas imutaveis apenas onde fazem sentido.

## Checklist de aplicacao

- Estou mutando o dado original?
- Consigo gerar uma nova versao?
- Preciso de copia profunda ou rasa?
- Metodos usados mudam o array?

## Resumo

Aplicar imutabilidade e criar novas versoes de dados ao atualizar estado. Isso reduz efeitos colaterais, facilita testes e deixa o codigo mais confiavel. O custo existe, mas com boas praticas o ganho e maior.

## Exercicios avancados (com respostas)

### 1) Atualizar quantidade de produto

**Enunciado:** Dado um array de produtos, atualize a quantidade do `id = 2`.

**Resposta:**

```javascript
const produtos = [
  { id: 1, qtd: 1 },
  { id: 2, qtd: 3 },
];

const atualizados = produtos.map((p) =>
  p.id === 2 ? { ...p, qtd: p.qtd + 1 } : p
);
```

### 2) Remover item com splice (errado) vs filter (certo)

**Enunciado:** Remova o item `"b"` do array sem mutar.

**Resposta:**

```javascript
const arr = ["a", "b", "c"];
const novo = arr.filter((v) => v !== "b");
```

### 3) Atualizar objeto com nested

**Enunciado:** Mude `cidade` de `perfil` para `"RJ"` sem mutar.

**Resposta:**

```javascript
const usuario = { perfil: { cidade: "SP" } };
const novo = { ...usuario, perfil: { ...usuario.perfil, cidade: "RJ" } };
```

## Resumo final em tabela

| Situacao | Exemplo | Observacao |
| --- | --- | --- |
| Atualizar objeto | `{ ...obj, a: 2 }` | Nao muta |
| Atualizar array | `arr.map(...)` | Nova lista |
| Remover item | `arr.filter(...)` | Nao muta |
| Evitar sort direto | `[...arr].sort()` | Preserva original |

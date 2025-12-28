# 6 - Manipulando Objetos Imutaveis

## O que significa manipular objetos de forma imutavel

Manipular objetos de forma imutavel significa **nao alterar o objeto original**. Em vez disso, voce cria um novo objeto com as mudancas desejadas.

Esse padrao ajuda porque:

- evita efeitos colaterais inesperados;
- torna comparacoes e debug mais simples;
- facilita rastrear historico de alteracoes.

## Quando usar

- Ao atualizar estado em interfaces (React/Vue).
- Ao trabalhar com dados compartilhados.
- Quando precisa evitar efeitos colaterais.

## Pros e contras

### Vantagens

- **Previsibilidade**: o dado antigo nao muda.
- **Facilidade de teste**: funcoes puras sao mais simples de validar.
- **Debug mais claro**: cada mudanca gera um novo estado.
- **Melhor integracao com UI**: frameworks detectam mudanca por referencia.

### Desvantagens

- **Mais alocacao de memoria**: novos objetos sao criados.
- **Custo em dados grandes**: copias profundas podem ser caras.
- **Mais codigo**: updates exigem mais linhas.

Use imutabilidade quando os beneficios superam o custo, principalmente em UI e dados compartilhados.

## Criar um novo objeto com spread

```javascript
const usuario = { nome: "juliosilva", idade: 28 };
const atualizado = { ...usuario, idade: 29 };
```

## Adicionar propriedade

```javascript
const usuario = { nome: "juliosilva", idade: 28 };
const comStatus = { ...usuario, status: "ativo" };
```

## Remover propriedade

```javascript
const usuario = { nome: "juliosilva", idade: 28, cidade: "SP" };
const { cidade, ...semCidade } = usuario;
```

## Usando rest operator para separar dados

O rest operator (`...`) ajuda a separar propriedades e manter o restante sem mutar o objeto original:

```javascript
const pedido = {
  id: 1,
  status: "pendente",
  cliente: "Ana",
};

const { status, ...dadosBasicos } = pedido;

console.log(status);       // "pendente"
console.log(dadosBasicos); // { id: 1, cliente: "Ana" }
```

## Atualizar propriedade aninhada

```javascript
const usuario = {
  nome: "juliosilva",
  perfil: { cidade: "SP", cargo: "Dev" },
};

const atualizado = {
  ...usuario,
  perfil: { ...usuario.perfil, cidade: "RJ" },
};
```

## Mesclar dois objetos

```javascript
const base = { nome: "juliosilva" };
const extra = { idade: 28 };
const combinado = { ...base, ...extra };
```

## Atualizar item em objeto por id

```javascript
const usuarios = {
  1: { nome: "juliosilva", idade: 20 },
  2: { nome: "Bia", idade: 25 },
};

const atualizado = {
  ...usuarios,
  2: { ...usuarios[2], idade: 26 },
};
```

## Evitar mutacoes acidentais

```javascript
const config = { tema: "claro" };
const novoConfig = { ...config };
// altere sempre o novoConfig, nao o original
```

## Exemplos praticos da vida real

### 1) Atualizar perfil em um app

```javascript
const perfil = { nome: "juliosilva", bio: "Dev" };
const novoPerfil = { ...perfil, bio: "Dev Fullstack" };
```

### 2) Atualizar preferencias do usuario

```javascript
const preferencias = { tema: "claro", idioma: "pt-BR" };
const novasPreferencias = { ...preferencias, tema: "escuro" };
```

### 3) Alterar endereco sem mutar

```javascript
const cliente = {
  nome: "juliosilva",
  endereco: { rua: "Av. Brasil", numero: 10 },
};

const novoCliente = {
  ...cliente,
  endereco: { ...cliente.endereco, numero: 20 },
};
```

### 4) Atualizar status de pedido

```javascript
const pedido = { id: 1, status: "pendente" };
const novoPedido = { ...pedido, status: "enviado" };
```

### 5) Configuracao de sistema

```javascript
const config = { cache: true, log: "info" };
const novaConfig = { ...config, log: "debug" };
```

### 6) Edicao de item em lista por id

```javascript
const produtos = {
  1: { nome: "Mouse", preco: 50 },
  2: { nome: "Teclado", preco: 100 },
};

const novosProdutos = {
  ...produtos,
  2: { ...produtos[2], preco: 120 },
};
```

## Onde usar e onde evitar

### Use quando:

- o dado e compartilhado por varias partes do sistema;
- voce precisa manter historico de alteracoes;
- a interface depende de comparacoes por referencia.

### Evite quando:

- o dado e local e descartavel;
- o custo de copiar e muito alto;
- performance e prioridade e a mutacao e controlada.

## Exemplos praticos do dia a dia

### 1) Atualizar email do usuario

```javascript
const usuario = { nome: "juliosilva", email: "juliosilva@a.com" };
const atualizado = { ...usuario, email: "juliosilva@a.com" };
```

### 2) Atualizar endereco

```javascript
const cliente = {
  nome: "juliosilva",
  endereco: { rua: "Av. Brasil", numero: 20 },
};

const novoCliente = {
  ...cliente,
  endereco: { ...cliente.endereco, numero: 30 },
};
```

### 3) Trocar plano

```javascript
const conta = { nome: "juliosilva", plano: "basico" };
const upgrade = { ...conta, plano: "premium" };
```

## Boas praticas

- Sempre copie o nivel que vai mudar.
- Use nomes claros para novas variaveis.
- Evite mutar objetos recebidos como parametro.
- Se o objeto for complexo, copie apenas o necessario.

## Conceito mais detalhado

Em JavaScript, objetos sao **referencias** na memoria. Quando voce altera uma propriedade, qualquer outra variavel que aponte para esse objeto ve a mudanca. A imutabilidade evita isso criando uma nova referencia para cada alteracao, o que torna o fluxo de dados mais controlado e previsivel.

## Resumo

Manipular objetos de forma imutavel e criar novas versoes sem alterar o original. Isso garante previsibilidade e reduz bugs.

## Exercicios avancados (com respostas)

### 1) Atualizar idade

**Enunciado:** Atualize a idade para 30 sem mutar o original.

**Resposta:**

```javascript
const pessoa = { nome: "juliosilva", idade: 25 };
const novaPessoa = { ...pessoa, idade: 30 };
```

### 2) Remover propriedade

**Enunciado:** Remova a propriedade `senha` sem mutar.

**Resposta:**

```javascript
const usuario = { nome: "juliosilva", senha: "123" };
const { senha, ...seguro } = usuario;
```

### 3) Atualizar objeto interno

**Enunciado:** Atualize `cidade` dentro de `endereco`.

**Resposta:**

```javascript
const cliente = { endereco: { cidade: "SP" } };
const novo = { ...cliente, endereco: { ...cliente.endereco, cidade: "RJ" } };
```

## Resumo final em tabela

| Situacao       | Exemplo                   | Observacao          |
| -------------- | ------------------------- | ------------------- |
| Atualizar prop | `{ ...obj, a: 2 }`        | Nao muta            |
| Remover prop   | `const { x, ...o } = obj` | Cria novo           |
| Nested         | `{ ...o, n: { ...o.n } }` | Copia nivel interno |
| Mesclar        | `{ ...a, ...b }`          | Ordem importa       |

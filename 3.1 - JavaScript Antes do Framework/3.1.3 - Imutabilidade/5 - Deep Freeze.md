# 5 - Deep Freeze

## O que e deep freeze

Deep freeze e uma tecnica para **congelar todos os niveis** de um objeto, impedindo mudancas tanto no nivel principal quanto em objetos e arrays internos.

Ele resolve o problema do `Object.freeze()` comum, que e **shallow** e nao protege estruturas aninhadas.

## Quando usar

- Para configuracoes que nao podem ser alteradas.
- Para dados compartilhados por varias partes do sistema.
- Para evitar mutacoes acidentais em objetos complexos.

## Exemplo simples

```javascript
const config = {
  ui: { tema: "claro" },
  cache: { ativo: true },
};
```

Com `Object.freeze()` apenas o primeiro nivel fica protegido:

```javascript
Object.freeze(config);
config.ui.tema = "escuro"; // altera
```

## Deep freeze na pratica (recursivo)

```javascript
function deepFreeze(obj) {
  Object.freeze(obj);

  Object.keys(obj).forEach((key) => {
    const valor = obj[key];
    if (valor && typeof valor === "object" && !Object.isFrozen(valor)) {
      deepFreeze(valor);
    }
  });

  return obj;
}
```

```javascript
const config = {
  ui: { tema: "claro" },
  cache: { ativo: true },
};

deepFreeze(config);
config.ui.tema = "escuro"; // nao altera
```

## Deep freeze com arrays

```javascript
const data = {
  itens: [1, 2, 3],
};

deepFreeze(data);
data.itens.push(4); // nao altera
```

## Boas praticas

- Use deep freeze em objetos que realmente nao devem mudar.
- Evite congelar estruturas grandes sem necessidade.
- Use em ambiente de desenvolvimento para detectar mutacoes.

## Cuidados importantes

- `deepFreeze` nao protege contra mutacoes via APIs externas.
- Objetos muito grandes podem gerar custo de performance.
- `deepFreeze` nao copia, apenas congela.

## Resumo

Deep freeze congela todos os niveis de um objeto, garantindo imutabilidade real. Ele e ideal para configs e dados compartilhados, mas deve ser usado com criterio.

## Exercicios avancados (com respostas)

### 1) Congelar objeto com nested

**Enunciado:** Congele `{ a: { b: 1 } }` com deep freeze.

**Resposta:**

```javascript
const obj = { a: { b: 1 } };
deepFreeze(obj);
```

### 2) Congelar objeto com array

**Enunciado:** Congele `{ lista: [1, 2] }`.

**Resposta:**

```javascript
const obj = { lista: [1, 2] };
deepFreeze(obj);
```

### 3) Confirmar que nao muda

**Enunciado:** Tente alterar `obj.a.b` e explique o resultado.

**Resposta:**

```javascript
const obj = { a: { b: 1 } };
deepFreeze(obj);
obj.a.b = 2; // nao altera
```

## Resumo final em tabela

| Situacao | Exemplo | Observacao |
| --- | --- | --- |
| Shallow freeze | `Object.freeze(obj)` | Nao congela nested |
| Deep freeze | `deepFreeze(obj)` | Congela todos os niveis |
| Arrays | `deepFreeze({ arr: [] })` | Bloqueia push/splice |
| Performance | Objetos grandes | Use com criterio |

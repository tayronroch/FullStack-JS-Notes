# 15 - Parâmetros Nomeados (Named Groups) com Regex

Quando criamos rotas dinâmicas como `/products/:id`, o Node.js nativo não sabe por padrão o que é `:id`. Para resolver isso de forma elegante, utilizamos um recurso moderno do JavaScript (introduzido no ES2018): os **Parâmetros Nomeados em Expressões Regulares (Named Capture Groups)**.

Nesta aula, entenderemos a fundo como essa funcionalidade funciona no JavaScript, como ela foi implementada no seu helper de utilidade e como os valores são extraídos de forma automática no servidor.

---

## 1. O que são Named Capture Groups no JavaScript?

Em expressões regulares normais, quando agrupamos padrões usando parênteses `()`, o JavaScript captura os resultados baseando-se em sua **posição (índice numérico)**:

```javascript
const regexComum = /\/products\/([^/]+)/;
const match = "/products/7".match(regexComum);

console.log(match[1]); // "7" (Acessado via índice da captura)
```

Com o **ES2018**, podemos dar um **nome** para esse grupo de captura usando a sintaxe `(?<nomeDoGrupo>padrao)` logo no início do grupo. Isso faz com que o JavaScript organize os resultados dentro de um objeto chamado `groups`:

```javascript
// Definindo o grupo com o nome 'id'
const regexNomeada = /\/products\/(?<id>[^/]+)/;
const match = "/products/7".match(regexNomeada);

console.log(match.groups);    // { id: "7" }
console.log(match.groups.id); // "7" (Acesso direto e semântico!)
```

---

## 2. A Mágica no seu Helper `parseRoutePath`

No arquivo `parseRoutePath.js`, você tem a seguinte lógica de substituição:

```javascript
const routeParametersRegex = /:([a-zA-Z]+)/g;
const params = path.replaceAll(routeParametersRegex, "(?<$1>[a-z0-9-_]+)");
```

### O que acontece por baixo dos panos?

Se a rota definida for `/products/:id`:
1. O `routeParametersRegex` encontra o trecho `:id`.
2. O `$1` no segundo argumento do `replaceAll` faz referência à palavra capturada (neste caso, `id`).
3. O trecho `:id` é substituído por `(?<id>[a-z0-9-_]+)`.
4. A rota final vira a Regex: `/^\/products\/(?<id>[a-z0-9-_]+)$/`.

Se a rota tivesse múltiplos parâmetros, como `/users/:userId/books/:bookId`, ela seria convertida para:
`/^\/users\/(?<userId>[a-z0-9-_]+)\/books\/(?<bookId>[a-z0-9-_]+)$/`

---

## 3. Extraindo os Parâmetros no Roteador

Graças à propriedade `.groups` dos Named Capture Groups, no `routeHandler.js` conseguimos recuperar todos os parâmetros definidos na URL com apenas uma linha de código:

```javascript
if (route) {
  const match = pathname.match(route.path);
  
  // match.groups conterá um objeto como { id: '7' } ou { userId: '1', bookId: '42' }
  request.params = match.groups || {};

  return route.controller(request, response);
}
```

Isso evita a necessidade de percorrer arrays, comparar índices manualmente ou mapear nomes de parâmetros externos, tornando o roteador nativo extremamente performático e robusto.

---

## 4. Diferenças práticas entre Named Groups e Index-based Groups

| Característica | Grupos por Posição (`match[1]`) | Parâmetros Nomeados (`match.groups.id`) |
| :--- | :--- | :--- |
| **Sintaxe de definição** | `([^/]+)` | `(?<id>[^/]+)` |
| **Facilidade de leitura** | Baixa (exige saber a ordem dos parênteses) | Alta (o nome do parâmetro está no próprio objeto) |
| **Resiliência** | Frágil (se você alterar a ordem dos parâmetros na rota, os índices mudam) | Forte (os valores continuam vinculados aos nomes corretos) |
| **Suporte** | Desde versões muito antigas do JS | Adicionado no ES2018 (suportado no Node.js v10+) |

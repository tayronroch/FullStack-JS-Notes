# 5 - Exportação Padrão vs Nomeada

Nesta aula, vamos aprofundar a diferença entre as duas formas de exportar módulos no JavaScript, entendendo as vantagens e desvantagens de cada uma para que você possa tomar a melhor decisão no seu projeto.

---

## 1. Exportação Nomeada (Named Export)

A exportação nomeada permite que você exporte múltiplos valores (variáveis, funções, classes) de um único arquivo.

```javascript
// utilitarios.js
export const somar = (a, b) => a + b;
export const subtrair = (a, b) => a - b;
export const PI = 3.14;
```

Para importar, você **deve** usar as chaves `{}` e o nome exato que foi exportado.

```javascript
import { somar, PI } from "./utilitarios.js";
```

### ✅ Prós (Vantagens):
- **Auto-complete (IntelliSense):** O VS Code e outras IDEs conseguem sugerir o que importar assim que você abre as chaves.
- **Múltiplas exportações:** Útil para bibliotecas de funções utilitárias ou conjuntos de constantes.
- **Refatoração Segura:** Se você mudar o nome da função no arquivo original, a IDE consegue identificar e renomear automaticamente em todos os lugares que a utilizam.
- **Clareza:** Quem lê o arquivo de importação sabe exatamente o que está sendo trazido.

### ❌ Contras (Desvantagens):
- **Sintaxe mais verbosa:** Exige sempre o uso de `{}`.
- **Ridez no Nome:** Você precisa conhecer o nome exato definido pelo autor do módulo (a menos que use `as` para renomear).

---

## 2. Exportação Padrão (Default Export)

A exportação padrão é usada quando o módulo tem um "valor principal". Cada arquivo só pode ter **uma única** exportação default.

```javascript
// Calculadora.js
export default class Calculadora {
  // ... lógica da classe
}
```

Para importar, você **não** usa chaves e pode escolher **qualquer nome** para o item importado.

```javascript
import MinhaCalculadora from "./Calculadora.js";
```

### ✅ Prós (Vantagens):
- **Sintaxe Simples:** Importação direta e limpa, sem a necessidade de chaves.
- **Flexibilidade de Nome:** Útil quando você quer dar um nome mais contextual no arquivo que está recebendo o módulo.
- **Padrão de Componentes:** Muito utilizado em frameworks (como React e Vue) para exportar o componente principal de um arquivo.

### ❌ Contras (Desvantagens):
- **Dificulta o IntelliSense:** Como o nome é livre, a IDE muitas vezes não sabe o que sugerir, o que pode diminuir a produtividade.
- **Inconsistência:** O mesmo módulo pode ser importado com nomes diferentes em arquivos diferentes (ex: um importa como `User`, outro como `Usuario`), o que pode confundir a equipe.
- **Risco de Erros Silenciosos:** Se você exportar algo como default e depois mudar o que é exportado, o import continuará funcionando com o nome antigo, ocultando mudanças estruturais.

---

## 3. Qual escolher? (Tabela Comparativa)

| Característica | Nomeada (Named) | Padrão (Default) |
| :--- | :--- | :--- |
| **Quantidade** | Múltiplas por arquivo | Apenas uma por arquivo |
| **Sintaxe de Import** | Requer chaves `{ }` | Sem chaves |
| **Nome no Import** | Deve ser o nome exato | Pode ser qualquer nome |
| **Suporte da IDE** | Excelente (Auto-complete) | Limitado / Manual |
| **Uso Comum** | Bibliotecas, Utils, Constantes | Classes, Componentes, Funções Únicas |

---

## 4. Boas Práticas Recomendadas

1. **Prefira Exportações Nomeadas:** A tendência moderna (especialmente em grandes projetos) é usar quase exclusivamente exportações nomeadas. Isso torna o código mais rastreável e fácil de manter.
2. **Use Default para o "Prato Principal":** Se o seu arquivo tem uma função ou classe que é claramente a razão de ser daquele arquivo, o `default` é aceitável.
3. **Evite exportar objetos gigantes no Default:** Em vez de fazer `export default { somar, subtrair }`, prefira exportar cada função individualmente. Isso ajuda o "Tree Shaking" (processo que remove código não utilizado para deixar o app mais leve).

---

## Exercícios de Fixação

### 1) Identificando o erro
**Enunciado:** O arquivo `api.js` contém `export default function getUser() {}`. Qual a forma correta de importar?
- A) `import { getUser } from "./api.js"`
- B) `import getUser from "./api.js"`
- C) `import { default as getUser } from "./api.js"`

**Resposta:** As opções **B** e **C** estão corretas, mas a **B** é a forma padrão e recomendada.

### 2) Vantagem Técnica
**Enunciado:** Por que as exportações nomeadas são consideradas melhores para grandes equipes?
**Resposta:** Porque elas forçam uma padronização de nomes em todo o projeto e permitem que as ferramentas de desenvolvimento (IDEs) ajudem na navegação e refatoração do código com precisão.

---

## Resumo Final

Use **Named Exports** quando quiser clareza, suporte da IDE e múltiplas funcionalidades. Use **Default Exports** quando tiver um item central e quiser uma importação mais rápida e flexível. Na dúvida, vá de **Named Export**!

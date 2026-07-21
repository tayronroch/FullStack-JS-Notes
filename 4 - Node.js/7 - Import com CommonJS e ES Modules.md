# 7 - Importações com CommonJS e ES Modules (ESM)

A modularização é um pilar fundamental no desenvolvimento de software. Dividir o código em múltiplos arquivos (módulos) torna os projetos organizados, testáveis e fáceis de manter. 

No ecossistema do Node.js, existem dois sistemas de módulos principais para gerenciar importações e exportações: **CommonJS (CJS)** e **ES Modules (ESM)**. Nesta aula, entenderemos a diferença de comportamento, sintaxe e como alternar entre eles.

---

## 1. O que é o CommonJS (CJS)?

O **CommonJS** é o sistema de módulos padrão histórico do Node.js. Qualquer arquivo `.js` criado no Node.js é tratado como CommonJS por padrão (a menos que configurado o contrário).

### Sintaxe de Exportação (CommonJS)

Você exporta elementos associando-os ao objeto global `module.exports`:

```javascript
// operacoes.js (CommonJS)
const somar = (a, b) => a + b;
const subtrair = (a, b) => a - b;

// Exportando múltiplos valores como um objeto
module.exports = { somar, subtrair };
```

### Sintaxe de Importação (CommonJS)

Para carregar um módulo no CommonJS, usamos a função síncrona `require()`:

```javascript
// Importando um módulo local (note o caminho './')
const { somar } = require('./operacoes');

// Importando um módulo nativo do Node.js (sem './')
const http = require('http');

// Boa prática moderna: usar o prefixo 'node:' para destacar que é um módulo nativo
const http = require('node:http');
```

### Características do CommonJS:
* **Carregamento Síncrono:** Os módulos são lidos e executados um por um, de forma sequencial.
* **Dinâmico:** Você pode colocar o `require()` dentro de funções ou estruturas condicionais (`if/else`):
  ```javascript
  if (ambiente === "desenvolvimento") {
    const logger = require('./logger'); // Válido no CommonJS!
  }
  ```
* **Extensão Opcional:** Não é obrigatório especificar a extensão `.js` ao importar arquivos locais.

---

## 2. O que é o ES Modules (ESM)?

O **ES Modules** é o padrão oficial de módulos da linguagem JavaScript (especificado pelo ECMAScript). É o sistema utilizado nativamente pelos navegadores modernos e frameworks modernos como React, Vue, Next.js e Vite.

### Sintaxe de Exportação (ES Modules)

No ESM, podemos exportar de duas formas:
1. **Named Exports (Exportações Nomeadas):** Vários itens por arquivo.
2. **Default Export (Exportação Padrão):** Apenas um item principal por arquivo.

```javascript
// utilitarios.js (ES Modules)

// 1. Named Export (Exportação Nomeada)
export const formatarMoeda = (valor) => `R$ ${valor.toFixed(2)}`;

// 2. Default Export (Exportação Padrão)
const config = { api: "https://api.com" };
export default config;
```

### Sintaxe de Importação (ES Modules)

Usamos a palavra-chave `import` na raiz do arquivo:

```javascript
// Importando um módulo local (com caminho './' e extensão obrigatória '.js')
import config, { formatarMoeda } from './utilitarios.js';

// Importando um módulo nativo do Node.js (sem './')
import http from 'http';

// Boa prática moderna: usar o prefixo 'node:' para destacar que é um módulo nativo
import http from 'node:http';
```

> [!NOTE]
> O prefixo `node:` (ex: `node:http`, `node:fs`) é uma convenção moderna altamente recomendada. Ele evita conflitos com pacotes homônimos do NPM e deixa explícito no código que se trata de uma API nativa do próprio ambiente Node.js.

### Características do ES Modules:
* **Carregamento Estático:** O compilador precisa ler todas as importações *antes* de executar qualquer linha de código.
* **Não Condicional:** Você **não pode** declarar um `import` dentro de uma estrutura condicional ou função:
  ```javascript
  if (true) {
    import './logger.js'; // ❌ ERRO de sintaxe!
  }
  ```
* **Extensões Obrigatórias:** Ao importar arquivos locais no Node.js com ESM, você **deve especificar a extensão do arquivo** (ex: usar `./modulo.js` em vez de `./modulo`).

---

## 3. Como Habilitar o ES Modules no Node.js?

Existem duas maneiras de indicar ao Node.js que você deseja usar a sintaxe moderna do ES Modules:

### Método 1: Habilitar no projeto inteiro (`package.json`)
Adicione a propriedade `"type": "module"` no arquivo `package.json` da raiz do seu projeto. Isso fará com que o Node trate todos os arquivos `.js` desse diretório como ES Modules.

```json
{
  "name": "meu-projeto",
  "type": "module"
}
```

### Método 2: Controlar por extensões de arquivos
Você pode definir o comportamento individual de cada arquivo usando extensões específicas:
* **`.cjs`**: Força o arquivo a ser executado como **CommonJS** (usa `require`).
* **`.mjs`**: Força o arquivo a ser executado como **ES Modules** (usa `import`).

---

## 4. Comparativo Direto: CJS vs ESM

| Característica | CommonJS (CJS) | ES Modules (ESM) |
| :--- | :--- | :--- |
| **Sintaxe de Importação** | `const modulo = require('modulo')` | `import modulo from 'modulo'` |
| **Sintaxe de Exportação** | `module.exports` ou `exports` | `export` ou `export default` |
| **Resolução das Dependências** | Em tempo de execução (síncrona) | Em tempo de compilação (estática) |
| **Uso Condicional** | Permitido (dentro de `if` ou funções) | Proibido (deve ser no topo do arquivo) |
| **Extensão do Arquivo Local** | Opcional (ex: `require('./util')`) | Obrigatória (ex: `import './util.js'`) |
| **Variáveis Globais de Caminho** | Possui `__dirname` e `__filename` | Não possui `__dirname` e `__filename` |

---

## 5. O Problema do `__dirname` no ES Modules

No CommonJS, temos acesso fácil às variáveis globais `__dirname` (caminho da pasta do arquivo atual) e `__filename` (caminho completo do arquivo atual).

Se você tentar executar `console.log(__dirname)` no ES Modules, o Node.js lançará o erro:
`ReferenceError: __dirname is not defined`

### Solução: Recriando `__dirname` no ESM
Para obter os caminhos no ES Modules, precisamos usar o objeto `import.meta.url` (que contém o caminho do arquivo no formato de URL) e convertê-lo usando os módulos nativos `url` e `path`:

```javascript
// index.js (ES Modules)
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Captura o caminho do arquivo atual
const __filename = fileURLToPath(import.meta.url);

// Captura a pasta onde o arquivo está localizado
const __dirname = dirname(__filename);

console.log("Arquivo atual:", __filename);
console.log("Diretório atual:", __dirname);
```

---

## 6. Interoperabilidade (Misturando os dois mundos)

Misturar os dois formatos em um mesmo projeto pode causar dores de cabeça se você não seguir estas regras:

1. **Importar CommonJS de dentro do ES Modules:**
   * **Válido!** Você pode importar pacotes CommonJS (como o `lodash`) de dentro do ESM usando a sintaxe de `import`:
     ```javascript
     import _ from 'lodash'; // Funciona perfeitamente
     ```
2. **Importar ES Modules de dentro do CommonJS:**
   * **Bloqueado!** Você não pode usar `require()` para carregar um arquivo ES Modules. O Node.js disparará o erro `ERR_REQUIRE_ESM`.
   * Para importar ESM dentro de CJS, você precisará usar uma importação dinâmica síncrona com `import()`, que retorna uma Promise:
     ```javascript
     import('./modulo-esm.js').then((modulo) => {
       // Usando o módulo ESM aqui dentro
     });
     ```

# 1 - Armazenando dados na nova pasta criada

Até o momento, estávamos armazenando os dados da nossa API em memória (como um simples array de produtos: `const products = []`). 

Embora essa abordagem seja útil para testes rápidos, ela apresenta problemas graves para aplicações reais:
* **Perda de Dados**: Toda vez que o servidor é reiniciado (o que ocorre automaticamente a cada alteração com o `node --watch`), todos os dados são apagados.
* **Consumo de RAM**: Todos os dados ficam alocados na memória do processo do Node.js.

Nesta aula, aprenderemos a persistir os dados salvando-os em um arquivo físico local (`db.json`) utilizando o módulo nativo **`node:fs`** (File System) do Node.js, estruturando uma classe simuladora de banco de dados.

---

## 1. O módulo `node:fs` (File System)

O Node.js possui um módulo nativo muito poderoso para lidar com o sistema de arquivos do computador chamado `fs`. 

Hoje em dia, a recomendação é utilizar a versão baseada em **Promises** deste módulo, que nos permite utilizar `async/await` em vez de callbacks:

```javascript
import fs from 'node:fs/promises';
```

### Principais métodos que utilizaremos:
* **`fs.readFile(caminho, codificacao)`**: Lê o conteúdo de um arquivo de forma assíncrona.
* **`fs.writeFile(caminho, dados)`**: Escreve (ou sobrescreve) o conteúdo de um arquivo.

---

## 2. Definindo o Caminho do Banco de Dados (`db.json`)

Para que o nosso banco de dados funcione corretamente em qualquer computador, não podemos usar caminhos absolutos fixos (ex: `/Users/tayron/...`). 

Utilizamos o módulo **`node:url`** com a constante global **`import.meta.url`** (no ES Modules) para calcular dinamicamente o caminho absoluto do arquivo `db.json` relativo ao arquivo de banco de dados:

```javascript
import { URL } from 'node:url';

// Resolve o caminho para gerar o arquivo 'db.json' na mesma pasta deste arquivo
const databasePath = new URL('../db.json', import.meta.url);
```

---

## 3. Construindo a Classe `Database`

Criaremos uma classe que centraliza todas as operações de leitura e escrita. Ela conterá um método privado `#persist()` responsável por salvar o estado atual do banco no arquivo `db.json`.

```javascript
// src/database.js
import fs from 'node:fs/promises';

const databasePath = new URL('../db.json', import.meta.url);

export class Database {
  // Propriedade privada para armazenar os dados na memória temporariamente
  #database = {};

  // O construtor roda automaticamente ao instanciar a classe
  constructor() {
    // Inicializa a base de dados lendo o arquivo físico
    fs.readFile(databasePath, 'utf8')
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        // Se o arquivo não existir, inicializa com um objeto vazio e o cria fisicamente
        this.#persist();
      });
  }

  // Método privado para persistir os dados da memória para o arquivo físico db.json
  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database, null, 2));
  }

  // Método para buscar todos os dados de uma tabela
  select(table) {
    const data = this.#database[table] ?? [];
    return data;
  }

  // Método para inserir novos dados em uma tabela
  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    this.#persist(); // Salva no arquivo db.json
    return data;
  }
}
```

---

## 4. Como utilizar a classe no Servidor

Após criar a classe, podemos importá-la e utilizá-la em nossas rotas:

```javascript
import { Database } from './database.js';

const database = new Database();

// Ao cadastrar um produto (POST)
database.insert('products', { name: 'Teclado', price: 120 });

// Ao listar os produtos (GET)
const products = database.select('products');
```

# 8 - Usando Classes nos Módulos

As classes são fundamentais para organizar código orientado a objetos. Em JavaScript moderno, os módulos facilitam muito a exportação de classes para que possam ser reutilizadas em diferentes partes da aplicação.

---

## Para que as Classes são mais usadas?

Antes de entendermos como exportá-las, é importante saber por que as usamos. As classes servem principalmente para:

1.  **Criar "Moldes" para Objetos:** Definir uma estrutura única para criar múltiplos objetos similares (ex: vários usuários, produtos ou pedidos).
2.  **Agrupar Dados e Comportamentos:** Manter propriedades (dados) e métodos (funções) que pertencem ao mesmo contexto juntos, facilitando a manutenção.
3.  **Gerenciar Estados Complexos:** Ideais para componentes que precisam guardar informações que mudam com o tempo (ex: um cronômetro ou um carrinho de compras).
4.  **Herança e Reutilização:** Permitir que uma classe herde características de outra, evitando a repetição de código.
5.  **Criação de Serviços:** Centralizar lógicas específicas, como chamadas de API (`ApiService`) ou gerenciamento de cache.

---

## 1. Exportando uma Classe como Default

Este é o padrão mais comum quando um arquivo contém apenas uma classe principal (como um componente, um serviço ou um modelo).

```javascript
// Usuario.js
export default class Usuario {
  constructor(nome) {
    this.nome = nome;
  }

  dizerOla() {
    console.log(`Olá, meu nome é ${this.nome}`);
  }
}
```

Para importar, não usamos chaves:

```javascript
// main.js
import Usuario from "./Usuario.js";

const user = new Usuario("Tayron");
user.dizerOla();
```

---

## 2. Exportando Múltiplas Classes (Nomeadas)

Se você tiver um conjunto de classes relacionadas (como tipos de erros ou utilitários pequenos), pode usar as exportações nomeadas.

```javascript
// Erros.js
export class ErroValidacao extends Error {}
export class ErroConexao extends Error {}
```

Para importar, usamos as chaves:

```javascript
import { ErroValidacao, ErroConexao } from "./Erros.js";
```

---

## 3. Instanciando vs. Exportando a Instância

Existem dois padrões principais de uso:

### ✅ A) Exportar a Classe (Mais comum)
Você exporta o "molde" e quem importa cria a instância quando precisar.
```javascript
export default class Servico {}
// Import: import Servico from "./Servico.js"; const s = new Servico();
```

### ✅ B) Exportar a Instância (Singleton)
Útil para serviços que devem ser compartilhados e manter o mesmo estado em toda a aplicação (ex: um gerenciador de cache ou conexão de banco).
```javascript
class GerenciadorDeEstado {
  constructor() { this.estado = {}; }
}
export const estado = new GerenciadorDeEstado();
```

---

## 4. Dicas de Organização

1. **Um arquivo, uma classe:** Sempre que possível, mantenha uma classe por arquivo se ela for grande. Isso torna o projeto muito mais fácil de navegar.
2. **Nomes de arquivos:** Use nomes que comecem com letra maiúscula para arquivos que exportam classes como default (ex: `Calculadora.js` em vez de `calculadora.js`).
3. **Extensões:** Lembre-se que você pode importar uma classe de um módulo e estendê-la em outro arquivo.

---

## Exercícios de Fixação

### 1) Exportação Default
**Enunciado:** Crie uma classe `Calculadora` com um método `somar(a, b)` e exporte-a como default.

**Resposta:**
```javascript
export default class Calculadora {
  somar(a, b) {
    return a + b;
  }
}
```

### 2) Importação e Uso
**Enunciado:** Como você importaria e criaria um objeto da classe `Calculadora` criada acima?

**Resposta:**
```javascript
import Calculadora from "./Calculadora.js";

const calc = new Calculadora();
console.log(calc.somar(5, 5));
```

---

## Resumo

- Classes podem ser exportadas como **Default** (mais comum para um item por arquivo) ou **Nomeadas**.
- Exportar a classe permite que quem importa crie múltiplas instâncias.
- Exportar a instância (já com o `new`) cria um padrão onde todos compartilham o mesmo objeto.


# Objetos em JavaScript (Intermediário)

Este guia explora conceitos de objetos em JavaScript, começando pelo básico e aprofundando em tópicos intermediários como protótipos, construtores, e propriedades avançadas.

---

## 1. O que é um Objeto?

De forma simples, um objeto em JavaScript é uma coleção de dados relacionados e/ou funcionalidades. Esses dados são organizados em pares de **chave-valor**. As chaves são strings (ou Símbolos), e os valores podem ser qualquer tipo de dado: strings, números, booleanos, arrays, e até mesmo outras funções (que chamamos de **métodos** quando estão dentro de um objeto).

Pense em um objeto do mundo real, como um carro. Ele tem **propriedades** (cor, marca, modelo) e **ações** que pode realizar (ligar, acelerar, frear). Em JavaScript, modelamos isso da seguinte forma:

```javascript
const carro = {
  // Propriedades (chave: valor)
  marca: "Fiat",
  modelo: "Uno",
  ano: 2010,
  ligado: false,

  // Métodos (ações)
  ligar() {
    this.ligado = true;
    console.log("Carro ligado!");
  },

  desligar() {
    this.ligado = false;
    console.log("Carro desligado.");
  }
};

// Acessando propriedades
console.log(carro.modelo); // "Uno"

// Chamando um método
carro.ligar(); 
console.log(carro.ligado); // true
```

Objetos são a base do JavaScript e são usados para estruturar e organizar o código de forma lógica e eficiente.

---

## 2. Acessando Propriedades de Objetos

Uma vez que um objeto é criado, você pode acessar, adicionar ou modificar suas propriedades e métodos de várias formas.

### a. Notação de Ponto (Dot Notation)

É a forma mais comum e direta. O nome da propriedade é usado diretamente após o objeto, separado por um ponto.

**Requisito:** A chave da propriedade deve ser um identificador JavaScript válido (não pode conter espaços, começar com números ou ter caracteres especiais).

```javascript
const usuario = {
  nome: "Maria",
  idade: 28
};

console.log(usuario.nome); // "Maria"

// Modificando um valor
usuario.idade = 29;
console.log(usuario.idade); // 29

// Adicionando uma nova propriedade
usuario.cidade = "São Paulo";
console.log(usuario.cidade); // "São Paulo"
```

### b. Notação de Colchetes (Bracket Notation)

Permite acessar propriedades usando uma string (ou uma variável que contém uma string) dentro de colchetes `[]`.

**Vantagens:**
1.  Permite o uso de chaves que **não são** identificadores válidos.
2.  Permite o uso de **variáveis** para acessar propriedades dinamicamente.

```javascript
const produto = {
  "código do produto": "XYZ-123",
  estoque: 50
};

// Acesso com chave contendo espaços
console.log(produto["código do produto"]); // "XYZ-123"

// Acesso dinâmico usando uma variável
let chaveDeAcesso = "estoque";
console.log(produto[chaveDeAcesso]); // 50

chaveDeAcesso = "código do produto";
console.log(produto[chaveDeAcesso]); // "XYZ-123"
```

### c. Desestruturação de Objetos (Object Destructuring)

Introduzida no ES6, é uma sintaxe que permite extrair valores de objetos (ou arrays) e atribuí-los a variáveis distintas. É extremamente útil para escrever código mais limpo e conciso.

```javascript
const dev = {
  primeiroNome: "João",
  linguagem: "JavaScript",
  nivel: "Pleno",
  empresa: "Google"
};

// Extrai 'linguagem' e 'nivel' para variáveis com o mesmo nome
const { linguagem, nivel } = dev;
console.log(linguagem); // "JavaScript"
console.log(nivel);     // "Pleno"

// Renomeando variáveis
const { primeiroNome: nome, empresa: firma } = dev;
console.log(nome);  // "João"
console.log(firma); // "Google"

// Atribuindo valores padrão
const { salario = 5000 } = dev;
console.log(salario); // 5000 (porque 'salario' não existe no objeto 'dev')
```

### d. Encadeamento Opcional (Optional Chaining)

O operador `?.` permite ler o valor de uma propriedade localizada profundamente em uma cadeia de objetos conectados, sem ter que validar expressamente que cada referência na cadeia é válida. Se uma referência for `null` ou `undefined`, a expressão fará um "curto-circuito" e retornará `undefined` em vez de causar um erro.

```javascript
const apiResponse = {
  usuario: {
    nome: "Carlos",
    // O objeto 'contato' está faltando
    // contato: { email: "carlos@email.com" }
  }
};

// Sem Encadeamento Opcional (causaria um erro)
// const email = apiResponse.usuario.contato.email; // TypeError!

// Com Encadeamento Opcional (seguro)
const email = apiResponse.usuario?.contato?.email;
console.log(email); // undefined (nenhum erro é lançado)

// Também funciona com chamadas de método
const metodoCustom = apiResponse.usuario?.metodoInexistente?.();
console.log(metodoCustom); // undefined
```

---

## 3. A Palavra-chave `this`: Acessando o Contexto do Objeto

Dentro de um objeto, como um método acessa outra propriedade ou método do mesmo objeto? A resposta é a palavra-chave `this`.

O valor de `this` é determinado pela forma como a função é chamada. Quando uma função é chamada como um método de um objeto, `this` se refere ao próprio objeto.

```javascript
const perfil = {
  nome: "Ana",
  profissao: "Desenvolvedora",
  apresentar() {
    // 'this' aqui se refere ao objeto 'perfil'
    console.log(`Olá, eu sou ${this.nome}, e trabalho como ${this.profissao}.`);
  }
};

perfil.apresentar(); // "Olá, eu sou Ana, e trabalho como Desenvolvedora."
```

### O Problema Comum: "Perdendo" o `this`

O valor de `this` pode mudar de forma inesperada se o método for chamado fora de seu contexto original. Isso é comum ao passar métodos como callbacks.

```javascript
const contador = {
  valor: 0,
  incrementar() {
    this.valor++;
    console.log(this.valor);
  }
};

// Chamada normal, 'this' é 'contador'
contador.incrementar(); // 1

// Passando o método como callback
// A função 'incrementar' é chamada fora do contexto de 'contador'
// Em modo não-estrito, 'this' se torna o objeto global (window no navegador)
// Em modo estrito ('use strict'), 'this' se torna 'undefined', causando um erro.
const funcaoIncrementar = contador.incrementar;
funcaoIncrementar(); // NaN ou TypeError
```

### A Solução Moderna: Arrow Functions

Arrow functions (`=>`) não possuem seu próprio `this`. Em vez disso, elas "herdam" o `this` do escopo em que foram criadas (comportamento léxico). Isso as torna perfeitas para callbacks dentro de métodos.

```javascript
const cronometro = {
  segundos: 0,
  iniciar() {
    setInterval(() => {
      // Esta arrow function não tem seu próprio 'this'.
      // Ela usa o 'this' do método 'iniciar', que é o objeto 'cronometro'.
      this.segundos++;
      console.log(this.segundos);
    }, 1000);
  }
};

// cronometro.iniciar(); // Imprime 1, 2, 3... a cada segundo
```

A forma tradicional de resolver isso antes das arrow functions era usando o método `.bind(this)`.

---

## 4. Adicionando e Atualizando Propriedades

Objetos em JavaScript são dinâmicos, o que significa que suas propriedades podem ser adicionadas, modificadas ou removidas a qualquer momento.

### a. Atribuição Direta (Mutação)

A forma mais simples de adicionar ou modificar uma propriedade é usando a notação de ponto ou de colchetes. Se a propriedade não existir, ela será criada. Se já existir, seu valor será sobrescrito.

```javascript
const user = {
  nome: "João"
};

// Modificando uma propriedade existente
user.nome = "João Silva";

// Adicionando uma nova propriedade
user.idade = 30;
user["status social"] = "Solteiro";

console.log(user); // { nome: "João Silva", idade: 30, "status social": "Solteiro" }
```

### b. `Object.assign()`

Este método copia todas as propriedades enumeráveis de um ou mais objetos de origem para um objeto de destino. Ele **muta** (modifica) o objeto de destino.

```javascript
const config = {
  theme: "dark",
  notifications: true
};

const userConfig = {
  notifications: false,
  language: "pt-br"
};

// Mescla userConfig em config.
// A propriedade 'notifications' será sobrescrita.
// A propriedade 'language' será adicionada.
const finalConfig = Object.assign(config, userConfig);

console.log(config); // { theme: 'dark', notifications: false, language: 'pt-br' }
console.log(finalConfig === config); // true -> O objeto original foi modificado!
```

### c. Sintaxe de Spread (`...`) para Atualizações Imutáveis

Uma abordagem mais moderna e frequentemente mais segura é a **imutabilidade**. Em vez de modificar o objeto original, você cria um novo objeto com as propriedades atualizadas. A sintaxe de spread é perfeita para isso.

```javascript
const point = { x: 10, y: 20 };

// Cria um NOVO objeto com o valor de 'y' atualizado
const newPoint = { ...point, y: 30, z: 40 };

console.log(point);    // { x: 10, y: 20 } -> O original permanece intacto
console.log(newPoint); // { x: 10, y: 30, z: 40 }
```
Esta abordagem é preferida em frameworks como React, pois facilita o rastreamento de mudanças.

### d. Deletando Propriedades

O operador `delete` remove uma propriedade de um objeto.

```javascript
const carro = {
  marca: "Ford",
  modelo: "Ka",
  ano: 2018
};

delete carro.ano;

console.log(carro); // { marca: "Ford", modelo: "Ka" }
```
O operador `delete` retorna `true` se a operação for bem-sucedida.

---

## 5. Protótipos e Herança Prototípica

Todo objeto em JavaScript tem um link interno para outro objeto chamado `prototype`. Quando tentamos acessar uma propriedade de um objeto que não existe nele, o JavaScript automaticamente busca essa propriedade no protótipo do objeto.

### Acessando o Protótipo

- **`Object.getPrototypeOf(obj)`**: Método moderno e preferencial para obter o protótipo de um objeto.
- **`__proto__`**: Propriedade não padrão, mas comum em muitos ambientes, que expõe o protótipo. Evite usar em código de produção.

```javascript
const pessoa = {
  falar() {
    console.log('Olá!');
  }
};

const joao = Object.create(pessoa);
joao.nome = 'João';

joao.falar(); // Olá! (herdado de 'pessoa')

console.log(Object.getPrototypeOf(joao) === pessoa); // true
```

---

## 6. Funções Construtoras

Funções construtoras são usadas para criar múltiplos objetos com a mesma estrutura. Por convenção, seus nomes começam com letra maiúscula. O operador `new` cria um novo objeto, define `this` para esse objeto e o retorna implicitamente.

O protótipo da função construtora (`MinhaFuncao.prototype`) é automaticamente atribuído como o protótipo dos objetos criados por ela.

```javascript
function Pessoa(nome, idade) {
  this.nome = nome;
  this.idade = idade;
}

// Métodos são adicionados ao prototype para economizar memória
Pessoa.prototype.apresentar = function() {
  console.log(`Meu nome é ${this.nome} e tenho ${this.idade} anos.`);
};

const maria = new Pessoa('Maria', 30);
const pedro = new Pessoa('Pedro', 25);

maria.apresentar(); // Meu nome é Maria e tenho 30 anos.
pedro.apresentar(); // Meu nome é Pedro e tenho 25 anos.
```

---

## 7. Getters e Setters

Getters e Setters permitem definir métodos que parecem propriedades.

- **`get`**: Executa uma função quando uma propriedade é lida.
- **`set`**: Executa uma função quando uma propriedade recebe um valor.

```javascript
const carro = {
  _marca: 'Ford', // convenção para propriedade "privada"
  _modelo: 'Mustang',

  get nomeCompleto() {
    return `${this._marca} ${this._modelo}`;
  },

  set nomeCompleto(valor) {
    const [marca, modelo] = valor.split(' ');
    this._marca = marca;
    this._modelo = modelo;
  }
};

console.log(carro.nomeCompleto); // Ford Mustang

carro.nomeCompleto = 'Chevrolet Camaro';
console.log(carro.nomeCompleto); // Chevrolet Camaro
console.log(carro._marca);       // Chevrolet
```

---

## 8. Descritores de Propriedade

Cada propriedade de um objeto tem "descritores" que controlam seu comportamento.

- **`value`**: O valor da propriedade.
- **`writable`**: Se a propriedade pode ser alterada (`true`/`false`).
- **`enumerable`**: Se a propriedade aparece em laços `for...in` e `Object.keys()` (`true`/`false`).
- **`configurable`**: Se a propriedade pode ser deletada e se seus descritores podem ser alterados (`true`/`false`).

### `Object.defineProperty()` e `Object.defineProperties()`

Esses métodos permitem controlar finamente as propriedades de um objeto.

```javascript
const obj = {};

Object.defineProperty(obj, 'a', {
  value: 10,
  writable: false,    // não pode ser alterado
  enumerable: true,   // aparece na enumeração
  configurable: false // não pode ser deletado/reconfigurado
});

obj.a = 20;
console.log(obj.a); // 10 (não foi alterado)

delete obj.a;
console.log(obj.a); // 10 (não foi deletado)

// Define várias propriedades de uma vez
Object.defineProperties(obj, {
  'b': { value: 2, writable: true },
  'c': { value: 3, enumerable: false }
});

console.log(Object.keys(obj)); // ['a'] ('c' não é enumerável)
```

---

## 9. Métodos Úteis de `Object`

- **`Object.keys(obj)`**: Retorna um array com os nomes das propriedades enumeráveis de um objeto.
- **`Object.values(obj)`**: Retorna um array com os valores das propriedades enumeráveis.
- **`Object.entries(obj)`**: Retorna um array de arrays, onde cada subarray contém `[chave, valor]`.
- **`Object.assign(alvo, ...fontes)`**: Copia as propriedades de um ou mais objetos `fontes` para um objeto `alvo`.
- **`Object.freeze(obj)`**: "Congela" um objeto. Impede a adição, remoção ou alteração de propriedades.
- **`Object.seal(obj)`**: "Sela" um objeto. Impede a adição ou remoção de propriedades, mas permite a alteração das existentes.

```javascript
const produto = {
  nome: 'Notebook',
  preco: 4500,
  categoria: 'Eletrônicos'
};

console.log(Object.keys(produto));   // ['nome', 'preco', 'categoria']
console.log(Object.values(produto)); // ['Notebook', 4500, 'Eletrônicos']
console.log(Object.entries(produto)); // [['nome', 'Notebook'], ...]

const clone = Object.assign({}, produto, { disponivel: true });
console.log(clone); // { nome: 'Notebook', ..., disponivel: true }

Object.freeze(produto);
produto.preco = 5000; // A alteração falha silenciosamente em modo não-estrito
console.log(produto.preco); // 4500
```

---

## 10. Shallow Copy vs. Deep Copy

É crucial entender que `Object.assign()` e o operador spread (`...`) realizam uma **cópia rasa (shallow copy)**. Isso significa que se uma propriedade do objeto original for, ela mesma, um objeto, a cópia conterá uma **referência** a esse objeto aninhado, e não um novo objeto.

```javascript
const dev = {
  nome: 'Ana',
  linguagens: ['JavaScript', 'Python']
};

const devClone = { ...dev };

// Modificar uma propriedade aninhada no clone afeta o original
devClone.linguagens.push('Go');

console.log(dev.linguagens); // ['JavaScript', 'Python', 'Go'] -> O original foi modificado!
```

Para uma **cópia profunda (deep copy)**, onde todos os níveis do objeto são duplicados, a forma mais simples (mas com limitações, como não copiar métodos, `undefined`, etc.) é usar `JSON`:

```javascript
const devDeepClone = JSON.parse(JSON.stringify(dev));

devDeepClone.linguagens.push('Ruby');

console.log(dev.linguagens);       // ['JavaScript', 'Python', 'Go'] -> O original permanece intacto
console.log(devDeepClone.linguagens); // ['JavaScript', 'Python', 'Go', 'Ruby']
```

---

## 11. Classes (ES6)

O ES6 introduziu a sintaxe de `class`, que é uma "açúcar sintático" sobre a herança baseada em protótipos. Ela torna o código mais limpo, mais organizado e mais familiar para quem vem de outras linguagens orientadas a objetos.

Por baixo dos panos, ainda são protótipos!

```javascript
class Veiculo {
  constructor(marca) {
    this.marca = marca;
  }

  dirigir() {
    console.log(`Dirigindo um ${this.marca}...`);
  }
}

class Carro extends Veiculo {
  constructor(marca, modelo) {
    super(marca); // Chama o construtor da classe pai (Veiculo)
    this.modelo = modelo;
  }

  info() {
    console.log(`Veículo: ${this.marca} ${this.modelo}`);
  }
}

const meuCarro = new Carro('Toyota', 'Corolla');
meuCarro.info();    // Veículo: Toyota Corolla
meuCarro.dirigir(); // Dirigindo um Toyota... (herdado de Veiculo)
```

---

## 12. Exemplo Prático: E-commerce

Vamos combinar vários conceitos para criar um objeto `Produto` para um e-commerce.

```javascript
class Produto {
  constructor(nome, preco, estoque) {
    this.nome = nome;
    this._preco = preco; // Propriedade "privada" por convenção
    this.estoque = estoque;

    // Congela o objeto para que propriedades não possam ser adicionadas/removidas
    // Object.seal(this); 
  }

  // Getter para o preço, garantindo que não seja negativo
  get preco() {
    return this._preco > 0 ? `R$ ${this._preco.toFixed(2)}` : 'Preço inválido';
  }

  // Setter para o preço, com validação
  set preco(novoPreco) {
    if (typeof novoPreco === 'number' && novoPreco > 0) {
      this._preco = novoPreco;
    } else {
      console.error('Valor de preço inválido.');
    }
  }

  // Método no protótipo da classe
  comprar(quantidade) {
    if (quantidade <= this.estoque) {
      this.estoque -= quantidade;
      console.log(`${quantidade} unidade(s) de '${this.nome}' comprada(s).`);
    } else {
      console.log(`Estoque insuficiente para '${this.nome}'.`);
    }
  }
}

const notebook = new Produto('Notebook Gamer', 5500, 10);

console.log(notebook.preco); // R$ 5500.00

notebook.preco = 5200; // Usando o setter
console.log(notebook.preco); // R$ 5200.00

notebook.comprar(2); // 2 unidade(s) de 'Notebook Gamer' comprada(s).
console.log(notebook.estoque); // 8

notebook.comprar(10); // Estoque insuficiente para '${this.nome}'.
```

---

## 13. Formas de Criar Objetos em Detalhes

JavaScript oferece múltiplas maneiras de criar objetos. A escolha depende do caso de uso, da complexidade e do padrão de projeto desejado.

### a. Objeto Literal

A forma mais simples e comum. Ótima para objetos únicos e estruturas de dados simples.

```javascript
const livro = {
  titulo: "O Hobbit",
  autor: "J.R.R. Tolkien",
  descrever() {
    return `${this.titulo} por ${this.autor}`;
  }
};
```

### b. Funções Construtoras

O modo clássico de criar objetos com uma estrutura compartilhada antes do ES6. Usa o operador `new` para instanciar.

```javascript
function Filme(titulo, diretor) {
  this.titulo = titulo;
  this.diretor = diretor;
}

Filme.prototype.info = function() {
  return `${this.titulo}, dirigido por ${this.diretor}`;
}

const pulpFiction = new Filme("Pulp Fiction", "Quentin Tarantino");
```

### c. `Object.create()`

Este método cria um novo objeto, usando um objeto existente como protótipo do novo objeto. É a forma mais pura de herança prototípica.

```javascript
const animal = {
  fazerSom() {
    console.log(this.som);
  }
};

const gato = Object.create(animal);
gato.som = "Miau";
gato.fazerSom(); // Miau

const cachorro = Object.create(animal);
cachorro.som = "Au au";
cachorro.fazerSom(); // Au au
```

### d. Classes (ES6)

A sintaxe moderna, introduzida no ES6, que simplifica a criação de construtores e a herança. É a abordagem preferida em código moderno.

```javascript
class Pessoa {
  constructor(nome) {
    this.nome = nome;
  }

  cumprimentar() {
    return `Olá, meu nome é ${this.nome}`;
  }
}

const dev = new Pessoa("Tayron");
```

### e. Factory Functions

Uma função que retorna um objeto sem usar a palavra-chave `new` ou `class`. Elas são poderosas para criar objetos e encapsular dados, permitindo a criação de propriedades e métodos "privados" através de closures.

```javascript
function criarCirculo(raio) {
  // A variável 'raio' é "privada" dentro do closure da função
  return {
    // As chaves 'area' e 'desenhar' são públicas
    area() {
      return Math.PI * raio * raio;
    },
    desenhar() {
      console.log(`Desenhando um círculo com raio ${raio}`);
    }
  };
}

const circulo1 = criarCirculo(5);
console.log(circulo1.area()); // 78.53...
// console.log(circulo1.raio); // undefined -> 'raio' não é acessível aqui fora
```

### Resumo: Quando Usar Cada Um?

- **Literal**: Para objetos simples e únicos.
- **Factory Function**: Quando precisar de múltiplos objetos sem a complexidade de protótipos/`this`, ou para encapsulamento forte (dados privados).
- **Construtor/Classe**: Para criar múltiplos objetos que compartilham a mesma estrutura e métodos, aproveitando a herança prototípica. **Classes** são a forma moderna e mais legível de fazer isso.
- **`Object.create`**: Quando você quer um controle explícito e direto sobre a cadeia de protótipos.

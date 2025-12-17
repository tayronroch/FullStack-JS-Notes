# Classes em JavaScript (Introdução ao POO)

Embora JavaScript seja uma linguagem baseada em protótipos, a introdução das **Classes** no ES6 (ECMAScript 2015) trouxe uma sintaxe mais limpa e familiar para quem vem de outras linguagens orientadas a objetos (como Java ou C#).

---

## 1. O Que São Classes?

Em JavaScript, classes são, na verdade, "açúcar sintático" sobre a herança baseada em protótipos. Elas oferecem uma maneira mais clara e semântica de criar objetos e lidar com herança.

### Sintaxe Básica

Uma classe é definida usando a palavra-chave `class`, seguida pelo nome da classe (convenção: PascalCase).

```javascript
class Pessoa {
  // O método constructor é especial: é executado automaticamente
  // quando criamos uma nova instância da classe com 'new'.
  constructor(nome, idade) {
    this.nome = nome;
    this.idade = idade;
  }

  // Método da classe (não precisa da palavra 'function')
  apresentar() {
    return `Olá, meu nome é ${this.nome} e tenho ${this.idade} anos.`;
  }
}

// Instanciando (criando um objeto a partir da classe)
const tayron = new Pessoa('Tayron', 30);
console.log(tayron.apresentar()); // "Olá, meu nome é Tayron e tenho 30 anos."
```

---

## 2. O Método `constructor`: Um Guia Completo

O método `constructor` é o coração da inicialização de classes em JavaScript. Ele é um método especial usado para criar e inicializar um objeto criado a partir de uma classe.

### a. Características Fundamentais

1.  **Exclusividade:** Uma classe pode ter apenas **um** método chamado `constructor`. Tentar definir mais de um resultará em um `SyntaxError`.
2.  **Automático:** Ele é chamado automaticamente quando você usa a palavra-chave `new`.
3.  **Padrão:** Se você não definir um construtor:
    -   Em uma classe base, um construtor vazio é usado: `constructor() {}`.
    -   Em uma classe derivada (que estende outra), o construtor padrão chama o pai: `constructor(...args) { super(...args); }`.

### b. Uso com Herança (`super`)

Quando você cria uma classe que estende outra (herança), o construtor da classe filha **deve** chamar `super()` antes de acessar `this`. O `super()` é responsável por executar o construtor da classe pai e criar o objeto `this`.

```javascript
class Veiculo {
  constructor(tipo) {
    this.tipo = tipo;
    console.log(`Construindo um veículo do tipo: ${tipo}`);
  }
}

class Moto extends Veiculo {
  constructor(marca) {
    // this.marca = marca; // ERRO! 'this' ainda não existe.
    
    super('Terrestre'); // Chama o construtor de Veiculo
    
    // Agora 'this' existe e foi inicializado pelo pai
    this.marca = marca; 
    console.log(`Moto da marca ${marca} criada.`);
  }
}

new Moto('Yamaha');
// Saída:
// "Construindo um veículo do tipo: Terrestre"
// "Moto da marca Yamaha criada."
```

### c. Retorno do Construtor

Por padrão, o construtor retorna a instância do objeto que está sendo criado (`this`). No entanto, você pode forçá-lo a retornar um objeto totalmente diferente (embora seja raro e geralmente não recomendado).

-   Retornar um **objeto**: Substitui a instância que seria criada.
-   Retornar um **primitivo** (número, string, null): É ignorado, e o `this` original é retornado.

```javascript
class Hacker {
  constructor() {
    this.skill = 'Alta';
    // Retornando um objeto arbitrário
    return { skill: 'Nenhuma', msg: 'Fui hackeado!' };
  }
}

const user = new Hacker();
console.log(user); // { skill: 'Nenhuma', msg: 'Fui hackeado!' }
console.log(user instanceof Hacker); // false!
```

---

### d. Boas Práticas e Anti-Padrões

O construtor deve ser simples e focado apenas na inicialização do estado do objeto.

#### ✅ Boas Práticas

1.  **Inicialização de Propriedades:** Use-o apenas para definir os valores iniciais de `this.propriedade`.
2.  **Validação Simples:** É aceitável lançar erros se os argumentos obrigatórios estiverem faltando ou forem inválidos.
3.  **Injeção de Dependência:** Receba as dependências (como conexões de banco ou serviços) como argumentos, em vez de criá-las dentro do construtor.

```javascript
// BOM EXEMPLO
class UsuarioService {
  constructor(databaseConnection) {
    if (!databaseConnection) throw new Error('Conexão obrigatória');
    this.db = databaseConnection;
  }
}
```

#### ❌ O Que EVITAR (Anti-Padrões)

1.  **Lógica de Negócio Pesada:** Não faça cálculos complexos ou processamento pesado no construtor. Isso torna a instanciação lenta e difícil de testar.
2.  **Efeitos Colaterais (Side Effects):** Evite chamadas de API, acesso ao DOM ou operações de I/O (leitura de arquivos) diretamente no construtor.
    -   *Por que?* O `new` deve ser síncrono e rápido. Além disso, torna impossível instanciar a classe para testes sem disparar o efeito.
3.  **`async` no Construtor:** Construtores **não podem** ser assíncronos. Eles sempre retornam a instância, não uma Promise.
    -   *Solução:* Use um método estático `static create()` ou um método `init()` se precisar de inicialização assíncrona.

```javascript
// MAU EXEMPLO - NÃO FAÇA ISSO
class Relatorio {
  constructor() {
    // Ruim: Fazendo requisição de rede na criação
    fetch('/api/dados').then(data => this.data = data);
  }
}

// SOLUÇÃO ELEGANTE (Factory Pattern)
class Relatorio {
  constructor(data) {
    this.data = data;
  }

  static async create() {
    const data = await fetch('/api/dados').then(r => r.json());
    return new Relatorio(data);
  }
}

// Uso: const relatorio = await Relatorio.create();
```

---

## 3. Propriedades e Métodos

Além do construtor, as classes são compostas por propriedades (dados) e métodos (comportamentos). O JavaScript moderno (ES2022+) trouxe formas muito mais limpas de definir propriedades.

### a. Propriedades de Classe (Class Fields)

Antigamente, todas as propriedades precisavam ser definidas dentro do `constructor` usando `this`. Hoje, podemos declará-las diretamente no corpo da classe. Isso torna o código mais legível e parecido com linguagens como Java ou C#.

```javascript
class Produto {
  // 1. Declaração de Campo Público (Public Class Field)
  // Define um valor padrão para TODAS as instâncias.
  categoria = 'Geral';
  estoque = 0;

  constructor(nome) {
    this.nome = nome; // Propriedade dinâmica (varia por instância)
  }

  adicionarEstoque(qtd) {
    this.estoque += qtd; // Acessa a propriedade da classe
  }
}

const p = new Produto('Caneta');
console.log(p.categoria); // "Geral"
console.log(p.estoque);   // 0
```

**Por que usar Class Fields?**
-   **Clareza:** Você vê logo no início da classe quais dados ela carrega.
-   **Menos código:** Evita a repetição de `this.x = x` para valores padrão.

---

### b. Métodos de Instância

São funções que pertencem a cada objeto criado a partir da classe. Eles representam as ações que o objeto pode realizar. Eles têm acesso total às propriedades da instância através do `this`.

```javascript
class Carro {
  constructor(modelo) {
    this.modelo = modelo;
    this.velocidade = 0;
  }

  // Método simples
  acelerar() {
    this.velocidade += 10;
    console.log(`${this.modelo} está a ${this.velocidade} km/h.`);
  }

  // Método que chama outro método
  frear() {
    this.velocidade -= 10;
    this.mostrarPainel();
  }

  mostrarPainel() {
    console.log(`Velocidade atual: ${this.velocidade}`);
  }
}
```

---

### c. Getters e Setters (Propriedades Computadas)

Getters e Setters são especiais: eles parecem propriedades, mas funcionam como métodos. Permitem interceptar o acesso (`get`) ou a modificação (`set`) de um valor. Isso é crucial para **encapsulamento** e **validação**.

```javascript
class ContaBancaria {
  constructor(saldoInicial) {
    // Convenção: _propriedade indica que ela deve ser tratada como privada
    // (embora ainda seja acessível publicamente se não usar #)
    this._saldo = saldoInicial; 
  }

  // Getter: permite ler 'conta.saldo' em vez de 'conta.getSaldo()'
  get saldo() {
    return `R$ ${this._saldo.toFixed(2)}`;
  }

  // Setter: permite validar antes de atribuir
  set saldo(valor) {
    if (valor < 0) {
      console.log('Erro: Saldo não pode ser negativo!');
    } else {
      this._saldo = valor;
    }
  }
}

const conta = new ContaBancaria(100);

// Usando o Setter
conta.saldo = -50; // Saída: "Erro: Saldo não pode ser negativo!"
conta.saldo = 200; // Funciona

// Usando o Getter
console.log(conta.saldo); // "R$ 200.00" (Note que não usamos parênteses!)
```

---

## 4. Membros Estáticos (`static`): O Lado "Global" da Classe

Membros estáticos (métodos ou propriedades) pertencem **à classe em si**, e não às instâncias (objetos) criadas a partir dela. Eles são carregados na memória quando a classe é definida e são compartilhados.

### a. Quando usar `static`?

1.  **Funções Utilitárias:** Quando você precisa de uma função que não depende de nenhum dado específico de um objeto (não usa `this.propriedade`).
2.  **Factory Methods (Fábricas):** Para criar instâncias da classe de formas alternativas.
3.  **Constantes:** Para armazenar valores fixos relacionados à classe.

### b. Métodos Estáticos Básicos

São chamados diretamente pelo nome da classe.

```javascript
class Calculadora {
  static somar(a, b) {
    return a + b;
  }
}

console.log(Calculadora.somar(5, 10)); // 15

// ERRO COMUM: Tentar chamar da instância
const calc = new Calculadora();
// calc.somar(1, 2); // TypeError: calc.somar is not a function
```

### c. O `this` no Contexto Estático (Avançado)

Dentro de um método estático, a palavra-chave `this` **não se refere a um objeto**, mas sim **à própria classe**. Isso permite que um método estático chame outro método estático ou acesse propriedades estáticas.

**Exemplo Prático: Sistema de Mensagens Centralizado**

```javascript
class Messenger {
  static appName = "GeminiChat";

  // Método estático 1: Formata a mensagem
  static formatMessage(user, msg) {
    return `[${this.appName}] ${user} diz: ${msg}`;
  }

  // Método estático 2: Exibe a mensagem (Chama o Método 1)
  static showMessage(user, msg) {
    // Usar 'this' aqui é o mesmo que usar 'Messenger'
    const formatted = this.formatMessage(user, msg);
    console.log(formatted);
  }

  static showSystemAlert(alert) {
    this.showMessage("SISTEMA", alert);
  }
}

Messenger.showMessage("Tayron", "Olá mundo!"); 
// Saída: "[GeminiChat] Tayron diz: Olá mundo!"

Messenger.showSystemAlert("O servidor será reiniciado.");
// Saída: "[GeminiChat] SISTEMA diz: O servidor será reiniciado."
```

---

### d. Padrão Factory (Fábrica) com Static

Um dos usos mais elegantes de métodos estáticos é criar "construtores nomeados" para instanciar objetos de formas específicas.

```javascript
class Usuario {
  constructor(nome, tipo) {
    this.nome = nome;
    this.tipo = tipo;
  }

  // Factory Method: Cria um usuário Admin
  static createAdmin(nome) {
    return new Usuario(nome, 'admin');
  }

  // Factory Method: Cria um usuário Convidado
  static createGuest() {
    return new Usuario('Visitante', 'guest');
  }
}

const admin = Usuario.createAdmin('Tayron');
const guest = Usuario.createGuest();

console.log(admin); // Usuario { nome: 'Tayron', tipo: 'admin' }
console.log(guest); // Usuario { nome: 'Visitante', tipo: 'guest' }
```

### e. Herança com Estáticos

Métodos estáticos também são herdados! Se você tiver uma classe filha, ela pode chamar os métodos estáticos da classe pai.

```javascript
class Animal {
  static categorias() {
    return ['Mamífero', 'Réptil', 'Ave'];
  }
}

class Cachorro extends Animal {}

console.log(Cachorro.categorias()); // ['Mamífero', 'Réptil', 'Ave']
```

---

## 5. Herança (`extends`): Reutilização e Polimorfismo

A herança é um dos pilares da Orientação a Objetos. Ela permite criar uma nova classe (filha/subclasse) baseada em uma classe existente (pai/superclasse), herdando seus métodos e propriedades.

### a. O Básico do `extends`

Use a palavra-chave `extends` para criar a relação.

```javascript
class Animal {
  constructor(nome) {
    this.nome = nome;
  }

  comer() {
    console.log(`${this.nome} está comendo.`);
  }

  dormir() {
    console.log(`${this.nome} foi dormir. Zzz...`);
  }
}

class Cachorro extends Animal {
  latir() {
    console.log(`${this.nome}: Au! Au!`);
  }
}

const rex = new Cachorro('Rex');
rex.comer();  // Herdado de Animal
rex.latir();  // Específico de Cachorro
```

### b. Sobrescrita de Métodos (Polimorfismo)

A sobrescrita (method overriding) ocorre quando uma classe filha fornece sua própria implementação para um método que já existe na classe pai. Isso é essencial para o polimorfismo, pois permite que objetos de diferentes tipos respondam à mesma chamada de método de maneiras distintas.

**1. Substituição Completa**
Quando você define um método na classe filha com o **mesmo nome** do pai, a versão da filha substitui completamente a do pai.

```javascript
class Funcionario {
  trabalhar() {
    console.log("Funcionário realizando tarefas gerais...");
  }
}

class Desenvolvedor extends Funcionario {
  // Sobrescreve 'trabalhar' completamente
  trabalhar() {
    console.log("Escrevendo código e corrigindo bugs.");
  }
}

const dev = new Desenvolvedor();
dev.trabalhar(); // "Escrevendo código e corrigindo bugs."
// A mensagem "Funcionário realizando tarefas gerais..." nunca é exibida.
```

**2. Extensão (Usando `super`)**
Muitas vezes, você não quer apagar o que o pai fazia, mas sim **adicionar** algo a mais. Use `super.metodo()` para chamar a implementação original.

```javascript
class Botao {
  clicar() {
    console.log("Efeito visual de clique.");
  }
}

class BotaoEnviar extends Botao {
  clicar() {
    super.clicar(); // 1. Executa o efeito visual do pai
    console.log("Enviando dados do formulário..."); // 2. Adiciona a lógica de envio
  }
}

const btn = new BotaoEnviar();
btn.clicar();
// Saída:
// "Efeito visual de clique."
// "Enviando dados do formulário..."
```

**Erro Comum:** Esquecer que o `super` é opcional em métodos normais (ao contrário do construtor). Se você não chamá-lo, a lógica do pai é perdida.

### c. A palavra-chave `super` nos Métodos

E se você quiser sobrescrever um método, mas **ainda assim aproveitar** o que o método original fazia? Use `super.metodo()`.

```javascript
class Passaro extends Animal {
  dormir() {
    super.dormir(); // 1. Executa a lógica original (imprime "Zzz...")
    console.log("...empoleirado no galho."); // 2. Adiciona comportamento extra
  }
}

const piu = new Passaro('Piu');
piu.dormir();
// Saída:
// "Piu foi dormir. Zzz..."
// "...empoleirado no galho."
```

### d. O `super` no `constructor`

Este é um ponto crucial e fonte comum de erros.

1.  Se uma classe estende outra e define um `constructor`, ela **DEVE** chamar `super()` antes de usar `this`.
2.  O `super()` chama o construtor da classe pai, garantindo que a inicialização básica aconteça.

```javascript
class Cobra extends Animal {
  constructor(nome, ehVenenosa) {
    // this.ehVenenosa = ehVenenosa; // ERRO: ReferenceError (this não existe ainda)
    
    super(nome); // Chama Animal(nome) -> define this.nome
    
    this.ehVenenosa = ehVenenosa; // Agora OK
  }
}
```

### f. Exemplo do Mundo Real: Sistema de Pagamentos

Para solidificar, vamos ver um cenário onde a herança e o polimorfismo brilham: processamento de diferentes formas de pagamento.

```javascript
// Classe Base (Genérica)
class ProcessadorPagamento {
  constructor(valor) {
    this.valor = valor;
  }

  processar() {
    throw new Error("O método 'processar' deve ser implementado pela classe filha.");
  }

  gerarRecibo() {
    return `Recibo genérico: R$ ${this.valor.toFixed(2)}`;
  }
}

// Classe Filha 1: Cartão de Crédito
class PagamentoCartao extends ProcessadorPagamento {
  constructor(valor, numeroCartao) {
    super(valor); // Inicializa o valor na classe pai
    this.numeroCartao = numeroCartao;
  }

  processar() {
    // Lógica específica de cartão
    const ultimosDigitos = this.numeroCartao.slice(-4);
    console.log(`Cobrando R$ ${this.valor} no cartão final ${ultimosDigitos}... Sucesso!`);
  }
}

// Classe Filha 2: Pix
class PagamentoPix extends ProcessadorPagamento {
  processar() {
    // Lógica específica de Pix
    const codigoPix = Math.random().toString(36).substring(7);
    console.log(`Gerando código Pix para R$ ${this.valor}: ${codigoPix}`);
  }

  // Sobrescrevendo o recibo
  gerarRecibo() {
    return `Recibo PIX: R$ ${this.valor.toFixed(2)} (Aprovado instantaneamente)`;
  }
}

// Polimorfismo em ação: Tratamos todos como 'ProcessadorPagamento'
const pagamentos = [
  new PagamentoCartao(100, '1234567812345678'),
  new PagamentoPix(50)
];

pagamentos.forEach(p => {
  p.processar(); // Cada um sabe como se processar
  console.log(p.gerarRecibo());
});
```

---

## 6. Campos Privados (`#`)

O JavaScript moderno introduziu campos verdadeiramente privados usando a sintaxe de hash (`#`). Eles não podem ser acessados de fora da classe.

```javascript
class Cofre {
  #senha; // Declaração de campo privado

  constructor(senhaInicial) {
    this.#senha = senhaInicial;
  }

  verificarSenha(tentativa) {
    return this.#senha === tentativa;
  }
}

const meuCofre = new Cofre('1234');
// console.log(meuCofre.#senha); // SyntaxError: Private field '#senha' must be declared...
console.log(meuCofre.verificarSenha('1234')); // true
```

---

## 7. Exercício Prático: Sistema de RPG Simples

Tente implementar:
1. Uma classe base `Personagem` com `nome` e `vida`.
2. Um método `atacar(alvo)` que reduz a vida do alvo.
3. Classes filhas `Guerreiro` (mais vida) e `Mago` (mais dano, mas menos vida).

---

## 8. A Cadeia de Protótipos (Prototype Chain) - O Motor por Baixo do Capô

Até agora, usamos a palavra-chave `class`, mas o JavaScript é, na verdade, uma linguagem baseada em **protótipos**. Classes são apenas uma "máscara" (açúcar sintático) para facilitar nossa vida. Entender isso é o que separa o desenvolvedor júnior do sênior.

### a. O Que é um Protótipo?

Cada objeto em JavaScript tem um link oculto para outro objeto, chamado de **protótipo**. Quando você tenta acessar uma propriedade que não existe no objeto (ex: `rex.falar()`), o JavaScript não desiste. Ele vai até o protótipo e procura lá. Se não achar, vai para o protótipo do protótipo, e assim por diante. Isso é a **Cadeia de Protótipos**.

### b. Visualizando a Cadeia

Vamos usar o exemplo dos animais que criamos na seção de Herança para ver a "corrente" na prática.

```javascript
class Animal {
  respirar() { return 'Inspirando...'; }
}

class Cachorro extends Animal {
  latir() { return 'Au au!'; }
}

const rex = new Cachorro();

// 1. O objeto 'rex' tem o método latir? Não diretamente na instância (ele está no protótipo Cachorro).
// 2. O JavaScript busca em rex.__proto__ (que é Cachorro.prototype). Achou 'latir'!

// Verificando a corrente manualmente:
console.log(rex.__proto__ === Cachorro.prototype); // true
console.log(rex.__proto__.__proto__ === Animal.prototype); // true
console.log(rex.__proto__.__proto__.__proto__ === Object.prototype); // true
console.log(rex.__proto__.__proto__.__proto__.__proto__); // null (Fim da linha)
```

### c. Exemplo Prático: Adicionando Métodos "On-the-Fly"

Como as classes são apenas funções e objetos, você pode adicionar métodos a **todas** as instâncias de uma vez, modificando o protótipo (embora deva ser feito com cuidado).

```javascript
class Usuario {
  constructor(nome) { this.nome = nome; }
}

const u1 = new Usuario('Ana');
const u2 = new Usuario('Beto');

// u1.dizerOi(); // Erro! Não existe.

// Adicionando ao protótipo (afeta u1 e u2 imediatamente)
Usuario.prototype.dizerOi = function() {
  console.log(`Oi, eu sou ${this.nome}!`);
};

u1.dizerOi(); // "Oi, eu sou Ana!"
u2.dizerOi(); // "Oi, eu sou Beto!"
```

### d. `hasOwnProperty` vs. Protótipo

É importante saber se uma propriedade pertence ao objeto ou se veio da herança.

```javascript
const obj = new Cachorro();
obj.nome = 'Totó'; // Propriedade da instância

console.log(obj.hasOwnProperty('nome')); // true (É dele mesmo)
console.log(obj.hasOwnProperty('latir')); // false (Vem do protótipo Cachorro)
console.log(obj.hasOwnProperty('respirar')); // false (Vem do protótipo Animal)
```

**Resumo da Aula:** A herança em JS funciona por delegação. Objetos não "têm" os métodos das classes; eles apenas "pedem emprestado" através da cadeia de protótipos quando necessário.
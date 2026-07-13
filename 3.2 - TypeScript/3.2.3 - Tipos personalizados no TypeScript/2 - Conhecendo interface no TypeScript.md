# Conhecendo Interfaces no TypeScript

Nesta aula, vamos nos aprofundar nas **Interfaces** no TypeScript. As interfaces são uma das ferramentas fundamentais da programação orientada a objetos (POO) e desempenham um papel crucial no TypeScript ao definir contratos formais que objetos, funções e classes devem cumprir.

---

## 1. O que é uma Interface?

Uma interface define a especificação ou a "forma" de um objeto. Ela não contém implementação de código (comportamento real); ela apenas descreve quais propriedades e métodos um objeto deve ter e quais são os seus tipos correspondentes.

```typescript
interface Usuario {
  id: number;
  nome: string;
  email: string;
  readonly criadoEm: Date; // Somente leitura
  telefone?: string;       // Opcional
}
```

---

## 2. Definindo Métodos em Interfaces

Além de propriedades primitivas, as interfaces podem descrever o formato de métodos (funções que pertencem ao objeto). Existem duas formas de escrever a assinatura de um método:

```typescript
interface Calculadora {
  // Forma 1: Sintaxe de função convencional
  somar(a: number, b: number): number;

  // Forma 2: Sintaxe de arrow function
  subtrair: (a: number, b: number) => number;
}

const minicalc: Calculadora = {
  somar: (x, y) => x + y,
  subtrair: (x, y) => x - y
};
```

---

## 3. Extensão de Interfaces (Herança)

Uma das maiores vantagens das interfaces é a capacidade de herdar propriedades e métodos de outras interfaces usando a palavra-chave **`extends`**. Isso ajuda a manter seu código modular e DRY (*Don't Repeat Yourself*).

```typescript
interface Pessoa {
  nome: string;
  idade: number;
}

// Cliente herda tudo de Pessoa e adiciona suas próprias propriedades
interface Cliente extends Pessoa {
  limiteCredito: number;
}

const novoCliente: Cliente = {
  nome: "Tayron",
  idade: 28,
  limiteCredito: 5000
};
```

### Herança Múltipla
Diferente de classes em muitas linguagens de programação, uma interface no TypeScript pode herdar de **múltiplas interfaces ao mesmo tempo**:

```typescript
interface Autenticavel {
  login(): boolean;
}

interface Autorizavel {
  permissoes: string[];
}

// ContaUsuario herda propriedades e métodos de ambas
interface ContaUsuario extends Autenticavel, Autorizavel {
  email: string;
}
```

---

## 4. Interfaces e Classes (`implements`)

Interfaces também são usadas para impor regras de comportamento sobre **Classes**. Quando uma classe assina um contrato com uma interface usando a palavra-chave **`implements`**, ela é obrigada a implementar todas as propriedades e métodos declarados na interface.

```typescript
interface Notificador {
  enviar(mensagem: string): void;
}

// A classe SmsNotificador DEVE ter o método enviar
class SmsNotificador implements Notificador {
  enviar(mensagem: string): void {
    console.log(`Enviando SMS com a mensagem: ${mensagem}`);
  }
}
```

---

## 5. Mesclagem de Declarações (Declaration Merging)

Como vimos brevemente na aula anterior, o compilador do TypeScript mescla automaticamente duas ou mais interfaces com o mesmo nome que estejam no mesmo escopo.

Esse comportamento é muito poderoso para estender bibliotecas de terceiros ou objetos globais do ambiente (como adicionar propriedades no objeto `Request` do Express ou no objeto `window` do navegador).

```typescript
// Estendendo o objeto global Window do navegador:
interface Window {
  tokenSeguranca: string;
}

// Agora você pode usar essa propriedade sem erros de compilação:
window.tokenSeguranca = "jwt_token_123";
```

---

## Resumo

1. **Contrato:** Interfaces definem a estrutura de dados e assinaturas de métodos de objetos e classes.
2. **Extensão (`extends`):** Permite herdar propriedades de uma ou mais interfaces, facilitando a reutilização de código.
3. **Classes (`implements`):** Força classes a implementarem a estrutura definida pela interface.
4. **Mesclagem:** Interfaces com nomes iguais são mescladas automaticamente, permitindo estender tipos globais ou de bibliotecas externas com facilidade.

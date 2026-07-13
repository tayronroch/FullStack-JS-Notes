# Como Estender Interfaces

Nesta aula, vamos estudar profundamente a herança e extensão de **Interfaces** no TypeScript. Estender interfaces é uma das práticas mais recomendadas para construir aplicações modulares, limpas e escaláveis, evitando a repetição desnecessária de código e definindo relacionamentos claros entre as entidades de dados.

---

## 1. Extensão Simples (`extends`)

A palavra-chave **`extends`** permite que uma interface herde todas as propriedades e métodos de outra interface existente, adicionando novas propriedades específicas sobre ela.

```typescript
// Interface base (Pai)
interface Veiculo {
  marca: string;
  ano: number;
}

// Interface estendida (Filho)
interface Carro extends Veiculo {
  numeroPortas: number;
  combustivel: "flex" | "gasolina" | "diesel";
}

const meuCarro: Carro = {
  marca: "Toyota",
  ano: 2023,
  numeroPortas: 4,
  combustivel: "flex"
};
```

---

## 2. Extensão Múltipla

Ao contrário de classes em muitas linguagens (onde você só pode estender uma única classe pai), no TypeScript uma interface pode herdar de **múltiplas interfaces ao mesmo tempo**, bastando separá-las por vírgula.

```typescript
interface Logger {
  log(mensagem: string): void;
}

interface BancoDados {
  salvar(dados: any): boolean;
}

// Interface combinando ambos os comportamentos e adicionando novas regras
interface ServicoDados extends Logger, BancoDados {
  chaveApi: string;
}
```

---

## 3. Sobrescrita de Propriedades (Property Overriding)

Ao estender uma interface, você pode redefinir o tipo de uma propriedade herdada, mas o TypeScript impõe uma regra de segurança estrita: **o novo tipo deve ser compatível (subtipo) com o tipo original**.

### Exemplo de Sobrescrita Válida (Estreitamento do tipo):
Se a interface base declara um tipo amplo (como `string | number`), a interface filha pode estreitá-lo para apenas um deles:

```typescript
interface UsuarioBase {
  id: string | number;
  nome: string;
}

interface UsuarioEmpresarial extends UsuarioBase {
  id: string; // Válido: 'string' é um subtipo aceito por 'string | number'
}
```

### Exemplo de Sobrescrita Inválida (Erro de Compilação):
Se você tentar alterar o tipo para algo completamente incompatível, o TypeScript bloqueará:

```typescript
interface ProdutoBase {
  preco: number;
}

// Erro de Compilação!
interface ServicoAssinatura extends ProdutoBase {
  preco: string; 
  // Erro: Interface 'ServicoAssinatura' incorrectly extends interface 'ProdutoBase'.
  // Types of property 'preco' are incompatible.
}
```

---

## 4. Estendendo de um Type Alias (`type`)

Uma interface não está limitada a estender apenas outras interfaces. Ela também pode estender um **Type Alias**, desde que o type descreva um formato de objeto ou uma união estática de tipos de objetos.

```typescript
type DadosContato = {
  email: string;
  telefone: string;
};

// Interface herdando de um Type Alias
interface PerfilUsuario extends DadosContato {
  nome: string;
  avatarUrl: string;
}
```

---

## 5. Interfaces Estendendo Classes (Recurso Avançado)

No TypeScript, uma interface pode estender uma classe. Quando isso acontece, a interface herda todos os membros da classe (incluindo propriedades `private` e `protected`), mas **sem herdar a sua implementação**.

Isso significa que a interface resultante só pode ser implementada por aquela classe ou por uma de suas subclasses.

```typescript
class ControleRemoto {
  private estado: boolean = false;
  ligar() {}
}

// Interface herda a estrutura da classe
interface InterfaceControle extends ControleRemoto {
  mudarCanal(canal: number): void;
}
```

---

## Resumo

1. Use **`extends`** para herdar todas as regras de uma interface pai.
2. Interfaces suportam **Herança Múltipla** (estender de várias interfaces ao mesmo tempo).
3. Ao redefinir propriedades de uma interface pai, o novo tipo deve ser **compatível** com o original.
4. Interfaces podem estender **Type Aliases** (desde que representem objetos).

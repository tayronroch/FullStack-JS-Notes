# TDD - Test-Driven Development

## O que é TDD?

**TDD (Test-Driven Development)** é uma prática de desenvolvimento onde você escreve os **testes ANTES** de escrever o código de produção.

## Ciclo Red-Green-Refactor

```
 RED →  GREEN →  REFACTOR →  RED → ...
```

### 1.  RED (Vermelho)
- Escreva um teste que falha
- O teste define o comportamento esperado

### 2.  GREEN (Verde)
- Escreva o código mínimo para fazer o teste passar
- Não se preocupe com qualidade ainda

### 3.  REFACTOR (Refatorar)
- Melhore o código mantendo os testes passando
- Remova duplicação, melhore legibilidade

## Por que usar TDD?

### Vantagens

 **Código testável por design**
 **Menos bugs**
 **Documentação viva**
 **Refatoração segura**
 **Foco no comportamento, não na implementação**
 **Feedback rápido**

### Desvantagens

 Curva de aprendizado
 Pode ser mais lento inicialmente
 Exige disciplina

## Exemplo Prático: Calculadora

### Passo 1:  RED - Escrever teste que falha

```javascript
// calculator.test.js
import { Calculator } from './calculator';

describe('Calculator', () => {
  test('should add two numbers', () => {
    const calc = new Calculator();
    expect(calc.add(2, 3)).toBe(5);
  });
});
```

**Resultado**:  FALHA - `Calculator is not defined`

### Passo 2:  GREEN - Código mínimo

```javascript
// calculator.js
export class Calculator {
  add(a, b) {
    return 5; // Código mínimo para passar
  }
}
```

**Resultado**:  PASSA

### Passo 3:  RED - Adicionar mais casos

```javascript
test('should add two numbers', () => {
  const calc = new Calculator();
  expect(calc.add(2, 3)).toBe(5);
  expect(calc.add(10, 5)).toBe(15); // Novo caso
});
```

**Resultado**:  FALHA - Expected 15, received 5

### Passo 4:  GREEN - Implementação correta

```javascript
export class Calculator {
  add(a, b) {
    return a + b;
  }
}
```

**Resultado**:  PASSA

### Passo 5:  RED - Adicionar subtração

```javascript
test('should subtract two numbers', () => {
  const calc = new Calculator();
  expect(calc.subtract(10, 3)).toBe(7);
});
```

**Resultado**:  FALHA - `subtract is not a function`

### Passo 6:  GREEN - Implementar subtract

```javascript
export class Calculator {
  add(a, b) {
    return a + b;
  }

  subtract(a, b) {
    return a - b;
  }
}
```

**Resultado**:  PASSA

### Passo 7:  REFACTOR - Melhorar código

Neste caso, o código já está simples. Mas poderíamos refatorar se houvesse duplicação.

## Exemplo Completo: Sistema de Usuários

### Iteração 1: Criar usuário

```javascript
// user.test.js
import { User } from './user';

describe('User', () => {
  test('should create user with name and email', () => {
    const user = new User('John Doe', 'john@example.com');

    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('john@example.com');
  });
});
```

```javascript
// user.js (implementação mínima)
export class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
}
```

### Iteração 2: Validar email

```javascript
test('should validate email format', () => {
  expect(() => {
    new User('John', 'invalid-email');
  }).toThrow('Invalid email');
});

test('should accept valid email', () => {
  const user = new User('John', 'john@example.com');
  expect(user.email).toBe('john@example.com');
});
```

```javascript
export class User {
  constructor(name, email) {
    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email');
    }
    this.name = name;
    this.email = email;
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
```

### Iteração 3: Desativar usuário

```javascript
test('should start as active user', () => {
  const user = new User('John', 'john@example.com');
  expect(user.isActive).toBe(true);
});

test('should deactivate user', () => {
  const user = new User('John', 'john@example.com');
  user.deactivate();
  expect(user.isActive).toBe(false);
});

test('should not deactivate twice', () => {
  const user = new User('John', 'john@example.com');
  user.deactivate();

  expect(() => {
    user.deactivate();
  }).toThrow('User already inactive');
});
```

```javascript
export class User {
  constructor(name, email) {
    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email');
    }
    this.name = name;
    this.email = email;
    this.isActive = true;
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  deactivate() {
    if (!this.isActive) {
      throw new Error('User already inactive');
    }
    this.isActive = false;
  }
}
```

### Iteração 4: Refatorar validação

```javascript
// Extrair validação para classe separada
export class EmailValidator {
  static validate(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

export class User {
  constructor(name, email) {
    if (!EmailValidator.validate(email)) {
      throw new Error('Invalid email');
    }
    this.name = name;
    this.email = email;
    this.isActive = true;
  }

  deactivate() {
    if (!this.isActive) {
      throw new Error('User already inactive');
    }
    this.isActive = false;
  }
}
```

## TDD com Funções Puras

### Exemplo: Validador de CPF

```javascript
// cpf.test.js
import { validateCPF } from './cpf';

describe('validateCPF()', () => {
  test('should return false for empty string', () => {
    expect(validateCPF('')).toBe(false);
  });
});
```

```javascript
// cpf.js
export function validateCPF(cpf) {
  return false; // Código mínimo
}
```

```javascript
// Adicionar mais casos
test('should return false for invalid format', () => {
  expect(validateCPF('123')).toBe(false);
});

test('should return false for all same digits', () => {
  expect(validateCPF('111.111.111-11')).toBe(false);
});

test('should return true for valid CPF', () => {
  expect(validateCPF('123.456.789-09')).toBe(true);
});
```

```javascript
// Implementação completa
export function validateCPF(cpf) {
  if (!cpf) return false;

  const cleaned = cpf.replace(/[^\d]/g, '');

  if (cleaned.length !== 11) return false;
  if (/^(\d)\1+$/.test(cleaned)) return false;

  // Validação dos dígitos verificadores
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned[i]) * (10 - i);
  }

  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleaned[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned[i]) * (11 - i);
  }

  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleaned[10])) return false;

  return true;
}
```

## Boas Práticas TDD

###  Fazer

1. **Escreva o teste primeiro**
   - Define o comportamento esperado
   - Garante que o teste pode falhar

2. **Pequenos passos**
   - Um teste de cada vez
   - Uma funcionalidade de cada vez

3. **Código mínimo para passar**
   - Não antecipe requisitos
   - YAGNI (You Aren't Gonna Need It)

4. **Refatore com confiança**
   - Testes garantem que nada quebrou

5. **Teste comportamento, não implementação**
   ```javascript
   //  Bom
   expect(user.getFullName()).toBe('John Doe');

   //  Ruim
   expect(user.firstName).toBe('John');
   expect(user.lastName).toBe('Doe');
   ```

###  Evitar

1. **Não escreva muito código sem teste**
2. **Não pule o refactor**
3. **Não teste detalhes de implementação**
4. **Não tenha medo de deletar código**

## Quando NÃO usar TDD?

- Protótipos rápidos (throw-away code)
- Explorando uma tecnologia nova
- Interface de usuário complexa
- Código experimental

## TDD vs Testes Tradicionais

| TDD | Testes Tradicionais |
|-----|-------------------|
| Teste primeiro | Código primeiro |
| Design emerge dos testes | Design depois testes |
| Alta cobertura | Cobertura variável |
| Refatoração constante | Refatoração ocasional |

## Exercício Prático

Implemente uma função `calculateDiscount(price, percent)` usando TDD:

```javascript
// 1. Teste básico
test('should calculate 10% discount', () => {
  expect(calculateDiscount(100, 10)).toBe(90);
});

// 2. Casos extremos
test('should return original price for 0% discount', () => {
  expect(calculateDiscount(100, 0)).toBe(100);
});

test('should handle 100% discount', () => {
  expect(calculateDiscount(100, 100)).toBe(0);
});

// 3. Validações
test('should throw error for negative price', () => {
  expect(() => calculateDiscount(-100, 10)).toThrow();
});

test('should throw error for discount > 100', () => {
  expect(() => calculateDiscount(100, 150)).toThrow();
});
```

## Resumo

**TDD em 3 passos:**
1.  Escreva teste que falha
2.  Escreva código para passar
3.  Refatore

**Benefícios:**
- Código mais testável
- Menos bugs
- Melhor design
- Refatoração segura

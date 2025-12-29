# Testes Unitários

## O que são Testes Unitários?

Testes unitários verificam o comportamento de **unidades isoladas** de código (funções, métodos, classes) de forma independente.

## Características

-  **Rápidos**: Executam em milissegundos
-  **Isolados**: Não dependem de banco de dados, APIs, arquivos
-  **Determinísticos**: Sempre retornam o mesmo resultado
-  **Focados**: Testam uma coisa por vez

## Estrutura de um Teste Unitário

### AAA Pattern

```javascript
test('should calculate discount correctly', () => {
  // Arrange (Preparar)
  const price = 100;
  const discountPercent = 20;

  // Act (Agir)
  const finalPrice = applyDiscount(price, discountPercent);

  // Assert (Verificar)
  expect(finalPrice).toBe(80);
});
```

## Exemplos Práticos

### 1. Testando Funções Puras

```javascript
// math.js
export function multiply(a, b) {
  return a * b;
}

export function isEven(num) {
  return num % 2 === 0;
}

export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
```

```javascript
// math.test.js
import { multiply, isEven, capitalize } from './math';

describe('multiply()', () => {
  test('should multiply two positive numbers', () => {
    expect(multiply(3, 4)).toBe(12);
  });

  test('should handle negative numbers', () => {
    expect(multiply(-3, 4)).toBe(-12);
  });

  test('should return 0 when multiplying by zero', () => {
    expect(multiply(5, 0)).toBe(0);
  });
});

describe('isEven()', () => {
  test('should return true for even numbers', () => {
    expect(isEven(2)).toBe(true);
    expect(isEven(100)).toBe(true);
  });

  test('should return false for odd numbers', () => {
    expect(isEven(3)).toBe(false);
    expect(isEven(99)).toBe(false);
  });
});

describe('capitalize()', () => {
  test('should capitalize first letter', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  test('should handle empty string', () => {
    expect(capitalize('')).toBe('');
  });

  test('should handle null/undefined', () => {
    expect(capitalize(null)).toBe('');
    expect(capitalize(undefined)).toBe('');
  });
});
```

### 2. Testando Classes

```javascript
// User.js
export class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
    this.isActive = true;
  }

  deactivate() {
    this.isActive = false;
  }

  updateEmail(newEmail) {
    if (!newEmail.includes('@')) {
      throw new Error('Invalid email');
    }
    this.email = newEmail;
  }

  getDisplayName() {
    return `${this.name} (${this.email})`;
  }
}
```

```javascript
// User.test.js
import { User } from './User';

describe('User', () => {
  let user;

  beforeEach(() => {
    user = new User('John Doe', 'john@example.com');
  });

  describe('constructor', () => {
    test('should create user with correct properties', () => {
      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@example.com');
      expect(user.isActive).toBe(true);
    });
  });

  describe('deactivate()', () => {
    test('should set isActive to false', () => {
      user.deactivate();
      expect(user.isActive).toBe(false);
    });
  });

  describe('updateEmail()', () => {
    test('should update email with valid format', () => {
      user.updateEmail('newemail@example.com');
      expect(user.email).toBe('newemail@example.com');
    });

    test('should throw error with invalid email', () => {
      expect(() => {
        user.updateEmail('invalid-email');
      }).toThrow('Invalid email');
    });
  });

  describe('getDisplayName()', () => {
    test('should return formatted display name', () => {
      expect(user.getDisplayName()).toBe('John Doe (john@example.com)');
    });
  });
});
```

### 3. Testando Validações

```javascript
// validator.js
export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validatePassword(password) {
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  return true;
}

export function validateAge(age) {
  return age >= 18 && age <= 120;
}
```

```javascript
// validator.test.js
import { validateEmail, validatePassword, validateAge } from './validator';

describe('validateEmail()', () => {
  test('should accept valid emails', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name@domain.co')).toBe(true);
  });

  test('should reject invalid emails', () => {
    expect(validateEmail('invalid')).toBe(false);
    expect(validateEmail('missing@domain')).toBe(false);
    expect(validateEmail('@nodomain.com')).toBe(false);
  });
});

describe('validatePassword()', () => {
  test('should accept valid passwords', () => {
    expect(validatePassword('SecurePass123')).toBe(true);
  });

  test('should reject short passwords', () => {
    expect(validatePassword('Short1')).toBe(false);
  });

  test('should reject passwords without uppercase', () => {
    expect(validatePassword('noupppercase123')).toBe(false);
  });

  test('should reject passwords without numbers', () => {
    expect(validatePassword('NoNumbers')).toBe(false);
  });
});

describe('validateAge()', () => {
  test('should accept valid ages', () => {
    expect(validateAge(18)).toBe(true);
    expect(validateAge(50)).toBe(true);
    expect(validateAge(120)).toBe(true);
  });

  test('should reject ages below 18', () => {
    expect(validateAge(17)).toBe(false);
  });

  test('should reject ages above 120', () => {
    expect(validateAge(121)).toBe(false);
  });
});
```

### 4. Testando com Mocks

```javascript
// UserService.js
export class UserService {
  constructor(database, emailService) {
    this.database = database;
    this.emailService = emailService;
  }

  async createUser(userData) {
    const user = await this.database.insert(userData);
    await this.emailService.sendWelcomeEmail(user.email);
    return user;
  }
}
```

```javascript
// UserService.test.js
import { UserService } from './UserService';

describe('UserService', () => {
  let userService;
  let mockDatabase;
  let mockEmailService;

  beforeEach(() => {
    // Criar mocks
    mockDatabase = {
      insert: jest.fn()
    };

    mockEmailService = {
      sendWelcomeEmail: jest.fn()
    };

    userService = new UserService(mockDatabase, mockEmailService);
  });

  describe('createUser()', () => {
    test('should create user in database', async () => {
      const userData = { name: 'John', email: 'john@example.com' };
      mockDatabase.insert.mockResolvedValue({ id: 1, ...userData });

      const user = await userService.createUser(userData);

      expect(mockDatabase.insert).toHaveBeenCalledWith(userData);
      expect(user).toEqual({ id: 1, name: 'John', email: 'john@example.com' });
    });

    test('should send welcome email', async () => {
      const userData = { name: 'John', email: 'john@example.com' };
      mockDatabase.insert.mockResolvedValue({ id: 1, ...userData });

      await userService.createUser(userData);

      expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalledWith('john@example.com');
    });

    test('should not send email if database fails', async () => {
      mockDatabase.insert.mockRejectedValue(new Error('DB Error'));

      await expect(userService.createUser({})).rejects.toThrow('DB Error');

      expect(mockEmailService.sendWelcomeEmail).not.toHaveBeenCalled();
    });
  });
});
```

## Testes Parametrizados

```javascript
// calculator.js
export function add(a, b) {
  return a + b;
}
```

```javascript
// calculator.test.js
import { add } from './calculator';

test.each([
  [1, 2, 3],
  [5, 5, 10],
  [-1, 1, 0],
  [0, 0, 0]
])('add(%i, %i) should return %i', (a, b, expected) => {
  expect(add(a, b)).toBe(expected);
});
```

## Testando Erros

```javascript
// divide.js
export function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}
```

```javascript
// divide.test.js
import { divide } from './divide';

describe('divide()', () => {
  test('should divide numbers correctly', () => {
    expect(divide(10, 2)).toBe(5);
  });

  test('should throw error when dividing by zero', () => {
    expect(() => divide(10, 0)).toThrow('Division by zero');
  });
});
```

## Cobertura de Casos Extremos (Edge Cases)

```javascript
describe('Edge Cases', () => {
  test('empty arrays', () => {
    expect(sum([])).toBe(0);
  });

  test('null/undefined', () => {
    expect(getLength(null)).toBe(0);
    expect(getLength(undefined)).toBe(0);
  });

  test('large numbers', () => {
    expect(add(Number.MAX_SAFE_INTEGER, 1)).toBeDefined();
  });

  test('special characters', () => {
    expect(sanitize('<script>alert("xss")</script>')).not.toContain('<script>');
  });
});
```

## Boas Práticas

###  Fazer

1. **Testar comportamento público**
   ```javascript
   //  Testa resultado
   expect(user.getFullName()).toBe('John Doe');
   ```

2. **Um conceito por teste**
   ```javascript
   test('should validate email format', () => {
     expect(isValidEmail('test@example.com')).toBe(true);
   });

   test('should reject invalid email', () => {
     expect(isValidEmail('invalid')).toBe(false);
   });
   ```

3. **Nomes descritivos**
   ```javascript
   test('should throw error when password is too short', () => {
     // ...
   });
   ```

###  Evitar

1. **Não teste detalhes de implementação**
   ```javascript
   //  Testa implementação
   expect(user._validateEmail).toHaveBeenCalled();

   //  Testa comportamento
   expect(() => user.setEmail('invalid')).toThrow();
   ```

2. **Não faça testes dependentes**
   ```javascript
   //  Testes acoplados
   let user;
   test('create user', () => { user = new User(); });
   test('update user', () => { user.update(); }); // Depende do anterior
   ```

3. **Não teste frameworks/bibliotecas**
   ```javascript
   //  Testando Array.map
   test('map works', () => {
     expect([1, 2].map(x => x * 2)).toEqual([2, 4]);
   });
   ```

## Checklist

- [ ] Função tem teste?
- [ ] Casos extremos (edge cases) cobertos?
- [ ] Erros tratados?
- [ ] Casos de sucesso e falha testados?
- [ ] Testes independentes entre si?
- [ ] Mocks usados para dependências externas?
- [ ] Nomes descritivos?

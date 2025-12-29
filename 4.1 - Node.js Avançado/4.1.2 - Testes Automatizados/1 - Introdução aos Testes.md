# Introdução aos Testes Automatizados

## O que são Testes Automatizados?

Testes automatizados são scripts que verificam se o código funciona conforme esperado, executados automaticamente sem intervenção manual.

## Por que Testar?

### Benefícios

1. **Confiança**
   - Garante que o código funciona como esperado
   - Facilita refatoração sem medo de quebrar funcionalidades

2. **Documentação Viva**
   - Testes mostram como o código deve ser usado
   - Exemplos práticos de uso da API

3. **Detecção Precoce de Bugs**
   - Encontra problemas antes de chegarem à produção
   - Reduz custo de correção

4. **Facilita Colaboração**
   - Outros desenvolvedores podem modificar código com segurança
   - CI/CD valida mudanças automaticamente

## Pirâmide de Testes

```
        /\
       /  \
      / E2E \      Poucos - Lentos - Caros
     /--------\
    /          \
   / Integração \  Médio - Moderados
  /--------------\
 /                \
/  Testes Unitários \  Muitos - Rápidos - Baratos
```

### Testes Unitários (70%)
- Testam funções/métodos isolados
- Rápidos e baratos
- Devem ser a maioria dos testes

### Testes de Integração (20%)
- Testam interação entre componentes
- Banco de dados, APIs externas, etc.
- Moderadamente lentos

### Testes E2E (10%)
- Testam fluxo completo da aplicação
- Simulam usuário real
- Lentos e caros

## Tipos de Testes

### 1. Testes Unitários

Testam unidades isoladas de código (funções, métodos).

```javascript
// função
function sum(a, b) {
  return a + b;
}

// teste
test('sum should add two numbers', () => {
  expect(sum(2, 3)).toBe(5);
});
```

### 2. Testes de Integração

Testam interação entre módulos/componentes.

```javascript
test('should create user in database', async () => {
  const user = await UserService.create({
    name: 'John',
    email: 'john@example.com'
  });

  expect(user.id).toBeDefined();
  expect(user.name).toBe('John');
});
```

### 3. Testes E2E (End-to-End)

Testam fluxo completo da aplicação.

```javascript
test('user can login and view dashboard', async () => {
  await page.goto('http://localhost:3000/login');
  await page.fill('#email', 'user@example.com');
  await page.fill('#password', 'password123');
  await page.click('#login-button');

  await expect(page).toHaveURL('http://localhost:3000/dashboard');
});
```

## Conceitos Fundamentais

### AAA Pattern (Arrange, Act, Assert)

```javascript
test('should calculate total price', () => {
  // Arrange (Preparar)
  const items = [
    { name: 'Book', price: 20 },
    { name: 'Pen', price: 5 }
  ];

  // Act (Agir)
  const total = calculateTotal(items);

  // Assert (Verificar)
  expect(total).toBe(25);
});
```

### Mocks, Stubs e Spies

**Mock**: Substitui dependência externa
```javascript
const sendEmail = jest.fn();
```

**Stub**: Retorna valor pré-definido
```javascript
jest.spyOn(Database, 'query').mockResolvedValue([]);
```

**Spy**: Observa chamadas de função
```javascript
const spy = jest.spyOn(console, 'log');
```

## Frameworks de Teste em Node.js

### Jest (Mais Popular)
```bash
npm install --save-dev jest
```

### Mocha + Chai
```bash
npm install --save-dev mocha chai
```

### Vitest (Moderno e Rápido)
```bash
npm install --save-dev vitest
```

## Estrutura de um Teste

```javascript
// user.test.js

describe('User Service', () => {

  beforeEach(() => {
    // Executado antes de cada teste
    database.clear();
  });

  afterEach(() => {
    // Executado após cada teste
    jest.clearAllMocks();
  });

  describe('create()', () => {
    test('should create user with valid data', () => {
      // Teste aqui
    });

    test('should throw error with invalid email', () => {
      // Teste aqui
    });
  });

  describe('findById()', () => {
    test('should return user when found', () => {
      // Teste aqui
    });

    test('should return null when not found', () => {
      // Teste aqui
    });
  });
});
```

## Cobertura de Testes (Coverage)

Mede quanto do código está coberto por testes.

```bash
# Gerar relatório de cobertura
npm test -- --coverage
```

Métricas:
- **Statements**: % de declarações executadas
- **Branches**: % de condicionais testadas
- **Functions**: % de funções testadas
- **Lines**: % de linhas executadas

Meta: > 80% de cobertura

## Boas Práticas

###  Fazer

1. **Testes Pequenos e Focados**
   ```javascript
   test('should validate email format', () => {
     expect(isValidEmail('test@example.com')).toBe(true);
   });
   ```

2. **Nomes Descritivos**
   ```javascript
   test('should throw error when user email already exists', () => {
     // ...
   });
   ```

3. **Testar Casos Extremos**
   ```javascript
   test('should handle empty array', () => {
     expect(sum([])).toBe(0);
   });
   ```

###  Evitar

1. **Testes Dependentes**
   ```javascript
   //  Teste 2 depende do Teste 1
   test('create user', () => {
     user = createUser();
   });

   test('delete user', () => {
     deleteUser(user.id); // Depende do anterior
   });
   ```

2. **Testar Implementação, não Comportamento**
   ```javascript
   //  Testando implementação
   expect(userService.database.query).toHaveBeenCalled();

   //  Testando comportamento
   expect(user).toEqual({ id: 1, name: 'John' });
   ```

## Exemplo Completo

```javascript
// math.js
export function divide(a, b) {
  if (b === 0) {
    throw new Error('Cannot divide by zero');
  }
  return a / b;
}

// math.test.js
import { divide } from './math';

describe('divide()', () => {
  test('should divide two numbers correctly', () => {
    expect(divide(10, 2)).toBe(5);
    expect(divide(9, 3)).toBe(3);
  });

  test('should handle negative numbers', () => {
    expect(divide(-10, 2)).toBe(-5);
  });

  test('should handle decimals', () => {
    expect(divide(5, 2)).toBe(2.5);
  });

  test('should throw error when dividing by zero', () => {
    expect(() => divide(10, 0)).toThrow('Cannot divide by zero');
  });
});
```

## Quando Escrever Testes?

### TDD (Test-Driven Development)
1. Escreva o teste (falha)
2. Escreva o código mínimo para passar
3. Refatore

### Abordagem Tradicional
1. Escreva o código
2. Escreva os testes
3. Refatore

**Recomendação**: Comece com testes simples e vá aumentando a cobertura gradualmente.

## Próximos Passos

- Aprender **Jest** (framework mais popular)
- Praticar **TDD** (Test-Driven Development)
- Estudar **Mocks e Stubs**
- Implementar **CI/CD** com testes automatizados

# Jest - Framework de Testes

## O que é Jest?

Jest é um framework de testes JavaScript desenvolvido pelo Facebook, focado em simplicidade e suporte para projetos de qualquer tamanho.

## Características

-  Zero configuração inicial
-  Snapshots
-  Mocks nativos
-  Cobertura de código integrada
-  Testes paralelos (rápido)
-  Suporte a TypeScript

## Instalação

```bash
npm install --save-dev jest

# Com TypeScript
npm install --save-dev jest @types/jest ts-jest
```

## Configuração

### package.json

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### jest.config.js (Opcional)

```javascript
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js'
  ],
  testMatch: [
    '**/__tests__/**/*.js',
    '**/*.test.js',
    '**/*.spec.js'
  ]
};
```

## Estrutura Básica

```javascript
// sum.js
function sum(a, b) {
  return a + b;
}

module.exports = sum;
```

```javascript
// sum.test.js
const sum = require('./sum');

test('should add 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

## Matchers (Verificadores)

### Igualdade

```javascript
test('equality matchers', () => {
  expect(2 + 2).toBe(4);                    // ===
  expect({ name: 'John' }).toEqual({ name: 'John' }); // deep equality
  expect([1, 2, 3]).toEqual([1, 2, 3]);
});
```

### Truthiness

```javascript
test('truthiness', () => {
  expect(true).toBeTruthy();
  expect(false).toBeFalsy();
  expect(null).toBeNull();
  expect(undefined).toBeUndefined();
  expect('hello').toBeDefined();
});
```

### Números

```javascript
test('numbers', () => {
  expect(10).toBeGreaterThan(5);
  expect(5).toBeLessThan(10);
  expect(10).toBeGreaterThanOrEqual(10);
  expect(0.1 + 0.2).toBeCloseTo(0.3);  // Floats
});
```

### Strings

```javascript
test('strings', () => {
  expect('Hello World').toMatch(/World/);
  expect('Testing').toContain('test');
  expect('JavaScript').toHaveLength(10);
});
```

### Arrays

```javascript
test('arrays', () => {
  const fruits = ['apple', 'banana', 'orange'];

  expect(fruits).toContain('banana');
  expect(fruits).toHaveLength(3);
  expect(fruits).toEqual(expect.arrayContaining(['apple', 'orange']));
});
```

### Objetos

```javascript
test('objects', () => {
  const user = { name: 'John', age: 30 };

  expect(user).toHaveProperty('name');
  expect(user).toHaveProperty('age', 30);
  expect(user).toMatchObject({ name: 'John' });
});
```

### Exceções

```javascript
test('exceptions', () => {
  function throwError() {
    throw new Error('Something went wrong');
  }

  expect(() => throwError()).toThrow();
  expect(() => throwError()).toThrow('Something went wrong');
  expect(() => throwError()).toThrow(Error);
});
```

## Async/Await

```javascript
// Promises
test('should fetch user data', () => {
  return fetchUser(1).then(user => {
    expect(user.name).toBe('John');
  });
});

// Async/Await
test('should fetch user data', async () => {
  const user = await fetchUser(1);
  expect(user.name).toBe('John');
});

// Rejeição de Promise
test('should fail to fetch invalid user', async () => {
  await expect(fetchUser(999)).rejects.toThrow('User not found');
});
```

## Hooks (Ciclo de Vida)

```javascript
describe('User Service', () => {

  beforeAll(() => {
    // Executado UMA VEZ antes de todos os testes
    console.log('Setup database connection');
  });

  afterAll(() => {
    // Executado UMA VEZ depois de todos os testes
    console.log('Close database connection');
  });

  beforeEach(() => {
    // Executado ANTES de cada teste
    console.log('Clear database');
  });

  afterEach(() => {
    // Executado DEPOIS de cada teste
    console.log('Reset mocks');
  });

  test('test 1', () => {
    // ...
  });

  test('test 2', () => {
    // ...
  });
});
```

## Mocks

### Mock de Funções

```javascript
test('mock function', () => {
  const mockFn = jest.fn();

  mockFn('hello');
  mockFn('world');

  expect(mockFn).toHaveBeenCalledTimes(2);
  expect(mockFn).toHaveBeenCalledWith('hello');
  expect(mockFn).toHaveBeenLastCalledWith('world');
});
```

### Mock com Retorno

```javascript
test('mock return value', () => {
  const mockFn = jest.fn();

  mockFn.mockReturnValue(42);
  expect(mockFn()).toBe(42);

  mockFn.mockReturnValueOnce(1)
        .mockReturnValueOnce(2)
        .mockReturnValue(3);

  expect(mockFn()).toBe(1);
  expect(mockFn()).toBe(2);
  expect(mockFn()).toBe(3);
});
```

### Mock de Módulos

```javascript
// emailService.js
const sendEmail = (to, subject) => {
  // Implementação real
};

module.exports = { sendEmail };
```

```javascript
// user.test.js
jest.mock('./emailService');

const { sendEmail } = require('./emailService');
const { createUser } = require('./user');

test('should send welcome email', async () => {
  sendEmail.mockResolvedValue(true);

  await createUser({ name: 'John', email: 'john@example.com' });

  expect(sendEmail).toHaveBeenCalledWith(
    'john@example.com',
    'Welcome!'
  );
});
```

### Spy em Métodos

```javascript
test('spy on method', () => {
  const user = {
    getName: () => 'John'
  };

  const spy = jest.spyOn(user, 'getName');

  user.getName();

  expect(spy).toHaveBeenCalled();

  spy.mockRestore(); // Restaura implementação original
});
```

## Cobertura de Código

```bash
# Gerar relatório de cobertura
npm test -- --coverage

# Cobertura com limite mínimo
npm test -- --coverage --coverageThreshold='{"global": {"lines": 80}}'
```

Saída:
```
----------|---------|----------|---------|---------|
File      | % Stmts | % Branch | % Funcs | % Lines |
----------|---------|----------|---------|---------|
user.js   |   90.00 |    85.71 |  100.00 |   90.00 |
----------|---------|----------|---------|---------|
```

## Snapshot Testing

```javascript
test('renders correctly', () => {
  const output = renderComponent({ name: 'John' });

  expect(output).toMatchSnapshot();
});
```

Primeira execução: cria snapshot
```
exports[`renders correctly 1`] = `
<div>
  <h1>Hello John</h1>
</div>
`;
```

Próximas execuções: compara com snapshot salvo

## Testes Parametrizados

```javascript
test.each([
  [1, 1, 2],
  [2, 3, 5],
  [5, 5, 10]
])('sum(%i, %i) should return %i', (a, b, expected) => {
  expect(sum(a, b)).toBe(expected);
});
```

## Comandos Úteis

```bash
# Rodar todos os testes
npm test

# Watch mode (re-executa ao salvar)
npm test -- --watch

# Apenas testes modificados
npm test -- --onlyChanged

# Rodar teste específico
npm test -- user.test.js

# Cobertura
npm test -- --coverage

# Modo verboso
npm test -- --verbose

# Atualizar snapshots
npm test -- --updateSnapshot
```

## Configurações Úteis

```javascript
// jest.config.js
module.exports = {
  // Ambiente de teste
  testEnvironment: 'node', // ou 'jsdom' para frontend

  // Timeout padrão (ms)
  testTimeout: 10000,

  // Setup antes dos testes
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Ignorar arquivos
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],

  // Transformar arquivos (TypeScript, Babel)
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },

  // Cobertura
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js'
  ]
};
```

## Boas Práticas

-  Use `describe` para agrupar testes relacionados
-  Nomes descritivos: `test('should return user when ID exists')`
-  Um `expect` por teste quando possível
-  Use `beforeEach` para setup repetitivo
-  Mock dependências externas
-  Teste casos extremos (edge cases)
-  Não teste implementação, teste comportamento
-  Não dependa da ordem de execução dos testes

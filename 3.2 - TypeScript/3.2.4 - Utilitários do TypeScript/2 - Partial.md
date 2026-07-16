# Partial

Nesta aula, vamos nos aprofundar no utility type **`Partial<T>`**. Ele é um dos utilitários mais práticos e comuns no dia a dia do desenvolvimento TypeScript, especialmente ao lidar com formulários, estados locais e atualizações de dados.

---

## 1. O que é o `Partial<T>`?

O `Partial<T>` constrói um novo tipo onde **todas as propriedades de `T` são definidas como opcionais (`?`)**. 

Isso significa que qualquer objeto do tipo `Partial<T>` pode conter nenhuma, algumas ou todas as propriedades da estrutura original `T`.

---

## 2. Por baixo dos panos (Under the hood)

Se olharmos a definição interna do TypeScript para o `Partial`, ele é implementado utilizando **Mapped Types** (Tipos Mapeados):

```typescript
type Partial<T> = {
  [P in keyof T]?: T[P];
};
```
* **`keyof T`:** Obtém todas as chaves do tipo `T`.
* **`P in keyof T`:** Percorre cada propriedade `P` de `T`.
* **`?:`:** Adiciona o modificador de opcionalidade a cada propriedade mapeada.
* **`T[P]`:** Mantém o tipo original da propriedade `P`.

---

## 3. Exemplos Práticos

### Exemplo 1: Declaração de Objeto Parcial (Caso de Uso Simples)

O exemplo mais básico é declarar uma variável com o tipo `Partial<T>`, permitindo que forneçamos apenas uma parte das propriedades definidas na interface original:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// Objeto completo seguindo a interface User
const newUser: User = { 
  id: 1, 
  name: "Rodrigo", 
  email: "rodrigo@email.com" 
};

// Objeto parcial que contém apenas a propriedade 'name'
const updatedUser: Partial<User> = { 
  name: "Rodrigo Gonçalves" 
};
```

---

### Exemplo 2: Atualizações Parciais (Rotas PATCH / APIs)
Ao atualizar um registro em um banco de dados, raramente enviamos todos os campos novamente. O usuário pode querer alterar apenas o e-mail ou apenas o nome.

```typescript
interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: "admin" | "usuario";
  ativo: boolean;
}

// Simulando um banco de dados
let usuarioBanco: Usuario = {
  id: "usr_123",
  nome: "Taylor Silva",
  email: "taylor@email.com",
  role: "usuario",
  ativo: true
};

// A função de atualização aceita apenas campos que queremos mudar (exceto o id, que é fixo)
function atualizarUsuario(id: string, camposParaAtualizar: Partial<Omit<Usuario, "id">>): void {
  usuarioBanco = {
    ...usuarioBanco,
    ...camposParaAtualizar
  };
  console.log("Usuário atualizado com sucesso!", usuarioBanco);
}

// Podemos atualizar apenas o e-mail
atualizarUsuario("usr_123", { email: "taylor.novo@email.com" });

// Ou múltiplos campos ao mesmo tempo
atualizarUsuario("usr_123", { nome: "Taylor R. Silva", ativo: false });
```

---

### Exemplo 3: Configurações com Valores Padrão (Options/Configs)
Em bibliotecas ou utilitários, é comum termos configurações padrão e permitir que o usuário substitua apenas algumas delas.

```typescript
interface ServerConfig {
  port: number;
  host: string;
  enableLog: boolean;
  timeout: number;
}

const DEFAULT_CONFIG: ServerConfig = {
  port: 3000,
  host: "localhost",
  enableLog: true,
  timeout: 5000,
};

function startServer(customConfig: Partial<ServerConfig> = {}) {
  // Mescla as opções padrão com as personalizadas pelo usuário
  const finalConfig: ServerConfig = {
    ...DEFAULT_CONFIG,
    ...customConfig
  };

  console.log(`Servidor rodando em http://${finalConfig.host}:${finalConfig.port}`);
}

// Inicia com as configurações padrão
startServer();

// Inicia substituindo apenas a porta e desabilitando logs
startServer({ port: 8080, enableLog: false });
```

---

## 4. Limitação Importante: O `Partial` é "Raso" (Shallow)

Por padrão, o `Partial<T>` do TypeScript altera apenas as propriedades do **primeiro nível** do objeto. Se você tiver propriedades aninhadas (objetos dentro de objetos), as propriedades internas **não** se tornarão opcionais de forma automática.

Veja este exemplo:

```typescript
interface Endereco {
  rua: string;
  numero: number;
}

interface Cliente {
  nome: string;
  endereco: Endereco; // Objeto aninhado
}

// O TypeScript aplica Partial apenas no primeiro nível:
const clienteParcial: Partial<Cliente> = {
  nome: "Rodrigo",
  // O campo endereco em si é opcional, mas se fornecido, deve conter rua E numero!
  endereco: {
    rua: "Av. Paulista"
    // ERRO! Propriedade 'numero' está faltando no tipo 'Endereco'.
  }
};
```

### Solução: Criando um `DeepPartial` personalizado
Para tornar todas as propriedades opcionais recursivamente (incluindo objetos filhos), você pode usar o seguinte tipo utilitário personalizado usando tipos condicionais:

```typescript
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Agora o endereço aninhado também se torna opcional em todos os níveis!
const clienteDeepParcial: DeepPartial<Cliente> = {
  nome: "Rodrigo",
  endereco: {
    rua: "Av. Paulista" // Válido! 'numero' não é mais obrigatório aqui.
  }
};
```

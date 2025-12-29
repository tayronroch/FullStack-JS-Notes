# Migrations com Sequelize

## Instalação

```bash
npm install sequelize sequelize-cli
npm install pg pg-hstore  # Para PostgreSQL
# ou
npm install mysql2        # Para MySQL
```

## Configuração Inicial

```bash
# Inicializar Sequelize
npx sequelize-cli init
```

Estrutura criada:
```
├── config/
│   └── config.json
├── migrations/
├── models/
└── seeders/
```

## Criar uma Migration

```bash
npx sequelize-cli migration:generate --name create-users-table
```

## Estrutura de uma Migration

```javascript
// migrations/20240101-create-users-table.js

'use strict';

module.exports = {
  // Aplicar mudanças
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  // Reverter mudanças
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
```

## Executar Migrations

```bash
# Aplicar todas as migrations pendentes
npx sequelize-cli db:migrate

# Reverter última migration
npx sequelize-cli db:migrate:undo

# Reverter todas as migrations
npx sequelize-cli db:migrate:undo:all
```

## Adicionar Coluna

```javascript
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'age', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'age');
  }
};
```

## Criar Índice

```javascript
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('users', ['email'], {
      name: 'users_email_index',
      unique: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('users', 'users_email_index');
  }
};
```

## Relacionamentos (Foreign Keys)

```javascript
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('posts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('posts');
  }
};
```

## Comandos Úteis

```bash
# Ver status das migrations
npx sequelize-cli db:migrate:status

# Criar migration
npx sequelize-cli migration:generate --name nome-da-migration

# Aplicar migrations
npx sequelize-cli db:migrate

# Reverter última migration
npx sequelize-cli db:migrate:undo

# Reverter até uma migration específica
npx sequelize-cli db:migrate:undo:all --to XXXXXXXXXXXXXX-create-posts.js
```

## Boas Práticas

-  Use nomes descritivos para migrations
-  Sempre teste o `up` e o `down`
-  Nunca edite migrations já aplicadas em produção
-  Mantenha migrations pequenas e focadas
-  Use timestamps nos nomes dos arquivos

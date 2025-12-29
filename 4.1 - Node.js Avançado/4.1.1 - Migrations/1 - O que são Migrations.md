# O que são Migrations

## Definição

Migrations (migrações) são arquivos que contêm instruções para modificar a estrutura do banco de dados de forma controlada e versionada.

## Por que usar Migrations?

### Vantagens

1. **Versionamento de Schema**
   - Histórico de todas as alterações no banco de dados
   - Rastreamento de quando e por que mudanças foram feitas

2. **Sincronização entre Ambientes**
   - Desenvolvimento, homologação e produção com o mesmo schema
   - Facilita trabalho em equipe

3. **Reversibilidade**
   - Possibilidade de desfazer alterações (rollback)
   - Segurança em caso de erros

4. **Automação**
   - Deploy automatizado de alterações
   - Redução de erros humanos

## Como funcionam?

```
Migration #1: Criar tabela users
Migration #2: Adicionar coluna email
Migration #3: Criar tabela posts
Migration #4: Adicionar índice em users.email
```

Cada migration tem:
- **UP**: código para aplicar a mudança
- **DOWN**: código para reverter a mudança

## Ferramentas Populares

- **Sequelize**: ORM completo com sistema de migrations
- **Knex.js**: Query builder com migrations
- **TypeORM**: ORM para TypeScript
- **Prisma**: ORM moderno com Prisma Migrate

## Exemplo Conceitual

```javascript
// Migration: criar_tabela_users

// UP - Aplicar
async function up() {
  await createTable('users', {
    id: 'integer primary key',
    name: 'varchar(255)',
    email: 'varchar(255) unique'
  })
}

// DOWN - Reverter
async function down() {
  await dropTable('users')
}
```

## Boas Práticas

-  Nunca editar migrations já aplicadas em produção
-  Criar uma migration para cada mudança lógica
-  Testar rollback antes de aplicar em produção
-  Incluir migrations no controle de versão (Git)
-  Nunca fazer alterações diretas no banco sem migration

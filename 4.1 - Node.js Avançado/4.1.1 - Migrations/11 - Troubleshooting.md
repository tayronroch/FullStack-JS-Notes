# Troubleshooting de Migrations

## Problemas Comuns e Soluções

### 1. Migration Travada (Stuck)

#### Sintoma

```bash
$ npm run migrate
Running migrations...
[Hangs forever, sem resposta]
```

#### Causa

Migration está esperando lock de tabela que nunca é liberado.

#### Diagnóstico

**PostgreSQL:**
```sql
-- Ver locks ativos
SELECT
  pid,
  usename,
  pg_blocking_pids(pid) as blocked_by,
  query as blocked_query
FROM pg_stat_activity
WHERE cardinality(pg_blocking_pids(pid)) > 0;

-- Ver migrations em execução
SELECT * FROM pg_stat_activity
WHERE query LIKE '%ALTER TABLE%'
   OR query LIKE '%CREATE INDEX%';
```

**MySQL:**
```sql
-- Ver processos
SHOW PROCESSLIST;

-- Ver locks
SHOW ENGINE INNODB STATUS\G

-- Ver transações pendentes
SELECT * FROM information_schema.INNODB_TRX;
```

#### Solução 1: Identificar e Matar Processo Bloqueador

**PostgreSQL:**
```sql
-- Encontrar processo bloqueador
SELECT
  pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE pid IN (
  SELECT unnest(pg_blocking_pids(12345))  -- 12345 = PID da migration travada
);
```

**MySQL:**
```sql
-- Matar processo
KILL 123456;  -- ID do processo
```

#### Solução 2: Timeout na Migration

```javascript
// config/database.js
module.exports = {
  production: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      // Timeout de statement
      statement_timeout: 60000,  // 60 segundos
      // Timeout de lock
      lock_timeout: 30000  // 30 segundos
    }
  }
};
```

```javascript
// Migration com timeout
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Definir timeout para esta sessão
    await queryInterface.sequelize.query(
      "SET statement_timeout = '60s'"
    );

    await queryInterface.sequelize.query(
      "SET lock_timeout = '30s'"
    );

    try {
      await queryInterface.addIndex('users', ['email']);
    } catch (error) {
      if (error.message.includes('timeout')) {
        console.error('Migration travou aguardando lock. Tente novamente.');
      }
      throw error;
    }
  }
};
```

### 2. Rollback Falhou

#### Sintoma

```bash
$ npm run migrate:undo
Rolling back migration...
ERROR: column "email" does not exist
```

#### Causa

Método `down` não está implementado corretamente ou dados foram modificados.

#### Diagnóstico

```javascript
// Verificar implementação do down
// migrations/20240115_add_email.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'email', {
      type: Sequelize.STRING
    });
  },

  down: async (queryInterface) => {
    // ERRO: Nome da coluna errado
    await queryInterface.removeColumn('users', 'emial'); // Typo!
  }
};
```

#### Solução 1: Corrigir e Reaplicar

```javascript
// Corrigir typo
module.exports = {
  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'email');  // Correto
  }
};
```

```bash
# Tentar novamente
npm run migrate:undo
```

#### Solução 2: Rollback Manual

```sql
-- Executar SQL manualmente
ALTER TABLE users DROP COLUMN email;
```

```bash
# Atualizar tabela de migrations
DELETE FROM "SequelizeMeta"
WHERE name = '20240115_add_email.js';
```

#### Solução 3: Rollback com Force

```javascript
// scripts/force-rollback.js
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL);

async function forceRollback(migrationName) {
  try {
    // Apenas remover da tabela de controle
    await sequelize.query(`
      DELETE FROM "SequelizeMeta"
      WHERE name = :name
    `, {
      replacements: { name: migrationName }
    });

    console.log(`Migration ${migrationName} removida do histórico`);
    console.log('ATENÇÃO: Schema não foi alterado!');
    console.log('Execute correções manuais se necessário');

  } catch (error) {
    console.error('Erro:', error.message);
  } finally {
    await sequelize.close();
  }
}

// Uso: node scripts/force-rollback.js 20240115_add_email.js
forceRollback(process.argv[2]);
```

### 3. Migration Aplicada Parcialmente

#### Sintoma

Migration falhou no meio, deixando banco em estado inconsistente.

```bash
$ npm run migrate
Running migration 20240115_users...
ERROR: duplicate key value violates unique constraint
Migration failed!
```

Agora o banco está parcialmente migrado.

#### Diagnóstico

```sql
-- Verificar se migration está registrada
SELECT * FROM "SequelizeMeta"
WHERE name = '20240115_users.js';

-- Verificar estado da tabela
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'users';
```

#### Solução: Usar Transações

**Problema (sem transação):**
```javascript
// Migration sem transação
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'email', {
      type: Sequelize.STRING
    });
    // Executa OK

    await queryInterface.addIndex('users', ['email'], { unique: true });
    // FALHA - mas coluna já foi criada!
  }
};
```

**Solução (com transação):**
```javascript
// Migration com transação
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.addColumn('users', 'email', {
        type: Sequelize.STRING
      }, { transaction });

      await queryInterface.addIndex('users', ['email'], {
        unique: true,
        transaction
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
```

#### Recuperação de Estado Parcial

```javascript
// scripts/fix-partial-migration.js
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL);

async function fixPartialMigration() {
  const transaction = await sequelize.transaction();

  try {
    // 1. Verificar estado atual
    const [columns] = await sequelize.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'users'
    `, { transaction });

    const hasEmail = columns.some(c => c.column_name === 'email');

    if (hasEmail) {
      console.log('Coluna email existe. Removendo...');

      // Remover índice se existir
      await sequelize.query(`
        DROP INDEX IF EXISTS users_email_unique
      `, { transaction });

      // Remover coluna
      await sequelize.query(`
        ALTER TABLE users DROP COLUMN email
      `, { transaction });
    }

    // 2. Remover migration da tabela de controle
    await sequelize.query(`
      DELETE FROM "SequelizeMeta"
      WHERE name = '20240115_users.js'
    `, { transaction });

    await transaction.commit();
    console.log('Estado restaurado. Pode reaplicar migration.');

  } catch (error) {
    await transaction.rollback();
    console.error('Erro:', error.message);
  } finally {
    await sequelize.close();
  }
}

fixPartialMigration();
```

### 4. "Migration already exists"

#### Sintoma

```bash
$ npx sequelize-cli migration:generate --name add-phone
ERROR: Migration already exists
```

#### Causa

Arquivo com mesmo timestamp já existe.

#### Solução

```bash
# Aguardar 1 segundo e tentar novamente
sleep 1
npx sequelize-cli migration:generate --name add-phone

# Ou renomear manualmente
mv migrations/20240115120000_add_phone.js \
   migrations/20240115120001_add_phone.js
```

### 5. Foreign Key Constraint Violation

#### Sintoma

```bash
$ npm run migrate
ERROR: insert or update on table "posts" violates foreign key constraint
```

#### Causa

Tentando criar foreign key mas há dados órfãos.

#### Diagnóstico

```sql
-- Encontrar registros órfãos
SELECT p.*
FROM posts p
LEFT JOIN users u ON p.user_id = u.id
WHERE u.id IS NULL;
```

#### Solução

```javascript
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Limpar órfãos primeiro
    await queryInterface.sequelize.query(`
      DELETE FROM posts
      WHERE user_id NOT IN (SELECT id FROM users)
    `);

    // 2. Adicionar constraint
    await queryInterface.addConstraint('posts', {
      fields: ['user_id'],
      type: 'foreign key',
      references: {
        table: 'users',
        field: 'id'
      }
    });
  }
};
```

### 6. Deadlock Durante Migration

#### Sintoma

```bash
$ npm run migrate
ERROR: deadlock detected
DETAIL: Process 12345 waits for ShareLock on transaction 67890
```

#### Causa

Múltiplas migrations ou queries concorrentes bloqueando-se mutuamente.

#### Diagnóstico

**PostgreSQL:**
```sql
-- Ver deadlocks
SELECT
  blocked_locks.pid AS blocked_pid,
  blocked_activity.usename AS blocked_user,
  blocking_locks.pid AS blocking_pid,
  blocking_activity.usename AS blocking_user,
  blocked_activity.query AS blocked_statement,
  blocking_activity.query AS current_statement_in_blocking_process
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks blocking_locks ON blocking_locks.locktype = blocked_locks.locktype
JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted;
```

#### Solução

**1. Executar migrations sequencialmente:**

```bash
# Ruim: múltiplas instâncias
npm run migrate &  # Processo 1
npm run migrate &  # Processo 2 - DEADLOCK!

# Bom: apenas uma instância
npm run migrate
```

**2. Lock advisory:**

```javascript
// Migration com lock exclusivo
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Adquirir lock advisory exclusivo
      await queryInterface.sequelize.query(
        'SELECT pg_advisory_xact_lock(123456)',
        { transaction }
      );

      // Executar migration
      await queryInterface.addColumn('users', 'phone', {
        type: Sequelize.STRING
      }, { transaction });

      await transaction.commit();
      // Lock é liberado automaticamente

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
```

### 7. Out of Memory Durante Migration

#### Sintoma

```bash
$ npm run migrate
FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - JavaScript heap out of memory
```

#### Causa

Processing de muitos dados de uma vez.

#### Solução: Processar em Lotes

```javascript
module.exports = {
  up: async (queryInterface) => {
    const batchSize = 1000;
    let processed = 0;

    while (true) {
      const [result] = await queryInterface.sequelize.query(`
        UPDATE users
        SET email = LOWER(email)
        WHERE id IN (
          SELECT id FROM users
          WHERE email != LOWER(email)
          LIMIT ${batchSize}
        )
      `);

      if (result.rowCount === 0) break;

      processed += result.rowCount;
      console.log(`Processados ${processed} registros...`);

      // Liberar memória
      if (global.gc) {
        global.gc();
      }

      // Pausa para não sobrecarregar
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`Total processado: ${processed}`);
  }
};
```

```bash
# Executar com mais memória
node --max-old-space-size=4096 node_modules/.bin/sequelize-cli db:migrate
```

### 8. "Cannot run migrations" - Tabela de Controle Corrompida

#### Sintoma

```bash
$ npm run migrate
ERROR: relation "SequelizeMeta" does not exist
```

#### Causa

Tabela de controle de migrations foi deletada ou corrompida.

#### Solução: Recriar Tabela de Controle

```javascript
// scripts/recreate-meta-table.js
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

async function recreateMetaTable() {
  const sequelize = new Sequelize(process.env.DATABASE_URL);

  try {
    // 1. Recriar tabela
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "SequelizeMeta" (
        name VARCHAR(255) NOT NULL PRIMARY KEY
      )
    `);

    // 2. Descobrir quais migrations estão aplicadas
    console.log('\nVerificando schema do banco...');

    const [tables] = await sequelize.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `);

    console.log('Tabelas existentes:', tables.map(t => t.table_name));

    // 3. Listar migrations disponíveis
    const migrationsDir = path.join(__dirname, '../migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.js'))
      .sort();

    console.log('\nMigrations disponíveis:');
    migrationFiles.forEach((file, i) => {
      console.log(`${i + 1}. ${file}`);
    });

    // 4. Perguntar quais foram aplicadas
    console.log('\nQuais migrations devem ser marcadas como aplicadas?');
    console.log('Digite os números separados por vírgula (ex: 1,2,3)');
    console.log('Ou "all" para marcar todas:');

    // Em produção, seria melhor automatizar isso
    // baseado na existência de tabelas/colunas

    // Exemplo: marcar todas
    for (const file of migrationFiles) {
      await sequelize.query(`
        INSERT INTO "SequelizeMeta" (name)
        VALUES (:name)
        ON CONFLICT DO NOTHING
      `, {
        replacements: { name: file }
      });
    }

    console.log('Tabela SequelizeMeta recriada com sucesso!');

  } catch (error) {
    console.error('Erro:', error.message);
  } finally {
    await sequelize.close();
  }
}

recreateMetaTable();
```

## Scripts de Diagnóstico

### Script Completo de Health Check

```javascript
// scripts/migration-health-check.js
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

async function healthCheck() {
  const sequelize = new Sequelize(process.env.DATABASE_URL);
  const issues = [];

  try {
    console.log('=== Migration Health Check ===\n');

    // 1. Verificar conexão
    await sequelize.authenticate();
    console.log('✓ Conexão com banco OK');

    // 2. Verificar tabela de controle
    try {
      await sequelize.query('SELECT * FROM "SequelizeMeta" LIMIT 1');
      console.log('✓ Tabela SequelizeMeta existe');
    } catch (error) {
      issues.push('✗ Tabela SequelizeMeta não existe');
    }

    // 3. Verificar migrations pendentes
    const [applied] = await sequelize.query(
      'SELECT name FROM "SequelizeMeta" ORDER BY name'
    );

    const migrationsDir = path.join(__dirname, '../migrations');
    const available = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.js'))
      .sort();

    const pending = available.filter(
      m => !applied.some(a => a.name === m)
    );

    if (pending.length === 0) {
      console.log('✓ Todas migrations aplicadas');
    } else {
      console.log(`⚠ ${pending.length} migrations pendentes:`);
      pending.forEach(m => console.log(`  - ${m}`));
    }

    // 4. Verificar locks
    const [locks] = await sequelize.query(`
      SELECT COUNT(*) as count
      FROM pg_locks
      WHERE NOT granted
    `);

    if (locks[0].count > 0) {
      issues.push(`✗ ${locks[0].count} locks aguardando`);
    } else {
      console.log('✓ Sem locks pendentes');
    }

    // 5. Verificar transações longas
    const [longTx] = await sequelize.query(`
      SELECT COUNT(*) as count
      FROM pg_stat_activity
      WHERE state = 'active'
        AND query_start < NOW() - INTERVAL '5 minutes'
    `);

    if (longTx[0].count > 0) {
      issues.push(`✗ ${longTx[0].count} transações longas (>5min)`);
    } else {
      console.log('✓ Sem transações longas');
    }

    // Resumo
    console.log('\n=== Resumo ===');
    if (issues.length === 0) {
      console.log('✓ Tudo OK!');
      process.exit(0);
    } else {
      console.log('✗ Problemas encontrados:');
      issues.forEach(issue => console.log(issue));
      process.exit(1);
    }

  } catch (error) {
    console.error('Erro:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

healthCheck();
```

## Prevenção de Problemas

### 1. Pre-flight Checks

```javascript
// Executar antes de cada migration
async function preFlightCheck(queryInterface) {
  // Verificar locks
  const [locks] = await queryInterface.sequelize.query(`
    SELECT COUNT(*) as count FROM pg_locks WHERE NOT granted
  `);

  if (locks[0].count > 0) {
    throw new Error(`${locks[0].count} locks ativos. Aguarde antes de migrar.`);
  }

  // Verificar conexões ativas
  const [conns] = await queryInterface.sequelize.query(`
    SELECT COUNT(*) as count FROM pg_stat_activity WHERE datname = current_database()
  `);

  if (conns[0].count > 50) {
    console.warn(`Atenção: ${conns[0].count} conexões ativas`);
  }

  return true;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await preFlightCheck(queryInterface);

    // Executar migration...
  }
};
```

### 2. Rollback Automático em Erro

```javascript
// wrapper para migrations
function safeMigration(upFn, downFn) {
  return {
    up: async (queryInterface, Sequelize) => {
      const transaction = await queryInterface.sequelize.transaction();

      try {
        await upFn(queryInterface, Sequelize, transaction);
        await transaction.commit();
      } catch (error) {
        console.error('Migration falhou:', error.message);
        console.log('Iniciando rollback automático...');

        await transaction.rollback();

        if (downFn) {
          try {
            await downFn(queryInterface, Sequelize);
            console.log('Rollback concluído');
          } catch (rollbackError) {
            console.error('Rollback também falhou:', rollbackError.message);
          }
        }

        throw error;
      }
    },
    down: downFn
  };
}

// Uso
module.exports = safeMigration(
  async (queryInterface, Sequelize, transaction) => {
    await queryInterface.addColumn('users', 'phone', {
      type: Sequelize.STRING
    }, { transaction });
  },
  async (queryInterface) => {
    await queryInterface.removeColumn('users', 'phone');
  }
);
```

## Checklist de Troubleshooting

Quando uma migration falhar:

- [ ] Verificar logs de erro completos
- [ ] Verificar estado da tabela SequelizeMeta
- [ ] Verificar locks ativos no banco
- [ ] Verificar se migration usa transações
- [ ] Testar rollback em ambiente de dev
- [ ] Verificar se há dados órfãos/inválidos
- [ ] Verificar espaço em disco
- [ ] Verificar memória disponível
- [ ] Verificar timeouts configurados
- [ ] Ter backup antes de correções

## Resumo de Comandos de Emergência

```bash
# PostgreSQL - Ver locks
SELECT * FROM pg_locks WHERE NOT granted;

# PostgreSQL - Matar processo
SELECT pg_terminate_backend(PID);

# PostgreSQL - Ver queries lentas
SELECT pid, query, state, query_start
FROM pg_stat_activity
WHERE state = 'active'
  AND query_start < NOW() - INTERVAL '5 minutes';

# Remover migration do histórico (último recurso!)
DELETE FROM "SequelizeMeta" WHERE name = 'migration_name.js';

# Recriar tabela de controle
CREATE TABLE "SequelizeMeta" (name VARCHAR(255) PRIMARY KEY);
```

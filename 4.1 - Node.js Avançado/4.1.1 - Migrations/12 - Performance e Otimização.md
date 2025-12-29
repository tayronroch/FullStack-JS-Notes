# Performance e Otimização de Migrations

## O Problema de Escala

```
Tabela pequena (1.000 registros):    Migration em segundos
Tabela média (100.000 registros):    Migration em minutos
Tabela grande (10.000.000 registros): Migration em horas (ou trava!)
```

## 1. Índices em Tabelas Grandes

### Problema: Locks Longos

```javascript
// RUIM: Bloqueia tabela por horas
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.addIndex('users', ['email']);
    // Lock exclusivo durante toda criação do índice!
  }
};
```

### Solução: CREATE INDEX CONCURRENTLY (PostgreSQL)

```javascript
// BOM: Não bloqueia leituras/escritas
module.exports = {
  up: async (queryInterface) => {
    // CONCURRENTLY não pode estar em transação
    await queryInterface.sequelize.query(`
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email
      ON users(email)
    `);
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      DROP INDEX CONCURRENTLY IF EXISTS idx_users_email
    `);
  }
};
```

**Características do CONCURRENTLY:**
- Não trava leituras
- Não trava escritas
- Leva ~2x mais tempo
- Não pode usar transação
- Pode falhar sem reverter

**Lidando com falhas:**

```javascript
module.exports = {
  up: async (queryInterface) => {
    try {
      // Tentar criar índice
      await queryInterface.sequelize.query(`
        CREATE INDEX CONCURRENTLY idx_users_email ON users(email)
      `);

    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('Índice já existe, continuando...');
        return;
      }

      // Se falhou, índice pode ficar INVALID
      console.error('Falha ao criar índice:', error.message);

      // Limpar índice inválido
      await queryInterface.sequelize.query(`
        DROP INDEX CONCURRENTLY IF EXISTS idx_users_email
      `);

      throw error;
    }
  }
};
```

### MySQL: Online DDL

```javascript
module.exports = {
  up: async (queryInterface) => {
    // MySQL 5.6+: Online DDL
    await queryInterface.sequelize.query(`
      ALTER TABLE users
      ADD INDEX idx_users_email (email)
      ALGORITHM=INPLACE,
      LOCK=NONE
    `);
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE users
      DROP INDEX idx_users_email
      ALGORITHM=INPLACE,
      LOCK=NONE
    `);
  }
};
```

## 2. Adicionar Colunas em Tabelas Grandes

### PostgreSQL: Adicionar com Default

**Problema em versões antigas (<11):**

```javascript
// PostgreSQL <11: Reescreve toda a tabela!
await queryInterface.addColumn('users', 'status', {
  type: Sequelize.STRING,
  defaultValue: 'active'  // Trigger full table rewrite!
});
```

**Solução para PostgreSQL <11:**

```javascript
// Adicionar sem default
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Adicionar coluna sem default
    await queryInterface.addColumn('users', 'status', {
      type: Sequelize.STRING,
      allowNull: true
    });

    // 2. Definir default (metadata apenas, rápido)
    await queryInterface.sequelize.query(`
      ALTER TABLE users
      ALTER COLUMN status SET DEFAULT 'active'
    `);

    // 3. Backfill em lotes (fora da migration, se necessário)
    // Ver seção de backfilling abaixo
  }
};
```

**PostgreSQL 11+:**
- Adicionar coluna com default é instantâneo
- Não reescreve tabela
- Default é aplicado apenas para novas linhas

## 3. Backfilling em Lotes

### Problema: UPDATE em Tabela Grande

```javascript
// RUIM: Tenta atualizar 10M registros de uma vez
await queryInterface.sequelize.query(`
  UPDATE users SET status = 'active' WHERE status IS NULL
`);
// Pode travar por horas, consumir toda RAM, causar bloat
```

### Solução: Processar em Batches

```javascript
module.exports = {
  up: async (queryInterface, Sequelize) => {
    console.log('Iniciando backfill em lotes...');

    const batchSize = 1000;
    let totalProcessed = 0;
    let batchCount = 0;

    while (true) {
      const startTime = Date.now();

      // Processar batch
      const [result] = await queryInterface.sequelize.query(`
        UPDATE users
        SET status = 'active'
        WHERE id IN (
          SELECT id
          FROM users
          WHERE status IS NULL
          LIMIT ${batchSize}
        )
      `);

      const rowsAffected = result.rowCount || 0;

      if (rowsAffected === 0) {
        break; // Nenhuma linha restante
      }

      totalProcessed += rowsAffected;
      batchCount++;

      const duration = Date.now() - startTime;
      const rate = (rowsAffected / duration * 1000).toFixed(0);

      console.log(
        `Batch ${batchCount}: ${rowsAffected} linhas em ${duration}ms ` +
        `(${rate} linhas/s). Total: ${totalProcessed}`
      );

      // Pausa entre batches para não sobrecarregar
      await new Promise(resolve => setTimeout(resolve, 100));

      // Liberar memória
      if (global.gc) global.gc();
    }

    console.log(`Backfill concluído: ${totalProcessed} linhas atualizadas`);
  }
};
```

### Backfill com Checkpoint

```javascript
// Para processos muito longos, salvar progresso
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Criar tabela de checkpoint
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS migration_checkpoints (
        migration_name VARCHAR(255) PRIMARY KEY,
        last_processed_id BIGINT,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    const migrationName = '20240115_backfill_status';
    const batchSize = 1000;

    // Recuperar último checkpoint
    const [checkpoints] = await queryInterface.sequelize.query(`
      SELECT last_processed_id
      FROM migration_checkpoints
      WHERE migration_name = :name
    `, {
      replacements: { name: migrationName }
    });

    let lastId = checkpoints[0]?.last_processed_id || 0;
    let totalProcessed = 0;

    while (true) {
      const [result] = await queryInterface.sequelize.query(`
        UPDATE users
        SET status = 'active'
        WHERE id > :lastId
          AND status IS NULL
          AND id IN (
            SELECT id FROM users
            WHERE id > :lastId AND status IS NULL
            ORDER BY id
            LIMIT ${batchSize}
          )
        RETURNING id
      `, {
        replacements: { lastId }
      });

      if (result.length === 0) break;

      // Atualizar checkpoint
      lastId = result[result.length - 1].id;
      totalProcessed += result.length;

      await queryInterface.sequelize.query(`
        INSERT INTO migration_checkpoints (migration_name, last_processed_id)
        VALUES (:name, :lastId)
        ON CONFLICT (migration_name)
        DO UPDATE SET last_processed_id = :lastId, updated_at = NOW()
      `, {
        replacements: { name: migrationName, lastId }
      });

      console.log(`Processados: ${totalProcessed}, último ID: ${lastId}`);

      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Limpar checkpoint
    await queryInterface.sequelize.query(`
      DELETE FROM migration_checkpoints WHERE migration_name = :name
    `, {
      replacements: { name: migrationName }
    });

    console.log(`Backfill concluído: ${totalProcessed} registros`);
  }
};
```

## 4. Alterar Tipos de Colunas

### PostgreSQL: Tipos Compatíveis

**Rápido (sem reescrita):**

```javascript
// VARCHAR(50) → VARCHAR(100): instantâneo
await queryInterface.changeColumn('users', 'name', {
  type: Sequelize.STRING(100)
});

// VARCHAR → TEXT: instantâneo
await queryInterface.changeColumn('posts', 'content', {
  type: Sequelize.TEXT
});

// Aumentar precision de NUMERIC: instantâneo
await queryInterface.sequelize.query(`
  ALTER TABLE products
  ALTER COLUMN price TYPE NUMERIC(12, 2)
`);
```

**Lento (com reescrita):**

```javascript
// VARCHAR → INTEGER: reescreve tabela
// TEXT → VARCHAR(50): reescreve e pode truncar
// INTEGER → BIGINT: reescreve (PostgreSQL <12)
```

**Solução: Usar USING para conversão customizada:**

```javascript
module.exports = {
  up: async (queryInterface) => {
    // Converter com validação
    await queryInterface.sequelize.query(`
      ALTER TABLE users
      ALTER COLUMN age TYPE INTEGER
      USING CASE
        WHEN age ~ '^[0-9]+$' THEN age::INTEGER
        ELSE NULL
      END
    `);
  }
};
```

## 5. Locks e Concorrência

### Tipos de Locks (PostgreSQL)

| Operação | Lock Level | Bloqueia Leitura? | Bloqueia Escrita? |
|----------|------------|-------------------|-------------------|
| SELECT | ACCESS SHARE | Não | Não |
| INSERT/UPDATE/DELETE | ROW EXCLUSIVE | Não | Não (mesma linha: sim) |
| CREATE INDEX | SHARE | Não | Sim |
| CREATE INDEX CONCURRENTLY | SHARE UPDATE EXCLUSIVE | Não | Não |
| ALTER TABLE | ACCESS EXCLUSIVE | Sim | Sim |
| DROP TABLE | ACCESS EXCLUSIVE | Sim | Sim |

### Minimizar Locks

```javascript
// RUIM: Lock longo
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    // Lock exclusivo por 10 minutos!
    await queryInterface.addColumn('users', 'col1', {...}, { transaction });
    await sleep(600000); // Alguma operação lenta
    await queryInterface.addColumn('users', 'col2', {...}, { transaction });

    await transaction.commit();
  }
};

// BOM: Locks curtos separados
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Lock curto 1
    await queryInterface.addColumn('users', 'col1', {...});

    // Fazer operação lenta fora do lock
    await doSlowOperation();

    // Lock curto 2
    await queryInterface.addColumn('users', 'col2', {...});
  }
};
```

### Lock Timeout

```javascript
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Definir timeout de lock
    await queryInterface.sequelize.query(`
      SET lock_timeout = '5s'
    `);

    try {
      await queryInterface.addIndex('users', ['email']);
    } catch (error) {
      if (error.message.includes('lock timeout')) {
        console.error('Não foi possível adquirir lock em 5s');
        console.error('Tente novamente em horário de menor tráfego');
      }
      throw error;
    }
  }
};
```

## 6. Particionamento

### Migrar para Tabela Particionada

**Cenário:** Tabela `events` com 100M registros → particionar por data

```javascript
// Migration 1: Criar tabela particionada
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Renomear tabela original
    await queryInterface.renameTable('events', 'events_old');

    // 2. Criar tabela particionada
    await queryInterface.sequelize.query(`
      CREATE TABLE events (
        id BIGSERIAL,
        user_id INTEGER,
        event_type VARCHAR(50),
        created_at TIMESTAMP NOT NULL,
        data JSONB
      ) PARTITION BY RANGE (created_at)
    `);

    // 3. Criar partições para os últimos 12 meses
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');

      await queryInterface.sequelize.query(`
        CREATE TABLE events_${year}_${month}
        PARTITION OF events
        FOR VALUES FROM ('${formatDate(date)}') TO ('${formatDate(nextDate)}')
      `);
    }

    // 4. Criar partição default para dados futuros
    await queryInterface.sequelize.query(`
      CREATE TABLE events_default
      PARTITION OF events DEFAULT
    `);
  }
};

// Migration 2: Copiar dados em lotes
module.exports = {
  up: async (queryInterface) => {
    console.log('Copiando dados para tabela particionada...');

    const batchSize = 10000;
    let offset = 0;
    let totalCopied = 0;

    while (true) {
      const [result] = await queryInterface.sequelize.query(`
        INSERT INTO events (user_id, event_type, created_at, data)
        SELECT user_id, event_type, created_at, data
        FROM events_old
        ORDER BY id
        LIMIT ${batchSize} OFFSET ${offset}
      `);

      if (result.rowCount === 0) break;

      totalCopied += result.rowCount;
      offset += batchSize;

      console.log(`Copiados: ${totalCopied} eventos`);

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`Total copiado: ${totalCopied}`);
  }
};

// Migration 3: Remover tabela antiga (após validação)
module.exports = {
  up: async (queryInterface) => {
    // Verificar se contagens batem
    const [oldCount] = await queryInterface.sequelize.query(
      'SELECT COUNT(*) as count FROM events_old'
    );

    const [newCount] = await queryInterface.sequelize.query(
      'SELECT COUNT(*) as count FROM events'
    );

    if (oldCount[0].count !== newCount[0].count) {
      throw new Error(
        `Contagens não batem! Old: ${oldCount[0].count}, New: ${newCount[0].count}`
      );
    }

    await queryInterface.dropTable('events_old');
    console.log('Tabela antiga removida');
  }
};
```

### Auto-criar Partições

```javascript
// Function para criar partições automaticamente
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION create_monthly_partition()
      RETURNS TRIGGER AS $$
      DECLARE
        partition_name TEXT;
        start_date TEXT;
        end_date TEXT;
      BEGIN
        partition_name := 'events_' ||
          TO_CHAR(NEW.created_at, 'YYYY_MM');

        start_date := TO_CHAR(
          DATE_TRUNC('month', NEW.created_at),
          'YYYY-MM-DD'
        );

        end_date := TO_CHAR(
          DATE_TRUNC('month', NEW.created_at) + INTERVAL '1 month',
          'YYYY-MM-DD'
        );

        -- Criar partição se não existir
        EXECUTE FORMAT(
          'CREATE TABLE IF NOT EXISTS %I PARTITION OF events
           FOR VALUES FROM (%L) TO (%L)',
          partition_name, start_date, end_date
        );

        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER create_partition_trigger
      BEFORE INSERT ON events
      FOR EACH ROW
      EXECUTE FUNCTION create_monthly_partition();
    `);
  }
};
```

## 7. Vacuum e Analyze

### Após Grandes Alterações

```javascript
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Adicionar coluna e backfill
    await queryInterface.addColumn('users', 'status', {
      type: Sequelize.STRING
    });

    await queryInterface.sequelize.query(`
      UPDATE users SET status = 'active'
    `);

    // VACUUM e ANALYZE para atualizar estatísticas
    await queryInterface.sequelize.query('VACUUM ANALYZE users');

    console.log('Vacuum concluído');
  }
};
```

### Vacuum Concorrente

```javascript
// PostgreSQL: VACUUM não bloqueia, mas VACUUM FULL bloqueia
module.exports = {
  up: async (queryInterface) => {
    // Seguro: Não bloqueia
    await queryInterface.sequelize.query('VACUUM ANALYZE users');

    // PERIGOSO: Bloqueia tabela!
    // await queryInterface.sequelize.query('VACUUM FULL users');
  }
};
```

## 8. Monitoramento de Performance

```javascript
// Migration com métricas
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const metrics = {
      startTime: Date.now(),
      rowsProcessed: 0,
      batchCount: 0
    };

    console.log('=== Migration Performance Metrics ===');

    // Obter tamanho da tabela antes
    const [beforeSize] = await queryInterface.sequelize.query(`
      SELECT pg_size_pretty(pg_total_relation_size('users')) as size
    `);
    console.log(`Tamanho antes: ${beforeSize[0].size}`);

    // Executar migration
    await queryInterface.addColumn('users', 'phone', {
      type: Sequelize.STRING
    });

    const batchSize = 1000;
    while (true) {
      const batchStart = Date.now();

      const [result] = await queryInterface.sequelize.query(`
        UPDATE users SET phone = '' WHERE phone IS NULL LIMIT ${batchSize}
      `);

      if (result.rowCount === 0) break;

      metrics.rowsProcessed += result.rowCount;
      metrics.batchCount++;

      const batchDuration = Date.now() - batchStart;
      const rate = (result.rowCount / batchDuration * 1000).toFixed(0);

      if (metrics.batchCount % 10 === 0) {
        console.log(`Batch ${metrics.batchCount}: ${rate} linhas/s`);
      }

      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // Obter tamanho depois
    const [afterSize] = await queryInterface.sequelize.query(`
      SELECT pg_size_pretty(pg_total_relation_size('users')) as size
    `);

    const duration = ((Date.now() - metrics.startTime) / 1000).toFixed(2);
    const avgRate = (metrics.rowsProcessed / duration).toFixed(0);

    console.log('=== Resumo ===');
    console.log(`Duração: ${duration}s`);
    console.log(`Linhas processadas: ${metrics.rowsProcessed}`);
    console.log(`Taxa média: ${avgRate} linhas/s`);
    console.log(`Tamanho antes: ${beforeSize[0].size}`);
    console.log(`Tamanho depois: ${afterSize[0].size}`);
  }
};
```

## 9. Estimativa de Tempo

```javascript
// Script para estimar duração
async function estimateMigrationTime(queryInterface, tableName, operation) {
  // Contar registros
  const [count] = await queryInterface.sequelize.query(`
    SELECT COUNT(*) as count FROM ${tableName}
  `);

  const totalRows = count[0].count;

  // Fazer amostra
  const sampleSize = 1000;
  const startTime = Date.now();

  await operation(sampleSize);

  const sampleDuration = Date.now() - startTime;

  // Estimar tempo total
  const estimatedTotal = (sampleDuration / sampleSize) * totalRows;
  const estimatedMinutes = (estimatedTotal / 1000 / 60).toFixed(2);

  console.log(`Estimativa para ${totalRows.toLocaleString()} registros:`);
  console.log(`  Tempo: ${estimatedMinutes} minutos`);
  console.log(`  Taxa: ${(sampleSize / sampleDuration * 1000).toFixed(0)} linhas/s`);

  return estimatedTotal;
}

// Uso
module.exports = {
  up: async (queryInterface) => {
    await estimateMigrationTime(
      queryInterface,
      'users',
      async (limit) => {
        await queryInterface.sequelize.query(`
          UPDATE users SET email = LOWER(email) LIMIT ${limit}
        `);
      }
    );

    // Executar migration completa...
  }
};
```

## Checklist de Performance

- [ ] Índices usam CONCURRENTLY?
- [ ] Backfilling processa em lotes?
- [ ] Locks são minimizados?
- [ ] Timeouts estão configurados?
- [ ] Alterações de tipo são compatíveis?
- [ ] VACUUM/ANALYZE após alterações grandes?
- [ ] Métricas de performance implementadas?
- [ ] Tempo estimado antes de executar?
- [ ] Checkpoint para processos longos?
- [ ] Testado em staging com dados reais?

## Resumo de Otimizações

| Operação | Técnica | Ganho |
|----------|---------|-------|
| Criar índice | CONCURRENTLY | Zero downtime |
| Backfill | Batches + pausas | Evita lock longo |
| Adicionar coluna | Sem default (PG <11) | Instantâneo |
| Alterar tipo | Tipos compatíveis | Instantâneo |
| Tabela grande | Particionamento | Queries mais rápidas |
| Locks | Lock timeout + retry | Melhor disponibilidade |
| Após ALTER | VACUUM ANALYZE | Plano de query atualizado |

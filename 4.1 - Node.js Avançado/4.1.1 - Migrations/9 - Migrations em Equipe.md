# Migrations em Equipe

## O Desafio do Trabalho em Equipe

Quando múltiplos desenvolvedores trabalham simultaneamente, surgem desafios específicos:

```
Dev A: Cria migration_001 → feature/add-users
Dev B: Cria migration_001 → feature/add-posts
Merge: CONFLITO! Duas migrations com mesmo timestamp
```

## Problemas Comuns

### 1. Conflitos de Timestamp

Migrations usam timestamps para ordenação:

```
20240115120000_create_users.js   ← Dev A
20240115120000_create_posts.js   ← Dev B (mesmo timestamp!)
```

**Consequência:** Ordem de execução imprevisível.

### 2. Dependências Não Declaradas

```
Dev A: Cria tabela 'categories'
Dev B: Cria foreign key posts → categories (sem saber que não existe ainda)
```

### 3. Schema Drift entre Branches

```
Branch main:     users (id, name, email)
Branch feature:  users (id, name, email, phone)
Merge: Conflito de estado
```

## Estratégias de Coordenação

### 1. Comunicação é Fundamental

**Canal dedicado para migrations:**

```markdown
# Slack Channel: #database-changes

@team FYI: Criando migration para adicionar tabela 'categories'
Branch: feature/categories
Migration: 20240115_create_categories_table

Por favor, aguardem merge antes de criar FKs para categories.
```

**Quadro Kanban:**

```
[Planejadas] | [Em Desenvolvimento] | [Review] | [Aplicadas]
   │              │                     │             │
Categories     Users Table         Posts FK       Add Indexes
Products       Email Unique                       Status Enum
```

### 2. Convenção de Nomenclatura

**Padrão recomendado:**

```
[YYYYMMDDHHMMSS]_[feature]_[acao]_[entidade].js

Exemplos:
20240115143000_users_create_table.js
20240115150000_users_add_email_index.js
20240116090000_posts_add_user_foreign_key.js
```

**Evita conflitos incluindo feature:**

```
20240115143000_feat_auth_create_users_table.js
20240115143000_feat_blog_create_posts_table.js
                ^^^^^^^^  ← Distingue features diferentes
```

### 3. Branch Strategy

#### Opção A: Migration por Branch

```
main
 │
 ├── feature/authentication
 │   └── migrations/
 │       └── 001_create_users.js
 │
 └── feature/blog
     └── migrations/
         └── 001_create_posts.js
```

**Merge order matters:**

```bash
# Merges devem ser sequenciais
git checkout main
git merge feature/authentication  # Migration 001
git merge feature/blog            # Migration 002 (renumerar!)
```

#### Opção B: Migrations apenas em Main

```
Regra: Apenas main pode ter migrations aplicadas

Processo:
1. Desenvolver feature sem migrations
2. Criar PR
3. Após aprovação, criar migration em main
4. Merge da feature
```

### 4. Rebase vs Merge

**Rebase (recomendado para migrations):**

```bash
# Mantém história linear
git checkout feature/my-feature
git rebase main

# Se houver conflito de migration, renumerar:
mv 20240115120000_my_migration.js 20240115130000_my_migration.js
```

**Merge:**

```bash
# Cria commit de merge
git checkout main
git merge feature/my-feature

# Resolver conflitos manualmente
```

## Resolução de Conflitos

### Conflito 1: Mesmo Timestamp

**Problema:**
```bash
git merge feature/posts
CONFLICT: migrations/20240115120000_create_table.js
```

**Solução:**

```bash
# 1. Renumerar migration da branch sendo merged
cd migrations/

# 2. Gerar novo timestamp
node -e "console.log(new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14))"
# Output: 20240115130500

# 3. Renomear arquivo
mv 20240115120000_create_posts.js 20240115130500_create_posts.js

# 4. Atualizar referências se houver
git add migrations/
git commit -m "fix: resolve migration timestamp conflict"
```

**Automatizar com script:**

```javascript
// scripts/renumber-migration.js
const fs = require('fs');
const path = require('path');

function generateTimestamp() {
  return new Date().toISOString()
    .replace(/[-:T.]/g, '')
    .slice(0, 14);
}

function renumberMigration(oldPath) {
  const fileName = path.basename(oldPath);
  const newTimestamp = generateTimestamp();
  const newFileName = fileName.replace(/^\d{14}/, newTimestamp);
  const newPath = path.join(path.dirname(oldPath), newFileName);

  fs.renameSync(oldPath, newPath);
  console.log(`Renomeado: ${fileName} → ${newFileName}`);

  return newPath;
}

// Uso: node scripts/renumber-migration.js migrations/20240115120000_my_migration.js
const migrationPath = process.argv[2];
renumberMigration(migrationPath);
```

### Conflito 2: Ordem de Dependência

**Problema:**

```javascript
// Dev A: Migration criada primeiro (timestamp menor)
// 20240115120000_add_post_category_fk.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('posts', {
      fields: ['category_id'],
      type: 'foreign key',
      references: {
        table: 'categories',  // Tabela ainda não existe!
        field: 'id'
      }
    });
  }
};

// Dev B: Migration criada depois (timestamp maior)
// 20240115130000_create_categories.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('categories', {
      id: { type: Sequelize.INTEGER, primaryKey: true }
    });
  }
};
```

**Solução 1: Renumerar para corrigir ordem**

```bash
# Trocar timestamps
mv 20240115120000_add_post_category_fk.js temp.js
mv 20240115130000_create_categories.js 20240115120000_create_categories.js
mv temp.js 20240115130000_add_post_category_fk.js
```

**Solução 2: Verificar existência antes de criar FK**

```javascript
// 20240115120000_add_post_category_fk.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Verificar se tabela existe
    const tables = await queryInterface.showAllTables();

    if (!tables.includes('categories')) {
      console.log('Tabela categories não existe. Pulando FK.');
      return;
    }

    await queryInterface.addConstraint('posts', {
      fields: ['category_id'],
      type: 'foreign key',
      references: { table: 'categories', field: 'id' }
    });
  }
};
```

### Conflito 3: Mudanças Simultâneas na Mesma Tabela

```javascript
// Dev A: Adiciona coluna 'age'
// 20240115120000_add_age_to_users.js
exports.up = (queryInterface, Sequelize) => {
  return queryInterface.addColumn('users', 'age', {
    type: Sequelize.INTEGER
  });
};

// Dev B: Adiciona coluna 'phone'
// 20240115120500_add_phone_to_users.js
exports.up = (queryInterface, Sequelize) => {
  return queryInterface.addColumn('users', 'phone', {
    type: Sequelize.STRING
  });
};
```

**Não há conflito real**, mas:

**Opção 1: Manter separadas** (recomendado)
- Permite rollback individual
- Facilita code review
- Mantém histórico granular

**Opção 2: Consolidar em uma migration**

```javascript
// 20240115120000_add_user_fields.js
exports.up = async (queryInterface, Sequelize) => {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    await queryInterface.addColumn('users', 'age', {
      type: Sequelize.INTEGER
    }, { transaction });

    await queryInterface.addColumn('users', 'phone', {
      type: Sequelize.STRING
    }, { transaction });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
```

## Code Review de Migrations

### Checklist para Reviewers

```markdown
## Migration Code Review Checklist

### Estrutura
- [ ] Tem método `up` implementado?
- [ ] Tem método `down` implementado e testado?
- [ ] Usa transações quando apropriado?
- [ ] Nome do arquivo é descritivo?

### Compatibilidade
- [ ] É backward compatible?
- [ ] Não quebra código em produção?
- [ ] Segue padrão Expand-Migrate-Contract se necessário?

### Dados
- [ ] Considera dados existentes?
- [ ] Backfill está implementado corretamente?
- [ ] Não causa perda de dados?

### Performance
- [ ] Índices usam CONCURRENTLY (PostgreSQL)?
- [ ] Não trava tabelas por muito tempo?
- [ ] Processa dados em lotes se necessário?

### Segurança
- [ ] Não expõe dados sensíveis em logs?
- [ ] Validações estão implementadas?
- [ ] Constraints de integridade estão corretas?

### Dependências
- [ ] Ordem de execução está correta?
- [ ] Depende de migrations anteriores?
- [ ] Foreign keys apontam para tabelas existentes?

### Testes
- [ ] Migration foi testada localmente?
- [ ] Rollback foi testado?
- [ ] Testada com dados de produção (staging)?
```

### Template de Pull Request

```markdown
## Migration PR Template

### Descrição
Breve descrição da mudança no schema.

### Tipo de Migration
- [ ] Adicionar tabela
- [ ] Adicionar coluna
- [ ] Remover coluna
- [ ] Alterar coluna
- [ ] Adicionar índice
- [ ] Adicionar foreign key
- [ ] Migração de dados
- [ ] Outro: ___________

### Backward Compatibility
- [ ] Sim, é backward compatible
- [ ] Não, requer deploy coordenado
- [ ] Parcial, requer feature flag

### Impacto em Dados Existentes
- [ ] Nenhum impacto
- [ ] Backfill necessário
- [ ] Transformação de dados
- [ ] Possível perda de dados (justificar)

### Plano de Deploy
1. Aplicar migration em staging
2. Testar com dados reais
3. Deploy em produção em horário de baixo tráfego
4. Monitorar métricas

### Rollback Plan
Descreva como reverter esta migration se algo der errado.

### Performance Impact
- Tempo estimado: ___ segundos/minutos
- Tabelas afetadas: ___
- Lock necessário: Sim/Não

### Checklist
- [ ] Testado localmente
- [ ] Rollback testado
- [ ] Documentação atualizada
- [ ] Equipe notificada
```

### Aprovação de Migrations

**Regras de aprovação:**

```yaml
# .github/CODEOWNERS
# Migrations requerem aprovação de DBA ou Tech Lead

/migrations/**  @dba-team @tech-leads
```

**GitHub Branch Protection:**

```yaml
# Requer 2 aprovações para migrations
branch_protection:
  required_reviews: 2
  dismiss_stale_reviews: true
  require_code_owner_reviews: true

  # Requer status checks
  required_status_checks:
    - migration-tests
    - migration-lint
```

## Workflow em Equipe

### Processo Recomendado

```
1. [Dev] Planeja mudança no schema
   ↓
2. [Dev] Cria issue descrevendo a migration
   ↓
3. [Team] Discute e aprova planejamento
   ↓
4. [Dev] Implementa migration em branch
   ↓
5. [Dev] Testa localmente (up e down)
   ↓
6. [Dev] Cria Pull Request
   ↓
7. [Reviewers] Revisam código
   ↓
8. [DBA/Tech Lead] Aprova
   ↓
9. [Dev] Merge para main
   ↓
10. [CI/CD] Aplica em staging
    ↓
11. [QA] Testa em staging
    ↓
12. [DevOps] Aplica em produção
```

### Daily Standup

Comunicar sobre migrations:

```
Dev: "Ontem criei migration para adicionar tabela de categorias.
      Hoje vou criar a FK de posts → categories.
      Bloqueio: Aguardando merge da migration de categorias."

Tech Lead: "Migration de categorias será aplicada hoje às 14h.
            Após isso, pode prosseguir com FK."
```

### Matriz de Responsabilidades (RACI)

| Atividade | Dev | Tech Lead | DBA | DevOps |
|-----------|-----|-----------|-----|--------|
| Criar migration | R/A | C | C | I |
| Code review | C | R/A | R/A | I |
| Testar em staging | R/A | C | C | I |
| Aplicar em produção | I | C | A | R |
| Rollback | I | R | A | R |
| Monitoramento | I | C | R | A |

R = Responsible, A = Accountable, C = Consulted, I = Informed

## Ferramentas de Coordenação

### 1. Pre-commit Hooks

```bash
# .husky/pre-commit
#!/bin/bash

echo "Verificando migrations..."

# Verificar se há migrations com timestamps duplicados
duplicates=$(ls -1 migrations/*.js | sed 's/migrations\///' | cut -d'_' -f1 | sort | uniq -d)

if [ -n "$duplicates" ]; then
  echo "ERRO: Migrations com timestamps duplicados encontradas:"
  echo "$duplicates"
  echo ""
  echo "Execute: npm run migration:renumber"
  exit 1
fi

echo "OK: Nenhum timestamp duplicado"
```

### 2. Linter para Migrations

```javascript
// scripts/lint-migrations.js
const fs = require('fs');
const path = require('path');

function lintMigration(filePath) {
  const errors = [];
  const content = fs.readFileSync(filePath, 'utf8');

  // Verificar se tem método up
  if (!content.includes('up:') && !content.includes('exports.up')) {
    errors.push('Método up não encontrado');
  }

  // Verificar se tem método down
  if (!content.includes('down:') && !content.includes('exports.down')) {
    errors.push('Método down não encontrado');
  }

  // Verificar uso de transaction em operações múltiplas
  const hasMultipleOperations = (content.match(/await queryInterface\./g) || []).length > 1;
  const hasTransaction = content.includes('transaction');

  if (hasMultipleOperations && !hasTransaction) {
    errors.push('Múltiplas operações sem transação');
  }

  // Verificar se remove colunas sem plano
  if (content.includes('removeColumn') && !content.includes('// SAFE:')) {
    errors.push('Remoção de coluna sem comentário de segurança');
  }

  return errors;
}

// Lint todas migrations
const migrationsDir = path.join(__dirname, '../migrations');
const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.js'));

let hasErrors = false;

files.forEach(file => {
  const errors = lintMigration(path.join(migrationsDir, file));

  if (errors.length > 0) {
    console.error(`\n${file}:`);
    errors.forEach(err => console.error(`  - ${err}`));
    hasErrors = true;
  }
});

if (hasErrors) {
  process.exit(1);
} else {
  console.log('Todas migrations passaram no lint!');
}
```

```json
// package.json
{
  "scripts": {
    "migration:lint": "node scripts/lint-migrations.js",
    "migration:renumber": "node scripts/renumber-migration.js"
  }
}
```

### 3. Migration Status Dashboard

```javascript
// scripts/migration-status.js
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

async function getMigrationStatus() {
  const sequelize = new Sequelize(process.env.DATABASE_URL);

  // Migrations aplicadas
  const [applied] = await sequelize.query(
    'SELECT name FROM "SequelizeMeta" ORDER BY name'
  );

  // Migrations disponíveis
  const migrationsDir = path.join(__dirname, '../migrations');
  const available = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.js'))
    .map(f => f.replace('.js', ''));

  // Migrations pendentes
  const pending = available.filter(
    m => !applied.some(a => a.name === m)
  );

  console.log('\n=== Migration Status ===\n');
  console.log(`Aplicadas: ${applied.length}`);
  console.log(`Disponíveis: ${available.length}`);
  console.log(`Pendentes: ${pending.length}`);

  if (pending.length > 0) {
    console.log('\nPendentes:');
    pending.forEach(m => console.log(`  - ${m}`));
  }

  await sequelize.close();
}

getMigrationStatus();
```

## Sincronização entre Ambientes

### Script de Deploy Coordenado

```bash
#!/bin/bash
# scripts/coordinated-deploy.sh

set -e

echo "=== Coordinated Deployment ===="

# 1. Verificar branch
current_branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$current_branch" != "main" ]; then
  echo "ERRO: Deploy apenas de main"
  exit 1
fi

# 2. Pull últimas mudanças
echo "Atualizando código..."
git pull origin main

# 3. Verificar migrations pendentes
echo "Verificando migrations pendentes..."
pending=$(npm run migration:status --silent | grep "Pendentes:" | awk '{print $2}')

if [ "$pending" -gt 0 ]; then
  echo "Há $pending migrations pendentes"
  echo "Deseja aplicar? (y/n)"
  read -r response

  if [ "$response" != "y" ]; then
    echo "Deploy cancelado"
    exit 1
  fi

  # 4. Backup
  echo "Criando backup..."
  timestamp=$(date +%Y%m%d_%H%M%S)
  pg_dump $DATABASE_URL > "backup_$timestamp.sql"

  # 5. Aplicar migrations
  echo "Aplicando migrations..."
  npm run migrate

  # 6. Verificar saúde
  echo "Aguardando estabilização..."
  sleep 5

  if ! npm run health:check; then
    echo "ERRO: Health check falhou!"
    echo "Iniciando rollback..."
    npm run migrate:undo
    exit 1
  fi
fi

# 7. Deploy aplicação
echo "Deploy da aplicação..."
npm run deploy

echo "Deploy concluído com sucesso!"
```

## Boas Práticas para Equipes

1. **Comunicação Proativa**
   - Avisar sobre migrations grandes
   - Documentar dependências
   - Compartilhar cronograma

2. **Convenções Claras**
   - Naming conventions
   - Branch strategy
   - Processo de review

3. **Automação**
   - Linters
   - Pre-commit hooks
   - CI/CD checks

4. **Documentação**
   - README com processo
   - Runbooks
   - Exemplos

5. **Ownership**
   - CODEOWNERS
   - Responsáveis por área
   - Escalação clara

## Resumo

| Problema | Solução |
|----------|---------|
| Timestamps duplicados | Script de renumeração automática |
| Ordem de dependência | Comunicação + verificação |
| Conflitos de merge | Rebase + renumeração |
| Falta de visibilidade | Dashboard de status |
| Review inconsistente | Checklist + CODEOWNERS |
| Deploy descoordenado | Script de deploy coordenado |

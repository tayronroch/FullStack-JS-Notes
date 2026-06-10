# 6 - Resolução de Dependências

Quando você instala um pacote, raramente ele é uma "ilha isolada". Quase sempre, ele próprio depende de outros pacotes para funcionar. Entender como o NPM descobre, baixa e organiza essa cadeia de dependências é fundamental para resolver conflitos e manter projetos saudáveis.

---

## 1. O Problema: Dependências de Dependências

Imagine que você instala a biblioteca **A**. Porém, a biblioteca **A** precisa da biblioteca **B** para funcionar. E a biblioteca **B** precisa da **C**. Essa cadeia chama-se **árvore de dependências** (dependency tree).

O NPM resolve essa árvore automaticamente: ao instalar **A**, ele lê o `package.json` de **A**, descobre que precisa de **B**, lê o `package.json` de **B**, descobre que precisa de **C**, e assim por diante, até que todas as peças estejam presentes na pasta `node_modules`.

```
meu-projeto
└── A
    └── B
        └── C
```

---

## 2. Versionamento Semântico (SemVer)

Antes de entender a resolução, é preciso entender como as versões funcionam. O NPM usa o padrão **SemVer (Semantic Versioning)**, onde uma versão tem três números: `MAJOR.MINOR.PATCH`.

| Número | Significado | Exemplo |
| :--- | :--- | :--- |
| **MAJOR** | Mudança que **quebra** a compatibilidade | `2.0.0` → `3.0.0` |
| **MINOR** | Nova funcionalidade **compatível** com a anterior | `2.0.0` → `2.1.0` |
| **PATCH** | Correção de bug, sem quebrar nada | `2.0.0` → `2.0.1` |

### Os prefixos no `package.json`

Quando o NPM salva uma dependência, ele usa prefixos que definem **qual faixa de versão é aceitável**:

```json
{
  "dependencies": {
    "axios": "^1.6.0",
    "dayjs": "~1.11.0",
    "lodash": "4.17.21"
  }
}
```

- **`^` (Caret):** Aceita atualizações de MINOR e PATCH, mas não de MAJOR. É o padrão do `npm install`. `^1.6.0` aceita qualquer versão `>=1.6.0` e `<2.0.0`.
- **`~` (Tilde):** Mais restrito — aceita apenas atualizações de PATCH. `~1.11.0` aceita qualquer versão `>=1.11.0` e `<1.12.0`.
- **Sem prefixo (Exato):** Instala exatamente aquela versão, sem variações.

---

## 3. Pacotes com Escopo (`@`)

Alguns pacotes no NPM são **escopados**, ou seja, pertencem a uma organização ou autor identificado pelo prefixo `@`. O formato é sempre `@escopo/nome-do-pacote`.

```bash
# Instalando um pacote escopado
npm install @angular/core
npm install @types/node
npm install @vitejs/plugin-react
```

No `package.json`, eles aparecem da mesma forma:

```json
{
  "dependencies": {
    "@angular/core": "^17.0.0",
    "@types/node": "^20.0.0"
  }
}
```

### Por que escopos existem?

- **Evitar colisões de nome:** O NPM tem milhões de pacotes. Um escopo garante que `@minha-empresa/utils` nunca conflite com outro pacote chamado `utils` de outra pessoa.
- **Organização:** Grandes projetos (Angular, Babel, Vite) publicam dezenas de pacotes relacionados todos sob o mesmo `@escopo`, facilitando a identificação.
- **Pacotes privados:** Empresas usam escopos para publicar pacotes internos no registro privado do NPM sem expô-los publicamente.

---

## 4. Como o NPM Resolve Conflitos de Versão

O cenário mais comum de conflito: dois pacotes diferentes precisam de versões incompatíveis de uma mesma biblioteca.

**Exemplo:**
- Pacote **A** requer `lodash@^3.0.0`
- Pacote **B** requer `lodash@^4.0.0`

Como `3.x` e `4.x` são versões MAJOR diferentes (incompatíveis), o NPM **instala as duas versões** ao mesmo tempo, cada uma dentro da pasta do pacote que a exige:

```
node_modules/
├── A/
│   └── node_modules/
│       └── lodash@3.10.1   ← versão exclusiva para A
├── B/
│   └── node_modules/
│       └── lodash@4.17.21  ← versão exclusiva para B
└── lodash@4.17.21          ← versão "raiz" para o seu código
```

Esse modelo evita que um pacote "quebre" outro por causa de versões conflitantes.

---

## 5. O Arquivo `package-lock.json`

O `package-lock.json` é gerado automaticamente pelo NPM e registra a versão **exata** de cada pacote (e de cada dependência transitiva) que foi instalada.

**Por que isso importa?** O `package.json` usa faixas (`^`, `~`), então sem o lock file, dois desenvolvedores rodando `npm install` em dias diferentes poderiam obter versões distintas de uma mesma dependência.

Com o lock file:
- Toda a equipe instala **exatamente** as mesmas versões.
- O ambiente de CI/CD é idêntico ao ambiente local.
- O erro "na minha máquina funciona" é eliminado para problemas de versão.

> **Regra:** Sempre commite o `package-lock.json` no repositório. Nunca o ignore no `.gitignore`.

---

## 6. Dependências de Pares (Peer Dependencies)

Existe um tipo especial de dependência: as **`peerDependencies`**. Elas indicam que um pacote precisa de uma biblioteca que **o seu projeto já deve ter instalada**, em vez de instalar uma cópia própria.

Um exemplo clássico são plugins do React: a biblioteca não embute o React dentro de si mesma — ela espera que o seu projeto já o tenha instalado.

```json
{
  "name": "meu-plugin-react",
  "peerDependencies": {
    "react": ">=17.0.0"
  }
}
```

Se você instalar esse plugin sem ter o React no projeto, o NPM exibirá um aviso (`WARN`) apontando a dependência de par que está faltando.

---

## 7. Comandos Úteis para Inspecionar Dependências

```bash
# Visualiza a árvore de dependências do projeto
npm list

# Mostra a árvore completa (incluindo as dependências das dependências)
npm list --all

# Verifica pacotes que possuem versões mais novas disponíveis
npm outdated

# Atualiza os pacotes para as versões mais recentes permitidas pelo package.json
npm update
```

---

## Conclusão

A resolução de dependências é o processo silencioso que mantém um projeto funcional. Saber que o NPM usa **SemVer** para interpretar faixas de versão, que ele pode instalar **múltiplas versões** do mesmo pacote para resolver conflitos e que o **`package-lock.json`** garante a consistência do ambiente são os pilares para diagnosticar e resolver a grande maioria dos problemas que aparecem ao rodar `npm install`.
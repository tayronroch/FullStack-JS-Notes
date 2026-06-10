# 4 - Instalando uma Versão Específica

Nem sempre a versão mais recente de um pacote é a ideal. Tutoriais, cursos e projetos legados frequentemente exigem uma versão específica para garantir compatibilidade. O NPM permite instalar exatamente a versão que você precisa.

---

## 1. Por que instalar uma versão específica?

- Um curso ou tutorial foi gravado com uma versão anterior que tem uma API diferente.
- A versão mais nova introduziu uma **breaking change** (mudança que quebra o código existente).
- A equipe padronizou uma versão para garantir que todos trabalhem igual.

Um exemplo prático: o **json-server** lançou a versão `1.x` com mudanças significativas em relação à `0.x`. Se um tutorial usa a `0.x`, instalar a versão mais recente vai gerar comportamentos diferentes.

---

## 2. Sintaxe para Instalar uma Versão Específica

Basta adicionar `@` seguido da versão desejada:

```bash
npm install json-server@0.17.4
```

Para instalar como dependência de desenvolvimento:

```bash
npm install -D json-server@0.17.4
```

O `package.json` registrará a versão exata:

```json
{
  "devDependencies": {
    "json-server": "^0.17.4"
  }
}
```

---

## 3. Verificando as Versões Disponíveis

Para ver todas as versões publicadas de um pacote:

```bash
# Lista todas as versões disponíveis
npm view json-server versions

# Mostra apenas a versão mais recente
npm view json-server version

# Mostra detalhes completos da versão mais recente
npm view json-server
```

---

## 4. Verificando a Versão Instalada no Projeto

```bash
# Versão de um pacote específico instalado
npm list json-server

# Versão via execução direta (se o pacote tiver CLI)
npx json-server --version
```

---

## 5. Atualizando ou Revertendo uma Versão

Para trocar a versão instalada, basta instalar a nova versão desejada — o NPM substitui automaticamente:

```bash
# Atualiza para a versão mais recente
npm install json-server@latest

# Reverte para uma versão anterior
npm install json-server@0.17.4
```

---

## Conclusão

Controlar a versão dos pacotes instalados é uma habilidade essencial no dia a dia. Saber usar o `@` para fixar uma versão e o `npm view` para consultar o que está disponível evita horas de depuração causadas por incompatibilidades silenciosas entre versões.

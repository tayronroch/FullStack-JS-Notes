# Guia Prático: Comandos Básicos do Git para Repositório Local

Este guia aborda os conceitos e comandos essenciais para gerenciar um repositório no seu próprio computador, mesclando teoria e prática.

---

## O Que é um Repositório Git?

Um **repositório Git** (ou "repo") é uma pasta de projeto que o Git monitora. Ele contém todos os arquivos do seu projeto e, mais importante, o histórico completo de todas as alterações. Esse histórico fica armazenado em uma subpasta oculta chamada `.git`.

---

## 1. Criando o Primeiro Commit (Prática)

Vamos simular o início de um projeto.

### Passo 1: Inicie o repositório
```bash
# Crie uma pasta para o projeto e entre nela
mkdir meu-projeto
cd meu-projeto

# Inicie o repositório
git init
```

### Passo 2: Crie e adicione um arquivo
```bash
# Crie um arquivo README.md
echo "# Meu Projeto" > README.md

# Verifique o status (o arquivo estará como "untracked")
git status

# Adicione o arquivo à Staging Area
git add README.md
```

### Passo 3: Faça o commit
```bash
# Salve a versão na história do projeto
git commit -m "Initial commit: Adiciona README.md"
```

---

## A Staging Area (Área de Preparação)

Antes de fazer um `commit`, você precisa preparar as alterações na **Staging Area**. 

-   **O que é?** É uma camada intermediária entre seu diretório de trabalho e o histórico do repositório. 
-   **Por que é útil?** Ela permite que você escolha quais alterações específicas quer incluir no próximo commit, criando registros mais organizados e lógicos.

O fluxo é: **Working Directory** -> (`git add`) -> **Staging Area** -> (`git commit`) -> **Repositório**.

---

## 2. Alterando e Commitando (Prática)

Este é o ciclo de desenvolvimento padrão.

### Passo 1: Modifique um arquivo
```bash
echo "
Projeto de exemplo para aprender Git." >> README.md
```

### Passo 2: Verifique e adicione as modificações
Para ver *o que* mudou, use `git diff`. Para preparar a alteração, use `git add`.
```bash
# Veja as linhas alteradas
git diff

# Adicione a alteração à Staging Area
git add README.md
```

### Passo 3: Faça o commit
```bash
git commit -m "Docs: Explica o propósito do projeto no README"
```

---

## Detalhes sobre Commits

### Corrigindo o Último Commit com `git commit --amend`

Cometeu um erro no último commit? `git commit --amend` substitui o commit anterior por um novo.

-   **Para corrigir a mensagem:**
    ```bash
    git commit --amend -m "Nova mensagem, agora correta"
    ```
-   **Para adicionar arquivos esquecidos:**
    ```bash
    git add arquivo-esquecido.js
    git commit --amend
    ```
> **Atenção:** Use `amend` apenas em commits que ainda não foram enviados a um repositório remoto (`git push`).

---

## 3. Navegando Pelos Commits

Use `git log` para explorar o histórico.

-   `git log`: Mostra o histórico completo.
-   `git log --oneline --graph`: Apresenta o histórico de forma visual e compacta.
-   `git log -p`: Exibe o `diff` de cada commit.
-   `git log --stat`: Mostra estatísticas de quais arquivos foram alterados.

---

## 4. Recuperando Um Arquivo Deletado (Prática)

Se você deletar um arquivo já commitado, pode recuperá-lo facilmente.

### Passo 1: Delete um arquivo
```bash
rm README.md
```
`git status` mostrará que o arquivo foi deletado.

### Passo 2: Restaure o arquivo
Use `git restore` para trazer de volta a versão do último commit.
```bash
git restore README.md
```
O arquivo `README.md` reaparecerá no seu projeto.

---

## Fluxo de Trabalho Básico (Resumo)

1.  **Modifique** os arquivos.
2.  Use `git status` e `git diff` para checar as alterações.
3.  Use `git add` para preparar as alterações desejadas.
4.  Use `git commit` para salvar no histórico.
5.  Repita.

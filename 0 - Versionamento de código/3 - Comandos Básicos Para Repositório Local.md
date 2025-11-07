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

- **O que é?** É uma camada intermediária entre seu diretório de trabalho e o histórico do repositório.
- **Por que é útil?** Ela permite que você escolha quais alterações específicas quer incluir no próximo commit, criando registros mais organizados e lógicos.

O fluxo é: **Working Directory** -> (`git add`) -> **Staging Area** -> (`git commit`) -> **Repositório**.

### Como "desfazer" o `git add`? (Unstaging)

Se você adicionou algo à Staging Area por engano, pode facilmente reverter isso com o comando `git restore --staged`.

- **O que faz?** Ele tira a alteração da Staging Area e a devolve para o seu Diretório de Trabalho. O arquivo continua modificado, mas não está mais preparado para o próximo commit.
- **Como usar:**
  - Para remover um arquivo específico da Staging Area:
    ```bash
    git restore --staged nome-do-arquivo.js
    ```
  - Para remover todas as alterações da Staging Area de uma vez:
    ```bash
    git restore --staged .
    ```

---

## 2. Alterando e Commitando (Prática)

Este é o ciclo de desenvolvimento padrão.

### Passo 1: Modifique um arquivo

```bash
echo "
Projeto de exemplo para aprender Git." >> README.md
```

### Passo 2: Verifique e adicione as modificações

Para ver _o que_ mudou, use `git diff`. Para preparar a alteração, use `git add`.

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

## Fazendo Commits de Forma Mais Rápida

Existe um atalho muito útil para fazer commits que combina o `git add` e o `git commit` em um só comando, para arquivos que já estão sendo rastreados pelo Git.

### O Atalho `git commit -am`

-   **O que faz?** Ele automaticamente adiciona à Staging Area todas as modificações de arquivos **já rastreados** e, em seguida, faz o commit com a mensagem fornecida.
-   **Como usar:**

    ```bash
    git commit -am "Sua mensagem de commit aqui"
    ```

    > **Atenção:** Este comando **não** adiciona arquivos novos (untracked files) à Staging Area. Para arquivos novos, você ainda precisará usar `git add nome-do-arquivo.txt` primeiro.

### Aspas Simples vs. Aspas Duplas em Mensagens de Commit

Ao passar a mensagem de commit no terminal, você pode usar aspas simples (`'`) ou duplas (`"`). Na maioria dos casos, o efeito é o mesmo, mas há uma diferença importante:

-   **Aspas Simples (`'`):** O terminal interpreta o conteúdo entre aspas simples literalmente. É a forma recomendada para mensagens de commit, especialmente se você quiser usar acentos graves para destaque.

    ```bash
    git commit -m 'adiciona arquivo `.editorconfig`'
    ```
    No GitHub, isso será renderizado com `.editorconfig` em destaque (como código).

-   **Aspas Duplas (`"`):** O terminal tenta interpretar o conteúdo entre aspas duplas. Isso pode ativar recursos como a **substituição de comando** (`command substitution`).

    ```bash
    # Exemplo PROBLEMÁTICO com aspas duplas e acento grave
    git commit -m "adiciona arquivo `.editorconfig`"
    ```
    Neste caso, o terminal tentaria executar o comando `editorconfig` (se existisse) e passaria a saída desse comando para a mensagem de commit, o que não é o desejado. Para evitar isso, use aspas simples ou escape o acento grave com uma barra invertida (`\``) dentro das aspas duplas.

---

## Git Diff e Amend

Com o Git, você tem uma máquina do tempo. Não é um Delorean, mas permite que você viaje ao passado do seu repositório e altere as coisas. O `git commit --amend` é o seu primeiro poder de viagem no tempo: ele permite alterar o evento mais recente da sua história.

### O que é o `git commit --amend`?

Imagine que você acabou de fazer um commit (salvou um ponto na história) e imediatamente percebeu um erro: esqueceu de adicionar um arquivo, ou a mensagem que você escreveu ficou confusa.

O `commit --amend` permite que você **emende** o último commit. Em vez de criar um novo commit para a correção (o que poluiria o histórico), ele desfaz o último commit e cria um _novo commit_ no lugar dele, já com as suas correções.

### Como Usar Sua Máquina do Tempo

**Cenário 1: Você errou a mensagem do commit.**

```bash
# Simplesmente execute o commit novamente com a flag --amend e a nova mensagem
git commit --amend -m "Docs: Explica corretamente o propósito do projeto"
```

O Git substituirá o commit anterior e sua mensagem pela nova.

**Cenário 2: Você esqueceu de incluir um arquivo na "foto".**

1.  Primeiro, adicione o arquivo que você esqueceu à Staging Area:

    ```bash
    # Suponha que você esqueceu de adicionar o arquivo de estilos
    git add styles.css
    ```

2.  Agora, use o `amend`. O Git pegará o que já estava no commit anterior, adicionará o `styles.css` e criará um novo commit com tudo junto.
    ```bash
    # O --no-edit faz com que a mensagem do commit original seja mantida
    git commit --amend --no-edit
    ```

### Verificando Antes de Viajar no Tempo com `git diff`

Antes de usar o `amend`, você pode e deve usar o `git diff` para ter certeza do que está mudando:

- `git diff`: Mostra as alterações que ainda estão apenas no seu diretório de trabalho.
- `git diff --staged`: Mostra as alterações que já estão na Staging Area e que serão adicionadas ao commit se você usar `amend`.

> **Aviso Fundamental sobre Viagens no Tempo:** Só altere o passado (`--amend`) em commits que ainda não foram compartilhados com outros desenvolvedores (que você ainda não enviou com `git push`). Mudar a história que outras pessoas já têm pode causar paradoxos temporais (e muitos conflitos) no projeto!

---

## 3. Navegando Pelos Commits

Use `git log` para explorar o histórico.

- `git log`: Mostra o histórico completo.
- `git log --oneline --graph`: Apresenta o histórico de forma visual e compacta.
- `git log -p`: Exibe o `diff` de cada commit.
- `git log --stat`: Mostra estatísticas de quais arquivos foram alterados.

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

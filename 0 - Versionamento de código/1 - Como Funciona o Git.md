# 1. Como Funciona o Git

### O que é Git?

Git é um **Sistema de Controle de Versão Distribuído (DVCS)**. Pense nele como um "histórico" superpoderoso para seus projetos de código. Ele permite que você:

*   **Salve "snapshots" (fotos) do seu código:** A qualquer momento, você pode salvar o estado atual do seu projeto. Esse "snapshot" é chamado de **commit**.
*   **Volte no tempo:** Se algo der errado, você pode facilmente voltar para uma versão anterior que estava funcionando.
*   **Trabalhe em equipe:** Várias pessoas podem trabalhar no mesmo projeto ao mesmo tempo, em "universos paralelos" chamados **branches**, e depois juntar suas alterações.
*   **Entenda o que mudou:** O Git mostra exatamente o que foi alterado em cada arquivo, quem fez a alteração e quando.

### Os 3 Estágios do Git

Para o Git, seus arquivos podem estar em três estados principais:

1.  **Working Directory (Diretório de Trabalho):** É a sua pasta de projeto no seu computador. Aqui é onde você cria, edita e apaga os arquivos. Qualquer arquivo que você modifica aqui é considerado "modificado" pelo Git, mas ainda não foi salvo no histórico.

2.  **Staging Area (Área de Preparação):** É uma espécie de "sala de espera". Antes de salvar um "snapshot" (commit) do seu projeto, você precisa adicionar os arquivos modificados que deseja incluir nesse snapshot para a Staging Area. Isso permite que você escolha exatamente quais alterações farão parte do próximo commit.
    *   **Comando:** `git add <nome_do_arquivo>` ou `git add .` (para adicionar todos os arquivos modificados).

3.  **Repository (Repositório):** É o "álbum de fotos" do seu projeto, onde todos os commits (snapshots) são permanentemente armazenados. O repositório fica dentro de uma pasta oculta chamada `.git` na raiz do seu projeto. Uma vez que você faz um commit, as alterações que estavam na Staging Area são salvas no repositório.
    *   **Comando:** `git commit -m "Sua mensagem descritiva aqui"`

![Fluxo do Git](https://git-scm.com/images/about/areas.png)

### Workflow Básico do Git

O fluxo de trabalho mais comum é:

1.  **Modificar** arquivos no seu **Working Directory**.
2.  **Adicionar** os arquivos que você quer salvar para a **Staging Area** com o comando `git add`.
3.  **Fazer um commit** para salvar o snapshot da Staging Area no seu **Repositório** com o comando `git commit`.

### O que são Branches?

Branches (ramos) são uma das características mais poderosas do Git. Imagine que a versão principal do seu projeto está em um branch chamado `main`.

Se você quiser adicionar uma nova funcionalidade (por exemplo, uma página de login), você pode criar um novo branch a partir do `main`, chamado `login-feature`.

Nesse novo branch, você pode fazer todas as alterações que quiser, criar commits, etc., sem afetar a versão principal do projeto no branch `main`.

Quando a sua nova funcionalidade estiver pronta e testada, você pode "mesclar" (juntar) o branch `login-feature` de volta ao `main`.

**Comandos comuns para branches:**

*   `git branch <nome-do-branch>`: Cria um novo branch.
*   `git checkout <nome-do-branch>`: Muda para o branch especificado.
*   `git merge <nome-do-branch>`: Junta as alterações do branch especificado no branch atual.

### Repositórios Remotos (GitHub, GitLab)

Até agora, falamos apenas do repositório local (na sua máquina). Para colaborar com outras pessoas, você usa um **repositório remoto**, que fica hospedado em um servidor na internet (como o GitHub).

*   `git clone <url>`: Baixa um repositório remoto para a sua máquina.
*   `git push`: Envia os seus commits do repositório local para o remoto.
*   `git pull`: Baixa os commits mais recentes do repositório remoto para o seu local.

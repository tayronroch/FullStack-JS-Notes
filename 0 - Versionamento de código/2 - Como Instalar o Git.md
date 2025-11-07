# Como Instalar e Configurar o Git

Este guia detalhado mostra como instalar e configurar o Git em diferentes sistemas operacionais: Windows, macOS e Linux.

## Windows

### Instalação via Instalador Oficial

A forma mais comum de instalar o Git no Windows é usando o instalador oficial, que oferece uma experiência gráfica e várias opções de personalização.

1.  **Baixe o instalador:**
    *   Acesse o site oficial do Git: [https://git-scm.com/download/win](https://git-scm.com/download/win)
    *   O download da versão mais recente (geralmente 64-bit) começará automaticamente.

2.  **Execute o instalador e personalize a instalação:**
    *   **Seleção de Componentes:** Você pode deixar os componentes padrão marcados. É útil incluir o **Git Bash** (para um ambiente de linha de comando similar ao do Linux) e o **Git GUI** (uma interface gráfica simples). O **Git Credential Manager** também é recomendado, pois ele armazena suas credenciais de forma segura para que você não precise digitá-las toda vez que se conectar a um repositório remoto (como o GitHub).
    *   **Editor Padrão:** O instalador perguntará qual editor de texto você deseja usar para mensagens de commit. O padrão é o Vim, que pode ser complexo para iniciantes. Recomenda-se escolher um editor com o qual você já esteja familiarizado, como o **Visual Studio Code**, **Sublime Text** ou **Notepad++**.
    *   **Ajuste do PATH:** Esta é uma etapa importante. A opção recomendada é **"Git from the command line and also from 3rd-party software"**. Isso adiciona o Git ao seu PATH do sistema, permitindo que você o use tanto no **Git Bash** quanto no **Prompt de Comando (CMD)** e **PowerShell**.
    *   **Configuração de Quebras de Linha (Line Endings):** Para evitar problemas de compatibilidade entre sistemas operacionais, a opção padrão e recomendada é **"Checkout Windows-style, commit Unix-style line endings"**. Isso garante que os arquivos no seu sistema local usem o formato do Windows (CRLF), mas no repositório remoto usem o formato do Unix (LF), que é o padrão na maioria dos projetos.

3.  **Verifique a instalação:**
    *   Abra o **Git Bash**, **CMD** ou **PowerShell** e digite:
        ```bash
        git --version
        ```
    *   A saída deve mostrar a versão do Git instalada.

## macOS

### Método 1: Xcode Command Line Tools (Padrão)

O macOS geralmente solicita a instalação do Git na primeira vez que você tenta usá-lo.

1.  **Verifique a instalação:**
    *   Abra o **Terminal** (em `Aplicações/Utilitários`).
    *   Digite o comando:
        ```bash
        git --version
        ```
    *   Se o Git não estiver instalado, uma janela pop-up aparecerá.

2.  **Instale as Ferramentas de Linha de Comando:**
    *   Na janela pop-up, clique em "Instalar". O macOS fará o download e a instalação do Git junto com outras ferramentas de desenvolvimento.
    *   Se a janela não aparecer, você pode forçar a instalação com:
        ```bash
        xcode-select --install
        ```

### Método 2: Homebrew (Recomendado para ter a versão mais recente)

O [Homebrew](https://brew.sh/) é um gerenciador de pacotes que facilita a instalação e atualização de softwares no macOS.

1.  **Instale o Homebrew (se ainda não tiver):**
    *   Siga as instruções no site oficial do Homebrew. Geralmente, envolve colar um comando no seu terminal.

2.  **Instale o Git:**
    ```bash
    brew install git
    ```

3.  **Verifique a instalação:**
    *   Feche e reabra o terminal para garantir que o sistema reconheça a nova versão instalada pelo Homebrew.
    *   Confirme a versão:
        ```bash
        git --version
        ```

## Linux (Diferentes Distribuições)

A instalação no Linux é feita através do gerenciador de pacotes da sua distribuição.

1.  **Debian/Ubuntu:**
    ```bash
    sudo apt update
    sudo apt install git
    ```

2.  **Fedora/CentOS/RHEL:**
    ```bash
    sudo dnf install git 
    # ou em versões mais antigas
    sudo yum install git
    ```

3.  **Arch Linux:**
    ```bash
    sudo pacman -S git
    ```

4.  **Verifique a instalação:**
    *   Abra o terminal e digite:
        ```bash
        git --version
        ```

## Configuração Inicial (Obrigatória para Todos os Sistemas)

Depois de instalar o Git, há algumas configurações básicas que você **deve** fazer. Elas são usadas para identificar quem está fazendo as alterações nos commits.

Abra seu terminal (Git Bash no Windows, Terminal no macOS/Linux) e execute os seguintes comandos, substituindo os valores de exemplo pelos seus:

1.  **Configure seu nome de usuário:**
    ```bash
    git config --global user.name "Seu Nome Completo"
    ```

2.  **Configure seu e-mail:**
    ```bash
    git config --global user.email "seu.email@exemplo.com"
    ```
    *   **Dica:** Use o mesmo e-mail que você usa na sua conta do GitHub, GitLab ou Bitbucket.

3.  **Verifique suas configurações:**
    *   Para ver todas as configurações globais, você pode usar:
        ```bash
        git config --list
        ```

Com o Git instalado e configurado, você está pronto para começar a versionar seus projetos!

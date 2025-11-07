# 5 - Interagindo com Repositórios Remotos (git push)

Até agora, todo o nosso trabalho com Git foi local. Nossos commits, nosso histórico, tudo está salvo apenas na nossa máquina, dentro da pasta `.git`. Nesta aula, vamos furar a bolha do repositório local e aprender a enviar nossas alterações para um **repositório remoto**, como o GitHub.

## O Que é um Repositório Remoto (`origin`)?

Um repositório remoto é uma versão do seu projeto que fica hospedada em um servidor na internet (ou em uma rede local). Ele serve como um ponto central para colaboração e backup.

- **`origin`**: É o nome padrão que o Git dá ao primeiro repositório remoto que você configura. Pense nele como um apelido para a URL do seu projeto no GitHub.

## Configurando um Repositório Remoto

Antes de poder enviar (`push`) ou receber (`pull`) alterações, você precisa conectar seu repositório local ao remoto.

1.  **Crie um repositório no GitHub:** Vá até o site do GitHub e crie um novo repositório (sem `README.md` ou `.gitignore`, para começar do zero).
2.  **Copie a URL:** O GitHub fornecerá uma URL (HTTPS ou SSH). Copie-a.
3.  **Conecte seu local ao remoto:** No seu terminal, dentro do seu projeto, execute o comando:

    ```bash
    # Substitua a URL pela URL do seu repositório no GitHub
    git remote add origin https://github.com/seu-usuario/seu-projeto.git
    ```

## As Duas Linhas do Tempo: `local/main` e `origin/main`

Para entender o `push`, é fundamental pensar em duas linhas do tempo que existem para o mesmo branch (vamos usar o `main` como exemplo):

1.  **`main` (seu branch local):** Esta é a versão da história que existe no seu computador. Ela avança toda vez que você faz um `git commit`.

2.  **`origin/main` (o "espelho" do remoto):** Esta não é uma conexão em tempo real. É uma espécie de "marcador" ou "ponteiro" que o seu repositório local usa para se lembrar onde o branch `main` estava no servidor `origin` da **última vez que vocês se comunicaram** (via `push`, `pull` ou `fetch`).

Quando você trabalha localmente, apenas a sua linha do tempo `main` avança. O seu `origin/main` fica para trás, congelado no tempo.

### O `git push` como Sincronizador de Linhas do Tempo

O `git push` é o comando que sincroniza essas duas linhas do tempo. Ao executá-lo, você está dizendo ao Git:

> "Pegue os commits que estão no meu `main` local e que ainda não existem no `origin/main`, envie-os para o servidor `origin` e, se tudo der certo, avance o meu marcador `origin/main` para que ele aponte para o mesmo lugar que o meu `main` local."

É assim que você compartilha suas novas features e melhorias, empurrando a linha do tempo do repositório remoto para frente.

## O Comando `git push`: Enviando Suas Alterações

O `git push` é o comando que você usa para enviar os seus commits locais para o repositório remoto.

- **O que faz?** Ele pega os commits que você fez no seu branch local e os envia para o branch correspondente no `origin`.

### O Primeiro Push

Na primeira vez que você envia um branch para o remoto, você precisa usar a flag `-u` (ou `--set-upstream`):

```bash
git push -u origin main
```

- **O que o `-u` faz?** Ele cria um "link" entre o seu branch `main` local e o branch `main` no `origin`. Fazendo isso, nas próximas vezes, você só precisará digitar `git push`.

### Pushes Seguintes

Depois de fazer o primeiro push, o fluxo é simples:

1.  Faça seus commits locais: `git add .` e `git commit -m "mensagem"`.
2.  Envie para o GitHub:
    ```bash
    git push
    ```

## `git push --force`: A Opção Perigosa

Vamos conectar este conceito com a nossa "viagem no tempo" (`git commit --amend`).

- **O Problema:** Imagine que você fez um `git push` e enviou um commit para o GitHub. Depois, você percebe um erro e usa `git commit --amend` para corrigir o commit na sua máquina local. Agora, o seu histórico local é **diferente** do histórico que está no GitHub. Se você tentar fazer um `git push` normal, o GitHub vai **rejeitar**, dizendo que os históricos divergiram. Isso é um mecanismo de segurança para impedir que você apague o histórico remoto por acidente.

- **A Solução Forçada:** O `git push --force` (ou sua forma curta `git push -f`) resolve isso de uma maneira drástica.

  ```bash
  # FORÇA o push, sobrescrevendo o histórico remoto
  git push --force
  ```

  - **O que faz?** Este comando diz ao servidor remoto: "Esqueça o seu histórico. O meu histórico local é o correto. Substitua tudo o que você tem pelo que eu estou enviando."

### Por Que o `--force` é Perigoso?

Ao forçar o push, você está **reescrevendo o histórico** do repositório remoto. Se outra pessoa já tiver baixado os commits que você está prestes a apagar, você causará um grande problema para ela, pois a base de trabalho dela não existirá mais no servidor.

- **Regra de Ouro:** **NUNCA** use `git push --force` em branches compartilhados, como `main`, `master` ou `develop`. Você pode (e provavelmente vai) apagar o trabalho de outras pessoas.
- **Quando é (relativamente) seguro?** Em um branch que só você está usando. Se você tem certeza de que ninguém mais baseou o trabalho naquele branch, um `push --force` para corrigir seu próprio histórico é aceitável.

### Uma Alternativa Mais Segura: `--force-with-lease`

Existe uma opção mais segura, o `git push --force-with-lease`. Ele também força o push, mas antes ele verifica se alguém mais enviou commits para o branch remoto. Se o histórico remoto tiver commits que você não tem localmente, ele falhará, prevenindo que você apague o trabalho de outra pessoa sem querer.

## Resumo

- `git push`: Use para enviar seus novos commits para o remoto. É a operação segura do dia a dia.
- `git push --force`: Use com extremo cuidado, apenas em branches pessoais e quando você precisa sobrescrever o histórico remoto para corresponder ao seu histórico local reescrito (com `amend` ou `rebase`).

# Os 3 Estágios de um Arquivo no Git (A Escada Infinita)

Para entender de verdade o Git, é crucial conhecer os três estágios, ou "estados", pelos quais um arquivo pode passar. Pense neles como as três principais áreas de trabalho do Git. Dominar esse conceito torna o fluxo de versionamento muito mais claro.

## As Três "Árvores" do Git

O Git gerencia o seu projeto em três "árvores" principais:

1.  **Diretório de Trabalho (Working Directory):**
    -   **O que é?** É a pasta do seu projeto no seu computador, onde você cria, edita e apaga arquivos.
    -   **Estado do arquivo:** `modified` (modificado) ou `untracked` (não rastreado).

2.  **Área de Preparação (Staging Area ou Index):**
    -   **O que é?** É uma área intermediária, uma espécie de "sala de espera". É aqui que você agrupa as alterações que farão parte do seu próximo commit.
    -   **Estado do arquivo:** `staged` (preparado).

3.  **Repositório Git (O Histórico / `.git` directory):**
    -   **O que é?** É o banco de dados do Git, localizado na pasta oculta `.git`. É aqui que o histórico de todas as versões (commits) do seu projeto é armazenado de forma permanente.
    -   **Estado do arquivo:** `committed` (commitado).

## A Analogia da "Escada Infinita"

Imagine que você está construindo algo com peças de Lego. O processo de salvar seu progresso no Git pode ser visto como uma escada.

### O Chão: Seu Diretório de Trabalho

O chão é o seu **Diretório de Trabalho**. É onde você tem todas as suas peças de Lego espalhadas, monta e desmonta coisas, experimenta. É onde a bagunça acontece: você edita um arquivo, cria outro, apaga um terceiro. Seus arquivos estão no estado `modified`.

### O Primeiro Degrau: A Staging Area (`git add`)

Você não quer guardar todas as peças soltas de qualquer jeito. Você decide organizar. O primeiro degrau da escada é a sua **Área de Preparação**.

-   **A Ação:** Você pega as montagens específicas que finalizou e as coloca cuidadosamente dentro de uma caixa. Esta ação é o `git add`.

Ao usar `git add`, você está dizendo ao Git: "Esta alteração específica neste arquivo está pronta. Quero que ela faça parte do próximo pacote que vou salvar". O arquivo agora está no estado `staged`.

Você pode ter outras peças ainda bagunçadas no chão (outros arquivos modificados), mas na caixa (Staging Area) só está o que você escolheu guardar.

### O Segundo Degrau: O Repositório (`git commit`)

Agora que a caixa está pronta e lacrada, você a leva para o segundo degrau: o seu **Repositório**.

-   **A Ação:** Você pega a caixa, escreve uma etiqueta clara nela (a mensagem de commit) e a coloca em uma prateleira numerada no seu armazém. Esta ação é o `git commit`.

O `commit` pega tudo o que está na Staging Area e salva um "snapshot" (uma foto) permanente no seu histórico. Os arquivos agora estão no estado `committed`. A prateleira é o seu `git log`, e cada caixa é um commit que você pode visitar quando quiser.

### A Escada é Infinita

Depois de guardar a caixa na prateleira, o que você faz? Volta para o chão para continuar construindo. O ciclo recomeça:

1.  **Modifica** os arquivos no chão (Working Directory).
2.  **Prepara** as alterações na caixa do primeiro degrau (`git add`).
3.  **Armazena** a caixa na prateleira do segundo degrau (`git commit`).

É uma "escada infinita" que você sobe a cada nova versão que cria para o seu projeto.

## Resumo do Fluxo

`Working Directory` --(`git add`)--> `Staging Area` --(`git commit`)--> `Repositório (.git)`

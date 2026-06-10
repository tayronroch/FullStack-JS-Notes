# 7 - Guia de Configuração (NVM, Node e PNPM)

Para ter um ambiente de desenvolvimento profissional, não basta instalar o Node.js manualmente. Precisamos de ferramentas que permitam trocar de versão facilmente e gerenciar pacotes de forma eficiente.

---

## 1. Instalando o NVM (Node Version Manager)

O **NVM** é a ferramenta mais importante para um desenvolvedor JavaScript. Ele permite que você tenha várias versões do Node.js instaladas ao mesmo tempo e alterne entre elas com um comando.

### Por que usar NVM?
- Evita problemas de permissão (`sudo`) ao instalar pacotes globais.
- Permite testar seu projeto em diferentes versões do Node.
- É o padrão da indústria.

### Comandos principais:
```bash
# Instala a versão LTS mais recente
nvm install --lts

# Lista todas as versões instaladas
nvm ls

# Escolhe uma versão específica para usar
nvm use 20.11.0

# Define a versão padrão
nvm alias default 20.11.0
```

---

## 2. Instalando o Node.js

Após instalar o NVM, você deve instalar a versão estável (LTS) do Node.js:

```bash
nvm install --lts
node -v # Deve mostrar a versão instalada
```

---

## 3. Instalando o PNPM (Versão 11)

Como vimos anteriormente, o **PNPM** é extremamente rápido e economiza espaço em disco. Para instalar a versão específica solicitada (11):

### Usando o Corepack (Recomendado no Node moderno)
O Node.js agora vem com o `corepack`, que gerencia os próprios gerenciadores de pacotes.

```bash
# Habilita o corepack
corepack enable

# Prepara e define a versão do pnpm
corepack prepare pnpm@11.0.0 --activate
```

### Alternativa via NPM
```bash
npm install -g pnpm@11
```

> **Nota:** Certifique-se de que a versão 11 já está disponível ou use a versão estável mais recente (`pnpm@latest`) se a 11 ainda estiver em fase experimental.

---

## 4. Verificando a Instalação Final

Ao final, seu terminal deve responder corretamente a estes comandos:

```bash
node -v   # v20.x.x (ou similar)
npm -v    # v10.x.x (ou similar)
pnpm -v   # 11.x.x
```

---

## Conclusão

Com **NVM + Node + PNPM**, você tem o "setup dos sonhos" para qualquer projeto moderno. O NVM cuida do ambiente, o Node executa o código e o PNPM gerencia suas bibliotecas com velocidade máxima.

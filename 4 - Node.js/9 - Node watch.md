# 9 - Execução Automática Nativa com o Node --watch

Durante anos, a comunidade do Node.js dependeu de ferramentas externas de terceiros, como o **`nodemon`**, para reiniciar o servidor automaticamente durante o desenvolvimento. 

A partir do **Node.js 18.11.0** (e estabilizado no Node.js 20.x+), o Node introduziu a flag nativa **`--watch`**, permitindo o reinício automático do processo sem precisar instalar nenhuma biblioteca adicional no seu projeto. Nesta aula, aprenderemos a configurar e usar este recurso no dia a dia.

---

## 1. Como Usar o `--watch`

O uso básico é extremamente simples. Basta incluir a flag `--watch` antes do nome do arquivo que você deseja executar:

```bash
node --watch src/index.js
```

Ao fazer isso, o Node.js:
1. Executará o arquivo `src/index.js`.
2. Monitorará o arquivo de entrada e **todas as dependências locais importadas** por ele (via `require` ou `import`).
3. Limpará o terminal e reiniciará o processo automaticamente assim que qualquer um desses arquivos for salvo.

---

## 2. Opções e Flags Avançadas

A execução nativa do `--watch` oferece parâmetros avançados para refinar o que deve ser monitorado:

### A. Monitorando pastas específicas (`--watch-path`)
Por padrão, o `--watch` monitora apenas os arquivos que são importados diretamente pela sua árvore de dependências a partir do entrypoint (`index.js`). Se você tiver arquivos de configuração, modelos HTML ou outros arquivos que não são importados no código, mas que você deseja que reiniciem o servidor quando alterados, use a flag `--watch-path`:

```bash
node --watch --watch-path=./config src/index.js
```

Você pode declarar a flag `--watch-path` múltiplas vezes para monitorar diretórios diferentes:
```bash
node --watch --watch-path=./config --watch-path=./views src/index.js
```

---

### B. Preservando o histórico de Logs (`--watch-preserve-output`)
Por padrão, o Node.js limpa a tela do terminal toda vez que reinicia o script para facilitar a leitura do novo fluxo. Caso você precise manter o histórico de logs das execuções anteriores para depuração, adicione a flag `--watch-preserve-output`:

```bash
node --watch --watch-preserve-output src/index.js
```

---

## 3. Configurando no `package.json`

Em projetos reais, é uma boa prática encapsular este comando dentro dos scripts do seu `package.json`:

```json
{
  "name": "meu-projeto",
  "version": "1.0.0",
  "scripts": {
    "start": "node src/index.js",
    "dev": "node --watch src/index.js"
  }
}
```

Para rodar em modo de desenvolvimento, basta digitar no terminal:
```bash
npm run dev
```

### Principais Vantagens do Modo Nativo:
1. **Zero Dependências:** Não há necessidade de baixar e manter a pasta `node_modules` com pacotes adicionais apenas para recarregar o código.
2. **Mais Segurança:** Menos pacotes de terceiros significam menos vulnerabilidades de segurança expostas no seu ambiente de desenvolvimento.
3. **Leveza e Velocidade:** Por rodar diretamente em C++ integrado ao motor do Node, o monitoramento consome menos recursos de sistema e o reinício é instantâneo.

---

## 4. Comparativo Direto: Node `--watch` vs. `nodemon`

| Característica | Node `--watch` (Nativo) | `nodemon` (Pacote NPM) |
| :--- | :--- | :--- |
| **Instalação** | Nenhuma (Nativo do Node 18+) | Necessária (`npm install -D nodemon`) |
| **Performance** | Extremamente rápido (Nativo em C++) | Bom, mas possui o delay do processo JS externo |
| **Configurações por arquivo** | Não possui (Configurado apenas por CLI) | Suporta arquivo de configuração `nodemon.json` |
| **Monitoramento de Pastas** | Via `--watch-path` | Via arquivo `nodemon.json` ou flag `--watch` |
| **Filtro de Extensões** | Automático para extensões de script | Customizável via flag `-e` (ex: `-e html,css`) |
| **Preservar logs** | Via `--watch-preserve-output` | Automático ou configurável |
| **Delay de Reinício** | Imediato | Configurável (ex: esperar 2.5s antes de rodar) |

---

## 5. Quando usar cada um?

* **Use o Node `--watch`** na imensa maioria dos novos projetos, scripts rápidos, ferramentas utilitárias ou APIs modernas. É a recomendação atual da comunidade por ser limpo, rápido e embutido.
* **Use o `nodemon`** se o seu projeto rodar em uma versão antiga do Node.js (inferior à 18.11), se você precisar configurar múltiplos diretórios para ignorar via arquivo de configuração complexo, ou se precisar aguardar um delay específico (ex: esperar a compilação de algum outro asset terminar antes de recarregar).

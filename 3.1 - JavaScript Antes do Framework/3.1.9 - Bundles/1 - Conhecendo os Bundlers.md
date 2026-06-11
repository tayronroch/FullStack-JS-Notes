# 1 - Conhecendo os Bundlers

## O que e um bundler

Um bundler e uma ferramenta que recebe multiplos arquivos JavaScript (e outros assets como CSS, imagens e fontes) e os agrupa em um ou poucos arquivos de saida otimizados para o navegador ou para o Node.

O problema que ele resolve e simples: aplicacoes modernas sao compostas por dezenas ou centenas de modulos com dependencias entre si. O navegador nao foi projetado para carregar centenas de arquivos separados com eficiencia — o bundler resolve isso consolidando tudo.

## O problema sem bundler

Imagine uma aplicacao com a seguinte estrutura:

```
src/
├── index.js
├── utils/format.js
├── utils/date.js
├── services/api.js
└── components/button.js
```

Sem um bundler, voce precisaria carregar cada arquivo com uma tag `<script>` separada no HTML, na ordem correta, sem erros de dependencia. Qualquer mudanca na estrutura exigiria atualizar o HTML manualmente.

Com um bundler, voce aponta para `index.js` e ele resolve todo o grafo de dependencias automaticamente, gerando um unico `bundle.js`.

## O que um bundler faz

1. **Resolve o grafo de dependencias**: a partir do ponto de entrada, percorre todos os `import` e `require` recursivamente ate mapear todos os modulos usados.
2. **Transforma os arquivos**: integra compiladores como Babel, SWC ou esbuild para transpilar o codigo durante o processo.
3. **Agrupa os modulos**: combina tudo em um ou mais arquivos de saida.
4. **Otimiza**: aplica minificacao, tree shaking e code splitting para reduzir o tamanho final.

## Bundler vs Compilador

| | Compilador | Bundler |
|---|---|---|
| **Faz** | Transforma sintaxe de um arquivo | Agrupa multiplos arquivos em um |
| **Entrada** | Um arquivo | Um ponto de entrada com dependencias |
| **Saida** | Um arquivo transformado | Um ou mais bundles otimizados |
| **Exemplos** | Babel, SWC, tsc | Webpack, Rollup, Vite, esbuild |

Na pratica, bundlers modernos incorporam compiladores internamente. O Vite usa esbuild como compilador e Rollup como bundler. Eles sao conceitos distintos, mas trabalham juntos.

## Os principais bundlers

### Webpack

O bundler mais usado historicamente. Extremamente configuravel, com um ecossistema enorme de plugins e loaders. Suporta qualquer tipo de asset (JS, CSS, imagens, fontes) via loaders. A curva de configuracao e alta.

- **Ponto forte**: flexibilidade e ecossistema maduro.
- **Ponto fraco**: configuracao verbosa e build lento em projetos grandes.

### Rollup

Especializado em bibliotecas. Gera bundles mais enxutos que o Webpack para codigo de biblioteca porque foi projetado com tree shaking como prioridade desde o inicio. E o bundler usado internamente pelo Vite em producao.

- **Ponto forte**: output limpo, ideal para publicar pacotes NPM.
- **Ponto fraco**: menos recursos para aplicacoes com muitos assets.

### esbuild

Escrito em Go, e o bundler/compilador mais rapido disponivel hoje. Usado pelo Vite durante o desenvolvimento para pre-processar dependencias. Tem menos flexibilidade para configuracoes avancadas comparado ao Webpack.

- **Ponto forte**: velocidade extrema.
- **Ponto fraco**: ecossistema de plugins menor.

### Vite

Nao e um bundler no sentido tradicional — e uma ferramenta de build que combina esbuild (desenvolvimento) e Rollup (producao). Durante o desenvolvimento, serve os modulos diretamente via ESM nativo do navegador, sem precisar gerar um bundle. Em producao, usa o Rollup para gerar o bundle otimizado.

- **Ponto forte**: desenvolvimento extremamente rapido, configuracao simples.
- **Ponto fraco**: comportamento diferente entre dev e prod pode gerar surpresas.

### Parcel

Bundler com foco em zero configuracao. Detecta automaticamente o tipo de cada arquivo e aplica as transformacoes necessarias sem nenhum arquivo de config. Ideal para projetos simples ou prototipagem rapida.

- **Ponto forte**: sem configuracao.
- **Ponto fraco**: menos controle sobre o processo de build.

## Tree shaking

Tree shaking e o processo de eliminar codigo que nunca e usado antes de gerar o bundle final. O nome vem da ideia de "sacudir a arvore" de dependencias para que o codigo morto caia.

```js
// utils.js
export function usada() { return 'usada' }
export function naoUsada() { return 'nao usada' }

// index.js
import { usada } from './utils.js'
```

Um bundler com tree shaking vai incluir apenas `usada` no bundle final. `naoUsada` e eliminada, mesmo que esteja exportada.

Tree shaking funciona com **ES Modules** (`import`/`export`). Modulos CommonJS (`require`) nao permitem analise estatica e nao sao compatíveis com tree shaking eficiente.

## Code splitting

Code splitting divide o bundle em multiplos arquivos menores que sao carregados sob demanda. Em vez de carregar tudo de uma vez, o navegador baixa apenas o que e necessario para a pagina atual.

```js
// Importacao dinamica — o bundler cria um chunk separado
const modulo = await import('./modulo-pesado.js')
```

O resultado sao varios arquivos no `dist`, carregados conforme o usuario navega pela aplicacao.

## Resumo

Bundlers resolvem o problema de gerenciar e otimizar multiplos modulos para entrega no navegador. Cada ferramenta tem um foco: Webpack para aplicacoes complexas, Rollup para bibliotecas, esbuild para velocidade e Vite para uma experiencia de desenvolvimento moderna. Entender o que um bundler faz — resolver dependencias, transformar, agrupar e otimizar — e o que permite configurar e depurar qualquer uma dessas ferramentas com confianca.

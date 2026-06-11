# 8 - Configurando Targets

## O que sao targets

Targets definem para qual ambiente o Babel deve compilar o codigo. Em vez de transpilar tudo indiscriminadamente, o Babel analisa o alvo e aplica apenas as transformacoes necessarias — o que resulta em um codigo de saida mais enxuto e mais proximo do original.

Sem targets configurados, o Babel nao transpila nada por padrao. Com targets, ele sabe exatamente o que o ambiente suporta e o que precisa ser convertido.

## Onde configurar os targets

Os targets sao definidos dentro do `@babel/preset-env` no arquivo `babel.config.json`:

```json
{
  "presets": [
    ["@babel/preset-env", {
      "targets": "..."
    }]
  ]
}
```

## Targets para Node.js

### Versao atual do Node

```json
{
  "targets": {
    "node": "current"
  }
}
```

Usa a versao do Node que esta rodando no momento. O Babel transpila apenas o que essa versao nao suporta nativamente. Ideal para scripts locais, CLIs e ambientes de teste.

### Versao especifica do Node

```json
{
  "targets": {
    "node": "18"
  }
}
```

Garante compatibilidade com o Node 18, independente da versao instalada na maquina.

## Targets para navegadores

### Query do Browserslist

O Browserslist e um padrao compartilhado por varias ferramentas (Babel, PostCSS, ESLint) para definir quais navegadores suportar:

```json
{
  "targets": "> 0.5%, last 2 versions, not dead"
}
```

Interpretacao da query acima:
- **`> 0.5%`**: navegadores com mais de 0.5% de uso global.
- **`last 2 versions`**: as duas ultimas versoes de cada navegador.
- **`not dead`**: exclui navegadores sem suporte oficial ha mais de 24 meses.

### Navegadores especificos

```json
{
  "targets": {
    "chrome": "90",
    "firefox": "88",
    "safari": "14",
    "edge": "91"
  }
}
```

Util quando o projeto tem um publico bem definido ou precisa suportar uma versao corporativa especifica.

### Apenas navegadores modernos

```json
{
  "targets": "last 1 chrome version, last 1 firefox version, last 1 safari version"
}
```

Reduz ao maximo as transformacoes aplicadas, resultando em um codigo quase identico ao original.

## Arquivo .browserslistrc

Em vez de definir os targets dentro do `babel.config.json`, e possivel usar um arquivo separado `.browserslistrc` na raiz do projeto. Todas as ferramentas que entendem o Browserslist vao ler esse arquivo automaticamente:

```
> 0.5%
last 2 versions
not dead
```

Isso centraliza a definicao de browsers em um unico lugar, evitando repeticao entre Babel, PostCSS e outras ferramentas.

## Targets por ambiente

E possivel definir targets diferentes para desenvolvimento e producao:

```json
{
  "env": {
    "development": {
      "presets": [
        ["@babel/preset-env", {
          "targets": "last 1 chrome version"
        }]
      ]
    },
    "production": {
      "presets": [
        ["@babel/preset-env", {
          "targets": "> 0.5%, last 2 versions, not dead"
        }]
      ]
    },
    "test": {
      "presets": [
        ["@babel/preset-env", {
          "targets": { "node": "current" }
        }]
      ]
    }
  }
}
```

- **Desenvolvimento**: alvo restrito (Chrome recente) para builds mais rapidos e codigo mais legivel.
- **Producao**: cobertura ampla de navegadores.
- **Teste**: Node atual para maxima velocidade.

## Como verificar o que o Babel vai transpilar

Para entender quais transformacoes um determinado target ativa, use o `@babel/preset-env` com a opcao `debug`:

```json
{
  "presets": [
    ["@babel/preset-env", {
      "targets": "> 0.5%, last 2 versions, not dead",
      "debug": true
    }]
  ]
}
```

O Babel vai imprimir no terminal quais plugins foram ativados e por que, com base no target informado. Util para entender o impacto de cada configuracao.

## Impacto dos targets no tamanho do bundle

Targets mais abrangentes = mais transformacoes = codigo de saida maior e mais verboso.

| Target | Transformacoes | Tamanho do output |
|---|---|---|
| `last 1 chrome version` | Minimas | Proximo do original |
| `last 2 versions` | Moderadas | Levemente maior |
| `> 0.5%, last 2 versions, not dead` | Amplas | Notavelmente maior |
| `> 0.1%, ie 11` | Maximas | Bem maior, inclui ES5 |

Escolher o target certo evita penalizar usuarios modernos com codigo desnecessariamente transpilado.

## Resumo

Targets sao o que tornam o `@babel/preset-env` inteligente. Em vez de transpilar tudo para ES5, ele analisa o ambiente-alvo e aplica apenas o necessario. Usar `node: current` em testes, uma query Browserslist em producao e `last 1 chrome version` em desenvolvimento e a configuracao mais eficiente para a maioria dos projetos.

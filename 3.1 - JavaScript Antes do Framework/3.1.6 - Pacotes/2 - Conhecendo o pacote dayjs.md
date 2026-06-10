# 2 - Conhecendo o pacote Day.js

O **Day.js** é uma biblioteca JavaScript minimalista que permite manipular, validar e formatar datas de forma muito simples e eficiente. Ela é amplamente utilizada como uma alternativa moderna e leve ao antigo *Moment.js*.

---

## 1. Por que usar o Day.js?

- **Leveza:** Pesa apenas cerca de 2KB (o Moment.js pesa cerca de 70KB).
- **Imutabilidade:** Operações no Day.js retornam uma nova instância, evitando bugs comuns de alteração de dados originais.
- **Sintaxe familiar:** Se você já usou Moment.js, a transição é quase imediata.
- **Suporte a I18n:** Fácil de configurar para diferentes idiomas, incluindo Português do Brasil.

---

## 2. Instalação

Para começar a usar o Day.js em um projeto Node.js ou Front-end moderno:

```bash
npm install dayjs
```

---

## 3. Uso Básico

### Importação
```javascript
import dayjs from "dayjs" // No ES Modules
// const dayjs = require('dayjs') // No CommonJS
```

### Formatação de Datas
O método `.format()` é o mais utilizado para exibir a data como desejado.

```javascript
// Data atual
dayjs().format() // "2024-03-20T15:30:00-03:00"

// Formatação customizada
dayjs().format("DD/MM/YYYY") // "20/03/2024"
dayjs().format("DD [de] MMMM [de] YYYY") // "20 de Março de 2024"
```

---

## 4. Manipulação de Datas

Você pode somar ou subtrair tempo de forma intuitiva:

```javascript
// Adicionando 7 dias
dayjs().add(7, "day").format("DD/MM/YYYY")

// Subtraindo 1 mês
dayjs().subtract(1, "month").format("DD/MM/YYYY")

// Início do mês atual
dayjs().startOf("month").format("DD/MM/YYYY")
```

---

## 5. Diferença entre Datas

Útil para calcular tempo decorrido ou prazos:

```javascript
const data1 = dayjs("2024-01-01")
const data2 = dayjs("2024-03-20")

const diferencaEmDias = data2.diff(data1, "day")
console.log(diferencaEmDias) // 79 dias
```

---

## 6. Configurando o Idioma (Português)

Para que nomes de meses e dias apareçam em português:

```javascript
import "dayjs/locale/pt-br"
dayjs.locale("pt-br")

dayjs().format("MMMM") // "março"
```

---

## Conclusão

O Day.js é a escolha ideal para projetos que precisam de manipulação de datas sem comprometer a performance do carregamento da página. É o exemplo perfeito de como um **pacote** pode facilitar a vida do desenvolvedor.

# 2 - API Client - Insomnia

Quando desenvolvemos páginas web (frontend), o navegador é a nossa ferramenta principal para visualizar o resultado. No entanto, quando estamos desenvolvendo ou consumindo **APIs (backend)**, o navegador comum se torna extremamente limitado. 

Para testar e depurar APIs de forma eficiente, utilizamos uma ferramenta especializada chamada **API Client** (ou Cliente HTTP). Nesta aula, entenderemos a importância dessas ferramentas e aprenderemos a utilizar o **Insomnia**, um dos clientes de API mais populares e leves do mercado.

---

## 1. Por que não testar APIs pelo Navegador?

O navegador web comum é excelente em realizar requisições do tipo **`GET`** (que acontecem de forma automática quando você digita um endereço na barra de busca e pressiona `Enter`). 

Contudo, testar uma API real exige muito mais:
* Como enviar dados em uma requisição **`POST`** para cadastrar um produto?
* Como enviar uma requisição **`PUT`** ou **`DELETE`**?
* Como enviar dados complexos em formato **JSON** no corpo (Body) da mensagem?
* Como enviar cabeçalhos (Headers) de segurança customizados (como tokens de autenticação)?

Fazer tudo isso pelo navegador exigiria que você escrevesse código JavaScript (`fetch` ou `axios`) no console do inspetor toda vez. Um **API Client** resolve esse problema fornecendo uma interface visual simples para configurar e enviar qualquer tipo de requisição HTTP em poucos cliques.

---

## 2. O que é o Insomnia?

O **Insomnia** é um cliente de API open-source, leve e com uma interface extremamente limpa e focada na produtividade. Ele permite estruturar, testar e organizar as requisições da sua API em coleções de pastas de forma organizada.

> [!NOTE]
> **Outros clientes famosos no mercado:**
> * **Postman:** O mais antigo e repleto de recursos, porém mais pesado e complexo.
> * **Thunder Client / Rest Client:** Extensões integradas diretamente no VS Code.
> * **curl:** Ferramenta clássica de linha de comando no terminal.

---

## 3. Elementos Fundamentais de uma Requisição no Insomnia

Ao abrir o Insomnia e criar uma nova requisição, você precisará configurar estes quatro elementos básicos:

```
┌────────────────────────────────────────────────────────┐
│ [ POST ]  http://localhost:3000/produtos              │ ➔ 1. Método & URL
├──────────────────────────┬─────────────────────────────┤
│ 2. Headers (Cabeçalhos)  │ 3. Body (Corpo da Mensagem) │
│ Content-Type: json       │ {                           │
│ Authorization: Bearer xx │   "nome": "Teclado",        │
│                          │   "preco": 350.00           │
│                          │ }                           │
└──────────────────────────┴─────────────────────────────┘
```

1. **Método (Verbo HTTP):** Define qual ação você deseja executar (`GET` para ler, `POST` para criar, `PUT` para atualizar, `DELETE` para deletar).
2. **URL (Endpoint):** O endereço da sua API (ex: `http://localhost:3000/produtos`).
3. **Body (Corpo):** Os dados que você está enviando para o servidor. No desenvolvimento de APIs, o formato quase universal para enviar esses dados é o **JSON**.
4. **Headers (Cabeçalhos):** Metadados adicionais sobre a requisição (ex: dizer ao servidor que os dados do corpo são JSON ou enviar chaves de acesso/tokens).

---

## 4. Criando sua Primeira Requisição no Insomnia (Passo a Passo)

### Passo 1: Criar uma Request Collection
Abra o Insomnia, clique no botão **Create** no canto superior direito e selecione **Request Collection**. Dê um nome ao seu projeto (ex: *Curso FullStack JS*).

### Passo 2: Criar uma Requisição GET
1. Clique no botão **`+`** (New Request) ou use o atalho `Ctrl + N` (`Cmd + N` no Mac).
2. Dê um nome à requisição (ex: *Buscar Info do Servidor*).
3. Selecione o método **`GET`**.
4. Na barra de endereço, digite a URL do seu servidor criado nas aulas anteriores (ex: `http://localhost:3000/sobre`).
5. Clique no botão azul **Send** (Enviar).
6. À direita, você verá a resposta do servidor, o tempo de resposta, o status code (ex: `200 OK`) e o formato da resposta.

---

### Passo 3: Criar uma Requisição POST enviando JSON
Para enviar dados de cadastro para a API:
1. Crie uma nova requisição (`Ctrl + N`).
2. Dê o nome de *Cadastrar Produto*.
3. Selecione o método **`POST`**.
4. Digite o endereço (ex: `http://localhost:3000/produtos`).
5. Abaixo da barra de URL, clique em **Body** e selecione a opção **JSON**.
6. Digite os dados no painel de texto em formato JSON:
   ```json
   {
     "titulo": "Mouse Sem Fio",
     "preco": 120.00
   }
   ```
7. Clique em **Send**. 
> [!TIP]
> Ao selecionar a opção "Body ➔ JSON", o Insomnia adiciona automaticamente o cabeçalho `'Content-Type': 'application/json'` nos Headers por baixo dos panos, garantindo que o seu servidor saiba ler o formato dos dados que estão chegando.

---

## 5. Dica de Ouro: Variáveis de Ambiente (Environments)

Quando testamos APIs, é comum mudarmos o local onde o servidor está rodando. Em desenvolvimento, usamos `http://localhost:3000`. Em produção, o endereço pode ser `https://api.meusite.com`.

Em vez de alterar a URL manualmente em todas as suas 50 requisições salvas, use os **Environments** do Insomnia:

1. Clique na engrenagem ou na barra de seleção de ambiente no canto superior esquerdo (geralmente escrito **Base Environment**).
2. Configure uma variável no formato JSON:
   ```json
   {
     "base_url": "http://localhost:3000"
   }
   ```
3. Agora, na barra de endereço de qualquer requisição, você pode substituir a parte repetida da URL pela variável digitando:
   `{{ _.base_url }}/produtos`
4. Se amanhã o servidor mudar de endereço, você altera em um único lugar (no Environment) e todas as requisições se atualizam automaticamente!

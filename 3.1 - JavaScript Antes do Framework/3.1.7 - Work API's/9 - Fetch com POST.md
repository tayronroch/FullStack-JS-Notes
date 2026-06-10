# 9 - Fetch com POST

Enquanto o método **GET** é usado para buscar dados de uma API, o método **POST** é utilizado para **enviar ou criar** novas informações no servidor.

---

## 1. Como funciona o POST no Fetch?

Diferente do GET (que é o padrão e não precisa de configuração extra), o POST exige que passemos um objeto de opções como segundo argumento da função `fetch()`.

Neste objeto, precisamos definir:
- **method:** O tipo da requisição (`"POST"`).
- **headers:** Informações sobre o tipo de dado que estamos enviando.
- **body:** O conteúdo real que será salvo no servidor.

---

## 2. Exemplo Prático

Imagine que queremos cadastrar um novo usuário em nossa API:

```javascript
async function criarUsuario() {
  const novoUsuario = {
    nome: "Tayron",
    email: "tayron@exemplo.com"
  };

  try {
    const response = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json" // Avisa a API que estamos enviando um JSON
      },
      body: JSON.stringify(novoUsuario) // Transforma o objeto JS em texto (string)
    });

    if (response.ok) {
      const dadoCriado = await response.json();
      console.log("Usuário criado com sucesso:", dadoCriado);
    }
  } catch (error) {
    console.error("Erro ao realizar o POST:", error);
  }
}

criarUsuario();
```

---

## 3. Detalhes Importantes

### Content-Type
O header `"Content-Type": "application/json"` é obrigatório quando enviamos dados em formato JSON. Sem ele, o servidor pode não entender como processar as informações no `body`.

### JSON.stringify()
O corpo da requisição (`body`) não pode ser um objeto JavaScript puro. Ele deve ser enviado como uma **String**. Por isso, usamos o `JSON.stringify(seuObjeto)`.

---

## 4. Diferença Visual (Network Tab)

Ao inspecionar a requisição no navegador (F12 -> Network):
- No **GET**, os dados (quando existem) costumam ir na URL.
- No **POST**, os dados vão "escondidos" dentro do corpo (**Payload**) da requisição, tornando o envio mais seguro e permitindo volumes maiores de dados.

---

## Conclusão

O `fetch` com POST é a base para formulários de cadastro, envio de mensagens e qualquer ação que envolva salvar dados em um banco de dados via API.

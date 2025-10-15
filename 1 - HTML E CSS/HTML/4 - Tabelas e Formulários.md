# Tabelas e Formulários em HTML

## Tabelas

Tabelas são usadas para exibir dados em formato de grade.

- `<table>`: Define a tabela.
- `<tr>`: Cria uma linha na tabela.
- `<th>`: Define uma célula de cabeçalho.
- `<td>`: Define uma célula de dados.

### Exemplo de Tabela

```html
<table border="1">
  <tr>
    <th>Nome</th>
    <th>Idade</th>
  </tr>
  <tr>
    <td>João</td>
    <td>30</td>
  </tr>
</table>
```

## Formulários

Formulários coletam informações do usuário.

- `<form>`: O contêiner para os elementos do formulário.
- `<label>`: Rótulo para um campo de entrada.
- `<input>`: Campo de entrada de dados. O atributo `type` define o tipo de entrada (ex: `text`, `password`, `submit`).
- `<textarea>`: Para entrada de texto com várias linhas.
- `<button>`: Um botão clicável.

### Exemplo de Formulário

```html
<form>
  <label for="nome">Nome:</label><br>
  <input type="text" id="nome" name="nome"><br>
  <label for="senha">Senha:</label><br>
  <input type="password" id="senha" name="senha"><br><br>
  <button type="submit">Enviar</button>
</form>
```

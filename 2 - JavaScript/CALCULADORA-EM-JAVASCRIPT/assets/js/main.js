function Calculadora() {
  // 1 criar a função fabrica
  this.display = document.querySelector(".display");

  this.inicia = () => {
    // 4 - gerenciador de eventos capturaCliques e capturaEnter.
    this.capturaCliques();
    this.capturaEnter();
  };

  this.capturaEnter = () => {
    document.addEventListener("keyup", (e) => {
      if (e.keyCode === 13) {
        // se qualquer uma tecla pressionada for do metodo 13, ela irá chamar o metodo realizaConta.
        this.realizaConta(); // chama o metodo realiza conta quando o evento é capturado
      }
    });
  };

  this.capturaCliques = () => {
    // 5 - vai capturar
    document.addEventListener("click", (event) => {
      //captura o evento do click
      const el = event.target; //qual botão foi pressionado.
      if (el.classList.contains("btn-num")) this.addNumDisplay(el); // captura numeros clickados e chama metodo addNumDisplay.
      if (el.classList.contains("btn-clear")) this.clear(); // captura click no botao de limpar e chama metodo clear
      if (el.classList.contains("btn-del")) this.del(); // captura click no botao de delete e chama metodo del.
      if (el.classList.contains("btn-eq")) this.realizaConta(); // captura click no botao de delete e e chama metodo realizaConta.
    });
  };

  this.realizaConta = () => {
    try {
      const conta = eval(this.display.value); // avalia se oq ta no display, se for uma conta o motor do javascript irá funcionar.

      if (!conta) {
        // senão foi uma conta, irá imprimir na tela uma mensagem informando que a conta é "...".
        alert("Conta inválida");
        return;
      }

      this.display.value = conta;
    } catch (e) {
      alert("Conta inválida");
      return;
    }
  };

  this.addNumDisplay = (el) => {
    // captura o evento de click e envia para o display
    this.display.value += el.innerText; // envia para o display o que foi clickado + texto q estava no botao.
    this.display.focus(); // FOCO VOLTAR PRO DISLPAY QUANDO O ENTER FOR PRESSIONADO. BUG FIX!
  };

  this.clear = () => (this.display.value = ""); // Simplesmente limpa o display quando chamado.
  this.del = () => (this.display.value = this.display.value.slice(0, -1)); // deleta o ultimo numero digitado no display.
}

const calculadora = new Calculadora(); // 2 - cria-se o objeito a partir da constante.
calculadora.inicia(); // 3 - chamando o metodo inicia de dentro da função Calculadora.

/* Tudo começa pelo metodo inicia, ele que faz rodar o motor do javaScript*/

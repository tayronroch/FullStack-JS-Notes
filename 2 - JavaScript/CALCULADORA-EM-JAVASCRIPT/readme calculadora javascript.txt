MANUAL DA CALCULADORA EM JAVASCRIPT - POR TAYRON ROCHA.

SEGUNDO A LOGICA DE PROGRAMAÇÃO USADA PARA CONCRETIZAR O NORMAL FUNCUIONAMENTO DA CALCULADORA EM JAVASCRIPT DEVE-SE SEGUIR



1 - CRIAR A FUNÇÃO QUE IRÁ EXECUTAR O MOTOR DO JAVASCRIPT

function Calculadora() {  
  this.display = document.querySelector('.display');
--------------------------------------------------------------------------------------------------------------------------------------------------------------------


2 - CRIAR UMA CONSTANTE QUE IRÁ FICAR RESPONSAVEL POR CRIAR UM NOVO OBJETO TODA VEZ QUE FOR EXECUTADO UM CALCULO

const calculadora = new Calculadora();
--------------------------------------------------------------------------------------------------------------------------------------------------------------------


3 - CRIAR UM  PONTE DE PARTIDA PARA SE CHAMAR O METODO QUE FARÁ O MOTOR DO JAVASCRIPT FUNCIONAR.


calculadora.inicia(); // 3 - chamando o metodo inicia de dentro da função Calculadora. 
--------------------------------------------------------------------------------------------------------------------------------------------------------------------


4 - VINCULAR METODO "INICIA", AOS EVENTOS QUE FAZEM UMA CALCULADORA FUNCIONAR.
Gerenciador de eventos capturaCliques e capturaEnter.
EX: this.capturaCliques();
    this.capturaEnter();
--------------------------------------------------------------------------------------------------------------------------------------------------------------------


5 - CRIAR OS PARAMETROS E ARGUMENTOS  DOS METODOS ''capturaCliques'' E ''capturaEnter''. 
 
this.capturaEnter = () => {
    document.addEventListener('keyup', e => {
      if (e.keyCode === 13) { // se qualquer uma tecla pressionada for do metodo 13, ela irá chamar o metodo realizaConta.
        this.realizaConta(); // chama o metodo realiza conta quando o evento é capturado
      }
    });

-------------------------------------------------------------------------------------------------------------------------------------------------------------------
this.capturaCliques = () => { // 5 - vai capturar 
    document.addEventListener('click', event => { //captura o evento do click
      const el = event.target; //qual botão foi pressionado.
      if (el.classList.contains('btn-num')) this.addNumDisplay(el); // captura numeros clickados e chama metodo addNumDisplay.
      if (el.classList.contains('btn-clear')) this.clear(); // captura click no botao de limpar e chama metodo clear
      if (el.classList.contains('btn-del')) this.del(); // captura click no botao de delete e chama metodo del.
      if (el.classList.contains('btn-eq')) this.realizaConta(); // captura click no botao de delete e e chama metodo realizaConta.


--------------------------------------------------------------------------------------------------------------------------------------------------------------------

6 - Criar o metodo que executará o motor do javascript quando encontrar valores validos para calculo.

this.realizaConta = () => {
    try {
      const conta = eval(this.display.value);  // avalia se oq ta no display, se for uma conta o motor do javascript irá funcionar.

      if(!conta) { // senão foi uma conta, irá imprimir na tela uma mensagem informando que a conta é "...".
        alert('Conta inválida');
        return;
      }

      this.display.value = conta;
    } catch(e) {
      alert('Conta inválida');
      return;
    }
  };

------------------------------------------------------------------------------------------------------------------------------------------------------------------
7 - Criar uma forma de capturar o evento e imprimir os valores em tela (ou display).

this.addNumDisplay = el => { // captura o evento de click e envia para o display
    this.display.value += el.innerText; // envia para o display o que foi clickado + texto q estava no botao.
    this.display.focus(); // FOCO VOLTAR PRO DISLPAY QUANDO O ENTER FOR PRESSIONADO. BUG FIX!
  };
------------------------------------------------------------------------------------------------------------------------------------------------------------------

8 - Os demais são auto-explicativos, criar chamada de evento de captura dos botões de "Enter", "delete (backspace)", "clear-display"

ENTENDER ->
this.capturaEnter = () => {
    document.addEventListener('keyup', e => {
      if (e.keyCode === 13) { // se qualquer uma tecla pressionada for do metodo 13, ela irá chamar o metodo realizaConta.
        this.realizaConta();  // chama o metodo realiza conta quando o evento é capturado
      }
    });

----------------------------------------------
CLEAR E DEL
 this.clear = () => this.display.value = ''; // Simplesmente limpa o display quando chamado.
  this.del = () => this.display.value = this.display.value.slice(0, -1); // deleta o ultimo numero digitado no display.


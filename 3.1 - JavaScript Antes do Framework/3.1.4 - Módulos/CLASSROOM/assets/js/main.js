import { add, sub, mul, div } from "./modules/calc.js";
import { getValues, setResult, setMessage, clearInputs } from "./modules/dom.js";

const operations = {
  add,
  sub,
  mul,
  div,
};

function handleOperation(op) {
  if (op === "clear") {
    clearInputs();
    setResult(0);
    setMessage("");
    return;
  }

  const { valueA, valueB } = getValues();

  if (Number.isNaN(valueA) || Number.isNaN(valueB)) {
    setMessage("Preencha os dois valores.");
    return;
  }

  const fn = operations[op];
  const result = fn(valueA, valueB);

  if (result === null) {
    setMessage("Nao e possivel dividir por zero.");
    return;
  }

  setResult(Number.isInteger(result) ? result : result.toFixed(2));
  setMessage("");
}

document.querySelectorAll("[data-op]").forEach((button) => {
  button.addEventListener("click", () => handleOperation(button.dataset.op));
});

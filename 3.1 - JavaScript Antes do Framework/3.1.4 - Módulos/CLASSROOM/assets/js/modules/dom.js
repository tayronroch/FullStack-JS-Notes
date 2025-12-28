export function getValues() {
  const valueA = Number(document.querySelector("#valueA").value);
  const valueB = Number(document.querySelector("#valueB").value);
  return { valueA, valueB };
}

export function setResult(value) {
  document.querySelector("#result").textContent = value;
}

export function setMessage(text) {
  document.querySelector("#message").textContent = text;
}

export function clearInputs() {
  document.querySelector("#valueA").value = "";
  document.querySelector("#valueB").value = "";
}

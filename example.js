import TangleMsgBox from "./dialog-component.js";

document.getElementById("alert").onclick = async () => {
  // TangleMsgBox.* se může zavolat kdekoliv v kódu, jen bacha na to že je asynchronní (takže vraci promise)
  await TangleMsgBox.alert("Tlačítko zčervená, koukej", "Pozoor");
  document.getElementById("alert").style.color = "red";
};

document.getElementById("confirm").onclick = async () => {
  const ano = await TangleMsgBox.confirm("Chcete pozadí změnit na modrou ?", "Mám dotaz.");
  if (ano) {
    document.body.style.background = "aqua";
  }
};

document.getElementById("prompt").onclick = async () => {
  const jmeno = await TangleMsgBox.prompt("Pls", "Zadejte svoje jméno");
  TangleMsgBox.alert(`Nazdárek ${jmeno}`);
};

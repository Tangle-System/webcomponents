import TangleMsgBox from "./dialog-component.js";

document.getElementById("alert").onclick = async () => {
  // TangleMsgBox.* se může zavolat kdekoliv v kódu, jen bacha na to že je asynchronní (takže vraci promise)
  await TangleMsgBox.alert("Tlačítko zčervená, koukej", "Pozoor");
  document.getElementById("alert").style.color = "red";
};

document.getElementById("confirm").onclick = async () => {
  const ano = await TangleMsgBox.confirm("Opravdu chcete uvést aplikaci do továrního nastavení? Tímto krokem odstraníte všechna uložená data.", "Tovární nastavení aplikace");
  if (ano) {
    document.body.style.background = "aqua";
  }
};

document.getElementById("prompt").onclick = async () => {
  const jmeno = await TangleMsgBox.prompt("Jestli nechceš být debil tak se přejmenuj", "debil", "Tvoje úžasné jméno");
  TangleMsgBox.alert(`Nazdárek ${jmeno}`);
};

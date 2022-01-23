import { TangleMsgBox } from "./dialog-component.js";
console.log(TangleMsgBox)

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

document.getElementById("adopt").onclick = async () => {
  const ano = await TangleMsgBox.confirm("Zkuste to, prosím, později.", "Přidání se nezdařilo", { confirm: "Zkusit znovu", cancel: "Zpět" });
  if (ano) {
    document.body.style.background = "aqua";
  }
};

document.getElementById("prompt").onclick = async () => {
  const jmeno = await TangleMsgBox.prompt("Jestli nechceš být debil tak se přejmenuj", "debil", "Tvoje úžasné jméno", "text");
  TangleMsgBox.alert(`Nazdárek ${jmeno}`);
};

document.getElementById("promptnumber").onclick = async () => {
  const cislo = await TangleMsgBox.prompt("Kolik máš diod", 141, "Led pásek", "number", { min: 1, max: 300 });
  TangleMsgBox.alert(`Tolik jo wow: ${cislo} ${typeof cislo}`);
};

document.getElementById("promptregex").onclick = async () => {
  const mail = await TangleMsgBox.prompt("Tvuj mail ?", '', "Potřebuji o tebe něco vědět", 'text', { placeholder: "lkov@post.cz", regex: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/ });
  TangleMsgBox.alert(`Email: ${mail} ${typeof mail}`);
};



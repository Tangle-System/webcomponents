import { TangleMsgBox } from "./dialog-component.js";
console.log(TangleMsgBox);

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
  const ano = await TangleMsgBox.confirm("Zkuste to, prosím, později.", "Přidání se nezdařilo", { confirm: "Zkusit znovu", secondary: "Zpět" });
  if (ano) {
    document.body.style.background = "aqua";
  }
};

document.getElementById("prompt").onclick = async () => {
  const jmeno = await TangleMsgBox.prompt("Jestli nechceš být debil tak se přejmenuj", "debil", "Tvoje úžasné jméno", "text");
  TangleMsgBox.alert(`Nazdárek ${jmeno}`);
};

document.getElementById("prompttime").onclick = async () => {
  const jmeno = await TangleMsgBox.prompt("Zadej čas:", "", "Prej chceš vypnout NARU", "time");
};

document.getElementById("promptnumber").onclick = async () => {
  const cislo = await TangleMsgBox.prompt("Kolik máš diod", 141, "Led pásek", "number", { min: 0, max: 300 });
  TangleMsgBox.alert(`Tolik jo wow: ${cislo} ${typeof cislo}`);
};

document.getElementById("promptregex").onclick = async () => {
  const mail = await TangleMsgBox.prompt("Tvuj mail ?", "", "Potřebuji o tebe něco vědět", "text", { placeholder: "lkov@post.cz", regex: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/ });
  TangleMsgBox.alert(`Email: ${mail} ${typeof mail}`);
};

document.getElementById("choose").onclick = async () => {
  const vybrano = await TangleMsgBox.choose(
    "",
    {
      defaultValue: "cs",
      options: [
        {
          label: "Čeština",
          value: "cs",
          icon: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAUCAYAAABiS3YzAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJ4SURBVHgB7ZNNaBNBFMf/+5XEmFiwVEGRHkpFRasiCD30UOxFD6IIFgre1IPSm0EvnkW8ePbiuQiKeLBeCmouFjzYSKVG2ghNG5KUhiS72ezO7Phm8sHGFNSzfcvbt/v2vd/8dz6A/9q0fylOp9PJWCw2qmnamBDiDGPssO/7Bud8k97fypLJycmKKYuv3rz/YHZmKmOa0bV4PF6kYlk4ZFnWUfIRyp2gOB6JREai0aip6zoIBtd14TgOPM+DaZp3CoXCPOEuKujC4o/pg4eGH926Mo6IZSKRSIAUdZ1gkCBSqBQHQYBGo6HAhmEop0FlXhUoKAs45hYyKFc9pG5cwJHBfQokC6WTCgVV80Vg+hP1LmEydrwzqB6e3g9fcrj9+CVeLHxVsI6KcLNsDD+HvWN6z6rRh3LFxtO5j7iceo53n7I9CncC7JQzw0rbVSpslqt4+Gwer9PLuD51FpfGj4HnN+CufIebz6O2mkOtWIRt2+DJvRgYOw22J/Y7tN8kfym7ia2VNexPvceQZ0Mj5Zzm1KGFcghoU/QY7YRXb1CMRv8MlXa+lkdqY7H1ewQU7bxoe+tZ65nMEFT0RHm/VvqGme0VCMPsqQpCsE61ygd9UPlNqK5B38G99c84zmrgtJ1kPnz0AqrhlAvURVGIrqQ+pbLgVL2A2a0MDoAhoG0l2legxhTwyR3OUCGvcQ6XXEocEK0hulDDtzG6/RPT9XWcJHUWbXybTpagxiY1VKmhznmRIEsO58t15mXrvl9ibrPsMKYZARsaaGjnEnQeJE/91d1kctAHJuKaNWGZxrBFm51WOdvUtZzQjFXd1zNPSrkCdu1v7BfgEyiEoWQnsgAAAABJRU5ErkJggg==')",
        },
        {
          label: "English",
          value: "en",
          icon: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAASCAYAAABfJS4tAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAOqSURBVHgB1ZRLbFRVGMd/c++5z3l1pgN0RoaX0opoEGKM6NLHggTRhS6MOzdu2Lhy4YK1j41bTSTRRFRiDAtiGoNg1ISXxoBIAoVpC23HGdppZ+7z3LnXQ4spGxO3nM1N7j33f/7f7/t/Bx60lfu/G08e/tgqivYB4ni3IaNxwninHHjNuN9342SYpqYxkysVp2QUfX7oxLET4u5Pz7xx5KPKxo2Fgm1eIpctWMLQUhipFItN3RDNYrezt9m5POFW65ZTH8Mc28jQEERpireyjD8YMJTJqOk4e6fPXbwruSZ8eXZpR0OrvVIra9SrBW4HQxq1ErNBRrstaRTqbHlzN8OpaeSlK3hffkesxKK8TaBphGFAONfGdl2y/XtWK1wVrrgmt7o+edum4w252fbRTIdhpqHrgtLKEuHXP2Pvfwr79UNU3z1MokQGC2287h38MCSrlhF+yODcefjsnrDrWGSGhVKh14+plV3SNIdQ5eZdoQ4Zw91VY9i6hXf2d5Kpm0RBSGSbBGqPP+gTtTvYpRJRY3TdsedHOKM6cTREKPea0FGMWRlEbB9z8G7PE/daGNu3kH/5JYzx7UhNX3U76HQx44hhuYgZSZbO/wbHv1gTHsQpVpaR6jk2FEwWFY6yYxKnktk7Hltqo7jPNZE3pukf/Ypkdo7I84kLzirjwPcU4znsYplwYtu64yc3OVxUCJr5PL5MlZhPueSQy+lE4ZC6LQl++RNz4hFG3nkbsW0ziWPTn55lMK+aRka2aQNiZYX+2Qvw7T3Hb+0y+fD5Z5n21elSvdAEIwWbHY0KdUfgLC2SXDNJbswQnPmVpDVDFMVrjIWG31cJabdxKlWCem3dsX/yFL1Pj/PQ4+O4mzdjuQ5CJnC9RW9xmUCxtXftROzYirvvCeyn96rmBfRbswjFWMiYrFbFUgnqTp6Cb/5NxcEX2XToIGKhgxFLTCGwRsrYjTpmuQSqSclf14ku/oH8/ke6771PLCOVY5dQY43xrXnsaoVoa+M+xz/8xPwnx8hv27r60XIcdFWq1l1CV4Ng79uDNfEwxmPjWAdeIFYuvV6PQDUsWlwiURNoVUYoqqlcVtg4cWxNOFZl2K+9ipVkKnYVDJVnQw2Lrp5I1bjOHeZutvj7zGl6M7fbvu9f9WQy05dBOwilL2Vs6WnWHDXtR7X7HV+dnDzamjylVTVjwhV6U6HQVAMH0tDbcY5rHulUmKYXUl2c/qB1ZeE/byoPjtTzJg/k+gedoqvOUi6NYwAAAABJRU5ErkJggg==')",
        },
      ],
    },
    "Jazyk / Language",
    { confirm: "Uložit", secondary: "null", cancel: "null" },
  );
  TangleMsgBox.alert(`Vybral jsi: ${vybrano}`);
};

const telIcon =
  "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAICSURBVHgBvZZPLztBGMe/s20Tv19FSlzc6hXg6qQcHRBvQOIF6MFBkOw2cXDTvgIu7nVxQ10c2RM3W6cmHCyxtcp2zTO1q6zN6tb0k0wyf9r57DzzJw/Dd9buppBw5+BiHgxZxEMXxXEK2B6ptg8wv5Y3Mkj3q4Cbx5/CirCeCiiOmp9CIUuf8No45KDDsnIkVURTrEyaDGLuloOvcK2WRSJhoBcwJ6dwmYpe0WTzSa7loXQRl6WJPuzM9kOvveHUaKBivIryI0yZY9i4jW/jGKtDyGYSX+fdvAv9vYIumBpNBWRRdCVcmfwX6NNrDqQJb+6Dk9+YEoX5QwuFY+tLX/nyBdKExN657ddN20X5qgGpQnUm7ddpdabdhDShOp0W95Comk0e3nrkfyKFdPRPljNi8u8ybfq/3y4cWVzqRE2HZNgAHfk8L949I/ED7dGljd3FAdH2Zfzg7F3Y+A2hL8395jAyfSzQTwejvZ9k2i9C6REaUnobf8KTkXhh/7EjGREaUnqI28PmQaLSWR3FMzvyRHYkpBdf/RBQqVw3+Ee8insWR+TBsH5rdJEsdYpOe3iA3sGFilNGr+Bpo4KtkQoPaQmycZslylFb1yKZ0tBKXmWho/6sUaUl1AZNpFI5KSullX3kpNQMPiUibVQ0PjSGuLmqiypP0Q6guGWxZW28A3tYyZpMQSKhAAAAAElFTkSuQmCC')";

document.getElementById("contact").onclick = async () => {
  const vybrano = await TangleMsgBox.choose(
    "",
    {
      defaultValue: "",
      options: [
        { label: "Technická podpora", value: "techtel", icon: telIcon },
        { label: "Obchodní konzultant", value: "obchtel", icon: telIcon },
      ],
    },
    "Jazyk / Language",
    { confirm: "null", secondary: "null", cancel: "null" },
  );

  switch (vybrano) {
    case "techtel":
      window.open("tel:+420606060606");
    case "obchtel":
      window.open("tel:+420880880880");
  }
};

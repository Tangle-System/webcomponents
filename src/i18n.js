import I18 from "i18next";

const i18 = I18.createInstance();

const cs = {
  translation: {
    "Zadejte platnou hodnotu": "Zadejte platnou hodnotu",
    Potvrdit: "Potvrdit",
    Zrušit: "Zrušit",
    Zpět: "Zpět",
  },
};

const en = {
  translation: {
    "Zadejte platnou hodnotu": "Enter valid value",
    Potvrdit: "Confirm",
    Zrušit: "Back",
    Zpět: "Zpět",
  },
};

i18.init(
  {
    fallbackLng: "en",
    debug: true,
    resources: {
      cs: cs,
      "cs-CZ": cs,
      en: en,
      "en-US": en,
    },
    keySeparator: "__",
    contextSeparator: "__",
  },
  (err, t) => {
    // TEST
    // console.log({ langs: { cs, en } });
    // console.log("webcomponents translation", "Zpět", t("Zpět"));
  },
);

// i18.changeLanguage("en");
export { i18 as i18webcomponents };

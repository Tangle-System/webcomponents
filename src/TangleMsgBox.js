import { i18webcomponents } from "./i18n";
const { t } = i18webcomponents;
// TODO handle confirm, cancel text HERE instead in sveltecomponent
i18webcomponents.on("languageChanged", lang => {
  console.log("Current language", lang);
});

/**
 * @type {string}
 */
export class TangleMsgBox {
  /**
   * @param {string} stringWithStyles
   */
  static setStyles(stringWithStyles) {
    window.___tangleMsgBoxStyles = stringWithStyles;
  }

  static async create(title, content, type, { confirm, cancel }) {
    const dialogBox = document.createElement("tangle-modal");
    // dialogBox.setAttribute("styles", styles);
    dialogBox.setAttribute("title", title);
    dialogBox.setAttribute("content", content);
    dialogBox.setAttribute("type", type);
    confirm && dialogBox.setAttribute("confirm", confirm);
    cancel && dialogBox.setAttribute("cancel", cancel);
    document.body.appendChild(dialogBox);

    return new Promise((resolve, reject) => {
      dialogBox.addEventListener("submit", function submit(e) {
        resolve(e.detail);
        dialogBox.removeEventListener("submit", submit);
      });
    });
  }

  /**
   * @param {string} content
   * @param {string} title
   * @returns {Promise<true>}
   * Creates the alert dialog element
   */
  static async alert(content, title = "", { confirm } = { confirm: "Ok" }) {
    const dialogBox = document.createElement("tangle-modal");
    // dialogBox.setAttribute("styles", styles);

    dialogBox.setAttribute("title", title);
    dialogBox.setAttribute("content", content);
    dialogBox.setAttribute("type", "alert");
    confirm && dialogBox.setAttribute("confirm", confirm);
    document.body.appendChild(dialogBox);

    return new Promise((resolve, reject) => {
      dialogBox.addEventListener("submit", function submit(e) {
        resolve(e.detail);
        dialogBox.removeEventListener("submit", submit);
      });
    });
  }
  /**
   * @param {string} content
   * @param {string} title
   * @returns {Promise<boolean>}
   * Creates the confirm dialog element
   */
  static async confirm(content, title = "", { confirm, cancel, secondary } = {}) {
    const dialogBox = document.createElement("tangle-modal");

    dialogBox.setAttribute("title", title);
    dialogBox.setAttribute("content", content);
    dialogBox.setAttribute("type", "confirm");

    dialogBox.setAttribute("confirm", confirm || t("Potvrdit"));
    dialogBox.setAttribute("cancel", cancel || t("Zrušit"));
    (secondary || secondary === "") && dialogBox.setAttribute("secondary", secondary);

    document.body.appendChild(dialogBox);

    return new Promise((resolve, reject) => {
      dialogBox.addEventListener("submit", function submit(e) {
        resolve(e.detail);
        dialogBox.removeEventListener("submit", submit);
      });
    });
  }
  /**
   * @param {string} content
   * @param {string} title
   * @param {'number'|'text'|'string'|RegExp} inputtype
   * @returns {Promise<string>}
   * Creates the confirm dialog element
   */
  static async prompt(
    content,
    value,
    title = "",
    inputtype,
    { placeholder, min, max, regex, invalidText, maxlength } = { placeholder: undefined, min: undefined, max: undefined, regex: undefined, maxlength: undefined },
    { confirm, cancel } = {},
  ) {
    const dialogBox = document.createElement("tangle-modal");
    // dialogBox.setAttribute("styles", styles);
    dialogBox.setAttribute("value", value);
    title && dialogBox.setAttribute("title", title);
    content && dialogBox.setAttribute("content", content);
    maxlength > 1 && dialogBox.setAttribute("maxlength", maxlength);
    dialogBox.setAttribute("type", "prompt");
    dialogBox.setAttribute("inputtype", inputtype);

    typeof min === "number" && dialogBox.setAttribute("min", min);
    typeof max === "number" && dialogBox.setAttribute("max", max);

    placeholder && dialogBox.setAttribute("placeholder", placeholder);
    /*(confirm || confirm === "") &&*/ dialogBox.setAttribute("confirm", confirm || t("Potvrdit"));
    /*(cancel || cancel === "")  && */ dialogBox.setAttribute("cancel", cancel || t("Zrušit"));
    regex && dialogBox.setAttribute("regex", regex);
    invalidText && dialogBox.setAttribute("invalidtext", invalidText);

    document.body.appendChild(dialogBox);

    return new Promise((resolve, reject) => {
      dialogBox.addEventListener("submit", function submit(e) {
        resolve(e.detail);
        dialogBox.removeEventListener("submit", submit);
      });
    });
  }

  static async choose(content, { defaultValue, options }, title = "", { confirm, cancel } = {}) {
    const dialogBox = document.createElement("tangle-modal");
    // dialogBox.setAttribute("styles", styles);
    dialogBox.setAttribute("type", "choose");
    title && dialogBox.setAttribute("title", title);
    content && dialogBox.setAttribute("content", content);

    defaultValue && dialogBox.setAttribute("defaultvalue", defaultValue);
    options && dialogBox.setAttribute("jsonoptions", JSON.stringify(options));

    dialogBox.setAttribute("confirm", confirm || t("Potvrdit"));
    dialogBox.setAttribute("cancel", cancel || t("Zrušit"));

    document.body.appendChild(dialogBox);

    return new Promise((resolve, reject) => {
      dialogBox.addEventListener("submit", function submit(e) {
        resolve(e.detail);
        dialogBox.removeEventListener("submit", submit);
      });
    });
  }
}


export function initGlobals() {
  window.TangleMsgBox = TangleMsgBox;

  window.prompt = TangleMsgBox.prompt;
  window.confirm = TangleMsgBox.confirm;
  window.alert = TangleMsgBox.alert;
}


// use without initializing class
// const tangleMsgBoxLegacy = new TangleMsgBox();
// export { tangleMsgBoxLegacy };

// import {tangleMsgBoxLegacy as TangleMsgBox} from '....'

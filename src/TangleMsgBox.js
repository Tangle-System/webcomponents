
export class TangleMsgBox {

  static async create(title, content, type, { confirm, cancel }) {
    const dialogBox = document.createElement("tangle-modal");
    dialogBox.setAttribute('title', title)
    dialogBox.setAttribute('content', content)
    dialogBox.setAttribute('type', type)
    confirm && dialogBox.setAttribute('confirm', confirm)
    cancel && dialogBox.setAttribute('cancel', cancel)
    document.body.appendChild(dialogBox);

    return new Promise((resolve, reject) => {
      dialogBox.addEventListener('submit', function submit(e) {
        resolve(e.detail)
        dialogBox.removeEventListener('submit', submit)
      })
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
    dialogBox.setAttribute('title', title)
    dialogBox.setAttribute('content', content)
    dialogBox.setAttribute('type', 'alert')
    confirm && dialogBox.setAttribute('confirm', confirm)
    document.body.appendChild(dialogBox);

    return new Promise((resolve, reject) => {
      dialogBox.addEventListener('submit', function submit(e) {
        resolve(e.detail)
        dialogBox.removeEventListener('submit', submit)
      })
    });
  }
  /**
   * @param {string} content
   * @param {string} title
   * @returns {Promise<boolean>}
   * Creates the confirm dialog element
   */
  static async confirm(content, title = "", { confirm, cancel } = { confirm: "Potvrdit", cancel: "Zrušit" }) {
    const dialogBox = document.createElement("tangle-modal");
    dialogBox.setAttribute('title', title)
    dialogBox.setAttribute('content', content)
    dialogBox.setAttribute('type', 'confirm')
    confirm && dialogBox.setAttribute('confirm', confirm)
    cancel && dialogBox.setAttribute('cancel', cancel)
    document.body.appendChild(dialogBox);

    return new Promise((resolve, reject) => {
      dialogBox.addEventListener('submit', function submit(e) {
        resolve(e.detail)
        dialogBox.removeEventListener('submit', submit)
      })
    });
  }
  /**
   * @param {string} content
   * @param {string} title
   * @param {'number'|'text'|'string'|RegExp} inputtype
   * @returns {Promise<string>}
   * Creates the confirm dialog element
   */
  static async prompt(content, value, title = "", inputtype, { placeholder, min, max, regex, invalidText } = { placeholder: undefined, min: undefined, max: undefined, regex: undefined }, { confirm, cancel } = { confirm: "Potvrdit", cancel: "Zrušit" }) {
    const dialogBox = document.createElement("tangle-modal");
    dialogBox.setAttribute('value', value)
    title && dialogBox.setAttribute('title', title)
    content && dialogBox.setAttribute('content', content)
    dialogBox.setAttribute('type', 'prompt')
    dialogBox.setAttribute('inputtype', inputtype)

    typeof min === 'number' && dialogBox.setAttribute('min', min)
    typeof max === 'number' && dialogBox.setAttribute('max', max)

    placeholder && dialogBox.setAttribute('placeholder', placeholder)
    confirm && dialogBox.setAttribute('confirm', confirm)
    cancel && dialogBox.setAttribute('cancel', cancel)
    regex && dialogBox.setAttribute('regex', regex)
    invalidText && dialogBox.setAttribute('invalidtext', invalidText)

    document.body.appendChild(dialogBox);

    return new Promise((resolve, reject) => {
      dialogBox.addEventListener('submit', function submit(e) {
        resolve(e.detail)
        dialogBox.removeEventListener('submit', submit)
      })
    });
  }
}

window.TangleMsgBox = TangleMsgBox;

window.prompt = TangleMsgBox.prompt;
window.confirm = TangleMsgBox.confirm;
window.alert = TangleMsgBox.alert;
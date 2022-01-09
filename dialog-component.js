class TangleMsgBoxElement extends HTMLElement {
  /**
   * Constructor
   * build() method will be called from here
   */
  constructor() {
    super();
    this.build();
  }
  /**
   * Build the web component
   */
  build() {
    this.attachShadow({ mode: "open" });
    //---------- Build the modal window
    const modalWindow = document.createElement("div");
    modalWindow.classList.add("tangle-msg-box-modal");
    //---------- Build the dialog window
    const dialogElm = document.createElement("div");
    const dialogHeaderElm = document.createElement("div");
    const dialogBodyElm = document.createElement("div");
    const dialogFooterElm = document.createElement("div");
    dialogElm.classList.add("tangle-msg-box-dialog");
    dialogHeaderElm.classList.add("tangle-msg-box-dialog-header");
    dialogBodyElm.classList.add("tangle-msg-box-dialog-body");
    dialogFooterElm.classList.add("tangle-msg-box-dialog-footer");
    dialogBodyElm.append(document.createElement("p"));
    dialogElm.append(dialogHeaderElm, dialogBodyElm, dialogFooterElm);
    modalWindow.append(dialogElm);
    //---------- Styling
    const style = document.createElement("style");
    style.textContent = this.setStyle();
    this.shadowRoot.append(style, modalWindow);
    //---------- Set default
    this.setDefault();
  }
  /**
   * Create the styling
   */
  setStyle() {
    const padding = "1em";
    return `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

    * {
      font-family: 'Poppins', sans-serif;
    }

    .tangle-msg-box-modal {
      font-family: inherit;
      font-size: inherit;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: auto;
      position: fixed;
      top: 0;
      left: 0;
    }
    
    .tangle-msg-box-dialog {
      width: calc(100% - 2em);
      max-width: 400px;
      overflow: hidden;
      box-sizing: border-box;
      box-shadow: 0 0.5em 1em rgba(0, 0, 0, 0.5);
      border-radius: 10px;
      animation: msg-box-dialog-show 265ms cubic-bezier(0.18, 0.89, 0.32, 1.28)
    }
    
    .tangle-msg-box-dialog.tangle-msg-box-dialog-hide {
      opacity: 0;
      animation: msg-box-dialog-hide 265ms ease-in;
    }
    
    @keyframes msg-box-dialog-show {
      0% {
        opacity: 0;
        transform: translateY(-100%);
      }
      100% {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    @keyframes msg-box-dialog-hide {
      0% {
        opacity: 1;
        transform: translateX(0);
      }
      100% {
        opacity: 0;
        transform: translateY(-50%);
      }
    }
    
    .tangle-msg-box-dialog-header {
      color: inherit;
      background-color: rgba(0, 0, 0, 0.05);
      padding: ${padding};
      border-bottom: solid 1px rgba(0, 0, 0, 0.15);
    }
    
    .tangle-msg-box-dialog-body {
      color: inherit;
      padding: ${padding};
    }
    
    .tangle-msg-box-dialog-body > p {
      color: inherit;
      padding: 0;
      margin: 0;
    }
    
    .tangle-msg-box-dialog-footer {
      color: inherit;
      display: flex;
      justify-content: stretch;
    }
    
    .tangle-msg-box-dialog-button {
      color: inherit;
      font-family: inherit;
      font-size: inherit;
      background-color: rgba(0, 0, 0, 0);
      width: 100%;
      padding: 1em;
      border: none;
      border-top: solid 1px rgba(0, 0, 0, 0.15);
      outline: 0;
      border-radius: 0px;
      transition: background-color 225ms ease-out;
    }
    
    .tangle-msg-box-dialog-button:focus {
      background-color: rgba(0, 0, 0, 0.05);
    }
    
    .tangle-msg-box-dialog-button:active {
      background-color: rgba(0, 0, 0, 0.15);
    }
    
    .tangle-msg-box-dialog-textbox {
      color: inherit;
      font-family: inherit;
      font-size: inherit;
      width: 100%;
      padding: 0.5em;
      border: solid 1px rgba(0, 0, 0, 0.15);
      margin-top: ${padding};
      outline: 0;
      box-sizing: border-box;
      border-radius: 0;
      box-shadow: 0 0 0 0 rgba(13, 134, 255, 0.5);
      transition: box-shadow 125ms ease-out, border 125ms ease-out;
    }
    
    .tangle-msg-box-dialog-textbox:focus {
      border: solid 1px rgba(13, 134, 255, 0.8);
      box-shadow: 0 0 0.1em 0.2em rgba(13, 134, 255, 0.5);
    }
    
    .tangle-msg-box-modal {
      background-color: rgba(31, 31, 31, 0.5);
    }
    
    .tangle-msg-box-dialog {
      color: white;
      background-color: black;
    }
    
    .tangle-msg-box-dialog-textbox {
      background-color: #2f2f2f;
    }
    .tangle-msg-box-dialog-header {
      background: #191919;
    }
    .tangle-msg-box-dialog-button{
      margin:10px;
      border-radius: 20px;
      background: #191919 !important;
      cursor: pointer;
    }
    .tangle-msg-box-dialog-button:hover{
      background: #262626 !important;
    }
    .tangle-msg-box-dialog-button:last-of-type {
      background: #FF257E !important;
    }
    .tangle-msg-box-dialog-button:last-of-type:hover {
      background: #FF4A94 !important;
    }
  `;
  }
  /**
   * Set the default value of the dialog box
   */
  setDefault() {
    let content = this.dataset.content;
    let title = this.dataset.title;
    let type = this.dataset.type;
    if (typeof content === "undefined" || typeof type === "undefined") {
      // Dialog will be built if these two datatypes are existing
      // as HTML attributes. This is to prevent calling the dialog
      // builders twice when the dialog was call from javascript.
      return;
    }
    if (typeof title === "undefined") {
      title = null;
    }
    switch (type) {
      case "alert":
        this.setAlert(content, title);
        break;
      case "confirm":
        this.setConfirm(content, title);
        break;
      case "prompt":
        this.setPrompt(content, title);
        break;
    }
  }
  /**
   * Put the title and the content of the dialog box.
   */
  createDialog(content, title) {
    const dialogHeaderElm = this.shadowRoot.querySelector(".tangle-msg-box-dialog-header");
    const dialogBodyElm = this.shadowRoot.querySelector(".tangle-msg-box-dialog-body > p");
    dialogBodyElm.innerHTML = content;
    if (title === null) {
      dialogHeaderElm.remove();
    } else {
      dialogHeaderElm.innerHTML = title;
    }
  }
  /**
   * Execute "animationend" event of the dialog, then dispose
   */
  disposeDialog() {
    const self = this;
    const dialogElm = self.shadowRoot.querySelector(".tangle-msg-box-dialog");
    dialogElm.classList.add("tangle-msg-box-dialog-hide");
    dialogElm.addEventListener("animationend", function dialogElmAnimationEnd(evt) {
      if (evt.animationName === "msg-box-dialog-hide") {
        dialogElm.removeEventListener("animationend", dialogElmAnimationEnd);
        self.remove();
      }
    });
  }
  /**
   * Creates the alert dialog element
   */
  setAlert(content, title) {
    const self = this;
    self.createDialog(content, title);
    const dialogFooterElm = self.shadowRoot.querySelector(".tangle-msg-box-dialog-footer");
    const dialogConfirmBtn = document.createElement("button");
    dialogConfirmBtn.classList.add("tangle-msg-box-dialog-button");
    dialogConfirmBtn.innerText = "Potvrdit";
    dialogFooterElm.append(dialogConfirmBtn);
    dialogConfirmBtn.focus();
    return new Promise(function (resolve) {
      dialogConfirmBtn.addEventListener("click", function dialogConfirmBtnClick() {
        dialogConfirmBtn.removeEventListener("click", dialogConfirmBtnClick);
        self.disposeDialog();
        resolve(true);
      });
    });
  }
  setConfirm(content, title) {
    const self = this;
    self.createDialog(content, title);
    const dialogFooterElm = self.shadowRoot.querySelector(".tangle-msg-box-dialog-footer");
    const dialogCancelBtn = document.createElement("button");
    const dialogConfirmBtn = document.createElement("button");
    dialogCancelBtn.classList.add("tangle-msg-box-dialog-button");
    dialogCancelBtn.innerText = "Zrušit";
    dialogConfirmBtn.classList.add("tangle-msg-box-dialog-button");
    dialogConfirmBtn.innerText = "Potvrdit";
    dialogFooterElm.append(dialogCancelBtn, dialogConfirmBtn);
    dialogCancelBtn.focus();
    return new Promise(function (resolve) {
      dialogCancelBtn.addEventListener("click", function dialogCancelBtnClick() {
        this.removeEventListener("click", dialogCancelBtnClick);
        self.disposeDialog();
        resolve(false);
      });
      dialogConfirmBtn.addEventListener("click", function dialogCancelBtnClick() {
        this.removeEventListener("click", dialogCancelBtnClick);
        self.disposeDialog();
        resolve(true);
      });
    });
  }
  /**
   * Creates the prompt dialog element
   */
  setPrompt(content, title) {
    const self = this;
    self.createDialog(content, title);
    // Create Textbox and put into the dialog body.
    const dialogBodyElm = self.shadowRoot.querySelector(".tangle-msg-box-dialog-body");
    const dialogMessageTextBoxContainer = document.createElement("p");
    const dialogMessageTextBox = document.createElement("input");
    dialogMessageTextBox.classList.add("tangle-msg-box-dialog-textbox");
    dialogMessageTextBox.type = "text";
    dialogMessageTextBoxContainer.append(dialogMessageTextBox);
    dialogBodyElm.append(dialogMessageTextBoxContainer);
    // Create buttons, and put into the dialog footer.
    const dialogFooterElm = self.shadowRoot.querySelector(".tangle-msg-box-dialog-footer");
    const dialogCancelBtn = document.createElement("button");
    const dialogConfirmBtn = document.createElement("button");
    dialogCancelBtn.classList.add("tangle-msg-box-dialog-button");
    dialogCancelBtn.innerText = "Zrušit";
    dialogConfirmBtn.classList.add("tangle-msg-box-dialog-button");
    dialogConfirmBtn.innerText = "Potvrdit";
    dialogFooterElm.append(dialogCancelBtn, dialogConfirmBtn);
    dialogMessageTextBox.focus();
    // Prompt message textbox KeyPress event
    function dialogMessageTextBoxKeyPress(evt) {
      if (evt.key === "Enter") {
        // If Enter key has been pressed
        dialogConfirmBtn.click();
      }
    }
    dialogMessageTextBox.addEventListener("keypress", dialogMessageTextBoxKeyPress);
    return new Promise(function (resolve) {
      dialogCancelBtn.addEventListener("click", function dialogCancelBtnClick() {
        this.removeEventListener("click", dialogCancelBtnClick);
        dialogMessageTextBox.removeEventListener("keypress", dialogMessageTextBoxKeyPress);
        self.disposeDialog();
        resolve(null);
      });
      dialogConfirmBtn.addEventListener("click", function dialogCancelBtnClick() {
        this.removeEventListener("click", dialogCancelBtnClick);
        dialogMessageTextBox.removeEventListener("keypress", dialogMessageTextBoxKeyPress);
        self.disposeDialog();
        resolve(dialogMessageTextBox.value);
      });
    });
  }
}
// Define the custom element as a web component
customElements.define("tangle-msg-box", TangleMsgBoxElement);
/**
 * Show message box
 */
export default class TangleMsgBox {
  /**
   * @param {string} content
   * @param {string} title
   * @returns {Promise<true>}
   * Creates the alert dialog element
   */
  static async alert(content, title = null) {
    const dialogBox = document.createElement("tangle-msg-box");
    document.body.appendChild(dialogBox);
    return await dialogBox.setAlert(content, title);
  }
  /**
   * @param {string} content
   * @param {string} title
   * @returns {Promise<boolean>}
   * Creates the confirm dialog element
   */
  static async confirm(content, title = null) {
    const dialogBox = document.createElement("tangle-msg-box");
    document.body.appendChild(dialogBox);
    return await dialogBox.setConfirm(content, title);
  }
  /**
   * @param {string} content
   * @param {string} title
   * @returns {Promise<string>}
   * Creates the confirm dialog element
   */
  static async prompt(content, title = null) {
    const dialogBox = document.createElement("tangle-msg-box");
    document.body.appendChild(dialogBox);
    return await dialogBox.setPrompt(content, title);
  }
}

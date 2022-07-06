let SvelteElement = class {
  constructor() {

  }
  attachShadow() {

  }
  connectedCallback() {

  }
  attributeChangedCallback(attr, _oldValue, newValue) {
  }
  disconnectedCallback() {
  }
  $destroy() {
  }
  $on(type, callback) {

  }
  $set($$props) {
  }
}

globalThis.SvelteElement = SvelteElement

if(typeof customElements === "undefined") {
  globalThis.customElements = new function () {
    this.define = function () {
  
    }
    return this;
  }
}


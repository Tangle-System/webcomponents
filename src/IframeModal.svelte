<svelte:options tag="tangle-iframe" immutable={true} />

<script>
  import { createEventDispatcher } from "svelte";
  import { get_current_component, onMount } from "svelte/internal";
  export let value = "";

export let type = "prompt";
export let title = "";
export let content = "";
/**
 * @type {'number'|'text'|'string'} datatype
 */
export let inputtype = "text";

export let placeholder = "";

export let min = -999999999;
export let max = 999999999;
export let maxlength = 999999999;

export let confirm = "Potvrdit";
export let secondary = "";
export let cancel = "Zrušit";
export let regex = /.*/;

export let invalidtext = "Zadejte platnou hodnotu";


const component = get_current_component();
  const svelteDispatch = createEventDispatcher();
  const dispatch = (name, detail) => {
    svelteDispatch(name, detail);
    component.dispatchEvent && component.dispatchEvent(new CustomEvent(name, { detail }));
  };

let modalElement;

  // modalElement.addEventListener('submit',function a(value) {
  //   console.log('Submit wtf')
  //   dispatch("submit", value);

    
  //   // component.remove();
  //   // dialogBox.removeEventListener('submit', a);
  // })

  window.onmessage = function(e) {
    console.log('From iframe' ,e);
    dispatch("submit", value);
    let data = {};
    try {
      data = JSON.parse(e.data);
    } catch (e) {
    }

    if (data?.name === "submit") {
      dispatch("submit", data.detail);
      component.remove();
    }
};

onMount(async () => {
  script = await fetch("dialog-component.js").then(v => v.text());

  modalElement = document.createElement('tangle-modal');
  modalElement.setAttribute('value', value);
  modalElement.setAttribute('type', type);
  modalElement.setAttribute('title', title);
  modalElement.setAttribute('content', content);
  modalElement.setAttribute('inputtype', inputtype);
  modalElement.setAttribute('placeholder', placeholder);
  modalElement.setAttribute('min', min);
  modalElement.setAttribute('max', max);
  modalElement.setAttribute('maxlength', maxlength);
  modalElement.setAttribute('confirm', confirm);
  modalElement.setAttribute('secondary', secondary);
  modalElement.setAttribute('cancel', cancel);
  modalElement.setAttribute('regex', regex);
  modalElement.setAttribute('invalidtext', invalidtext);
  modalElement = modalElement;
  console.log(modalElement)

  t = `
  <!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tangle Modal</title>
</head>
<body>
  ${modalElement ? modalElement.outerHTML : ''}
  ${'<scri'}pt type="module">
    ${script}
  </s${'cript>'}
</body>
</html>
`;
})

  let t = '';
  let script = ``;

</script>

<iframe  title="Lumexum modal" srcdoc={t}></iframe>

<style>
  iframe {
   position: absolute;
   left: 0;
   top: 0;
    border: 0;
    width: 100%;
    height: 100%;
    z-index: 1000000;
  }
</style>
<!-- <tangle-modal></tangle-modal> -->
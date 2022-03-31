<svelte:options tag="tangle-modal" immutable={true} />

<script>
  import { createEventDispatcher } from "svelte";
  import { get_current_component, onMount } from "svelte/internal";
  import {i18webcomponents} from "./i18n";
  const {t} = i18webcomponents;


  const component = get_current_component();
  const svelteDispatch = createEventDispatcher();
  const dispatch = (name, detail) => {
    svelteDispatch(name, detail);
    component.dispatchEvent && component.dispatchEvent(new CustomEvent(name, { detail }));
    if (window.top) {
      window.top.postMessage(JSON.stringify({ name, detail }), "*");
    }
  };

  let inputField;
  onMount(async () => {
    console.log(inputtype);

    value = value || defaultvalue;
    try {
      component.focus();
    } catch {
      // ignore
    }
    const style = document.createElement("style");
    style.innerHTML = `@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');`;
    component.appendChild(style);

    setTimeout(() => {
      if (inputtype.match(/text|email|tel|url/)) {
        try {
          inputField && inputField.focus();
        }catch {
          // ignore
        }
        inputField && inputField.click();
        inputField &&
          setTimeout(() => {
            document.execCommand("selectall", null, false);
          }, 0);
      }
    }, 0);

    return () => style.remove();
  });
  document.addEventListener("keydown", e => {
    e.key === "Enter" && confirmDialog();
    e.key === "Escape" && exitDialog();
  });

  let msgboxDialog;
  let msgboxCloseDialog = false;

  function exitDialog() {
    const dialogElm = msgboxDialog;
    msgboxCloseDialog = true;
    dialogElm.addEventListener("animationend", function dialogElmAnimationEnd(evt) {
      if (evt.animationName === "msg-box-dialog-hide") {
        dialogElm.removeEventListener("animationend", dialogElmAnimationEnd);
        dispatch("submit", undefined);
        component.remove();
      }
    });
  }
  function confirmDialog() {
    if (!invalid) {
      const dialogElm = msgboxDialog;
      msgboxCloseDialog = true;
      dialogElm.addEventListener("animationend", function dialogElmAnimationEnd(evt) {
        if (evt.animationName === "msg-box-dialog-hide") {
          dialogElm.removeEventListener("animationend", dialogElmAnimationEnd);
          dispatch("submit", type === "prompt" || type === "choose" ? value : true);
          component.remove();
        }
      });
    }
  }

  function confirmDialogSecondary() {
    const dialogElm = msgboxDialog;
    msgboxCloseDialog = true;
    dialogElm.addEventListener("animationend", function dialogElmAnimationEnd(evt) {
      if (evt.animationName === "msg-box-dialog-hide") {
        dialogElm.removeEventListener("animationend", dialogElmAnimationEnd);
        dispatch("submit", "secondary");
        component.remove();
      }
    });
  }

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

  export let confirm = "";
  export let secondary = "";
  export let cancel = "";
  export let regex = /.*/;

  export let jsonoptions = "[]";
  export let defaultvalue = "";
  export let value = "";

  function handleChooseOption(v) {
    value = v;
    if (!(confirm && confirm !== "null")) {
      confirmDialog();
    }
  }

  $: options = JSON.parse(jsonoptions);

  $: regexForValidation = new RegExp(regex.toString().slice(1, -1));
  // $: console.log({regex,regexForValidation,value, test: regexForValidation.test(value)})
  export let invalidtext = t("Zadejte platnou hodnotu");

  function validate(value) {
    return regexForValidation.test(value);
  }

  $: invalid = !validate(value);

  // new RegExp('.+\\*.+')

  let confirmBtn;
  let cancelBtn;
</script>

<div class="tangle-msg-box-modal">
  <div bind:this={msgboxDialog} class="tangle-msg-box-dialog" class:tangle-msg-box-dialog-hide={msgboxCloseDialog}>
    <div class="tangle-msg-box-dialog-header">
      <div id="exitElm" on:click={exitDialog}>
        {#if type !== "alert"}
          <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.6">
              <path d="M18.0312 6.01025L6.01037 18.0311" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M18.0312 6.01025L6.01037 18.0311" stroke="url(#paint0_linear_2500_2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M18.0312 18.0312L6.01037 6.01043" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M18.0312 18.0312L6.01037 6.01043" stroke="url(#paint1_linear_2500_2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </g>
            <defs>
              <linearGradient id="paint0_linear_2500_2" x1="18.3847" y1="6.36381" x2="6.36393" y2="18.3846" gradientUnits="userSpaceOnUse">
                <stop stop-color="white" />
                <stop offset="1" stop-color="white" stop-opacity="0" />
              </linearGradient>
              <linearGradient id="paint1_linear_2500_2" x1="17.6776" y1="18.3848" x2="5.65682" y2="6.36399" gradientUnits="userSpaceOnUse">
                <stop stop-color="white" />
                <stop offset="1" stop-color="white" stop-opacity="0" />
              </linearGradient>
            </defs>
          </svg>
        {/if}
      </div>
      {title}
    </div>
    <div class="tangle-msg-box-dialog-body">
      <p>
        {content}
      </p>
      {#if type === "prompt"}
        {#if inputtype === "number"}
          <p style="display: flex; justify-content:center">
            <tangle-number-input {min} {max} {value} on:change={e => (value = e.detail.value)} bind:this={inputField} />
          </p>
        {:else}
          <p>
            {#if invalid}
              <small class="invalidtext">
                {invalidtext}
              </small>
            {/if}
            {#if inputtype === "time"}
              <input {maxlength} type="time" class:invalid {placeholder} class="tangle-msg-box-dialog-textbox" bind:value bind:this={inputField} />
            {:else if inputtype === "date"}
              <input {maxlength} type="date" class:invalid {placeholder} class="tangle-msg-box-dialog-textbox" bind:value bind:this={inputField} />
            {:else if inputtype === "datetime"}
              <input {maxlength} type="datetime" class:invalid {placeholder} class="tangle-msg-box-dialog-textbox" bind:value bind:this={inputField} />
            {:else if inputtype === "password"}
              <input {maxlength} type="password" class:invalid {placeholder} class="tangle-msg-box-dialog-textbox" bind:value bind:this={inputField} />
            {:else if inputtype === "tel"}
              <input {maxlength} type="tel" class:invalid {placeholder} class="tangle-msg-box-dialog-textbox" bind:value bind:this={inputField} />
            {:else if inputtype === "url"}
              <input {maxlength} type="url" class:invalid {placeholder} class="tangle-msg-box-dialog-textbox" bind:value bind:this={inputField} />
            {:else}
              <input {maxlength} type="text" class:invalid {placeholder} class="tangle-msg-box-dialog-textbox" bind:value bind:this={inputField} />
            {/if}
          </p>
        {/if}
      {/if}
      {#if type === "choose" && content !== ""}
        <div style="height:12px;" />
      {/if}
      {#if type === "choose"}
        <div class="choose-box">
          {#each options as o (o.value)}
            <button class="tangle-msg-box-dialog-option option" class:selected={o.value === value} on:click={() => handleChooseOption(o.value)}><span class="icon" style={"background: " + o.icon} />{o.label}</button>
          {/each}
        </div>
      {/if}
    </div>
    <div class="tangle-msg-box-dialog-footer">
      {#if type !== "alert" && !secondary && cancel !== "null"}
        <button class="tangle-msg-box-dialog-button cancel" bind:this={cancelBtn} on:click={exitDialog}>{cancel || t("Zrušit")}</button>
      {/if}
      {#if secondary && secondary !== "null"}
        <button class="tangle-msg-box-dialog-button secondary" on:click={confirmDialogSecondary}>{secondary}</button>
      {/if}
      {#if confirm !== "null"}
        <button class="tangle-msg-box-dialog-button" bind:this={confirmBtn} on:click={confirmDialog}>{confirm || t("Potvrdit")}</button>
      {/if}
    </div>
  </div>
  {@html "<style>" + window.___tangleMsgBoxStyles + "</style>"}
</div>

<style>
  :root {
    --body-bg: #191919;
    --text: #9b9b9b;
  }
  .input {
  }
  * {
    font-family: "Poppins", sans-serif !important;
  }

  .tangle-msg-box-modal {
    font-family: inherit;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: auto;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100000;
    /* user-select: none; */
  }

  .tangle-msg-box-dialog {
    width: calc(100% - 2em);
    max-width: 314px;
    overflow: hidden;
    box-sizing: border-box;
    box-shadow: 0 0.5em 1em rgba(0, 0, 0, 0.5);
    border-radius: 25px;
    animation: msg-box-dialog-show 265ms cubic-bezier(0.18, 0.89, 0.32, 1.28);
    background: #191919;
  }

  .tangle-msg-box-dialog .tangle-msg-box-dialog-header,
  .tangle-msg-box-dialog .tangle-msg-box-dialog-body,
  .tangle-msg-box-dialog .tangle-msg-box-dialog-footer {
    background-color: inherit;
  }

  .tangle-msg-box-dialog-header {
    color: inherit;
    text-align: center;
    font-weight: 500;
    font-size: 16px;
    padding: 16px;
    padding-top: 42px;
    padding-bottom: 0px;
  }

  .tangle-msg-box-dialog-body {
    color: inherit;
    padding-bottom: 24px;
    padding-top: 16px;
  }

  .tangle-msg-box-dialog-body > p {
    text-align: center;
    font-size: 12px;
    color: var(--text);
    line-height: 18px;
    font-weight: 300;
    padding: 0;
    margin: 0;
    margin-left: 22px;
    margin-right: 22px;
    overflow-wrap: break-word;
  }

  .tangle-msg-box-dialog-footer {
    color: inherit;

    display: flex;
    flex-direction: column-reverse;
    justify-content: stretch;
    padding-left: 22px;
    padding-right: 22px;
    padding-bottom: 20px;
  }

  .tangle-msg-box-dialog-button {
    color: inherit;
    font-family: inherit;
    font-size: inherit;
    background-color: rgba(0, 0, 0, 0);
    width: 100%;
    max-width: 100%;
    margin-top: 8px;
    padding: 16px;
    padding-top: 14.5px;
    padding-bottom: 14.5px;
    border: none;
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
    width: 100%;
    margin-top: 16px;
    transition: border 125ms ease-out, border 125ms ease-out;
    border-radius: 10px;
    background: #303030;
    padding: 13px 0px;
    border: none;
    text-align: center;
    font-family: "Poppins", sans-serif;
    -moz-appearance: textfield;
    font-size: 16px;
    font-weight: 500;
    color: white;
    margin-bottom: -10px !important;
    outline: none !important;
  }

  .tangle-msg-box-dialog-textbox:focus {
    /* box-shadow: 0 0 0.1em 0.2em rgba(13, 134, 255, 0.5); */
    box-shadow: none;
  }

  .tangle-msg-box-modal {
    background-color: rgba(31, 31, 31, 0.5);
  }

  .tangle-msg-box-dialog {
    color: white;
  }

  .tangle-msg-box-dialog-textbox {
    background-color: #2f2f2f;
  }
  .tangle-msg-box-dialog-header {
    background: #191919;
  }

  /* Zpet button */
  .tangle-msg-box-dialog-button {
    border-radius: 20px;
    font-weight: 500;
    font-size: 14px;
    color: #777777 !important;
    cursor: pointer;
  }
  .tangle-msg-box-dialog-button:hover {
    color: white;
  }
  /* Pokračovat button */
  .tangle-msg-box-dialog-button:last-of-type {
    background: #ff257e !important;
    color: white !important;
  }
  .tangle-msg-box-dialog-button:last-of-type:hover {
    background: #ff4a94 !important;
  }
  .tangle-msg-box-dialog-button.cancel {
    margin-bottom: -10px;
  }
  .tangle-msg-box-dialog-option {
    color: inherit;
    font-family: inherit;
    font-size: inherit;
    background-color: rgba(0, 0, 0, 0);
    width: 100%;
    max-width: 100%;
    margin-top: 8px;
    padding: 16px;
    padding-top: 14.5px;
    padding-bottom: 14.5px;
    border: none;
    outline: 0;
    border-radius: 0px;
    transition: background-color 225ms ease-out;

    /* margin-bottom: -10px; */
    border-radius: 20px;
    font-weight: 500;
    font-size: 14px;
    color: #777777 !important;
    cursor: pointer;
    display: flex;
    background: #303030;
    border: 1px solid transparent;
    align-items: center;
    color: white !important;
  }
  .tangle-msg-box-dialog-option.selected {
    background: #5a5a5a !important;
    border: 1px solid white;
  }

  #exitElm {
    height: 0;
    width: 0;
    margin-top: -30px;
    float: right;
    transform: translateX(-20px);
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

  .invalidtext {
    color: red;
    margin-top: 8px;
    display: block;
  }

  .invalid {
    border: 1px solid red;
  }
  .secondary {
    background: #303030 !important;
    margin-top: 15px;
  }

  .icon {
    width: 20px;
    height: 20px;
    margin-right: 16px;
    display: block;
    /* background-size: 100% 100%; */
    background-repeat: no-repeat;
    background-size: cover !important;
    /* background-size: cover; */
  }
  .choose-box {
    margin-left: 22px;
    margin-right: 22px;
    margin-bottom: -10px;
  }
</style>

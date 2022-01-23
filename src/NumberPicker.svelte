<svelte:options tag="tangle-number-input" immutable={true} />

<script>
  import { createEventDispatcher } from "svelte";
  import { get_current_component } from "svelte/internal";

  export let min = -999999999;
  export let max = 999999999;
  export let value = 0;

  const component = get_current_component();
  const svelteDispatch = createEventDispatcher();
  const dispatch = (name, detail) => {
    svelteDispatch(name, detail);
    component.dispatchEvent && component.dispatchEvent(new CustomEvent(name, { detail }));
  };

  $: dispatch("change", {
    value: value,
  });

  function limitNumber(val) {
    console.log({ val, min, max });
    if (val < min) {
      value = min;
    }
    if (val > max) {
      value = max;
    }
    return val;
  }
  $: limitNumber(value);
</script>

<main>
  <svg width="14" height="21" viewBox="0 0 14 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.620667 10.5L13.6138 0.540707L13.6138 20.4593L0.620667 10.5Z" fill="white" on:click={_ => value > min && value--} />
  </svg>
  <input type="number" bind:value {min} {max} />
  <svg width="14" height="21" viewBox="0 0 14 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.0483 10.5L0.0551758 20.4593L0.0551758 0.540708L13.0483 10.5Z" fill="white" on:click={_ => value < max && value++} />
  </svg>
</main>

<style>
  main {
    display: flex;
    align-items: center;
    margin-top: 16px;
  }
  input {
    margin: 0 13px;
    width: 75.79px;
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
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
</style>

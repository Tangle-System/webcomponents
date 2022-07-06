import DialogModal from "./DialogModal.svelte";
import NumberPicker from "./NumberPicker.svelte";
import { TangleMsgBox,initGlobals } from "./TangleMsgBox";
import { i18webcomponents } from "./i18n.js";

const dialogModal = new DialogModal({});
new NumberPicker({});

// export { dialogModal }

export { TangleMsgBox, i18webcomponents, initGlobals };
export default TangleMsgBox;

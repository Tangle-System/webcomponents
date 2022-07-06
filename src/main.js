import "./init.js"
import DialogModal from "./DialogModal.svelte";
import NumberPicker from "./NumberPicker.svelte";
import { TangleMsgBox } from "./TangleMsgBox";
import { i18webcomponents } from "./i18n.js";

if (typeof window !== "undefined") {
  const dialogModal = new DialogModal({});
  new NumberPicker({});
}




// export { dialogModal }

export { TangleMsgBox, i18webcomponents };
export default TangleMsgBox;

import DialogModal from './DialogModal.svelte';
import NumberPicker from './NumberPicker.svelte';
import IframeModal from './IframeModal.svelte';
import { TangleMsgBox } from './TangleMsgBox';

const dialogModal = new DialogModal({});
new NumberPicker({});
new IframeModal({});

// export { dialogModal }

export { TangleMsgBox };
export default TangleMsgBox
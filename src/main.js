import DialogModal from './DialogModal.svelte';
import NumberPicker from './NumberPicker.svelte';
import { TangleMsgBox } from './TangleMsgBox';

const dialogModal = new DialogModal({});
new NumberPicker({});

// export { dialogModal }

export { TangleMsgBox };
export default TangleMsgBox
import {ref} from "vue";
import {MODE} from "./dialogTypes.js"

export const useDialogState=()=>{
    const mode=ref(MODE.ADD)
    const visible=ref(false)
    const updateMode=(target)=>{
        mode.value=target
    }
    return{
        mode,
        visible,
        updateMode
    }
}

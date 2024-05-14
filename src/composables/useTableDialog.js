import {useDialogState} from "@/composables/useDialogState.js";
import {ref} from "vue";

export const useTableDialog=(tableInstance)=>{
    const { visible, mode, updateMode } = useDialogState();

    const form=ref([])

    const logParams = ref({})

    const closeDialog = () => {
        // tableInstance.value?.resetFields();
        visible.value = false;
    };
    const openDialog = (target, newForm, newParams) => {
        updateMode(target);
        visible.value = true;
        // tableInstance.value?.resetFields();
        // if (typeof newForm!=="undefined" && newForm!==null){
        //     // deep copy
        //     form.value=JSON.parse(JSON.stringify(newForm))
        //     selectedOptions.value=form.value.region?.split(" ")
        // }
        form.value=newForm
        logParams.value=newParams
    };

    const modeText = () => {
        if (mode.value === 'add') return '添加';
        if (mode.value === 'edit') return '编辑';
        if (mode.value === 'readonly') return '详情';
    }

    return{
        visible, mode, openDialog, closeDialog, modeText, form, logParams
    }
}

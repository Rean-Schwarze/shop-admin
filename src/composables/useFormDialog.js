import {useDialogState} from "@/composables/useDialogState.js";
import {ref} from "vue";

export const useFormDialog=(formInstance)=>{
    const { visible, mode, updateMode } = useDialogState();

    const form=ref({
        receiver:'',
        contact:'',
        region:'',
        address:'',
        isDefault:false,
        id:-1
    })

    const selectedOptions = ref([])

    const closeDialog = () => {
        formInstance.value?.resetFields();
        visible.value = false;
    };
    const openDialog = (target, newForm) => {
        updateMode(target);
        visible.value = true;
        formInstance.value?.resetFields();
        if (typeof newForm!=="undefined" && newForm!==null){
            // deep copy
            form.value=JSON.parse(JSON.stringify(newForm))
            selectedOptions.value=form.value.region?.split(" ")
        }
    };

    const modeText = () => {
        if (mode.value === 'add') return '添加';
        if (mode.value === 'edit') return '编辑';
        if (mode.value === 'readonly') return '详情';
    }

    return{
        visible, mode, openDialog, closeDialog, modeText, form, selectedOptions
    }
}

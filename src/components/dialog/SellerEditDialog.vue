<script setup>
import {ref} from "vue";
import CommonDialog from "@/components/dialog/CommonDialog.vue";
import {MODE} from "@/composables/dialogTypes.js";
import {useFormDialog} from "@/composables/useFormDialog.js";
import {ElMessage} from "element-plus";
import {resetSellerPasswordAPI} from '@/apis/admin.js'
const formRef=ref(null)

const { visible, mode, closeDialog, openDialog, form } = useFormDialog(formRef)

defineExpose({
  openDialog
})

const rules={
  newPassword:[
    {required:true,message:'密码不能为空',trigger:"blur"},
    {min:6,max:14,message:'密码长度为6~14字符',trigger:"blur"}
  ],
}

const confirm = async () => {
  // if (!formRef.value) return;
  let id=form.value.value.id
  let newPassword=form.value.value.newPassword
  const res=await resetSellerPasswordAPI({id,newPassword})
  if(res.code===1){
    ElMessage.success("重置密码成功！")
  }
  else{
    ElMessage.error(res.message)
  }
  closeDialog()
}

const customClose = () => {
  closeDialog()
}

const emits = defineEmits(['update'])  //定义一个变量来接收父组件传来的方法
const handleUpdate = () => {
  emits('update')
}
</script>

<template>
  <CommonDialog
      :before-close="customClose"
      @confirm="confirm"
      v-model="visible"
      title="重置密码"
      :confirm-text="mode === MODE.ADD ? '确认' : '修改'"
      style="width: 50%;"
  >
    <div class="addressWrapper">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="left" label-width="100px"
               status-icon>
        <el-form-item prop="newPassword" label="新密码">
          <el-input v-model="form.value.newPassword" size="large" type="password"/>
        </el-form-item>
      </el-form>
    </div>

  </CommonDialog>
</template>

<style scoped lang="scss">
.addressWrapper {
  max-height: 500px;
  overflow-y: auto;
  padding-top: 30px;
  padding-left: 15px;
  padding-right: 25px;

  .input{
    text-align: center;
    margin: auto;
    display: inline-flex;
  }

  .pagination-container {
    padding-top: 10px;
    display: flex;
    justify-content: center;
  }
}
</style>

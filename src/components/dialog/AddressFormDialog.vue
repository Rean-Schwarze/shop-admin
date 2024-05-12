<script setup>
import { ElMessage } from "element-plus";
import {ref} from "vue";
import CommonDialog from "@/components/dialog/CommonDialog.vue";
import {MODE} from "@/composables/dialogTypes.js";
import {useFormDialog} from "@/composables/useFormDialog.js";
import {pcaTextArr} from "element-china-area-data";
import {addAddressAPI,modifyAddressAPI} from "@/apis/user.js";

const formRef=ref(null)
const rules={
  receiver:[
    {required:true,message:'收件人姓名不能为空',trigger:'blur'},
    {pattern:/[^^#*%&',;=?\s$\x22]+/,message:'不能含有非法字符',trigger:'blur'}
  ],
  contact:[
    {required:true,message:'手机号不能为空',trigger:'blur'},
    {pattern:/^\d{11}$/,message:'手机号必须是11位数字',trigger:'blur'}
  ],
  address:[
    {required:true,message:'详细地址不能为空',trigger:'blur'},
    {pattern:/[^^#*%&',;=?\s$\x22]+/,message:'不能含有非法字符',trigger:'blur'}
  ]
}

// 省市区选择
const region=ref("")
const handleChange = () => {
  // if (
  //     selectedOptions.value[0] != null &&
  //     selectedOptions.value[1] != null &&
  //     selectedOptions.value[2] != null
  // ) {
  //   region.value =
  //       codeToText[selectedOptions.value[0]] + ' ' +
  //       codeToText[selectedOptions.value[1]] + ' ' +
  //       codeToText[selectedOptions.value[2]]
  // }
  region.value =
      selectedOptions.value[0] + ' ' +
      selectedOptions.value[1] + ' ' +
      selectedOptions.value[2]
  form.value.region=region
}
const clearRegion=()=>{
  selectedOptions.value=[]
  region.value=""
}

const { visible, mode, closeDialog, openDialog, form, selectedOptions } = useFormDialog(formRef)

defineExpose({
  openDialog
})

const confirm = () => {
  if (!formRef.value) return;
  const {receiver,contact,region,address,isDefault,id}=form.value
  formRef.value.validate(async (valid) => {
    if (valid) {
      // 添加收货地址
      if (mode.value === MODE.ADD) {
        const res = await addAddressAPI({receiver, contact, region, address, isDefault})
        if(res.code===1){
          ElMessage.success("添加收货地址成功！")
          handleUpdate()
        }
        else{
          ElMessage.error(res.message)
        }
      }
      // 修改收货地址
      else if(mode.value===MODE.EDIT){
        const res=await modifyAddressAPI({receiver,contact,region,address,isDefault,id})
        if(res.code===1){
          ElMessage.success("修改收货地址成功！")
          handleUpdate()
        }
        else{
          ElMessage.error(res.message)
        }
      }

      clearRegion()
      closeDialog()
    }
  })
}

const customClose = () => {
  // ElMessage({
  //   message: "取消提交",
  //   type: "info",
  // })
  clearRegion()
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
      title="地址管理"
      :confirm-text="mode === MODE.ADD ? '添加' : '修改'"
  >
    <div class="addressWrapper">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="right" label-width="100px"
               status-icon>
        <el-form-item prop="receiver" style="width: 95%;" label="收件人姓名" :inline="true">
          <el-input v-model="form.receiver"/>
        </el-form-item>
        <el-form-item prop="contact" style="width: 95%;" label="收件人手机" :inline="true">
          <el-input v-model="form.contact"/>
        </el-form-item>
        <el-form-item prop="address" style="width: 95%;" label="收货地址">
          <el-cascader
              size="default" style="padding-bottom: 6px;" placeholder="请选择地区"
              :options="pcaTextArr"
              v-model="selectedOptions"
              @change="handleChange"/>
          <el-input placeholder="请输入详细地址" v-model="form.address"/>
        </el-form-item>
        <el-form-item label="是否默认">
          <el-switch v-model="form.isDefault"></el-switch>
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
}
</style>

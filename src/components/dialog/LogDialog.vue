<script setup>
import {ref} from "vue";
import CommonDialog from "@/components/dialog/CommonDialog.vue";
import {MODE} from "@/composables/dialogTypes.js";
import {useTableDialog} from "@/composables/useTableDialog.js";
import {ElMessage} from "element-plus";
import {useUserStore} from "@/stores/user.js";

const formRef=ref(null)
const userStore=useUserStore();

const { visible, mode, closeDialog, openDialog, form, logParams } = useTableDialog(formRef)

defineExpose({
  openDialog
})

const confirm = async () => {
  // if (!formRef.value) return;
  console.log(logParams)
  // closeDialog()
}

const customClose = () => {
  closeDialog()
}

const handleLogChange=async ()=>{
  const {goods_id,page,pageSize}=logParams.value.value
  const {total,logs}=await userStore.getUserTpAndBuyLog({goods_id,page,pageSize})
  logParams.value.value.total=total
  form.value=logs
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
      title="用户相关日志"
      :confirm-text="mode === MODE.READONLY ? '确认' : '修改'"
  >
    <div class="addressWrapper">
      <el-table :data="form" :table-layout="'auto'" height="450">
        <el-table-column fixed prop="id" label="用户id" align="center"/>
        <el-table-column prop="time" label="操作时间" align="center"/>
        <el-table-column prop="ip" label="IP地址" align="center"/>
        <el-table-column prop="type" label="操作类型" align="center"/>
        <el-table-column prop="value" label="详情" align="center"/>
      </el-table>
      <div class="pagination-container">
        <el-pagination :total="logParams.value.total" :page-size="logParams.value.pageSize" v-model:current-page.sync="logParams.value.page"
                       @current-change="handleLogChange" background layout="prev, pager, next" />
      </div>
    </div>

  </CommonDialog>
</template>

<style scoped lang="scss">
.addressWrapper {
  max-height: 500px;
  overflow-y: auto;
  padding-top: 10px;

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

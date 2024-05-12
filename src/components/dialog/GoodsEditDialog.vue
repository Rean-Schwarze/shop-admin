<script setup>
import {ref} from "vue";
import CommonDialog from "@/components/dialog/CommonDialog.vue";
import {MODE} from "@/composables/dialogTypes.js";
import {useTableDialog} from "@/composables/useTableDialog.js";
import {Edit} from '@element-plus/icons-vue';
import {updateSkuPriceAndInventoryAPI} from '@/apis/user.js'
import {ElMessage} from "element-plus";

const formRef=ref(null)


const { visible, mode, closeDialog, openDialog, form, selectedOptions } = useTableDialog(formRef)

defineExpose({
  openDialog
})

const confirm = async () => {
  // if (!formRef.value) return;
  const res=await updateSkuPriceAndInventoryAPI(form.value[0].goodsId,form.value)
  if(res.code===1){
    ElMessage.success("修改成功！")
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

const editIndex = ref(-1)
const editColumn=ref(-1)
const handleEdit=(scope)=>{
  editIndex.value=scope.$index
  editColumn.value=scope.cellIndex
}
const clearEditIndex=(index,column)=>{
  editIndex.value=index
  editColumn.value=column
}
</script>

<template>
  <CommonDialog
      :before-close="customClose"
      @confirm="confirm"
      v-model="visible"
      title="修改商品属性"
      :confirm-text="mode === MODE.ADD ? '添加' : '修改'"
  >
    <div class="addressWrapper">
      <el-table :data="form">
        <el-table-column prop="id" label="id" align="center"/>
        <el-table-column prop="attrsText" label="具体规格" align="center"/>
        <el-table-column label="价格" align="center">
          <template #default="scope">
            <!-- 双击文字或点击修改图标以更改"show"属性 -->
            <div v-show="scope.$index !== editIndex || scope.cellIndex!==editColumn">
              <span>{{ scope.row.price }}</span>
              <el-button size="small" :icon="Edit" @click="handleEdit(scope)" style="margin-left:10px; padding-left: 8px; padding-right: 8px;"/>
            </div>
            <!-- 失去焦点时更改"show"属性，显示文本 -->
            <el-input
                v-show="scope.$index === editIndex && scope.cellIndex===editColumn"
                v-model="scope.row.price"
                @blur="clearEditIndex(-1,-1)"
                class="input"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="库存" align="center">
          <template #default="scope">
            <!-- 双击文字或点击修改图标以更改"show"属性 -->
            <div v-show="scope.$index !== editIndex || scope.cellIndex!==editColumn">
              <span>{{ scope.row.inventory }}</span>
              <el-button size="small" :icon="Edit" @click="handleEdit(scope)" style="margin-left:10px; padding-left: 8px; padding-right: 8px;"/>
            </div>
            <!-- 失去焦点时更改"show"属性，显示文本 -->
            <el-input
                v-show="scope.$index === editIndex && scope.cellIndex===editColumn"
                v-model="scope.row.inventory"
                @blur="clearEditIndex(-1,-1)"
                class="input"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="salesCount" label="销量" align="center"/>
        <el-table-column prop="salesVolume" label="销售额" align="center"/>
      </el-table>
    </div>

  </CommonDialog>
</template>

<style scoped lang="scss">
.addressWrapper {
  max-height: 500px;
  overflow-y: auto;
  padding-top: 30px;

  .input{
    text-align: center;
    margin: auto;
    display: inline-flex;
  }
}
</style>

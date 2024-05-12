<script setup>
import {ref} from "vue";

// defineProps({
//   visible:{
//     type:Boolean,
//     default:false
//   },
//   // true为添加，false为修改
//   addFlag:{
//     type:Boolean,
//     default:true
//   },
//   id:{
//     type:Number,
//     default:-1
//   }
// })

const form=ref({
  receiver:'',
  contact:'',
  region:'',
  address:'',
  isDefault:false
})
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
</script>

<script>
let resolve = null
export default {
  data() {
    return {
      props: {},
      title: '',
      dialogOption: {},
      component: null,
      visible: true,
      onClose: () => { },
    }
  },
  methods: {
    open({ title, dialogOption, component, props, onClose }) {
      this.title = title
      this.dialogOption = dialogOption
      this.component = component
      this.props = props
      this.visible = true
      this.onClose = onClose
      //异步处理相关逻辑，未来可用
      return new Promise((resolse, reject) => {
        resolve = resolse
      })
    },
    confirm(arg) {
      this.close()
      resolve(arg)
    },
    cancel() {
      this.close()
      resolve()
    },
    close() {
      //调用回调close,回传传入的close方法，销毁组件
      this.visible = false
      this.$emit('close')
    }
  },
};
</script>

<template>
  <el-dialog title="地址管理" width="35%" :visible="visible" @close="handleClose" center>
    <div class="addressWrapper">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="right" label-width="100px"
               status-icon>
        <el-form-item prop="receiver" style="width: 85%;" label="收件人姓名" :inline="true">
          <el-input size="large" v-model="form.receiver"/>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
    <span class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确定</el-button>
    </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.addressWrapper {
  max-height: 500px;
  overflow-y: auto;
}

.text {
  flex: 1;
  min-height: 90px;
  display: flex;
  align-items: center;

  &.item {
    border: 1px solid #f5f5f5;
    margin-bottom: 10px;
    cursor: pointer;

    &.active,
    &:hover {
      border-color: $xtxColor;
      background: lighten($xtxColor, 50%);
    }

    >ul {
      padding: 10px;
      font-size: 14px;
      line-height: 30px;
    }
  }
}

:deep {
  .el-input__suffix {
    .el-input__suffix-inner .el-button {
      color: #00aaf8; // 修改el-button字体颜色
    }
    &-inner {
      flex-direction: row-reverse;
      -webkit-flex-direction: row-reverse;
      display: flex;
    }
  }
}

.el-form-item :deep .el-input__validateIcon {
  display: none;
}
</style>

<script lang="ts" setup>
import {ref,onMounted} from 'vue';
import {useUserStore} from "@/stores/user.js";
import {useCategoryStore} from "@/stores/category.js";
import {ElMessage} from "element-plus";
import {addSellerAPI} from "@/apis/admin.js";
import {useRouter} from "vue-router";
import type {UploadInstance, UploadProps, UploadUserFile} from 'element-plus'
import {useDialog} from "@/composables/useDialog.js";
import {Plus} from '@element-plus/icons-vue'


const userStore=useUserStore();
const categoryStore=useCategoryStore();
const router=useRouter()
onMounted(()=>{
  categoryStore.getCategory(userStore.userInfo.type)
  userStore.getBrands()
})

const formRef=ref(null)
const form=ref({
  name:'',
  password:'',
  brandId:null,
  selectedCategory:null,
  subCategory:[],
  avatar:''
})
const rules={
  name:[
    {required:true,message:'账号名不能为空',trigger:"blur"},
    {pattern:/[^^#*%&',;=?\s$\x22]+/,message:'不能含有非法字符',trigger:'blur'}
  ],
  password:[
    {required:true,message:'密码不能为空',trigger:"blur"},
    {min:6,max:14,message:'密码长度为6~14字符',trigger:"blur"}
  ],
  brandId:[
    {required:true,message:'所属品牌不能为空',trigger:"blur"},
  ]
}

// 头像上传
const uploadRef = ref<UploadInstance>()
const imgList=ref<UploadUserFile[]>([])
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
      dialogVisible.value = true
}
const handleExceed: UploadProps['onExceed'] = () => {
  ElMessage.warning(
      "只能上传一张图片，请删除后重试！"
  )
}
const beforeAvatarUpload:UploadProps['beforeUpload']=(rawFile)=>{
  if (rawFile.type !== 'image/jpeg' && rawFile.type!=='image/png') {
    ElMessage.error('图片必须是.jpg/.png格式')
    return false
  } else if (rawFile.size / 1024 / 1024 > 1) {
    ElMessage.error('图片大小必须小于1MB！')
    return false
  }
  return true
}
const imgUpload=async (info)=>{
  const { file } = info
  const formData = new FormData()
  formData.append('file', file)
  await userStore.uploadAvatar(formData)
}

const handleUpload=()=>{
  uploadRef.value!.submit()
}

const handleSuccess: UploadProps['onSuccess'] = () => {
  handleRegister()
}

const handleRegister=async ()=>{
  const {name,password,brandId,selectedCategory,subCategory}=form.value
  const category=[]
  formRef.value.validate(async (valid)=>{
    // valid:所有表单都通过校验才true
    if(valid){
      const avatar=userStore.avatar
      let children=categoryStore.categoryList.find(obj=>obj.id===selectedCategory).children
      let sub=[]
      subCategory.forEach(obj=>{
        let i={
          id:obj.id
        }
        sub.push(i)
      })
      let tmp={
        id:selectedCategory,
        children:sub,
        isAllSub:subCategory.length===children.length
      }
      category.push(tmp)
      const res=await addSellerAPI({name,password,brandId,category,avatar})
      if(res.code===1){
        ElMessage.success("添加账号成功！")
        await router.replace({path: '/admin/account'})
      }
      else{
        ElMessage.error(res.message)
      }
    }
  })
}
</script>

<template>
  <div class="title">
    <h2>添加账号</h2>
  </div>
  <div class="account-container">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left" label-width="160px"
             status-icon>
      <el-form-item prop="name"  label="账号名">
        <el-input style="height:40px;" placeholder="账号名" v-model="form.name"/>
      </el-form-item>
      <el-form-item prop="password"  label="密码">
        <el-input style="height:40px;" placeholder="密码" v-model="form.password" type="password"/>
      </el-form-item>
      <el-form-item label="头像(<1MB)">
        <el-upload class="avatar-upload" ref="uploadRef"
                   accept=".jpg, .jpeg, .png, .bmp"
                   :http-request="imgUpload"
                   :limit="1"
                   v-model:file-list="imgList"
                   list-type="picture-card"
                   :on-preview="handlePictureCardPreview"
                   :auto-upload="false"
                   :before-upload="beforeAvatarUpload"
                   :on-exceed="handleExceed"
                   :on-success="handleSuccess"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-dialog v-model="dialogVisible" title="图片预览" style="width: 50%;">
        <img class="avatar-btn" :src="dialogImageUrl" alt="Preview Image" />
      </el-dialog>
      <el-form-item prop="brandId"  label="所属品牌">
        <el-select v-model="form.brandId" placeholder="请选择品牌" size="large">
          <el-option v-for="items in userStore.brands" :key="items.id" :label="items.name" :value="items.id"/>
        </el-select>
      </el-form-item>
      <el-form-item prop="category" label="负责分类（一级）">
        <el-radio-group v-model="form.selectedCategory">
          <el-radio v-for="items in categoryStore.categoryList" :value="items.id" class="radio">{{items.name}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="subCategory" label="负责分类（二级）">
        <template v-if="form.selectedCategory!==null">
          <el-checkbox-group v-model="form.subCategory">
            <el-checkbox v-for="children in categoryStore.categoryList.find(obj=>obj.id===form.selectedCategory).children"
                         :value="children.id" :label="children.name" :key="children.id" class="radio">{{children.name}}
            </el-checkbox>
          </el-checkbox-group>
        </template>
        <template v-else>
          <el-text size="small">尚未选择一级分类</el-text>
        </template>
      </el-form-item>
      <el-row justify="end">
        <el-col :span="3">
          <el-button size="large" @click="handleUpload" type="primary">添加</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
.title{
  padding-top: 10px;
  padding-left: 45px;
}
.account-container {
  padding-top: 10px;
  padding-bottom: 30px;
  width: 75%;
  margin: auto;

  .avatar-upload{
    display: flex;
    align-items: center;
    justify-content: center;
    margin: auto;
  }

  .tabs{
    padding-top: 10px;

    .items{
      padding-top: 15px;
      padding-left: 20px;

      .radio{
        padding-right: 40px;
      }

      .table-button{
        padding-top: 10px;
        margin:auto;
      }

      .text{
        padding-top:15px;
        padding-bottom: 15px;
        font-size:16px;
      }
    }

    .success{
      padding-top: 35px;
      margin:auto;
      text-align: center;
      font-size:32px;

      .textLarge{
        padding-top: 15px;
      }

      .icon{
        padding-top: 35px;
      }
    }
  }

  .header{
    padding-top: 10px;
    padding-left: 30px;
    align-items: center;

    .text{
      margin: auto;
      text-align: center;
      display: inline-flex;
    }
  }

  .main{
    padding-top: 10px;

    .table-button{
      padding-top: 10px;
      margin:auto;
    }
  }

  .pagination-container {
    padding-top: 10px;
    display: flex;
    justify-content: center;
  }

  .main-container {
    min-height: 500px;

    .holder-container {
      min-height: 500px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
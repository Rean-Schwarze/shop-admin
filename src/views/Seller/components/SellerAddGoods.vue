<script lang="ts" setup>
import {ElConfigProvider} from "element-plus";
import {onMounted, ref} from 'vue';
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import {useCategoryStore} from "@/stores/category.js";
import {Delete, Plus, Check} from "@element-plus/icons-vue";
import type {UploadInstance, UploadProps, UploadUserFile} from 'element-plus'
import {useUserStore} from "@/stores/user.js";
import {addGoodsAPI} from '@/apis/user'


const userStore=useUserStore()
const categoryStore=useCategoryStore();

onMounted(()=>{
  categoryStore.getCategory()
})

const activeName=ref("0")
const beforeTabLeave=(activeName, oldActiveName)=>{
  // activeName是即将进入的标签页名称name
  // oldActiveName是即将离开的标签页名称name
  if((activeName ==='2' || activeName ==='3' || activeName ==='5') && form.value.category===null){
    ElMessage.error('请先选择商品分类!')
    return false
  }
  if((activeName ==='3' || activeName ==='5') && form.value.specs.length===0){
    ElMessage.error('请先添加商品规格!')
    return false
  }
  if(activeName==='5'&&goods_id.value<=0){
    ElMessage.error('尚未完成商品添加!')
    return false
  }
}
const handlePrev=(index)=>{
  activeName.value=(parseInt(index) - 1).toString()
}
const handleNext=(index)=>{
  activeName.value=(parseInt(index) + 1).toString()
}

const locale=zhCn
const goods_id=ref(0)
// 表单校验（账号名、密码）
// 1. 准备表单对象
const form=ref({
  name:'',
  desc:'',
  isPreSale:false,
  isNew:true,
  isOnSale:true,
  pubTime:'',
  category:null,
  subCategory:[],
  specs:[],
  skus:[]
})
const formRef=ref(null)
// 2. 准备规则对象
const rules={
  name:[
    {required:true,message:'名称不能为空',trigger:'blur'},
    {pattern:/[^^#*%&',;=?$\x22]+/,message:'不能含有非法字符',trigger:'blur'},
    {max:45,message:'名称字数不应超过45',trigger:"blur"}
  ],
  desc:[
    {required:true,message:'描述不能为空',trigger:'blur'},
    {max:512,message:'描述字数不应超过512',trigger:"blur"},
    {pattern:/[^^#*%&',;=?$\x22]+/,message:'不能含有非法字符',trigger:'blur'}
  ],
  category:[
    {required:true,message:'一级分类不能为空',trigger:'blur'},
  ],
  subCategory:[
    {required:true,message:'二级分类不能为空',trigger:'blur'},
    {
      validator:(rule,value,callback)=>{
        // rule:自定义校验逻辑
        // value:当前输入的数据
        // callback:校验处理函数，校验通过时调用
        if(form.value.category===101){
          if(value.length===2 && (value.includes(1002) && value.includes(1003))){
            callback(new Error('参数冲突！'))
          }
          else{
            callback()
          }
        }
        else{
          callback()
        }
      }
    }
  ],
  specs:[
    {required:true,message:'规格不能为空',trigger:'blur'},
  ],
  skus:[
    {required:true,message:'属性不能为空',trigger:'blur'},
  ],
  pubTime:[
    {required:true,message:'上架时间不能为空',trigger:'blur'},
  ]
}
let valuesCount=1
const handleAdd=(index,row,type)=>{
  if(type==='specs'){
    if(form.value.specs.length<=2){
      const specs={
        id:valuesCount++,
        name:'',
        values:[{
          id:valuesCount++,
          name:'',
          desc:''
        }],
      }
      form.value.specs.push(specs)
    }
    else{
      ElMessage.error("目前仅支持最多2种规格")
    }
  }
  else if(type==='specsValues'){
    const value={
      id:valuesCount++,
      name:'',
      desc:''
    }
    let specsIndex=findSpecsIndex(row)
    form.value.specs[specsIndex].values.push(value)
  }
  else if(type==='specsValue'){
    const value={
      id:valuesCount++,
      name:'',
      desc:''
    }
    form.value.specs[index].values.push(value)
  }
  else if(type==='sku'){
    const keymap={
      name:'label',
      id:'value',
      values:'children'
    }
    categoryStore.keyMap(form.value.specs, keymap)
    const sku={
      price:'',
      oldPrice:'',
      inventory:0,
      specs:[],
      selectedSpecs:[
        []
      ]
    }
    if(form.value.specs.length===2){
      sku.selectedSpecs.push([])
    }
    form.value.skus.push(sku)
  }
}
const isValueEmpty=(value)=>{
  let isEmpty = true;
  if (value.name!=='' || value.desc!=='') {
    isEmpty = false;
  }
  return isEmpty;
}
const findSpecsIndex=(row)=>{
  let index=-1
  form.value.specs.forEach(specs=>{
    specs.values.forEach(values=>{
      if(values.id===row.id){
        index=form.value.specs.indexOf(specs)
      }
    })
  })
  return index
}
const findSpecsIndexById=(id:number)=>{
  let index=-1
  form.value.specs.forEach(specs=>{
    if(specs.id===id){
      index=form.value.specs.indexOf(specs)
    }
  })
  return index
}
const findSpecsValueIndexById=(id:number)=>{
  let valueIndex=-1
  let specIndex=-1
  form.value.specs.forEach(specs=>{
    specs.values.forEach(values=>{
      if(values.id===id){
        specIndex=findSpecsIndexById(specs.id)
        valueIndex=form.value.specs[specIndex].values.indexOf(values)
      }
    })
  })
  return valueIndex
}
const handleDelete=(index,row,type)=>{
  if(type==='specs'){
    form.value.specs.splice(index,1)
  }
  else if(type==='specsValues'){
    if(isValueEmpty(row)){
      ElMessage.error("不可删除空值！")
    }
    else{
      let specsIndex=findSpecsIndex(row)
      form.value.specs[specsIndex].values.splice(index,1)
    }
  }
  else if(type==='sku'){
    form.value.skus.splice(index,1)
  }
}

// 上传图片
const uploadDetailRef = ref<UploadInstance>()
const imgDetailList=ref<UploadUserFile[]>([])
const uploadMainRef = ref<UploadInstance>()
const imgMainList=ref<UploadUserFile[]>([])
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
      dialogVisible.value = true
}
const handleExceed: UploadProps['onExceed'] = () => {
  ElMessage.warning(
      "上传图片数量超出限制！（封面图：5/详情图：20）"
  )
}
const beforeAvatarUpload:UploadProps['beforeUpload']=(rawFile)=>{
  if (rawFile.type !== 'image/jpeg' && rawFile.type!=='image/png') {
    ElMessage.error('图片必须是.jpg/.png格式')
    return false
  }
  return true
}


const handleConfirm = async () => {
  const {name,desc,category,specs,skus,isPreSale,isNew,isOnSale,pubTime}=form.value
  const subCategory=form.value.subCategory[0]
  const subCategory2=form.value.subCategory[1]
  skus.forEach(sku=>{
    sku.selectedSpecs.forEach(obj=>{
      let specId=findSpecsIndexById(obj[0])
      let valueId=findSpecsValueIndexById(obj[1])
      const spec={
        name:form.value.specs[specId].name,
        valueName:form.value.specs[specId].values[valueId].name
      }
      sku.specs.push(spec)
    })
  })
  formRef.value.validate(async (valid)=>{
    // valid:所有表单都通过校验才true
    if(valid){
      const res=await addGoodsAPI({name, desc,category,subCategory,subCategory2,specs,skus,isPreSale,isNew,isOnSale,pubTime})
      goods_id.value=res.result
      if (res.code===1){
        uploadMainRef.value!.submit()
        uploadDetailRef.value!.submit()
        ElMessage({ type: 'success', message: '添加商品成功！' })
        handleNext("4")
      }
      else{
        ElMessage.error(res.message)
      }
    }
    else{
      ElMessage.warning("商品信息尚未填写完毕！")
    }
  })
};
const imgMainUpload=async (info)=>{
  const { file } = info
  const goodsId=goods_id.value
  const formData = new FormData()
  formData.append('files', file)
  formData.append('goodsId',goodsId)
  formData.append('type','main')
  await userStore.uploadGoodsImages(formData)
}
const imgDetailUpload=async (info)=>{
  const { file } = info
  const goodsId=goods_id.value
  const formData = new FormData()
  formData.append('files', file)
  formData.append('goodsId',goodsId)
  formData.append('type','detail')
  await userStore.uploadGoodsImages(formData)
}

</script>

<template>
  <div class="goods-container">
    <el-steps :active="activeName-0" finish-status="success" simple>
      <el-step title="基本信息" />
      <el-step title="设置分类" />
      <el-step title="设置规格" />
      <el-step title="设置属性" />
      <el-step title="上传图片" />
      <el-step title="完成" />
    </el-steps>

    <div class="tabs">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="left" label-width="150px"
               status-icon size="large">
        <el-tabs tab-position="left" v-model="activeName" :before-leave="beforeTabLeave">
          <el-tab-pane label="基本信息" name="0">
            <div class="items">
              <el-form-item prop="name"  label="商品名称">
                <el-input v-model="form.name"/>
              </el-form-item>
              <el-form-item prop="desc"  label="商品描述">
                <el-input v-model="form.desc" autosize
                          type="textarea"/>
              </el-form-item>
              <el-form-item prop="pubTime" label="上架时间">
                <el-config-provider :locale="locale">
                  <el-date-picker
                      v-model="form.pubTime"
                      type="datetime"  value-format="YYYY-MM-DD HH:mm:ss" :locale="locale"/>
                </el-config-provider>
              </el-form-item>
              <el-row>
                <el-col :span="8">
                  <el-form-item prop="isPreSale" label="是否为预售商品">
                    <el-switch v-model="form.isPreSale" size="large"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="isNew" label="是否为全新商品">
                    <el-switch v-model="form.isNew" size="large"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="isOnSale" label="是否正式上架">
                    <el-switch v-model="form.isOnSale" size="large"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row justify="end">
                <el-col :span="3">
                  <el-button size="large" @click="handleNext(activeName)">继续</el-button>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="设置分类" name="1">
            <div class="items">
              <el-form-item prop="category" label="一级分类">
                <el-radio-group v-model="form.category">
                  <el-radio v-for="items in categoryStore.categoryList" :value="items.id" class="radio">{{items.name}}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item prop="subCategory" label="二级分类">
                <template v-if="form.category!==null">
                  <el-checkbox-group v-model="form.subCategory" :max="2">
                    <el-checkbox v-for="children in categoryStore.categoryList.find(obj=>obj.id===form.category).children"
                              :value="children.id" :label="children.name" :key="children.id" class="radio">{{children.name}}
                    </el-checkbox>
                  </el-checkbox-group>
                </template>
                <template v-else>
                  <el-text size="small">尚未选择一级分类</el-text>
                </template>
              </el-form-item>
              <el-row justify="space-between">
                <el-col :span="1">
                  <el-button size="large" @click="handlePrev(activeName)">返回上一步</el-button>
                </el-col>
                <el-col :span="3">
                  <el-button size="large" @click="handleNext(activeName)">继续</el-button>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="设置规格" name="2">
            <div class="items">
              <el-row justify="end">
                <el-col :span="3">
                  <el-button size="default" @click="handleAdd(null,null,'specs')">添加规格</el-button>
                </el-col>
              </el-row>
              <el-table :data="form.specs" :table-layout="'auto'">
                <el-table-column prop="name" label="规格名称" align="center">
                  <template #default="scope">
                    <el-input
                        v-model="scope.row.name"
                        class="input"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="具体规格" align="center">
                  <template #default="scope">
                    <el-table :data="scope.row.values">
                      <el-table-column label="具体规格名称" align="center">
                        <template #default="scope">
                          <el-input
                              v-model="scope.row.name"
                              class="input" type="textarea"
                          ></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column label="具体规格描述/备注" align="center">
                        <template #default="scope">
                          <el-input
                              v-model="scope.row.desc"
                              class="input" type="textarea"
                          ></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" align="center">
                        <template #default="scope">
                          <div class="table-button">
                            <el-button size="default" @click="handleAdd(scope.$index, scope.row,'specsValues')" :icon="Plus"></el-button>
                            <el-button
                                size="default"
                                type="danger" :icon="Delete"
                                @click="handleDelete(scope.$index, scope.row,'specsValues')"
                            ></el-button>
                          </div>
                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                  <template #default="scope">
                    <div class="table-button">
                      <el-button size="default" @click="handleAdd(scope.$index,scope.row,'specs')" :icon="Plus">下一规格</el-button>
                    </div>
                    <div class="table-button">
                      <el-button size="default" @click="handleAdd(scope.$index,scope.row,'specsValue')" :icon="Plus">具体规格</el-button>
                    </div>
                    <div class="table-button">
                      <el-button
                          size="default"
                          type="danger" :icon="Delete"
                          @click="handleDelete(scope.$index, scope.row,'specs')"
                      ></el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <el-row justify="space-between" style="padding-top: 10px;">
                <el-col :span="1">
                  <el-button size="large" @click="handlePrev(activeName)">返回上一步</el-button>
                </el-col>
                <el-col :span="3">
                  <el-button size="large" @click="handleNext(activeName)">继续</el-button>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="设置属性" name="3">
            <div class="items">
              <el-row justify="end">
                <el-col :span="3">
                  <el-button size="default" @click="handleAdd(null,null,'sku')">添加属性</el-button>
                </el-col>
              </el-row>
              <el-table :data="form.skus" :table-layout="'auto'">
                <el-table-column label="现价(￥)" align="center">
                  <template #default="scope">
                    <el-input
                        v-model="scope.row.price"
                        class="input"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="原价(￥)" align="center">
                  <template #default="scope">
                    <el-input
                        v-model="scope.row.oldPrice"
                        class="input"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="库存" align="center">
                  <template #default="scope">
                    <el-input-number
                        v-model="scope.row.inventory"
                        :min="1"
                        controls-position="right"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="规格" align="center">
                  <template #default="scope">
                    <el-cascader v-model="scope.row.selectedSpecs[0]" :options="form.specs" :show-all-levels="false"/>
                    <template v-if="form.specs.length===2">
                      <el-cascader v-model="scope.row.selectedSpecs[1]" :options="form.specs" :show-all-levels="false"/>
                    </template>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                  <template #default="scope">
                    <div class="table-button">
                      <el-button size="default" @click="handleAdd(scope.$index, scope.row,'sku')" :icon="Plus"></el-button>
                    </div>
                    <div class="table-button">
                      <el-button
                          size="default"
                          type="danger" :icon="Delete"
                          @click="handleDelete(scope.$index, scope.row,'sku')"
                      ></el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <el-row justify="space-between" style="padding-top: 10px;">
                <el-col :span="1">
                  <el-button size="large" @click="handlePrev(activeName)">返回上一步</el-button>
                </el-col>
                <el-col :span="3">
                  <el-button size="large" @click="handleNext(activeName)">继续</el-button>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="上传图片" name="4">
            <div class="items">
              <div class="text">商品封面图</div>
              <el-upload class="avatar-upload" ref="uploadMainRef"
                         accept=".jpg, .jpeg, .png"
                         :http-request="imgMainUpload"
                         :limit="5"
                         v-model:file-list="imgMainList"
                         list-type="picture-card"
                         :on-preview="handlePictureCardPreview"
                         :auto-upload="false"
                         :before-upload="beforeAvatarUpload"
                         :on-exceed="handleExceed"
                         multiple
              >
                <el-icon><Plus /></el-icon>
              </el-upload>
              <div class="text">商品详情图</div>
              <el-upload class="avatar-upload" ref="uploadDetailRef"
                         accept=".jpg, .jpeg, .png"
                         :http-request="imgDetailUpload"
                         :limit="20"
                         v-model:file-list="imgDetailList"
                         list-type="picture-card"
                         :on-preview="handlePictureCardPreview"
                         :auto-upload="false"
                         :before-upload="beforeAvatarUpload"
                         :on-exceed="handleExceed"
                         multiple
              >
                <el-icon><Plus /></el-icon>
              </el-upload>
              <el-dialog v-model="dialogVisible" title="图片预览">
                <img class="avatar-btn" :src="dialogImageUrl" alt="Preview Image" />
              </el-dialog>
              <el-row justify="space-between" style="padding-top: 10px;">
                <el-col :span="1">
                  <el-button size="large" @click="handlePrev(activeName)">返回上一步</el-button>
                </el-col>
                <el-col :span="4">
                  <el-button size="large" type="primary" @click="handleConfirm">上传商品信息</el-button>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="完成" name="5">
            <div class="success">
              <el-icon size="76" style="color:#1dc779">
                <Check/>
              </el-icon>
              <div class="textLarge">上传成功</div>
              <div class="icon"><el-button size="large" @click="$router.push('/seller/goods')">返回商品列表</el-button></div>
            </div>
<!--            <div class="success">上传成功</div>-->
<!--            <div class="success"><el-button size="large">返回商品列表</el-button></div>-->
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.goods-container {
  padding: 10px 20px;

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
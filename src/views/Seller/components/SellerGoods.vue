<script setup>
import {onMounted,ref} from "vue";
import {Search, Close, Edit, Delete, Tickets} from '@element-plus/icons-vue';
import {useCategoryStore} from "@/stores/category.js";
import {useUserStore} from "@/stores/user.js";
import {getGoodsAPI,getGoodsCountAPI,deleteGoodsAPI} from '@/apis/user.js';
import {ElMessage} from "element-plus";
import GoodsEditDialog from "@/components/dialog/GoodsEditDialog.vue";
import LogDialog from "@/components/dialog/LogDialog.vue";
import {MODE} from "@/composables/dialogTypes.js";

const categoryStore=useCategoryStore();
const userStore=useUserStore();
onMounted(()=>{
  init()
})

const userType=userStore.userInfo.type
const init=()=>{
  categoryStore.getCategory(userType)
  getGoods()
}

const goodsList=ref([])
const total=ref(0)
const pageParams= ref({
  page:1,
  pageSize:10,
  type:'all'
})
const selectCategories=ref([-1])
const props = {
  expandTrigger: 'hover',
  checkStrictly: true,
}
const getGoods=async ()=>{
  const {page,pageSize,type}=pageParams.value
  let id=selectCategories.value[0]
  if(type==='sub'){
    id=selectCategories.value[1]
  }
  const count=await getGoodsCountAPI({id, type, userType})
  total.value=count.result
  const res=await getGoodsAPI({page,pageSize,id,type,userType})
  goodsList.value=res.result
}
const handleCategoryChange=async ()=>{
  if(selectCategories.value.length===1){
    pageParams.value.type='main'
    await getGoods()
  }
  else{
    pageParams.value.type='sub'
    await getGoods()
  }
}
const clear=async ()=>{
  pageParams.value.type='all'
  await getGoods()
  selectCategories.value=[]
}

const handleDelete=async (index,row)=>{
  const res=await deleteGoodsAPI(row.id)
  if(res.code===1){
    ElMessage.success("删除商品："+row.name+"  成功！")
  }
  else{
    ElMessage.error("删除商品："+row.name+"  失败！")
  }
  await getGoods()
}

const goodsTableDialogRef=ref(GoodsEditDialog)
const logDialogRef=ref(LogDialog)

const handleEdit=async (index,row)=>{
  if(!goodsTableDialogRef.value) return
  goodsTableDialogRef.value.openDialog(MODE.EDIT,row.skus)
}

const searchText=ref("")
const handleSearch=()=>{

}

const logParams=ref({
  goods_id:-1,
  page:1,
  pageSize:10,
  total:0
})
const handleLog=async (index,row)=>{
  if(!logDialogRef.value) return
  logParams.value.goods_id=row.id
  const {goods_id,page,pageSize}=logParams.value
  const {total,logs}=await userStore.getUserTpAndBuyLog({goods_id,page,pageSize})
  logParams.value.total=total
  logDialogRef.value.openDialog(MODE.READONLY,logs,logParams)
}
</script>

<template>
  <div class="goods-container">
    <div class="header">
      <el-row>
        <el-col :span="2" class="text">
          <div>分类</div>
        </el-col>
        <el-col :span="8" style="margin: auto;">
          <el-cascader v-model="selectCategories" :options="categoryStore.categoryList"
                       :props="props" :show-all-levels="false" @change="handleCategoryChange"
                       placeholder="请选择分类">
          </el-cascader>
          <el-button :icon="Close" @click="clear" />
        </el-col>
        <el-col :span="10">
          <el-input v-model="searchText" placeholder="敬请期待">
            <template #append>
              <el-button :icon="Search" @click="handleSearch"/>
            </template>
          </el-input>
        </el-col>
        <el-col :span="1"></el-col>
        <el-col :span="3">
          <el-button v-if="userType==='seller'" type="primary" @click="$router.push('/seller/add')">添加商品</el-button>
          <el-button v-if="userType==='admin'" type="primary" @click="$router.push('/admin/statistics')">查看销售报表</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="main">
      <el-table :data="goodsList" height="1200" :table-layout="'auto'">
        <el-table-column prop="id" label="商品id" align="center"/>
        <el-table-column prop="name" label="商品名称" align="center"/>
        <el-table-column prop="picture" label="商品图片" align="center">
          <!-- 图片的显示 -->
          <template   #default="scope">
            <img :src="scope.row.picture"  width="100" height="90" />
          </template>
        </el-table-column>
        <el-table-column prop="price" label="商品价格(￥)" align="center"/>
        <el-table-column prop="totalStock" label="总库存" align="center"/>
        <el-table-column prop="totalSales" label="总销售数量" align="center"/>
        <el-table-column prop="totalVolume" label="总销售额(￥)" align="center"/>
        <el-table-column label="操作" align="center">
          <template #default="scope" v-if="userType==='seller'">
            <div class="table-button">
              <el-button size="default" @click="handleEdit(scope.$index, scope.row)" :icon="Edit"></el-button>
            </div>
            <div class="table-button">
              <el-button size="default" @click="handleLog(scope.$index, scope.row)" :icon="Tickets"></el-button>
            </div>
            <div class="table-button">
              <el-button
                  size="default"
                  type="danger" :icon="Delete"
                  @click="handleDelete(scope.$index, scope.row)"
              ></el-button>
            </div>
          </template>
          <template #default="scope" v-else>
            <div class="table-button">
              <el-button size="default" @click="handleEdit(scope.$index, scope.row)" :icon="Edit"></el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination :total="total" :page-size="pageParams.pageSize" v-model:current-page.sync="pageParams.page"
                       @current-change="handleCategoryChange" background layout="prev, pager, next" />
      </div>
    </div>
  </div>
  <GoodsEditDialog ref="goodsTableDialogRef"/>
  <LogDialog ref="logDialogRef"/>
</template>

<style scoped lang="scss">
.goods-container {
  padding: 10px 20px;

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
<script setup>
import {onMounted,ref} from "vue";
import {Close, Delete, Edit, Search, Tickets} from "@element-plus/icons-vue";
import {useUserStore} from "@/stores/user.js";
import {getSellerCountsAPI,getSellerAPI,deleteSellerAPI} from "@/apis/admin.js";
import SellerEditDialog from "@/components/dialog/SellerEditDialog.vue";
import {MODE} from "@/composables/dialogTypes.js";

const userStore=useUserStore();
const userType=userStore.userInfo.type
const sellerEditDialogRef=ref(SellerEditDialog)

const init=async ()=>{
  await userStore.getBrands()
}

onMounted(()=>{
  init()
  getSeller()
})

const sellerList=ref([])
const total=ref(0)
const pageParams= ref({
  page:1,
  pageSize:10,
  brand_id:0
})

const getSeller=async ()=>{
  const {page,pageSize,brand_id}=pageParams.value
  const count=await getSellerCountsAPI()
  total.value=count.result
  const res=await getSellerAPI({page,pageSize,brand_id})
  sellerList.value=res.result
}

const form=ref({
  id:0,
  newPassword:''
})

const handleEdit=(index,row)=>{
  form.value.id=row.id
  if(!sellerEditDialogRef.value) return
  sellerEditDialogRef.value.openDialog(MODE.EDIT,form)
}

const handleDelete=async (index,row)=>{
  const res=await deleteSellerAPI(row.id)
  if(res.code===1){
    ElMessage.success("删除账号【"+row.name+"】（id："+row.id+"）成功！")
  }
  else{
    ElMessage.error(res.message)
  }
  await getSeller()
}

const handleSellerChange=async ()=>{
  await getSeller()
}

const clear=async ()=>{
  pageParams.value.brand_id=0
  await getSeller()
}

const searchText=ref("")
const handleSearch=()=>{

}
</script>

<template>
  <div class="account-container">
    <div class="header">
      <el-row>
        <el-col :span="2" class="text">
          <div>品牌</div>
        </el-col>
        <el-col :span="10" style="margin: auto;">
          <el-select v-model="pageParams.brand_id" placeholder="请选择品牌" style="width:260px;" @change="getSeller">
            <el-option v-for="items in userStore.brands" :key="items.id" :label="items.name" :value="items.id"/>
          </el-select>
          <el-button :icon="Close" @click="clear" />
        </el-col>
        <el-col :span="8">
          <el-input v-model="searchText" placeholder="敬请期待">
            <template #append>
              <el-button :icon="Search" @click="handleSearch"/>
            </template>
          </el-input>
        </el-col>
        <el-col :span="1"></el-col>
        <el-col :span="3">
          <el-button v-if="userType==='admin'" type="primary" @click="$router.push('/admin/add')">添加账号</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="main">
      <el-table :data="sellerList" height="1200" :table-layout="'auto'">
        <el-table-column prop="id" label="账号id" align="center"/>
        <el-table-column prop="name" label="账号名称" align="center"/>
        <el-table-column prop="avatar" label="头像" align="center">
          <!-- 图片的显示 -->
          <template   #default="scope">
            <img :src="scope.row.avatar"  width="90" height="90" />
          </template>
        </el-table-column>
        <el-table-column prop="brand.name" label="所属品牌" align="center"/>
        <el-table-column label="操作" align="center">
          <template   #default="scope">
            <div class="table-button">
              <el-button size="default" @click="handleEdit(scope.$index, scope.row)" :icon="Edit"></el-button>
            </div>
            <div class="table-button">
              <el-button size="default" @click="handleDelete(scope.$index, scope.row)" :icon="Delete" type="danger"></el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination :total="total" :page-size="pageParams.pageSize" v-model:current-page.sync="pageParams.page"
                       @current-change="handleSellerChange" background layout="prev, pager, next" />
      </div>
    </div>
  </div>
  <SellerEditDialog ref="sellerEditDialogRef"/>
</template>

<style scoped lang="scss">
.account-container {
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
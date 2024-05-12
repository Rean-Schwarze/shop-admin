<script setup>
import {useUserStore} from "@/stores/user.js";
import {useRouter} from "vue-router";
import {ElMessage} from "element-plus";
import {onMounted} from "vue";

const userStore=useUserStore()
const router=useRouter()

const checkLogin=()=>{
  if(typeof userStore.userInfo.id==="undefined"){
    router.push("/login")
    ElMessage.error("尚未登录！")
  }
}

onMounted(()=>checkLogin())
</script>

<template>
  <div class="container">
    <div class="xtx-member-aside">
      <div class="user-manage">
        <h4>个人中心</h4>
        <div class="links">
          <RouterLink to="/seller">个人资料</RouterLink>
        </div>
        <h4>商品管理</h4>
        <div class="links">
          <RouterLink to="/seller/goods">商品列表</RouterLink>
        </div>
        <h4>订单管理</h4>
        <div class="links">
          <RouterLink to="/seller/order">交易订单</RouterLink>
        </div>
      </div>
    </div>
    <div class="article">
      <!-- 三级路由的挂载点 -->
       <RouterView />
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  padding-top: 20px;

  .xtx-member-aside {
    min-height: 400px;
    width: 220px;
    margin-right: 20px;
    border-radius: 2px;
    background-color: #fff;

    .user-manage {
      background-color: #fff;

      h4 {
        font-size: 18px;
        font-weight: 400;
        padding: 20px 52px 5px;
        border-top: 1px solid #f6f6f6;
      }

      .links {
        padding: 0 52px 10px;
      }

      a {
        display: block;
        line-height: 1;
        padding: 15px 0;
        font-size: 14px;
        color: #666;
        position: relative;

        &:hover {
          color: $xtxColor;
        }

        &.active,
        &.router-link-exact-active {
          color: $xtxColor;

          &:before {
            display: block;
          }
        }

        &:before {
          content: '';
          display: none;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          position: absolute;
          top: 19px;
          left: -16px;
          background-color: $xtxColor;
        }
      }
    }
  }

  .article {
    width: 1000px;
    background-color: #fff;
  }
}
</style>

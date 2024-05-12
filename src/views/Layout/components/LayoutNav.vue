<script setup>
import {useUserStore} from "@/stores/user.js";
const userStore=useUserStore()
import {useRouter} from "vue-router";
import {logoutAPI} from "@/apis/user.js";
import {ElMessage} from "element-plus";

const router=useRouter()
const confirm=async ()=>{
  // 退出登陆业务逻辑实现
  // 1. 清除当前用户数据 触发action
  const res=await logoutAPI(userStore.userInfo.type)
  if(res.code===1){
    userStore.clearUserInfo()
    ElMessage.success("已退出登录")
    router.push('/login')
  }
  else{
    ElMessage.error("注销过程中发生错误！")
  }

}
</script>

<template>
  <nav class="app-topnav">
    <div class="container">
      <ul>
<!--        多模板渲染 区分登陆、非登录（是否有token）-->
        <template v-if="userStore.userInfo.token">
          <li><a href="javascript:;"><i class="iconfont icon-user"></i>{{userStore.userInfo.name}}</a></li>
          <li>
            <el-popconfirm @confirm="confirm" title="确认退出吗?" confirm-button-text="确认" cancel-button-text="取消">
              <template #reference>
                <a href="javascript:;">退出登录</a>
              </template>
            </el-popconfirm>
          </li>
<!--          <li><a href="javascript:;" @click="$router.push('/member/order')">我的订单</a></li>-->
<!--          <li><a href="javascript:;" @click="$router.push('/member/user')">会员中心</a></li>-->
        </template>
        <template v-else>
          <li><a href="javascript:;" @click="$router.push('/login')">请先登录</a></li>
<!--          <li><a href="javascript:;" @click="$router.push('/register')">注册</a></li>-->
        </template>
      </ul>
    </div>
  </nav>
</template>


<style scoped lang="scss">
.app-topnav {
  background: #333;
  ul {
    display: flex;
    height: 53px;
    justify-content: flex-end;
    align-items: center;
    li {
      a {
        padding: 0 15px;
        color: #cdcdcd;
        line-height: 1;
        display: inline-block;

        i {
          font-size: 14px;
          margin-right: 2px;
        }

        &:hover {
          color: $xtxColor;
        }
      }

      ~li {
        a {
          border-left: 2px solid #666;
        }
      }
    }
  }
}
</style>

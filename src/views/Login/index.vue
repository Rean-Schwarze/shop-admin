<script setup>
import {ref} from "vue";
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import {useRouter} from "vue-router";
import {useUserStore} from "@/stores/user.js";

const userStore=useUserStore()
// 表单校验（账号名、密码）
// 1. 准备表单对象
const option=[
  {
    label:'销售人员',
    value:'seller',
  },
  {
    label:'管理员',
    value:'admin',
  }
]
const form=ref({
    account:'',
    password:'',
    type:'seller',
})
// 2. 准备规则对象
const rules={
  account:[
    {required:true,message:'账户不能为空',trigger:"blur"},
    {pattern:/[^^#*%&',;=?\s$\x22]+/,message:'不能含有非法字符',trigger:'blur'}
  ],
  password:[
    {required:true,message:'密码不能为空',trigger:"blur"},
    {min:6,max:14,message:'密码长度为6~14字符',trigger:"blur"}
  ],
  type:[
    {required:true,message:'角色不能为空',trigger:"blur"},
  ]
}
// 3. 获取form实例做统一校验
const formRef=ref(null)
const router=useRouter()
const doLogin=()=>{
  const {account,password,type}=form.value
  formRef.value.validate(async (valid)=>{
    // valid:所有表单都通过校验才true
    if(valid){
      await userStore.getUserInfo({account,password,type})
      // 提示、跳转
      if (Object.keys(userStore.userInfo).length!==0){
        ElMessage({ type: 'success', message: '登录成功' })
        await router.replace({path: '/'+type})
      }
    }
  })
}
</script>


<template>
  <div>
    <header class="login-header">
      <div class="container m-top-20">
        <h1 class="logo">
          <RouterLink to="/"></RouterLink>
        </h1>
        <RouterLink class="entry" to="/">
          进入首页
          <i class="iconfont icon-angle-right"></i>
          <i class="iconfont icon-angle-right"></i>
        </RouterLink>
      </div>
    </header>
    <section class="login-section">
      <div class="wrapper">
        <nav>
          <a href="javascript:;">账户登录</a>
        </nav>
        <div class="account-box">
          <div class="form">
<!--            绑定表单、规则对象-->
            <el-form ref="formRef" :model="form" :rules="rules" label-position="right" label-width="60px"
                     status-icon>
<!--              双向绑定-->
              <el-form-item prop="type"  label="角色">
                <el-select v-model="form.type" size="large">
                  <el-option v-for="item in option" :key="item.value" :label="item.label" :value="item.value"/>
                </el-select>
              </el-form-item>
              <el-form-item prop="account"  label="账户">
                <el-input style="height:40px;" placeholder="账号名" v-model="form.account"/>
              </el-form-item>
              <el-form-item prop="password" label="密码">
                <el-input style="height:40px;" v-model="form.password" show-password/>
              </el-form-item>
              <el-row :gutter="20">
                <el-col :span="24">
                  <el-button size="large" class="subBtn" @click="doLogin">登录</el-button>
                </el-col>
<!--                <el-col :span="12">-->
<!--                  <el-button size="large" class="subBtn" @click="$router.push('/register')">注册</el-button>-->
<!--                </el-col>-->
              </el-row>

            </el-form>
          </div>
        </div>
      </div>
    </section>

    <footer class="login-footer">
      <div class="container">
        <p>
          <a href="javascript:;">关于我们</a>
          <a href="javascript:;">帮助中心</a>
<!--          <a href="javascript:;">售后服务</a>-->
<!--          <a href="javascript:;">配送与验收</a>-->
<!--          <a href="javascript:;">商务合作</a>-->
<!--          <a href="javascript:;">搜索推荐</a>-->
<!--          <a href="javascript:;">友情链接</a>-->
        </p>
        <p>CopyRight &copy; Rean</p>
      </div>
    </footer>
  </div>
</template>

<style scoped lang='scss'>
.login-header {
  background: #fff;
  border-bottom: 1px solid #e4e4e4;

  .container {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  .logo {
    width: 200px;

    a {
      display: block;
      height: 132px;
      width: 100%;
      text-indent: -9999px;
      background: url("@/assets/images/logo.png") no-repeat center 18px / contain;
    }
  }

  .sub {
    flex: 1;
    font-size: 24px;
    font-weight: normal;
    margin-bottom: 38px;
    margin-left: 20px;
    color: #666;
  }

  .entry {
    width: 120px;
    margin-bottom: 38px;
    font-size: 16px;

    i {
      font-size: 14px;
      color: $xtxColor;
      letter-spacing: -5px;
    }
  }
}

.login-section {
  background: url('@/assets/images/login-bg.png') no-repeat center / cover;
  height: 488px;
  position: relative;

  .wrapper {
    width: 420px;
    background: #fff;
    position: absolute;
    left: 50%;
    top: 54px;
    transform: translate3d(100px, 0, 0);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);

    nav {
      font-size: 14px;
      height: 68px;
      margin-bottom: 20px;
      border-bottom: 1px solid #f5f5f5;
      display: flex;
      padding: 0 40px;
      text-align: right;
      align-items: center;

      a {
        flex: 1;
        line-height: 1;
        display: inline-block;
        font-size: 18px;
        position: relative;
        text-align: center;
      }
    }
  }
}

.login-footer {
  padding: 30px 0 50px;
  background: #fff;

  p {
    text-align: center;
    color: #999;
    padding-top: 20px;

    a {
      line-height: 1;
      padding: 0 10px;
      color: #999;
      display: inline-block;

      ~a {
        border-left: 1px solid #ccc;
      }
    }
  }
}

.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;

    a {
      color: $xtxColor;

      i {
        font-size: 14px;
      }
    }
  }

  .form {
    padding: 2px 20px 20px 20px;

    &-item {
      margin-bottom: 28px;

      .input {
        position: relative;
        height: 46px;

        >i {
          width: 34px;
          height: 46px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 46px;
          font-size: 18px;
        }

        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 46px;
          line-height: 36px;
          width: 100%;

          &.error {
            border-color: $priceColor;
          }

          &.active,
          &:focus {
            border-color: $xtxColor;
          }
        }

        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 46px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 46px;
          cursor: pointer;
        }
      }

      >.error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: $priceColor;

        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }

    .agree {
      a {
        color: #069;
      }
    }

    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: $xtxColor;

      &.disabled {
        background: #cfcdcd;
      }
    }
  }

  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}

.subBtn {
  background: $xtxColor;
  width: 100%;
  color: #fff;
}
</style>

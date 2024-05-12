import axios from 'axios'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import {useUserStore} from "@/stores/user.js";
import router from '@/router'
// 创建axios实例
const http = axios.create({
    baseURL:'/api',
    timeout: 5000
})

// axios请求拦截器
http.interceptors.request.use(config => {
    // 1. 从pinia获取token数据
    const userStore=useUserStore()
    // 2. 按照后端要求拼接token数据
    const token=userStore.userInfo.token
    if(token){
        config.headers.Authorization=`${token}`
    }
    return config
}, e => Promise.reject(e))

// axios响应式拦截器
http.interceptors.response.use(res => res.data, e => {
    const userStore=useUserStore()
    console.log(e.response)
    // 统一错误提示
    ElMessage({
        type:'warning',
        message:e.response.status+': '+e.response.statusText
    })
    // 401 token失效处理
    if(e.response.status===401){
        // 1. 清除本地用户数据
        userStore.clearUserInfo()
        // 2. 跳转到登录页
        router.push('/login')
    }
    return Promise.reject(e)
})


export default http

// 管理用户数据相关

import {defineStore} from "pinia";
import {ref} from "vue";
import {loginAPI, uploadAvatarAPI} from "@/apis/user.js";
import { ElMessage } from 'element-plus'

export const useUserStore=defineStore('user',()=>{
    //1. 定义管理用户数据的state
    const userInfo=ref({})
    //2. 定义获取接口数据的action函数
    const getUserInfo=async ({account, password,type})=>{
        const res=await loginAPI({account,password,type})
        if(res.result!=null){
            userInfo.value=res.result
        }
        else {
            ElMessage({
                type:'warning',
                message:res.message
            })
        }
    }
    //4. 退出时清除用户信息
    const clearUserInfo=()=>{
        userInfo.value={}
    }
    // 上传头像
    const uploadAvatar=async (formData)=>{
        const res=await uploadAvatarAPI(formData);
        if(res.code===1){
            ElMessage.success("上传成功！")
            userInfo.value.avatar=res.result.url
        }
        else{
            ElMessage.error(res.message)
        }
    }
    //3. 以对象的格式把state和action返回
    return {
        userInfo,
        getUserInfo,
        clearUserInfo,
        uploadAvatar
    }
},{
    persist:true,
    })

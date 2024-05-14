// 管理用户数据相关

import {defineStore} from "pinia";
import {ref} from "vue";
import {getUserTpAndBuyLogAPI, loginAPI, uploadGoodsImagesAPI} from "@/apis/user.js";
import { ElMessage } from 'element-plus'
import {getBrandsAPI, uploadAvatarAPI} from "@/apis/admin.js";

export const useUserStore=defineStore('user',()=>{
    //1. 定义管理用户数据的state
    const userInfo=ref({})
    const brands=ref([])
    const avatar=ref("")
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
    const addAllToBrand=()=>{
        brands.value.push({id:0,name:'全部'})
    }
    const getBrands=async ()=>{
        const res=await getBrandsAPI()
        brands.value=res.result
    }
    //4. 退出时清除用户信息
    const clearUserInfo=()=>{
        userInfo.value={}
    }
    // 上传商品图片
    const uploadGoodsImages=async (formData)=>{
        const res=await uploadGoodsImagesAPI(formData);
        if(res.code===1){
            ElMessage.success("上传成功！")
        }
        else{
            ElMessage.error(res.message)
        }
    }
    const getUserTpAndBuyLog=async ({goods_id,page,pageSize})=>{
        const res=await getUserTpAndBuyLogAPI({goods_id,page,pageSize})
        if(res.code===1){
            const total=res.result.total
            const logs=res.result.logs

            logs.forEach(log=>{
                if(log.id===-1){log.id='未登录用户'}
                if(log.type==='tp'){
                    log.type='浏览'
                    let tmp=log.value.split(' ')
                    log.value='在商品【'+tmp[1]+'】处停留 '+tmp[2]+' 秒'
                }
                else if(log.type==='buy'){
                    log.type='购买'
                    log.value=log.value.replace('goods','商品').replace('count','数量')
                }
            })
            return {total,logs}
        }
        else{
            ElMessage.error(res.message)
        }

    }
    // 上传头像
    const uploadAvatar=async (formData)=>{
        const res=await uploadAvatarAPI(formData);
        if(res.code===1){
            ElMessage.success("上传成功！")
            avatar.value=res.result.url
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
        uploadGoodsImages,
        getUserTpAndBuyLog,
        brands,
        getBrands,
        addAllToBrand,
        uploadAvatar,
        avatar
    }
},{
    persist:true,
    })

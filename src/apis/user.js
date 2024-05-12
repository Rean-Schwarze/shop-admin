//封装所有和用户相关的接口函数
import request from '@/utils/http.js'

// ---------------------------
// 销售人员相关
// ---------------------------
export const loginAPI=({account,password,type})=>{
    return request({
        url: '/'+type+'/login',
        method:'POST',
        data:{
            account,
            password
        }
    })
}
export const logoutAPI=(type)=>{
    return request({
        url: '/'+type+'/logout',
        method:'POST',
    })
}

// ---------------------------
// 管理员相关
// ---------------------------

export const registerAPI=({account,phone,password,nickName,email})=>{
    return request({
        url:'/user/register',
        method:'POST',
        data:{
            account,phone,password,nickName,email
        }
    })
}

export const getLikeListAPI = ({ limit = 4 }) => {
    return request({
        url:'/goods/relevant',
        params: {
            limit
        }
    })
}

export const getAddressAPI=()=>{
    return request({
        url:'/user/address',
        method:'GET'
    })
}

// 上传头像
export const uploadAvatarAPI=(data)=>{
    return request({
        url:'/upload/avatar',
        method:'POST',
        data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    })
}


// 添加收货地址
export const addAddressAPI=({receiver,contact,region,address,isDefault})=>{
    return request({
        url:'/user/address',
        method:'POST',
        data:{
            receiver,
            contact,
            region,
            address,
            isDefault
        }
    })
}

// 修改收货地址
export const modifyAddressAPI=({receiver,contact,region,address,isDefault,id})=>{
    return request(({
        url:'/user/modify/address',
        method:'POST',
        data:{
            receiver,
            contact,
            region,
            address,
            isDefault,
            id
        }
    }))
}

// 上传浏览商品停留时间
export const uploadTpLogAPI=({userId,goodsId,time,type})=>{
    return request({
        url:'/user/log/tp',
        method:'POST',
        data:{
            userId,
            goodsId,
            time,
            type
        }
    })
}
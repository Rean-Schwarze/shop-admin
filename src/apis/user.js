//封装所有和用户相关的接口函数
import request from '@/utils/http.js'

// ---------------------------
// 登陆相关
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
// 销售人员相关
// ---------------------------

// 获取负责分类
export const getSellerCategoryAPI=()=>{
    return request({
        url:'/seller/category',
        method:'GET'
    })
}

// 获取指定分类下商品总数
export const getGoodsCountAPI=({id,type,userType})=>{
    return request({
        url:'/'+userType+'/goods/count',
        method:'GET',
        params:{
            id,
            type
        }
    })
}

// 获取指定分类下商品
export const getGoodsAPI=({page,pageSize,id,type,userType})=>{
    return request({
        url:'/'+userType+'/goods',
        method:'GET',
        params:{
            id,
            page,
            pageSize,
            type
        }
    })
}

// 删除商品（伪）
export const deleteGoodsAPI=(id)=>{
    return request({
        url:'/seller/goods',
        method:'DELETE',
        params:{
            id
        }
    })
}

// 修改商品sku价格、库存
export const updateSkuPriceAndInventoryAPI=(goods_id,skus,userType)=>{
    return request({
        url:'/'+userType+'/modify/goods/sku',
        method:'POST',
        data:{
            goods_id,
            skus
        }
    })
}

// 添加商品
export const addGoodsAPI=({name,desc,category,subCategory,subCategory2,specs,skus,isPreSale,isNew,isOnSale,pubTime})=>{
    return request({
        url:'/seller/goods',
        method:'POST',
        data:{name,desc,category,subCategory,subCategory2,specs,skus,isPreSale,isNew,isOnSale,pubTime}
    })
}

// 上传商品图片
export const uploadGoodsImagesAPI=(data)=>{
    return request({
        url:'/upload/seller/goods',
        method:'POST',
        data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    })
}

// 获取用户日志（浏览、购买）
export const getUserTpAndBuyLogAPI=({goods_id,page,pageSize})=>{
    return request({
        url:'/seller/log/user',
        method:'GET',
        params:{
            goods_id,
            page,
            pageSize
        }
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
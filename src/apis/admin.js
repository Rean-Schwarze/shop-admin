import request from '@/utils/http.js'

// 获取品牌
export const getBrandsAPI=()=>{
    return request({
        url:'/admin/brand',
        method:'GET',
    })
}

// 获取销售人员账号
export const getSellerAPI=({page,pageSize,brand_id})=>{
    return request({
        url:'/admin/seller',
        method:'GET',
        params:{
            page,pageSize,brand_id
        }
    })
}

// 获取销售人员数量
export const getSellerCountsAPI=(brand_id)=>{
    return request({
        url:'/admin/seller/count',
        method:'GET',
        params:{
            brand_id
        }
    })
}

// 重置销售人员账号密码
export const resetSellerPasswordAPI=({id, newPassword})=>{
    return request({
        url:'/admin/seller/reset/password',
        method:'POST',
        data:{
            id,
            newPassword
        }
    })
}

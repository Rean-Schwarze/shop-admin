import request from '@/utils/http.js'


export const getUserOrderAPI = (params) => {
    /*
params: {
  orderState:0,
  page:1,
  pageSize:2
}
*/
    return request({
        url:'/seller/order',
        method:'GET',
        params
    })
}

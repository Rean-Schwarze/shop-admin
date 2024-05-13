import {createRouter, createWebHashHistory} from 'vue-router'
import Login from '@/views/Login/index.vue'
import Layout from '@/views/Layout/index.vue'
import Seller from '@/views/Seller/index.vue'
import Admin from '@/views/Admin/index.vue'
import Home from '@/views/Home/index.vue'
import SellerGoods from "@/views/Seller/components/SellerGoods.vue";
import SellerOrder from "@/views/Seller/components/SellerOrder.vue";
import SellerInfo from "@/views/Seller/components/SellerInfo.vue";
import SellerAddGoods from '@/views/Seller/components/SellerAddGoods.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path:'/',
      component:Layout,
      children:[
        {
          path:'',
          component:Home
        },
        {
          path:'seller',
          component:Seller,
          children:[
            {
              path:'',
              component:SellerInfo
            },
            {
              path:'goods',
              component:SellerGoods,
            },
            {
              path:'order',
              component:SellerOrder
            },
            {
              path:'add',
              component:SellerAddGoods
            }
          ]
        },
        {
          path:'admin',
          component:Admin
        }
      ]
    },
    {
      path:'/login',
      component:Login
    }
  ],
  // 路由滚动行为定制
  scrollBehavior(){
    return {
      top:0
    }
  }
})

export default router

// 封装 banner轮播图 相关业务代码
import {onMounted,ref} from "vue";
import {getBannerAPI} from "@/apis/home.js";


export function useBanner(){
    // 获取banner
    const bannerList=ref([])

    const getBanner=async ()=>{
        const res=await getBannerAPI({
            distributionSite:'2'
        })
        bannerList.value=res.result
    }

    onMounted(()=>getBanner())

    return {
        bannerList
    }
}

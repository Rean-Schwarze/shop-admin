// 封装倒计时逻辑函数
import {ref,computed,onUnmounted} from "vue"
import dayjs from 'dayjs'
export const useCountDown=()=>{
    // 1.响应式数据
    let timer=null
    const time=ref(0)
    const formatTime = computed(() => dayjs.unix(time.value).format('mm分ss秒'))
    const formatTimeSecond = computed(() => dayjs.unix(time.value).format('ss秒'))
    // 2.开启倒计时
    const start=(currentTime)=>{
        time.value=currentTime
        timer=setInterval(()=>{
            if(time.value>0){
                time.value--
            }
        },1000)
    }
    const startWithTimeout=(currentTime,timeout)=>{
        time.value=currentTime
        timer=setInterval(()=>{
            if(time.value>0){
                time.value--
            }
            else{
                timeout.value=true
            }
        },1000)
    }
    onUnmounted(()=>{
        timer&& clearInterval(timer)
    })
    return {
        formatTime,
        formatTimeSecond,
        start,
        startWithTimeout
    }
}

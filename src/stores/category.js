import {ref} from 'vue'
import { defineStore } from 'pinia'
import {getSellerCategoryAPI} from "@/apis/user.js";

export const useCategoryStore = defineStore('category', () => {
    // 导航列表数据管理
    const categoryList=ref([])
    const keyMap=(arr,map)=>{
        arr.forEach(v => {
            let keymap=map
            Object.keys(v).map(keys => {
                let newKey = keymap[keys]
                if (newKey) {
                    v[newKey] = v[keys]
                }
            })
            if (v.children && v.children.length > 0) {
                keyMap(v.children,map)
            } else {
                delete v['children']
            }
        })
        return arr
    }
    const getCategory=async ()=>{
        const res = await getSellerCategoryAPI()
        const keymap = {
            id: "value",
            children: 'children',
            name: "label",
            picture: 'picture',
            parentId: "parentId",
        }
        keyMap(res.result,keymap)
        categoryList.value=res.result

    }

    return {
        categoryList,
        getCategory,
        keyMap
    }
})

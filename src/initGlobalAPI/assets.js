import { ASSETS_TYPES } from "../const"
export default function initAssetRegisters(){
    ASSETS_TYPES.forEach(type=>{
        Vue[type] = function(id,definition){
            if(type==='component'){
                // 注册全局组件    
            }else if(type==='filter'){

            }
        }
    })
}
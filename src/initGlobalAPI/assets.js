import { ASSETS_TYPES } from "../const"
export default function initAssetRegisters(Vue){
    ASSETS_TYPES.forEach(type=>{
        Vue[type] = function(id,definition){

            if(type==='component'){
                // 注册全局组件
                // 使用extend 方法 将对象变成构造函数
                // 子组件可能也有这个VueComponent.component方法
                // console.log(definition)
                definition = this.options._base.extend(definition)
                console.log('ss',definition)
            }else if(type==='filter'){

            }else if(type==='directive'){

            }
            this.options[type+'s'][id] = definition
        }
    })
}

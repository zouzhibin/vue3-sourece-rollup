

import {isSymbol,isObject, hasOwn, hasChanged,isArray,isInteger} from '../shared/index'
import { reactive } from './reactive'
import {track, trigger} from './effect'
function createGetter(){
    return function get(target,key,receiver){
        const res = Reflect.get(target,key,receiver)

        // 如果 取得值是symbol类型 我要忽略它
        if(isSymbol(key)){ // 数组中有很多symbol的内置方法
            return res
        }

        // console.log('=========',target,key)

        //依赖收集
        track(target,key)
        if(isObject(res)){  //取值是对象进行代理
            return reactive(res)
        }

        return res
    }
}

function createSetter(){
    return function set(target,key,value,receiver){


        const oldValue = target[key] ; // 如果是修改那肯定有老值
        // 看一下有没有这个属性


        // 第一种是数组新增的逻辑 第二种是对象的逻辑
        const hadKey = isArray(target)&&isInteger(key)?Number(key)<target.length:hasOwn(target,key)


        const res = Reflect.set(target,key,value,receiver)

        // 新增
        if(!hadKey){
            trigger(target,'add',key,value)
        // 修改   
        }else if(hasChanged(value,oldValue)){
            trigger(target,'set',key,value,oldValue)
        }



        return res
    }
}

const get = createGetter()
const set = createSetter()

export const mutableHandlers = {
    get, // 获取对象中的属性会执行此方法
    set //设置属性值得时候会执行此方法
}
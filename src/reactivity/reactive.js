import { isObject } from "../shared/index"
import { mutableHandlers } from "./baseHandlers"



const proxyMap = new WeakMap()
export function reactive(target){
    // 将目标变成响应式 Proxy
    return  createReactiveObject(target,mutableHandlers) // 核心操作就是当读取文件的时候做依赖收集，当数据变化时重新执行effect
}


function createReactiveObject(target,baseHandlers){
    // 如果不是对象 直接返回出去
    if(!isObject(target)){
        return target
    }
    // 做缓存 看存不存在
    const exisitingProxy = proxyMap.get(target)
    if(exisitingProxy){
        return exisitingProxy
    }
    // 只是对最外层对象做代理 默认不会递归 而且不会重新重写对象中的属性 
    const proxy = new Proxy(target,baseHandlers)
    proxyMap.set(target,proxy) // 将代理的对象和代理后的结果做一个映射表
    return proxy 
}
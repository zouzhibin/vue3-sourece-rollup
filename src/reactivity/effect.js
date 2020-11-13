import {isArray} from "../shared/index";

export function effect(fn,options = {}){ // effect =>vue2 watch
    const effect = createReactiveEffect(fn,options)

    if(!options.lazy){
        effect()
    }
}
let uid = 0;
let activeEffect; // 用来存储当前的effect函数
const effectStack = []
function createReactiveEffect(fn,options){
    let effect = function (){
        if(!effectStack.includes(effect)){ // 防止递归执行
            try{
                activeEffect = effect
                effectStack.push(activeEffect)
                return fn() // 用户自己写的逻辑,内部会对数据进行取值操作
            }finally {
                effectStack.pop()
                activeEffect = effectStack[effectStack.length-1]
            }
        }
    }
    effect.id = uid++
    effect.deps = [] // 用来表示effect中依赖了哪些属性
    return effect;
}
// {object:{key:[effect,effect]}}
const targetMap = new WeakMap()
// 将属性和effect做一个关联
export function track(target,key){
    if(activeEffect===undefined){
        return false
    }
    let depsMap = targetMap.get(target)
    if(!depsMap){
        targetMap.set(target,(depsMap=new Map()))
    }
    let dep = depsMap.get(key)
    if(!dep){
        depsMap.set(key,(dep=new Set))
    }
    if(!dep.has(activeEffect)){ // 如果没有effect 就把effect放进集合中
        dep.add(activeEffect)
        activeEffect.deps.push(key) // 双向记忆的过程
    }

    // console.log('targetMap',targetMap)

}
// 触发依赖收集
export function trigger(target,type,key,value,oldValue){

    const depsMap = targetMap.get(target)
    if(!depsMap){ // 判断是否已经进行过收集依赖
        return false
    }
    const run = effects =>{
        if(effects) effects.forEach(effect=>effect())
    }

    // 数组有特殊的情况
    if(key==='length'&&isArray(target)){
        // depsMap.forEach((dep,key)=>{ // map可以循环
        //     if(key==='length'||key>=value){ // 如果改的长度小于数组原有的长度,应该更新视图
        //         run(dep)
        //     }
        // })
    }else{
        // 对象的处理
        if(key!==undefined){ // 说明修改了key
            run(depsMap.get(key))
        }
    }
}
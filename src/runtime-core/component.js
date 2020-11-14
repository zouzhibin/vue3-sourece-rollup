import { isFunction } from "../shared/index"

export function createComponentInstace(vnode){
    const instance = {
        type:vnode.type,
        props:{},
        vnode,
        render:null,
        setupState:null,
        isMounted:false // 默认组件没有挂载
    }
    return instance
}




export const setupComponent = (instance)=>{
    // 1、源码中会对属性进行初始化
    // 2、会对插槽进行初始化
    // 3、调用setup方法
    setupStatefulComponent(instance)
}


function setupStatefulComponent(instance){
    const Component = instance.type // 组件的虚拟节点
    const {setup} = Component
    if(setup){
        const setUpResult = setup() // 获取setup返回的值
        // 判断返回的值类型
        handleSetupResult(instance,setUpResult)
    }
}

function handleSetupResult(instance,setUpResult){
    if(isFunction(setUpResult)){
        instance.render = setUpResult // 获取render方法
    }else{
        instance.setupState = setUpResult
    }
}
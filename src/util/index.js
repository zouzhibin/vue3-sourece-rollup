
/**
 * 
 * @param {*} data 当前数据是不是对象
 */
export function isObject(data) {
    return typeof data === 'object' && data !== null;
}


export function proxy(vm,source,key){
    Object.defineProperty(vm,key,{
        get(){
            return vm[source][key]
        },
        set(newValue){
            vm[source][key] = newValue
        }
    })
}


export function def(data,key,value){
    Object.defineProperty(data,key,{
        enumerable:false,
        configurable:false,
        value
    })
}
const LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestory',
    'destroyed'
]

const strats = []

//合并hooks
function mergeHook(parentVal,childVal){
    if(childVal){
        if(parentVal){
            return parentVal.concat(childVal)
        }else{
            return [childVal]
        }
    }else{
        return parentVal
    }
}
LIFECYCLE_HOOKS.forEach(hook=>{
    strats[hook] = mergeHook
})

// 合并两个对象
export function mergeOptions(parent,child){
    const options = {}
    for(let key in parent){
        mergeFiled(key)
    }
    for(let key in child){
        if(!parent.hasOwnProperty(key)){
            mergeFiled(key)
        }
    }

    function mergeFiled(key){
        if(strats[key]){
            return options[key] = strats[key](parent[key],child[key])
        }


        if(typeof parent[key]==='object'&&typeof child[key]==='object'){
            options[key] = {
                ...parent[key],
                ...child[key]
            }
        }else if(child[key]===null){
            optionsp[key]=parent[key]
        }else{
            options[key] = child[key]
        }
    }
    return options
}

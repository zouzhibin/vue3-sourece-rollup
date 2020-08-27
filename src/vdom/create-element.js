import {isObject,isReservedTag} from "../util/index";

export function createElement(vm,tag,data={},...children){
    // console.log('tag==',tag)
    // console.log('tag,data,...children',tag,data,...children)
    let key = data.key;

    if(key){
        delete data.key
    }
    // 如果是原生标签 代表不是组件
    if(isReservedTag(tag)){
        return vnode(tag,data,key,children,undefined)
    }else{
        // 如果是组件的话
        let Ctor = vm.$options.components[tag] // 这是一个extend返回的构造函数
        return createComponent(vm,tag,data,key,children,Ctor)
    }

}

function createComponent(vm,tag,data,key,children,Ctor) {

    // Ctor 如果是对象的话 就重新用extend包装一下
    if(isObject(Ctor)){

        Ctor = vm.$options._base.extend(Ctor)
    }
    data.hook = {
        init(vnode){
            // 当前组件的实例 就是componentInstance
            let child = vnode.componentsInstance = new Ctor({_isComponent:true})
            child.$mount()
        }
    }
    return vnode(`vue-component-${Ctor.cid}-${tag}`,data,key,undefined,{Ctor,children})
}

export function createTextNode(vm,text){
    return vnode(undefined,undefined,undefined,undefined,text)
}

/**
 *
 * @param tag
 * @param data
 * @param key
 * @param children
 * @param text
 * @param componentOptions 组件的插槽
 * @returns {{data: *, children: *, tag: *, text: *, key: *}}
 */
function vnode(tag,data,key,children,text,componentOptions){
    return {
        tag,
        data,
        key,
        children,
        text,
        componentOptions
    }
}

//虚拟节点 就是通过_C _v 实现用对象来描述dom的操作 （对象）


//1) 将template 转换成ast 语法树->生成render方法->生成虚拟dom
// ->真实的dom  重新生成虚拟dom ->更新dom

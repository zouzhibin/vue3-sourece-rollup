import { effect } from "../reactivity/index"
// import { patchProps } from "../runtime-dom/pathProps"
import { ShapeFlags } from "../shared/index"
import { createAppAPI } from "./apiCreateApp" // 用户调用的createApp方法
import { createComponentInstace, setupComponent } from "./component"

// options 是平台传过来的方法 不同的平台可以实现不同的操作逻辑
export function createRenderer(options){
    return baseCreateRenderer(options)
}

function baseCreateRenderer(options){
    console.log('options',options)
    const {
        createElement:hostCreateElement,
        patchProps:hostPatchProp,
        setElementText:hostSetElementText,
        insert:hostInsert,
        remove:hostRemove
    } = options    
    const patch=(n1,n2,container)=>{
        console.log('n2',n2)
        let {shapeFlag,props} = n2
        const mountElemnt = (vnode,container)=>{
            // vnode 虚拟节点  container 是容器
            let {shapeFlag} = vnode
            let el = vnode.el = hostCreateElement(vnode.type)

            // 创建儿子节点
            if(shapeFlag&ShapeFlags.TEXT_CHILDREN){
                hostSetElementText(el,vnode.children)
            }else if(shapeFlag&ShapeFlags.ARRAY_CHILDREN){
                mountChildren(vnode.children,el)
            }
            if(props){
                for(let key in props){
                    hostPatchProp(el,key,null,props[key])
                }
            }

            hostInsert(el,container)
        }
        const mountChildren = (children,container)=>{
            for(let i=0;i<children.length;i++){
                patch(null,children[i],container)
            }
        }
        const patchElemnt= (n1,n2,container)=>{

        }
        const mountComponent=(initialVnode,container)=>{
            // 组件挂载逻辑 1、创建组件的实例 2、找到组件的render方法 3、执行render
            // 组件实例要记录当前组件的状态

            const instance = initialVnode.component = createComponentInstace(initialVnode)


            setupComponent(instance) // 找到组件的setUp方法
            // 调用render方法 如果render方法中数据变化了 会重新渲染

            setupRenderEffect(instance,initialVnode,container) // 给组件创建一个effect 用于渲染

        }

        const setupRenderEffect = (instance,initialVnode,container)=>{
            effect(function componentEffect(){
                if(!instance.isMounted){
                    // 渲染组件中的内容
                    const subTree = instance.subTree = instance.render() // 组件渲染的结果
                    patch(null,subTree,container)
                    instance.isMounted = true
                }else{
                    // 更新逻辑
                    let prev = instance.subTree // 上一次的渲染结果
                    let next = instance.render 
                    // 进行diff比较
                }

            })
        }





        const updateComponent=(n1,n2,container)=>{

        }

        const processElement = (n1,n2,container) =>{
            if(n1===null){
                mountElemnt(n2,container)
            }else{
                patchElemnt(n1,n2,container)
            }
        }
        const processComponent =(n1,n2,container)=>{
            if(n1===null){
                mountComponent(n2,container)
            }else{
                updateComponent(n1,n2,container)
            }
        }

        if(shapeFlag&ShapeFlags.ELEMENT){
            processElement(n1,n2,container)
        }else if(shapeFlag&ShapeFlags.STATEFUL_COMPONENT){
            processComponent(n1,n2,container)
        }
    }
    const render = (vnode,container)=>{
        // 我需要将虚拟节点变成真实节点 挂载到容器中
        patch(null,vnode,container)
    }
    return {
        createApp:createAppAPI(render)
    }
}
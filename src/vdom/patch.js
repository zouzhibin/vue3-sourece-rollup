export function patch(oldVnode,vnode){
    // console.log(oldVnode,vnode)
    if(!oldVnode){
        // 通过当前的虚拟节点 创建元素并返回
        return createElm(vnode)
    }else{
        const isRealElement = oldVnode.nodeType
        // 判断是否是真实元素  因为只有真实元素采用nodeType属性
        if(isRealElement){
            const oldElm = oldVnode // div id="app"
            const parentElm = oldVnode.parentNode //body
            let el = createElm(vnode)

            parentElm.insertBefore(el,oldElm.nextSibling)

            parentElm.removeChild(oldElm)
            // 需要将渲染好的结果返回出去
            return el
        }else{
            // 如果都是虚拟节点的话
            if(oldVnode.tag!==vnode.tag){
                // 标签不一致时  直接替换
                oldVnode.el.parentNode.replaceChild(createElm(vnode),oldVnode.el)
            }

        }
    }

    // 递归创建真实节点  替换掉老的节点
}

function createComponent(vnode) { // 初始化的作用
    let i = vnode.data
    // 需要创建组件的实例
    if((i=i.hook)&&(i=i.init)){
        i(vnode)
    }
    // 执行完毕后
    if(vnode.componentsInstance){
        return true
    }

}

// 根据虚拟节点创建出真实的节点
export function createElm(vnode){
    let {tag,children,key,data,text} = vnode;
   // 是标签就创建出标签
    if(typeof tag ==='string'){
        // 不是tag 是字符串的就是普通的html 还有可能就是我们的组件
        // 实例化组件
        if(createComponent(vnode)){ // 表示是组件
            // 这里返回的是真实的dom
            return vnode.componentsInstance.$el
        }
        vnode.el = document.createElement(tag) // 递归创建儿子节点 将儿子节点扔到父节点中
        updateProperties(vnode)
        children.forEach(child=>{
            return vnode.el.appendChild(createElm(child))
        })
    }else{
        // 虚拟dom上映射着真实dom 方便后续更新操作
        vnode.el = document.createTextNode(text)
    }
    // 如果不是标签就是文本
    return vnode.el
}

// 更新属性 如ID style class

function updateProperties(vnode){
    let newProps = vnode.data||{};
    let el = vnode.el;
    // console.log('newProps',newProps)
    for(let key in newProps){
        if(key==='style'){
            for(let styleName in newProps.style){
                el.style[styleName] = newProps.style[styleName]
            }
        }else if(key==='class'){
            el.className = newProps.class
        }else{
            el.setAttribute(key,newProps[key])
        }
    }

}

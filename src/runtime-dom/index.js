
import { createRenderer } from '../runtime-core/renderer'
import {nodeOps} from './nodeOps'
import {patchProps} from './pathProps'
const renderOptions = {...nodeOps,patchProps} // dom操作

function ensureRenderer(){
    return createRenderer(renderOptions)
}


export function createApp(rootComponent){
    debugger
    // 1、根据组件创建一个渲染器
    const app = ensureRenderer().createApp(rootComponent)
    const {mount} = app
    app.mount = function(container){
        container = document.querySelector(container)
        // 1、挂载时需要将容器清空 在进行挂载
        container.innerHTML = ''
        mount(container)
    }
    return app
}
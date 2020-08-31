 import {initMixin} from './init'
 import {renderMixin} from './render'
 import {lifecycleMixin} from './lifecycle'


 import {initGlobalAPI} from './initGlobalAPI/index'
 function Vue(options){
    // 进行vue的初始化操作
    this._init(options)
}

// 给Vue原型扩展方法
// 通过引入文件的方式 给Vue 原型上添加方法
initMixin(Vue)  // 给Vue原型上添加一个_init方法
renderMixin(Vue) //
lifecycleMixin(Vue) //



// 初始化全局的api 给类添加方法
initGlobalAPI(Vue)


// dom 产生两个虚拟节点进行比对
// template =>render 方法 =>vnode
// import {compileToFunction} from './compiler/index'
// import {createElm} from './vdom/patch'
// let vm1 = new Vue({
//     data:{name:'hello'}
// })
// // 生成render函数
// let render1 = compileToFunction('<div id="app">{{name}}</div>')
// let vnode = render1.call(vm1) // 生成虚拟dom
// let el = createElm(vnode) // 生成真实dom
// document.body.appendChild(el)
//
//
// let vm2 = new Vue({
//     data:{name:'zb',age:18}
// })
// // 生成render函数
// let render2 = compileToFunction('<p id="app">{{age}}<span>{{name}}</span></div>')
// let vnode2 = render2.call(vm2) // 生成虚拟dom
// let el = createElm(vnode2) // 生成真实dom
// document.body.appendChild(el)

// 1、diff 算法的特点是 平级比较 ，我们正常操作dom元素 ，很少涉及到父变成子 子变成父o(n3)


export default Vue

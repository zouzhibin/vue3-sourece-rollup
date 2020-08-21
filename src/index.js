 import {initMixin} from './init'
 import {renderMixin} from './render'
 function Vue(options){
    // 进行vue的初始化操作
    this._init(options)
}
// 通过引入文件的方式 给Vue 原型上添加方法
initMixin(Vue)  // 给Vue原型上添加一个_init方法
renderMixin(Vue) //
export default Vue

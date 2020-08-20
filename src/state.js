import {observe} from './observe/index'
import {proxy} from './util/index'
export function initState(vm){
    const opts = vm.$options
    // vue的数据来源 属性 方法 数据 计算属性  watch
    if(opts.props){
        initProps(vm)
    }
    if(opts.methods){
        initMethod(vm)
    }
    if(opts.data){
        initData(vm)
    }
    if(opts.computed){
        initComputed(vm)
    }
    if(opts.watch){
        initWatch(vm)
    }


    console.log(vm)
}

function initProps(){

}
function initMethod(){

}

function initData(vm){
    // 数据初始化工作
    let data = vm.$options.data // 用户传递的data
    //  vm._data 是为了 可以this._data 可以访问到值   data.call 是因为data 有可能是个函数  在函数里访问this时  可以访问到vue这个实例
    data = vm._data = typeof data ==='function'?data.call(vm):data
    // 对象劫持 用户改变了数据 我希望可以得到通知 =>刷新页面

    // 为了让用户更好的使用 我希望可以直接vm.xxx
    for(let key in data){
        proxy(vm,'_data',key)
    }

    // MVVM模式 数据变化可以驱动视图变化
    // Object.defineProperty() 给属性增加get方法 和set方法
    observe(data) // 响应式原理
    // console.log(data)

}
function initComputed(){

}
function initWatch(){

}
// 把data中的数据 都使用Object.defineProperty重新定义es5
// Object.defineProperty 不能兼容ie8 及以下 vue2 无法兼容ie8版本
import {isObject,def} from '../util/index'
import {arrayMethods} from './array'
import Dep from './dep'
class Observer{
    constructor(value){
        // vue 如果数据的层次过多 需要递归的去解析对象中的属性 依次增加set和get方法
        // value.__ob__= this // 我给每一个监控的对象都增加一个__ob__属性
          // 防止 __ob__ 被修改 遍历 
        //   Object.defineProperty(value,'__ob__',{
        //     enumerable:false,
        //     configurable:false,
        //     value:this
        // })
        this.dep = new Dep // 给数组用的
        def(value,'__ob__',this)
        if(Array.isArray(value)){
            // 如果是数组的话并不会 对索引进行观测 因为会导致性能问题
            // 前端开发中很少很少 去操作索引 push shift unshift
              value.__proto__ = arrayMethods   // 给数组的原型重写方法 当访问数组方法的时候  会先访问自身的
           
            // 如果数组里放的是对象我再监控劫持
            this.observeArray(value)

        }else{
            this.walk(value)
        }
    }
    observeArray(value){
        for(let i=0;i<value.length;i++){
            observe(value[i])
        }
    }
    walk(data){
        let keys = Object.keys(data)
        for(let i=0;i<keys.length;i++){
            let key = keys[i]
            let value = data[key]
            defineReactive(data,key,value) // 定义响应式数据
        }
    }
}

function defineReactive(data,key,value){
    let dep = new Dep()
    // 这里这个value 可能是数组 也可能是对象 返回的结果是observer的实例
    // 当前这个value对应的observer
    let childOb = observe(value) // 递归实现深度检测
    Object.defineProperty(data,key,{
        configurable:true,
        enumerable:true,
        get(){  // 获取值的时候做一些操作
            //每个属性都对应着自己的watcher
            if(Dep.target){ // 如果当前有watcher
                dep.depend() // 意味着我要将watcher存起来

                if(childOb){
                    childOb.dep.depend() // 收集了数组的相关依赖


                    // 如果数组中还有数组
                    if(Array.isArray(value)){
                        dependArray(value)
                    }
                }
            }
            return value;
        },
        set(newValue){  // 设值的时候做一些操作
            if(newValue===value) return 
            observe(newValue) // 继续劫持用户设置的值  因为有可能用户设置的值是一个对象
            value = newValue 
            dep.notify() // 通知依赖的watcher来进行一个更新操作
        }
    })
}

function dependArray(value){
    for(let i=0;i<value.length;i++){
        let current = value[i] //将数组中的每一个都取出来 数据变化后，也去更新视图
        // 数组中的数组的依赖收集
        current.__ob__&&current.__ob__.dep.depend()
        if(Array.isArray(current)){
            dependArray(current)
        }
    }
}

export function observe(data){
 // console.log(data)
    if(!isObject(data)){
        return 
    }
    return new Observer(data) // 用来观测数据


}
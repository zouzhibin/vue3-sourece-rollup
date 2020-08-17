// 把data中的数据 都使用Object.defineProperty重新定义es5
// Object.defineProperty 不能兼容ie8 及以下 vue2 无法兼容ie8版本
import {isObject} from '../util/index'
import {arrayMethods} from './array'
class Observer{
    constructor(value){
        // vue 如果数据的层次过多 需要递归的去解析对象中的属性 依次增加set和get方法
        // value.__ob__= this // 我给每一个监控的对象都增加一个__ob__属性
          // 防止 __ob__ 被修改 遍历 
          Object.defineProperty(value,'__ob__',{
            enumerable:false,
            configurable:false,
            value:this
        })
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
        for(let i=o;i<value.length;i++){
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
    observe(value) // 递归实现深度检测
    Object.defineProperty(data,key,{
        get(){  // 获取值的时候做一些操作
            return value;
        },
        set(newValue){  // 设值的时候做一些操作
            if(newValue===value) return 
            observe(newValue) // 继续劫持用户设置的值  因为有可能用户设置的值是一个对象

            value = newValue 
        }
    })
}

export function observe(data){
 // console.log(data)
    if(!isObject(data)){
        return 
    }
    return new Observer(data) // 用来观测数据


}
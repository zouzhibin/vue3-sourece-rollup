import {pushTarget,popTarget} from './dep'
import {queueWatcher} from './schedular'
let id = 0
class Watcher{
    constructor(vm,exprOrFn,callback,options){
        this.vm = vm
        this.callback = callback
        this.options = options
        this.id = id++
        this.getter = exprOrFn; // 将内部传过来的回调函数 放到getter属性上
        this.depsId = new Set()// es6中的集合 （不能放重复项）\
        this.deps = []
        this.get() // 调用get方法  会让渲染watcher执行
    }
    addDep(dep){ //watcher 里不能放重复的dep dep里不能放重复的watcher
        let id = dep.id
        if(!this.depsId.has(id)){
            this.depsId.add(id)
            this.deps.push(dep)
            dep.addSub(this)
        }
    }
    get(){
        pushTarget(this) // 把Watcher存起来
        this.getter() // 渲染watcher 的执行 当渲染watcher执行的时候 会去取值 {{name}} {{age}}
        popTarget() // 移除watcher
    }
    update(){
        // 等待着 一起来更新 因为每次调用update的时候 都放入了watcher
        // this.get()
        queueWatcher(this)
    }
    run(){
        this.get()
    }
}


export default Watcher
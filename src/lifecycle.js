export function mountComponent(vm,el){
    const options = vm.$options ; // render
    vm.$el = el; // 真实的dom元素

    // 渲染页面
    let updateComponent = ()=>{ // 无论是渲染还是更新都会调用此方法
        // 返回的是虚拟dom
        vm._update(vm._render())

    }
    // 渲染watcher 每个组件都有一个watcher vm.$watch(()=>)
    new Watcher(vm,updateComponent,()=>{},true) // true 表示他是一个渲染watcher
}

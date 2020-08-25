
let callbacks = []
let waitting = false

function flushCallback(){
    callbacks.forEach(cb=>cb())
    waitting = false
    callbacks = []
}


export function nextTick(){
    // 多次调用nextTick如果没有刷新的时候 就先把他放到数组中
    // 刷新后 更改waitting
    callbacks.push(cb)
    if(waitting === false){
        setTimeout(flushCallback,0)
        waitting = true
    }
}
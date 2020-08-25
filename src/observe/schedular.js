import { nextTick } from "../util/next-tick"

let queue = []
let has = {}
function flushSchedularQueue(){
    queue.forEach(watcher=>watcher.run())
    queue = []
    has = {} 
}
export function queueWatcher(watch){
    const id = watch.id
    if(has[id]===null){
        queue.push(watch)
        has[id] = true
        // 宏任务 和微任务 (vue里使用Vue.nextTick)
        // Vue.nextTick =promise/mutationObserver/setImmediate/setTimeout
       nextTick(flushSchedularQueue)
    }
}

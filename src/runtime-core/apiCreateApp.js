import { createVnode } from "./vnode"

export function createAppAPI(render){
    return (rootComponent)=>{
        const app = {
            mount(container){ // 和平台是无关的

                const vode = createVnode(rootComponent)
                render(vode,container)

            }
        }
        return app
    }
}
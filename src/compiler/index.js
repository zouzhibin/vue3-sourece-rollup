import {parseHTML} from './parse-html'
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

import {generate} from './generate'
export function compileToFunction(template) {
    // 1、解析html字符串 将html字符串=>ast语法树
    let root = parseHTML(template)


    let code = generate(root)
    // console.log(code)

    // 核心思路就是将模板转化成 下面这段字符串
    // 2.需要将ast 语法树生成最终的render函数 就是字符串拼接  （模板引擎）
    // <div id="app"><p>hello {{name}}</p>hello</div>
    // 将ast树 再次转换成js的语法
    // _c("div",{id:app},_c("p",undefined,_v('hello+_s(name))),_v('hello'))
    // console.log(root)

    // 所有的模板引擎实现 都需要new Function + with

    let renderFn = new Function(`with(this) {return ${code}}`)
    // 得到是这个 _c("div",{id:"app"},_c("span",undefined,_v("hello"+_s(name))))

    // vue 的render 他返回的是虚拟dom
    return renderFn
}


/* <div>
    <p></p>
</div> */

// let root = {
//     tag:'div',
//     attrs:[{name:'id',value:'app'}],
//     parent:null,
//     type:1,
//     children:[{
//         tag:'div',
//         attrs:[{name:'id',value:'app'}],
//         parent:null,
//         type:13
//     }]
// }

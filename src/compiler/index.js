import {parseHTML} from './parse-html'
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
function genProps(attrs){ // 处理属性 拼接成属性的字符串
    let str = '';
    for(let i=0;i<attrs.length;i++){
        let attr = attrs[i];
        if(attrs.name ==='style'){
            // style="color:red;fontSize:14px"=>{style:{color:'red'},id:name}
            let obj ={}
            attr.value.split(';').forEach(item=>{
                let [key,value] = item.split(':');
                obj[key] = value
            })
            attr.value = obj
        }
        str+= `${attr.name}:${JSON.stringify(attr.value)},`
    }
    return `{${str.slice(0,-1)}}`
}
function genChildren(el){
    let children = el.children;
    if(children&&children.length>0){
        return `${children.map(c=>gen(c)).join(',')}`
    }else{
        return false
    }
}
function gen(node){
    if(node.type===1){
        // 元素标签
        return generate(node)
    }else{
        let text = node.text; // a {{name}} b{{age}} c
        let tokens = [];
        let match,index;
        let lastIndex = defaultTagRE.lastIndex=0
        while(match = defaultTagRE.exec(text)){
            index = match.index
            if(index>lastIndex){
                tokens.push(JSON.stringify(text.slice(lastIndex,index)))
            }
            // console.log(match)
            tokens.push(`_s(${match[1].trim()})`)
            lastIndex = index+match[0].length;
        }
        if(lastIndex<text.length){
            tokens.push(JSON.stringify(text.slice(lastIndex)))
        }

        // _v("a"+_s(name)+"b"+_s(age)+'c')
        return `_v(${tokens.join('+')})`
    }
}

function generate(el){ // [name:"id",value:'app',{}] {id:app,a:1,b:2}
    let children = genChildren(el);
    let code = `_c("${el.tag}",${
        el.attrs.length?genProps(el.attrs):'undefined'
    }${children?`,${children}`:''})

    `
    return code
}

export function compileToFunction(template) {
    // 1、解析html字符串 将html字符串=>ast语法树
    let root = parseHTML(template)


    let code = generate(root)
    console.log(code)

    // 核心思路就是将模板转化成 下面这段字符串
    // 2.需要将ast 语法树生成最终的render函数 就是字符串拼接  （模板引擎）
    // <div id="app"><p>hello {{name}}</p>hello</div>
    // 将ast树 再次转换成js的语法
    // _c("div",{id:app},_c("p",undefined,_v('hello+_s(name))),_v('hello'))
    // console.log(root)

    // 所有的模板引擎实现 都需要new Function + with
    
    let renderFn = new Function(`with(this) {return ${code}}`)


    // vue 的render 他返回的是虚拟dom
    return function render() {

    }
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
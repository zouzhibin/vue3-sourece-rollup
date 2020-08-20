// ast 语法树 使用对象来描述原生语法的  虚拟dom用对象来描述dom结构的
// ?: 匹配不捕获

const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // abc-aaa
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // <aaa:asdads>
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >  // 空格开头 />这样判断是否结束
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g


let root = null ; // ast 语法树的树根
let currentParent; // 标识当前父亲是谁

const ELMENT_TYPE = 1 // 代表元素
const TEXT_TYPE = 3
let stack = []
// 创建元素ast语法树
function createASTElement(tagName,attrs){
    return {
        tag:tagName,
        type:ELMENT_TYPE,
        children:[],
        attrs,
        parent:null
    }
}


// tagName 开始标签  attrs 属性
function start(tagName,attrs){
    // console.log('开始标签:',tagName,'属性是:',attrs)
    // 遇到开始标签 就创建一个ast元素
    let element = createASTElement(tagName,attrs)
    if(!root){
        root = element;
    }
    currentParent = element; // 把当前元素标记成父ast树
    stack.push(element) // 将开始标签存放到栈中

}
// 文本
function chars(text){
    // console.log('文本:',text)
    text = text.replace(/\s/g,'');
    if(text){
        currentParent.children.push({
            text,
            type:TEXT_TYPE
        })
    }

}

// 结束标签 <div><p></p></div>
function end(tagName){
    // console.log('结束标签',tagName)
    let element = stack.pop()
    // 我要标识当前这个p 是属于这个div儿子的
    currentParent = stack[stack.length-1]
    if(currentParent){
        element.parent = currentParent;
        currentParent.children.push(element) // 实现了一个树的父子关系
    }
}

export function parseHTML(html) {

    // 不停的去解析html字符串
    while (html) {
        let textEnd = html.indexOf('<')
        if (textEnd === 0) {
            // 如果当前索引为0 肯定是一个标签  开始标签 或者结束标签
            let startTagMatch = parseStartTag() // 通过这个方法获取到的匹配的结果 tagName attrs

            // 匹配开始标签
            if(startTagMatch){
                start(startTagMatch.tagName,startTagMatch.attrs)
                continue; // 如果开始标签匹配完毕后 继续下一次匹配
            }
            
            let endTagMatch = html.match(endTag)
            if(endTagMatch){
                advance(endTagMatch[0].length)
                end(endTagMatch[1])
                continue;
            }
        }
        let text;
        // 去掉空格 和文本内容
        if(textEnd>=0){
            text = html.substring(0,textEnd)
        }
        // 有可能有文本
        if(text){
            advance(text.length)
            chars(text)
            // break
        }   

    }
    // 解析标签 解析一个一个删掉前面的 比如 <div id="app"></div> 匹配到<div 然后就删掉 直到全部没有为止
    // 清理所有剩余标签
    function advance(n) {
        html = html.substring(n)
    }

    // 解析开始标签 上的内容 和属性 因为只有开始标签采用属性
    function parseStartTag() {
        let start = html.match(startTagOpen)
        if (start) {
            const match = {
                tagName: start[1],
                attrs: []
            }

            advance(start[0].length) // 将标签删除
            // console.log(html)
            let end, attr;
            // console.log('html.match(startTagClose)',html.match(startTagClose))
            // console.log('html.match(attribute)',html.match(attribute))
            // 将属性解析
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                advance(attr[0].length) // 将属性去掉
                match.attrs.push({
                    name: attr[1],
                    value: attr[3] || attr[4] || attr[5]
                })
            }
            if(end){ // 去掉开始标签的>
                advance(end[0].length) // 将属性去掉
                return match
            }
            // console.log('sss',end)
        }

    }

    return root
}

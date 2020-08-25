(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  /**
   *
   * @param {*} data 当前数据是不是对象
   */
  function isObject(data) {
    return _typeof(data) === 'object' && data !== null;
  }
  function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[source][key];
      },
      set: function set(newValue) {
        vm[source][key] = newValue;
      }
    });
  }
  /**
   * 是否是原生标签
   * @param tagName
   */

  function isReservedTag(tagName) {
    var str = 'p,div,span,input,button';
    var obj = {};
    str.split(',').forEach(function (tag) {
      obj[tag] = true;
    });
    return obj[tagName];
  }
  function def(data, key, value) {
    Object.defineProperty(data, key, {
      enumerable: false,
      configurable: false,
      value: value
    });
  }
  var LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestory', 'destroyed'];
  var strats = []; //合并hooks

  function mergeHook(parentVal, childVal) {
    if (childVal) {
      if (parentVal) {
        return parentVal.concat(childVal);
      } else {
        return [childVal];
      }
    } else {
      return parentVal;
    }
  }

  LIFECYCLE_HOOKS.forEach(function (hook) {
    strats[hook] = mergeHook;
  });

  function mergeAssets(parentVal, childVal) {
    var res = Object.create(parentVal);

    if (childVal) {
      for (var key in childVal) {
        res[key] = childVal[key];
      }
    }

    return res;
  }

  strats.components = mergeAssets; // 合并两个对象

  function mergeOptions(parent, child) {
    var options = {};

    for (var key in parent) {
      mergeFiled(key);
    }

    for (var _key in child) {
      if (!parent.hasOwnProperty(_key)) {
        mergeFiled(_key);
      }
    }

    function mergeFiled(key) {
      if (strats[key]) {
        return options[key] = strats[key](parent[key], child[key]);
      }

      if (_typeof(parent[key]) === 'object' && _typeof(child[key]) === 'object') {
        options[key] = _objectSpread2(_objectSpread2({}, parent[key]), child[key]);
      } else if (child[key] === null) {
        optionsp[key] = parent[key];
      } else {
        options[key] = child[key];
      }
    }

    return options;
  }

  // 重写数组的七个方法  push shift unshift pop reverse sort splice 会导致数组本身发生变化
  var oldArrayMethods = Array.prototype; // value.__proto__== arrayMethods 原型链查找的问题  会向上查找 先查找我重写的 重写的没有会继续向上查找
  // arrayMethods.__proto__ = oldArrayMethods

  var arrayMethods = Object.create(oldArrayMethods);
  var methods = ['push', 'shift', 'unshift', 'pop', 'reverse', 'sort', 'splice'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // console.log('用户调用了push 方法') //AOP切片编程
      var result = oldArrayMethods[method].apply(this, args); // 调用原生的数组方法
      // push unshift 添加的元素可能还是一个对象

      var inserted; // 当前用户插入的元素

      var ob = this.__ob__;

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          // 3个 新增的属性 splice 有删除 有新增的功能 arr.splice(0,1,{name:1})
          inserted = args.slice(2);
          break;
      }

      if (inserted) {
        ob.observeArray(inserted); // 将新增属性继续观测
      }

      ob.dep.notify(); // 如果用户调用了push方法我会通知当前这个dep去更新

      return result;
    };
  });

  var id = 0;

  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.id = id++;
      this.subs = [];
    }

    _createClass(Dep, [{
      key: "addSub",
      value: function addSub(watcher) {
        this.subs.push(watcher);
      }
    }, {
      key: "depend",
      value: function depend() {
        // 让这个watcher 记住我当前的dep
        // 如果watcher没存过dep,dep肯定不能存过watcher
        // Dep.target = watcher
        Dep.target.addDep(this); // this.subs.push(Dep.target) // 观察者模式
      }
    }, {
      key: "notify",
      value: function notify() {
        this.subs.forEach(function (watcher) {
          return watcher.update();
        });
      }
    }]);

    return Dep;
  }();

  var stack = []; // 目前可以做到将 watcher保留起来 和移除的功能

  function pushTarget(watcher) {
    Dep.target = watcher;
    stack.push(watcher);
  }
  function popTarget() {
    stack.pop();
    Dep.target = stack[stack.length - 1];
  }

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      // vue 如果数据的层次过多 需要递归的去解析对象中的属性 依次增加set和get方法
      // value.__ob__= this // 我给每一个监控的对象都增加一个__ob__属性
      // 防止 __ob__ 被修改 遍历 
      //   Object.defineProperty(value,'__ob__',{
      //     enumerable:false,
      //     configurable:false,
      //     value:this
      // })
      this.dep = new Dep(); // 给数组用的

      def(value, '__ob__', this);

      if (Array.isArray(value)) {
        // 如果是数组的话并不会 对索引进行观测 因为会导致性能问题
        // 前端开发中很少很少 去操作索引 push shift unshift
        value.__proto__ = arrayMethods; // 给数组的原型重写方法 当访问数组方法的时候  会先访问自身的
        // 如果数组里放的是对象我再监控劫持

        this.observeArray(value);
      } else {
        this.walk(value);
      }
    }

    _createClass(Observer, [{
      key: "observeArray",
      value: function observeArray(value) {
        for (var i = 0; i < value.length; i++) {
          observe(value[i]);
        }
      }
    }, {
      key: "walk",
      value: function walk(data) {
        var keys = Object.keys(data);

        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          var value = data[key];
          defineReactive(data, key, value); // 定义响应式数据
        }
      }
    }]);

    return Observer;
  }();

  function defineReactive(data, key, value) {
    var dep = new Dep(); // 这里这个value 可能是数组 也可能是对象 返回的结果是observer的实例
    // 当前这个value对应的observer

    var childOb = observe(value); // 递归实现深度检测

    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: true,
      get: function get() {
        // 获取值的时候做一些操作
        //每个属性都对应着自己的watcher
        if (Dep.target) {
          // 如果当前有watcher
          dep.depend(); // 意味着我要将watcher存起来

          if (childOb) {
            childOb.dep.depend(); // 收集了数组的相关依赖
            // 如果数组中还有数组

            if (Array.isArray(value)) {
              dependArray(value);
            }
          }
        }

        return value;
      },
      set: function set(newValue) {
        // 设值的时候做一些操作
        if (newValue === value) return;
        observe(newValue); // 继续劫持用户设置的值  因为有可能用户设置的值是一个对象

        value = newValue;
        dep.notify(); // 通知依赖的watcher来进行一个更新操作
      }
    });
  }

  function dependArray(value) {
    for (var i = 0; i < value.length; i++) {
      var current = value[i]; //将数组中的每一个都取出来 数据变化后，也去更新视图
      // 数组中的数组的依赖收集

      current.__ob__ && current.__ob__.dep.depend();

      if (Array.isArray(current)) {
        dependArray(current);
      }
    }
  }

  function observe(data) {
    // console.log(data)
    if (!isObject(data)) {
      return;
    }

    return new Observer(data); // 用来观测数据
  }

  function initState(vm) {
    var opts = vm.$options; // vue的数据来源 属性 方法 数据 计算属性  watch

    if (opts.props) ;

    if (opts.methods) ;

    if (opts.data) {
      initData(vm);
    }

    if (opts.computed) ;

    if (opts.watch) ;

    console.log(vm);
  }

  function initData(vm) {
    // 数据初始化工作
    var data = vm.$options.data; // 用户传递的data
    //  vm._data 是为了 可以this._data 可以访问到值   data.call 是因为data 有可能是个函数  在函数里访问this时  可以访问到vue这个实例

    data = vm._data = typeof data === 'function' ? data.call(vm) : data; // 对象劫持 用户改变了数据 我希望可以得到通知 =>刷新页面
    // 为了让用户更好的使用 我希望可以直接vm.xxx

    for (var key in data) {
      proxy(vm, '_data', key);
    } // MVVM模式 数据变化可以驱动视图变化
    // Object.defineProperty() 给属性增加get方法 和set方法


    observe(data); // 响应式原理
    // console.log(data)
  }

  // ast 语法树 使用对象来描述原生语法的  虚拟dom用对象来描述dom结构的
  // ?: 匹配不捕获
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // abc-aaa

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // <aaa:asdads>

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则 捕获的内容是标签名

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配标签结尾的 </div>

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的

  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >  // 空格开头 />这样判断是否结束
  function parseHTML(html) {
    var root = null; // ast 语法树的树根

    var currentParent; // 标识当前父亲是谁

    var ELMENT_TYPE = 1; // 代表元素

    var TEXT_TYPE = 3;
    var stack = []; // 创建元素ast语法树

    function createASTElement(tagName, attrs) {
      return {
        tag: tagName,
        type: ELMENT_TYPE,
        children: [],
        attrs: attrs,
        parent: null
      };
    } // tagName 开始标签  attrs 属性


    function start(tagName, attrs) {
      // console.log('开始标签:',tagName,'属性是:',attrs)
      // 遇到开始标签 就创建一个ast元素
      var element = createASTElement(tagName, attrs);

      if (!root) {
        root = element;
      }

      currentParent = element; // 把当前元素标记成父ast树

      stack.push(element); // 将开始标签存放到栈中
    } // 文本


    function chars(text) {
      // console.log('文本:',text)
      text = text.replace(/\s/g, '');

      if (text) {
        currentParent.children.push({
          text: text,
          type: TEXT_TYPE
        });
      }
    } // 结束标签 <div><p></p></div>


    function end(tagName) {
      // console.log('结束标签',tagName)
      var element = stack.pop(); // 我要标识当前这个p 是属于这个div儿子的

      currentParent = stack[stack.length - 1];

      if (currentParent) {
        element.parent = currentParent;
        currentParent.children.push(element); // 实现了一个树的父子关系
      }
    } // 不停的去解析html字符串


    while (html) {
      var textEnd = html.indexOf('<');

      if (textEnd === 0) {
        // 如果当前索引为0 肯定是一个标签  开始标签 或者结束标签
        var startTagMatch = parseStartTag(); // 通过这个方法获取到的匹配的结果 tagName attrs
        // 匹配开始标签

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue; // 如果开始标签匹配完毕后 继续下一次匹配
        }

        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
          continue;
        }
      }

      var text = void 0; // 去掉空格 和文本内容

      if (textEnd >= 0) {
        text = html.substring(0, textEnd);
      } // 有可能有文本


      if (text) {
        advance(text.length);
        chars(text); // break
      }
    } // 解析标签 解析一个一个删掉前面的 比如 <div id="app"></div> 匹配到<div 然后就删掉 直到全部没有为止
    // 清理所有剩余标签


    function advance(n) {
      html = html.substring(n);
    } // 解析开始标签 上的内容 和属性 因为只有开始标签采用属性


    function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length); // 将标签删除
        // console.log(html)

        var _end, attr; // console.log('html.match(startTagClose)',html.match(startTagClose))
        // console.log('html.match(attribute)',html.match(attribute))
        // 将属性解析


        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          advance(attr[0].length); // 将属性去掉

          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
        }

        if (_end) {
          // 去掉开始标签的>
          advance(_end[0].length); // 将属性去掉

          return match;
        } // console.log('sss',end)

      }
    }

    return root;
  }

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

  function genProps(attrs) {
    // 处理属性 拼接成属性的字符串
    var str = '';

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];

      if (attr.name === 'style') {
        (function () {
          // style="color:red;fontSize:14px"=>{style:{color:'red'},id:name}
          var obj = {}; // console.log(attr.value.split(';'))

          attr.value.split(';').forEach(function (item) {
            var _item$split = item.split(':'),
                _item$split2 = _slicedToArray(_item$split, 2),
                key = _item$split2[0],
                value = _item$split2[1];

            obj[key] = value;
          });
          attr.value = obj;
        })();
      }

      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    }

    return "{".concat(str.slice(0, -1), "}");
  }

  function genChildren(el) {
    var children = el.children;

    if (children && children.length > 0) {
      return "".concat(children.map(function (c) {
        return gen(c);
      }).join(','));
    } else {
      return false;
    }
  }

  function gen(node) {
    if (node.type === 1) {
      // 元素标签
      return generate(node);
    } else {
      var text = node.text; // a {{name}} b{{age}} c

      var tokens = [];
      var match, index;
      var lastIndex = defaultTagRE.lastIndex = 0;

      while (match = defaultTagRE.exec(text)) {
        index = match.index;

        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        } // console.log(match)


        tokens.push("_s(".concat(match[1].trim(), ")"));
        lastIndex = index + match[0].length;
      }

      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      } // _v("a"+_s(name)+"b"+_s(age)+'c')


      return "_v(".concat(tokens.join('+'), ")");
    }
  }

  function generate(el) {
    // [name:"id",value:'app',{}] {id:app,a:1,b:2}
    var children = genChildren(el);
    var code = "_c(\"".concat(el.tag, "\",").concat(el.attrs.length ? genProps(el.attrs) : 'undefined').concat(children ? ",".concat(children) : '', ")\n\n    ");
    return code;
  }

  function compileToFunction(template) {
    // 1、解析html字符串 将html字符串=>ast语法树
    var root = parseHTML(template);
    var code = generate(root); // console.log(code)
    // 核心思路就是将模板转化成 下面这段字符串
    // 2.需要将ast 语法树生成最终的render函数 就是字符串拼接  （模板引擎）
    // <div id="app"><p>hello {{name}}</p>hello</div>
    // 将ast树 再次转换成js的语法
    // _c("div",{id:app},_c("p",undefined,_v('hello+_s(name))),_v('hello'))
    // console.log(root)
    // 所有的模板引擎实现 都需要new Function + with

    var renderFn = new Function("with(this) {return ".concat(code, "}")); // 得到是这个 _c("div",{id:"app"},_c("span",undefined,_v("hello"+_s(name))))
    // vue 的render 他返回的是虚拟dom

    return renderFn;
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

  var callbacks = [];
  var waitting = false;

  function flushCallback() {
    callbacks.forEach(function (cb) {
      return cb();
    });
    waitting = false;
    callbacks = [];
  }

  function nextTick() {
    // 多次调用nextTick如果没有刷新的时候 就先把他放到数组中
    // 刷新后 更改waitting
    callbacks.push(cb);

    if (waitting === false) {
      setTimeout(flushCallback, 0);
      waitting = true;
    }
  }

  var has = {};

  function queueWatcher(watch) {
    var id = watch.id;

    if (has[id] === null) {
      has[id] = true; // 宏任务 和微任务 (vue里使用Vue.nextTick)
      // Vue.nextTick =promise/mutationObserver/setImmediate/setTimeout

      nextTick();
    }
  }

  var id$1 = 0;

  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, exprOrFn, callback, options) {
      _classCallCheck(this, Watcher);

      this.vm = vm;
      this.callback = callback;
      this.options = options;
      this.id = id$1++;
      this.getter = exprOrFn; // 将内部传过来的回调函数 放到getter属性上

      this.depsId = new Set(); // es6中的集合 （不能放重复项）\

      this.deps = [];
      this.get(); // 调用get方法  会让渲染watcher执行
    }

    _createClass(Watcher, [{
      key: "addDep",
      value: function addDep(dep) {
        //watcher 里不能放重复的dep dep里不能放重复的watcher
        var id = dep.id;

        if (!this.depsId.has(id)) {
          this.depsId.add(id);
          this.deps.push(dep);
          dep.addSub(this);
        }
      }
    }, {
      key: "get",
      value: function get() {
        pushTarget(this); // 把Watcher存起来

        this.getter(); // 渲染watcher 的执行 当渲染watcher执行的时候 会去取值 {{name}} {{age}}

        popTarget(); // 移除watcher
      }
    }, {
      key: "update",
      value: function update() {
        // 等待着 一起来更新 因为每次调用update的时候 都放入了watcher
        // this.get()
        queueWatcher(this);
      }
    }, {
      key: "run",
      value: function run() {
        this.get();
      }
    }]);

    return Watcher;
  }();

  function patch(oldVnode, vnode) {
    // console.log(oldVnode,vnode)
    if (!oldVnode) {
      // 通过当前的虚拟节点 创建元素并返回
      return createElm(vnode);
    } else {
      var isRealElement = oldVnode.nodeType; // 判断是否是真实元素  因为只有真实元素采用nodeType属性

      if (isRealElement) {
        var oldElm = oldVnode; // div id="app"

        var parentElm = oldVnode.parentNode; //body

        var el = createElm(vnode);
        parentElm.insertBefore(el, oldElm.nextSibling);
        parentElm.removeChild(oldElm); // 需要将渲染好的结果返回出去

        return el;
      }
    } // 递归创建真实节点  替换掉老的节点

  }

  function createComponent(vnode) {
    // 初始化的作用
    var i = vnode.data; // 需要创建组件的实例

    if ((i = i.hook) && (i = i.init)) {
      i(vnode);
    } // 执行完毕后


    if (vnode.componentsInstance) {
      return true;
    }
  } // 根据虚拟节点创建出真实的节点


  function createElm(vnode) {
    var tag = vnode.tag,
        children = vnode.children,
        key = vnode.key,
        data = vnode.data,
        text = vnode.text; // 是标签就创建出标签

    if (typeof tag === 'string') {
      // 不是tag 是字符串的就是普通的html 还有可能就是我们的组件
      // 实例化组件
      if (createComponent(vnode)) {
        // 表示是组件
        // 这里返回的是真实的dom
        return vnode.componentsInstance.$el;
      }

      vnode.el = document.createElement(tag); // 递归创建儿子节点 将儿子节点扔到父节点中

      updateProperties(vnode);
      children.forEach(function (child) {
        return vnode.el.appendChild(createElm(child));
      });
    } else {
      // 虚拟dom上映射着真实dom 方便后续更新操作
      vnode.el = document.createTextNode(text);
    } // 如果不是标签就是文本


    return vnode.el;
  } // 更新属性 如ID style class


  function updateProperties(vnode) {
    var newProps = vnode.data || {};
    var el = vnode.el; // console.log('newProps',newProps)

    for (var key in newProps) {
      if (key === 'style') {
        for (var styleName in newProps.style) {
          el.style[styleName] = newProps.style[styleName];
        }
      } else if (key === 'class') {
        el.className = newProps["class"];
      } else {
        el.setAttribute(key, newProps[key]);
      }
    }
  }

  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      // 我要通过虚拟节点 渲染出真实的dom
      var vm = this;
      vm.$el = patch(vm.$el, vnode); // 需要用虚拟节点 创建出真实节点 替换掉 真实的$el
    };
  }
  function mountComponent(vm, el) {
    var options = vm.$options; // render

    vm.$el = el; // 真实的dom元素
    // Watcher 就是用来渲染的
    // vm._render 通过解析的render方法 渲染出虚拟dom
    // vm._update 通过虚拟dom 创建真实的dom

    callHook(vm, 'beforeMount'); // 渲染页面

    var updateComponent = function updateComponent() {
      // 无论是渲染还是更新都会调用此方法
      // vm._render() 返回的是虚拟dom // vm._update创建真实节点 去更新页面
      vm._update(vm._render());
    }; // 渲染watcher 每个组件都有一个watcher vm.$watch(()=>)


    new Watcher(vm, updateComponent, function () {}, true); // true 表示他是一个渲染watcher

    callHook(vm, 'mounted');
  }
  function callHook(vm, hook) {
    var handlers = vm.$options[hook];

    if (handlers) {
      // 找到对应的钩子依次执行
      for (var i = 0; i < handlers.length; i++) {
        handlers[i].call(vm);
      }
    }
  }

  // 在原型上添加一个init 方法
  function initMixin(Vue) {
    // 初始化流程
    Vue.prototype._init = function (options) {
      // 数据的劫持
      var vm = this; //vue中使用this.options 指代的就是用户传递的属性
      // 将用户传递的 和全局的进行一个合并
      // vm.constructor.options = Vue.prototype

      vm.$options = mergeOptions(vm.constructor.options, options);
      vm.$options = options;
      callHook(vm, 'beforeCreated'); // 初始化状态

      initState(vm); // 分割代码

      callHook(vm, 'created'); // 如果用户传入传入了el属性 需要将页面渲染出来
      // 如果用户传入了el 就要实现挂载流程

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      var options = vm.$options;
      el = document.querySelector(el); // 默认先会查找有没有render方法，没有render 会采用template template 也没有就用el中的内容

      if (!options.render) {
        // 对模板进行编译
        var template = options.template; //取出模板

        if (!template && el) {
          template = el.outerHTML;
        }

        var render = compileToFunction(template);
        options.render = render; // 我们需要将template 转换成render 方法 
      } // 渲染当前的组件 挂载这个组件 


      mountComponent(vm, el);
    }; // 用户调用的nextTick


    Vue.prototype.$nextTick = nextTick;
  }

  function createElement(vm, tag) {
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    console.log('tag==', tag); // console.log('tag,data,...children',tag,data,...children)

    var key = data.key;

    if (key) {
      delete data.key;
    } // 如果是原生标签 代表不是组件


    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }

    if (isReservedTag(tag)) {
      return vnode(tag, data, key, children, undefined);
    } else {
      // 如果是组件的话
      var Ctor = vm.$options.components[tag];
      return createComponent$1(vm, tag, data, key, children, Ctor);
    }
  }

  function createComponent$1(vm, tag, data, key, children, Ctor) {
    if (isObject(Ctor)) {
      Ctor = vm.$options._base.extend(Ctor);
    }

    data.hook = {
      init: function init(vnode) {
        // 当前组件的实例 就是componentInstance
        var child = vnode.componentsInstance = new Ctor({
          _isComponent: true
        });
        child.$mount();
      }
    };
    return vnode("vue-component-".concat(Ctor.cid, "-").concat(tag), data, key, undefined, {
      Ctor: Ctor,
      children: children
    });
  }

  function createTextNode(vm, text) {
    return vnode(undefined, undefined, undefined, undefined, text);
  }
  /**
   *
   * @param tag
   * @param data
   * @param key
   * @param children
   * @param text
   * @param componentOptions 组件的插槽
   * @returns {{data: *, children: *, tag: *, text: *, key: *}}
   */

  function vnode(tag, data, key, children, text, componentOptions) {
    return {
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text
    };
  } //虚拟节点 就是通过_C _v 实现用对象来描述dom的操作 （对象）
  //1) 将template 转换成ast 语法树->生成render方法->生成虚拟dom
  // ->真实的dom  重新生成虚拟dom ->更新dom

  function renderMixin(Vue) {
    // _c 创建元素的虚拟节点
    // _v 创建文本的虚拟节点
    // _s JSON.stringfy
    Vue.prototype._c = function () {
      return createElement.apply(void 0, [this].concat(Array.prototype.slice.call(arguments))); // tag,data,children1,children2
    };

    Vue.prototype._v = function (text) {
      return createTextNode(this, text);
    };

    Vue.prototype._s = function (val) {
      return val === null ? '' : _typeof(val) === 'object' ? JSON.stringify(val) : val;
    };

    Vue.prototype._render = function () {
      var vm = this;
      var render = vm.$options.render; // console.log(render)
      // 返回的是一个虚拟节点

      var vnode = render.call(vm); // 去实例上取值
      // console.log(vnode)

      return vnode;
    };
  }

  function initMixin$1(Vue) {
    console.log();

    Vue.mixin = function (mixin) {
      // 如何实现两个对象的合并
      this.options = mergeOptions(this.options, mixin);
    }; // 生命周期的合并策略
    // Vue.mixin()

  }

  var ASSETS_TYPES = ['component', 'directive', 'filter'];

  function initAssetRegisters(Vue) {
    ASSETS_TYPES.forEach(function (type) {
      Vue[type] = function (id, definition) {
        if (type === 'component') {
          // 注册全局组件
          // 使用extend 方法 将对象变成构造函数
          // 子组件可能也有这个VueComponent.component方法
          // console.log(definition)
          definition = this.options._base.extend(definition);
          console.log('ss', definition);
        }

        this.options[type + 's'][id] = definition;
      };
    });
  }

  function initExtend(Vue) {
    // 为什么要有子类和父类 new Vue (Vue的构造函数) __init
    // 创建子类 继承于父类 扩展的时候都扩展到自己的属性上
    var cid = 0;

    Vue.extend = function (extendOptions) {
      console.log(extendOptions);

      var Sub = function VueComponent(options) {
        this.__init(options);
      };

      Sub.cid = cid++;
      Sub.prototype = Object.create(this.prototype);
      Sub.prototype.constructor = Sub;
      Sub.options = mergeOptions(this.options, extendOptions);
      return Sub;
    };
  }

  function initGlobalAPI(Vue) {
    // 整合了所以的全局相关的内容
    Vue.options = {};
    initMixin$1(Vue); // 初始化的全局过滤器 指令 组件

    ASSETS_TYPES.forEach(function (type) {
      Vue.options[type + 's'] = {};
    });
    Vue.options._base = Vue; //_base 是Vue的构造函数
    // 注册extend方法

    initExtend(Vue);
    initAssetRegisters(Vue);
  }

  function Vue(options) {
    // 进行vue的初始化操作
    this._init(options);
  } // 给Vue原型扩展方法
  // 通过引入文件的方式 给Vue 原型上添加方法


  initMixin(Vue); // 给Vue原型上添加一个_init方法

  renderMixin(Vue); //

  lifecycleMixin(Vue); // 
  // 初始化全局的api 给类添加方法

  initGlobalAPI(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map

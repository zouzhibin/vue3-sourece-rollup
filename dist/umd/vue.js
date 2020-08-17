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

  /**
   * 
   * @param {*} data 当前数据是不是对象
   */
  function isObject(data) {
    return _typeof(data) === 'object' && data !== null;
  }

  // 重写数组的七个方法  push shift unshift pop reverse sort splice 会导致数组本身发生变化
  var oldArrayMethods = Array.prototype; // value.__proto__== arrayMethods 原型链查找的问题  会向上查找 先查找我重写的 重写的没有会继续向上查找
  // arrayMethods.__proto__ = oldArrayMethods

  var arrayMethods = Object.create(oldArrayMethods);
  var methods = ['push', 'shift', 'unshift', 'pop', 'reverse', 'sort', 'splice'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      console.log('用户调用了push 方法'); //AOP切片编程

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

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

      return result;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      // vue 如果数据的层次过多 需要递归的去解析对象中的属性 依次增加set和get方法
      // value.__ob__= this // 我给每一个监控的对象都增加一个__ob__属性
      // 防止 __ob__ 被修改 遍历 
      Object.defineProperty(value, '__ob__', {
        enumerable: false,
        configurable: false,
        value: this
      });

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
        for (var i = o; i < value.length; i++) {
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
    observe(value); // 递归实现深度检测

    Object.defineProperty(data, key, {
      get: function get() {
        // 获取值的时候做一些操作
        return value;
      },
      set: function set(newValue) {
        // 设值的时候做一些操作
        if (newValue === value) return;
        observe(newValue); // 继续劫持用户设置的值  因为有可能用户设置的值是一个对象

        value = newValue;
      }
    });
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
    // MVVM模式 数据变化可以驱动视图变化
    // Object.defineProperty() 给属性增加get方法 和set方法

    observe(data); // 响应式原理
    // console.log(data)
  }

  // 在原型上添加一个init 方法
  function initMixin(Vue) {
    // 初始化流程
    Vue.prototype._init = function (options) {
      // 数据的劫持
      var vm = this; //vue中使用this.options 指代的就是用户传递的属性

      vm.$options = options; // 初始化状态

      initState(vm); // 分割代码
    };
  }

  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map

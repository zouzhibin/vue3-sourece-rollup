(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Vue = {}));
}(this, (function (exports) { 'use strict';

    function computed() {}

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

    var isObject = function isObject(val) {
      return _typeof(val) === 'object' && val !== null;
    };
    var isSymbol = function isSymbol(val) {
      return _typeof(val) === 'symbol';
    };
    var isArray = Array.isArray;
    var isInteger = function isInteger(key) {
      return '' + parseInt(key, 10) === key;
    };
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var hasOwn = function hasOwn(val, key) {
      return hasOwnProperty.call(val, key);
    };
    var hasChanged = function hasChanged(value, oldValue) {
      return value !== oldValue;
    };

    function effect(fn) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      // effect =>vue2 watch
      var effect = createReactiveEffect(fn);

      if (!options.lazy) {
        effect();
      }
    }
    var uid = 0;
    var activeEffect; // 用来存储当前的effect函数

    var effectStack = [];

    function createReactiveEffect(fn, options) {
      var effect = function effect() {
        if (!effectStack.includes(effect)) {
          // 防止递归执行
          try {
            activeEffect = effect;
            effectStack.push(activeEffect);
            return fn(); // 用户自己写的逻辑,内部会对数据进行取值操作
          } finally {
            effectStack.pop();
            activeEffect = effectStack[effectStack.length - 1];
          }
        }
      };

      effect.id = uid++;
      effect.deps = []; // 用来表示effect中依赖了哪些属性

      return effect;
    } // {object:{key:[effect,effect]}}


    var targetMap = new WeakMap(); // 将属性和effect做一个关联

    function track(target, key) {
      if (activeEffect === undefined) {
        return false;
      }

      var depsMap = targetMap.get(target);

      if (!depsMap) {
        targetMap.set(target, depsMap = new Map());
      }

      var dep = depsMap.get(key);

      if (!dep) {
        depsMap.set(key, dep = new Set());
      }

      if (!dep.has(activeEffect)) {
        // 如果没有effect 就把effect放进集合中
        dep.add(activeEffect);
        activeEffect.deps.push(key); // 双向记忆的过程
      } // console.log('targetMap',targetMap)

    } // 触发依赖收集

    function trigger(target, type, key, value, oldValue) {
      var depsMap = targetMap.get(target);

      if (!depsMap) {
        // 判断是否已经进行过收集依赖
        return false;
      }

      var run = function run(effects) {
        if (effects) effects.forEach(function (effect) {
          return effect();
        });
      }; // 数组有特殊的情况


      if (key === 'length' && isArray(target)) ; else {
        // 对象的处理
        if (key !== undefined) {
          // 说明修改了key
          run(depsMap.get(key));
        }
      }
    }

    function createGetter() {
      return function get(target, key, receiver) {
        var res = Reflect.get(target, key, receiver); // 如果 取得值是symbol类型 我要忽略它

        if (isSymbol(key)) {
          // 数组中有很多symbol的内置方法
          return res;
        }

        console.log('=========', target, key); //依赖收集

        track(target, key);

        if (isObject(res)) {
          //取值是对象进行代理
          return reactive(res);
        }

        return res;
      };
    }

    function createSetter() {
      return function set(target, key, value, receiver) {
        var oldValue = target[key]; // 如果是修改那肯定有老值
        // 看一下有没有这个属性
        // 第一种是数组新增的逻辑 第二种是对象的逻辑

        var hadKey = isArray(target) && isInteger(key) ? Number(key) < target.length : hasOwn(target, key);
        var res = Reflect.set(target, key, value, receiver); // 新增

        if (!hadKey) {
          trigger(target, 'add', key); // 修改   
        } else if (hasChanged(value, oldValue)) {
          trigger(target, 'set', key);
        }

        return res;
      };
    }

    var get = createGetter();
    var set = createSetter();
    var mutableHandlers = {
      get: get,
      // 获取对象中的属性会执行此方法
      set: set //设置属性值得时候会执行此方法

    };

    var proxyMap = new WeakMap();
    function reactive(target) {
      // 将目标变成响应式 Proxy
      return createReactiveObject(target, mutableHandlers); // 核心操作就是当读取文件的时候做依赖收集，当数据变化时重新执行effect
    }

    function createReactiveObject(target, baseHandlers) {
      // 如果不是对象 直接返回出去
      if (!isObject(target)) {
        return target;
      } // 做缓存 看存不存在


      var exisitingProxy = proxyMap.get(target);

      if (exisitingProxy) {
        return exisitingProxy;
      } // 只是对最外层对象做代理 默认不会递归 而且不会重新重写对象中的属性 


      var proxy = new Proxy(target, baseHandlers);
      proxyMap.set(target, proxy); // 将代理的对象和代理后的结果做一个映射表

      return proxy;
    }

    function ref(target) {}

    exports.computed = computed;
    exports.effect = effect;
    exports.reactive = reactive;
    exports.ref = ref;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=vue.js.map

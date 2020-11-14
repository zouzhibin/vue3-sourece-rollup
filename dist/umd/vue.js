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

    var ShapeFlags = {
      ELEMENT: 1,
      FUNCTION_COMPONENT: 1 << 1,
      //2 
      STATEFUL_COMPONENT: 1 << 2,
      //4
      TEXT_CHILDREN: 1 << 3,
      // 8
      ARRAY_CHILDREN: 1 << 4 // 16

    };

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
    var isString = function isString(value) {
      return typeof value === 'string';
    };
    var isFunction = function isFunction(value) {
      return typeof value === 'function';
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


      if (key === 'length' && isArray(target)) {
        depsMap.forEach(function (dep, key) {
          // map可以循环
          if (key === 'length' || key >= value) {
            // 如果改的长度小于数组原有的长度,应该更新视图
            run(dep);
          }
        });
      } else {
        // 对象的处理
        if (key !== undefined) {
          // 说明修改了key
          run(depsMap.get(key));
        }

        switch (type) {
          case 'add':
            if (isArray(target)) {
              // 给数组如果通过索引增加选项
              if (isInteger(key)) {
                // 因为如果页面中直接使用了数组也会对数组进行取值操作
                // 会对length进行收集 新增属性时直接出发length即可
                run(depsMap.get('length'));
              }
            }

            break;
        }
      }
    }

    function createGetter() {
      return function get(target, key, receiver) {
        var res = Reflect.get(target, key, receiver); // 如果 取得值是symbol类型 我要忽略它

        if (isSymbol(key)) {
          // 数组中有很多symbol的内置方法
          return res;
        } // console.log('=========',target,key)
        //依赖收集


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
          trigger(target, 'add', key, value); // 修改   
        } else if (hasChanged(value, oldValue)) {
          trigger(target, 'set', key, value);
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

    function createVnode(type) {
      var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var children = arguments.length > 2 ? arguments[2] : undefined;
      // type类型
      var shapeFlag = isString(type) ? ShapeFlags.ELEMENT : isObject(type) ? ShapeFlags.STATEFUL_COMPONENT : 0;
      var vnode = {
        // 虚拟节点可以表示dom结构 也可以用来表示组件
        type: type,
        props: props,
        children: children,
        component: null,
        // 组件的实例
        el: null,
        key: props.key,
        shapeFlag: shapeFlag // vue3里面非常优秀的做法 虚拟节点的类型 元素 组件

      };

      if (isArray(children)) {
        vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN; // 如果在或的过程中有一个是1就是1
        // 把两个数相加
      } else {
        vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN;
      }

      return vnode;
    }

    function createAppAPI(render) {
      return function (rootComponent) {
        var app = {
          mount: function mount(container) {
            // 和平台是无关的
            var vode = createVnode(rootComponent);
            render(vode, container);
          }
        };
        return app;
      };
    }

    function createComponentInstace(vnode) {
      var instance = {
        type: vnode.type,
        props: {},
        vnode: vnode,
        render: null,
        setupState: null,
        isMounted: false // 默认组件没有挂载

      };
      return instance;
    }
    var setupComponent = function setupComponent(instance) {
      // 1、源码中会对属性进行初始化
      // 2、会对插槽进行初始化
      // 3、调用setup方法
      setupStatefulComponent(instance);
    };

    function setupStatefulComponent(instance) {
      var Component = instance.type; // 组件的虚拟节点

      var setup = Component.setup;

      if (setup) {
        var setUpResult = setup(); // 获取setup返回的值
        // 判断返回的值类型

        handleSetupResult(instance, setUpResult);
      }
    }

    function handleSetupResult(instance, setUpResult) {
      if (isFunction(setUpResult)) {
        instance.render = setUpResult; // 获取render方法
      } else {
        instance.setupState = setUpResult;
      }
    }

    function createRenderer(options) {
      return baseCreateRenderer(options);
    }

    function baseCreateRenderer(options) {
      console.log('options', options);
      var hostCreateElement = options.createElement,
          hostPatchProp = options.patchProps,
          hostSetElementText = options.setElementText,
          hostInsert = options.insert,
          hostRemove = options.remove;

      var patch = function patch(n1, n2, container) {
        console.log('n2', n2);
        var shapeFlag = n2.shapeFlag,
            props = n2.props;

        var mountElemnt = function mountElemnt(vnode, container) {
          // vnode 虚拟节点  container 是容器
          var shapeFlag = vnode.shapeFlag;
          var el = vnode.el = hostCreateElement(vnode.type); // 创建儿子节点

          if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            hostSetElementText(el, vnode.children);
          } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            mountChildren(vnode.children, el);
          }

          if (props) {
            for (var key in props) {
              hostPatchProp(el, key, null, props[key]);
            }
          }

          hostInsert(el, container);
        };

        var mountChildren = function mountChildren(children, container) {
          for (var i = 0; i < children.length; i++) {
            patch(null, children[i], container);
          }
        };

        var mountComponent = function mountComponent(initialVnode, container) {
          // 组件挂载逻辑 1、创建组件的实例 2、找到组件的render方法 3、执行render
          // 组件实例要记录当前组件的状态
          var instance = initialVnode.component = createComponentInstace(initialVnode);
          setupComponent(instance); // 找到组件的setUp方法
          // 调用render方法 如果render方法中数据变化了 会重新渲染

          setupRenderEffect(instance, initialVnode, container); // 给组件创建一个effect 用于渲染
        };

        var setupRenderEffect = function setupRenderEffect(instance, initialVnode, container) {
          effect(function componentEffect() {
            if (!instance.isMounted) {
              // 渲染组件中的内容
              var subTree = instance.subTree = instance.render(); // 组件渲染的结果

              patch(null, subTree, container);
              instance.isMounted = true;
            } else {
              // 更新逻辑
              var prev = instance.subTree; // 上一次的渲染结果

              var next = instance.render; // 进行diff比较
            }
          });
        };

        var processElement = function processElement(n1, n2, container) {
          if (n1 === null) {
            mountElemnt(n2, container);
          }
        };

        var processComponent = function processComponent(n1, n2, container) {
          if (n1 === null) {
            mountComponent(n2, container);
          }
        };

        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container);
        }
      };

      var render = function render(vnode, container) {
        // 我需要将虚拟节点变成真实节点 挂载到容器中
        patch(null, vnode, container);
      };

      return {
        createApp: createAppAPI(render)
      };
    }

    var nodeOps = {
      createElement: function createElement(type) {
        return document.createElement(type);
      },
      setElementText: function setElementText(el, text) {
        el.textContent = text;
      },
      insert: function insert(child, parent) {
        var anchor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        parent.insertBefore(child, anchor);
      },
      remove: function remove(child) {
        var parent = child.parentNode;

        if (parent) {
          parent.removeChild(parent);
        }
      }
    };

    function patchClass(el, value) {
      if (value === null) value = '';
      el.className = value;
    }

    function patchStyle(el, prev, next) {
      var style = el.style;

      if (!next) {
        el.removeAttribute('style');
      } else {
        for (var key in next) {
          style[key] = next[key];
        }

        if (prev) {
          for (var _key in prev) {
            if (next[_key] === null) {
              style[_key] = '';
            }
          }
        }
      }
    }

    function patchAttr(el, key, value) {
      if (value === null) {
        el.removeAttribute(key);
      } else {
        el.setAttribute(key, value);
      }
    }

    function patchProps(el, key, prevValue, nextValue) {
      switch (key) {
        case 'class':
          patchClass(el, nextValue);
          break;

        case 'style':
          patchStyle(el, prevValue, nextValue);
          break;

        default:
          patchAttr(el, key, nextValue);
          break;
      }
    }

    var renderOptions = _objectSpread2(_objectSpread2({}, nodeOps), {}, {
      patchProps: patchProps
    }); // dom操作


    function ensureRenderer() {
      return createRenderer(renderOptions);
    }

    function createApp(rootComponent) {
      debugger; // 1、根据组件创建一个渲染器

      var app = ensureRenderer().createApp(rootComponent);
      var mount = app.mount;

      app.mount = function (container) {
        container = document.querySelector(container); // 1、挂载时需要将容器清空 在进行挂载

        container.innerHTML = '';
        mount(container);
      };

      return app;
    }

    function h(type) {
      var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var children = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      return createVnode(type, props, children);
    }

    exports.computed = computed;
    exports.createApp = createApp;
    exports.createRenderer = createRenderer;
    exports.effect = effect;
    exports.h = h;
    exports.reactive = reactive;
    exports.ref = ref;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=vue.js.map

---
sidebar: auto
sidebarDepth: 4
---


#

## 原型一把梭

[如果知道以下几个问题, `原型` 这一章节可以略过](https://juejin.cn/post/6844903984335945736#heading-5)

- 为什么 `typeof` 判断 `null` 是 `Object` 类型;
- `Function` 和 `Object` 是什么关系;
- `new` 关键字具体做了什么? 手写?;
- `prototype` 和 `__proto__` 是什么关系? 什么情况下相等?
- ES5 实现继承有几种方式, 优缺点?
- ES6 如何实现一个类
- ES6 `extends` 关键字实现原理?

 <img src="https://phsdevoss.eheren.com/pcloud/phs3.0/test/proto-classic.jpg"  width="500" height="600" />

- function Foo 就是一个方法, 比如js 内置的 Array, String 等
- function Object 就是一个 Object
- function Function 就是一个 Function
- 以上都是 function, 所以 `.__proto__` 都是 `Function.prototype`

### 函数对象和普通对象

![函数对象和普通对象](https://phsdevoss.eheren.com/pcloud/phs3.0/test/Snipaste_2023-04-26_15-22-52.jpg)

从上面我们可以看出, 函数对象和普通对象都是对象, **却存在差异**.

其实在 js 中, 我们将对象分为函数对象和普通对象. 所谓函数对象, 其实就是 js 的用函数来模拟的类实现, js 中的 Object, Function 就是典型的函数对象.

```js
function fn1() {};
const fn2 = function() {};
const fn3 = new Function('name', 'console.log(name);');

const obj1 = {};
const obj2 = new Object();
const obj3 = new fn1();
const obj4 = new new Function();

typeof Object; // function
typeof Function; // function

typeof fn1; // function
typeof fn2; // function
typeof fn3; // function

typeof obj1; // object
typeof obj2; // object
typeof obj3; // object
typeof obj4; // object
```

可以看出, **所有 Function 的实例都是函数对象, 其他的均为普通对象, 包括Function实例的实例, 也就是函数对象**

> `Function.__proto__ === Function.prototype`

js 中万物皆对象, 而对象皆出自构造函数.

### `__proto__`

> 首先我们要明确两点: 1.` __proto__ `, `constructor` 都是对象独有的; 2. `prototype` 是函数独有的

但是在 js 中, 函数也是对象, 所以函数也拥有 `__proto__`, `constructor`.

<a-mark>`子.__proto__ === 父.prototype`</a-mark>

```js
  // 子.__proto__ === 父.prototype.
  const fn1 = new Function();
  const fn2 = new fn1();


  fn2.__proto__ === fn1.prototype; // true
  fn1.__proto__ === Function.prototype; // true
```

### constructor

constructor 属性也是**对象**所拥有的, 它是**一个对象指向一个函数, 这个函数就是该对象的构造函数**

> 每一个对象都有其构造函数, 本身或继承而来. 单从`constructor`这个属性来讲, 只有 `prototype` 对象才有.
每个函数在创建的时候, js 会同时创建一个该函数对应的 `prototype` 对象, 而 `函数创建的对象.__proto__ === 该函数.prototype`,
该`函数.prototype.constructor === 该函数本身`, 所以通过函数创建的对象即使自己没有 `constructor` 属性, 也能通过 `__proto__`
找到对应的 `constructor`, 所以任何对象最终都可以找到其对应的构造函数.

唯一特殊的就是 `Function`, js 原型的老祖宗, 它是他自己的构造函数. 所以 `Function.prototype === Function.__proto__`:

```js
Function.prototype.__proto__ === Object.prototype; // true
Function.__proto__.__proto__ === Object.prototype; // true
Function.__proto__ === Function.prototype; // true
```

### typeof && instanceof

#### [基本用法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/typeof)

typeof 支持的类型:

- undefined
- boolean
- number
- bigint
- string
- symbol
- function

typeof 其他任何对象 === 'object'

```ts
typeof new String('cqc'); // object
typeof null; // object  这是 js 设计的一个 bug
```

#### instanceof

instanceof 可以判断一个实例是否是其父类型或者祖先类型的实例

> object instanceof constructor

`instanceof` 和 `typeof` 非常类似, `instanceof` 运算符 用来检测 `constructor.prototype` 是否存在于参数 `object` 原型链上

基本用法

```ts
const C = function () {};
const D = function () {};

const o = new C();

o instanceof C; // true
o instanceof D; // false

o instanceof Object; // true, 因为 Object.prototype.isPrototypeOf(o) === true
C.prototype instanceof Object; // true, 同上


C.prototype = {};
o instanceof C; // false, C.prototype 指向了一个空对象,这个空对象不在 o 的原型链上

D.prototype = new C();
const o2 = new D();

o2 instanceof C; // true
```

```ts
Object instanceof Object; // true
Function instanceof Function; // true
Function instanceof Object; // true

Number instanceof Number; // false
String instanceof String; // false
```

为什么`Function | Object instance of 自己成立`, 而其他类 instance of 自己不成立呢?

```ts
const myInstanceof = function(target, model) {
  const proto = model.prototype;
  target = target.__proto__;

  while(true) {
    if(target === null) {
      return false
    } else if(target === proto) {
      return true
    }

    target = target.__proto__;
  }
}

```

### new 关键字

`new` 都干了啥?

```js
function Person(name) {
  this.name = name;
}

Person.prototype.isHandsome = true;
Person.prototype.sayHi = function () {
  console.log('hihihi');
};

const cqc = new Person('cqc');

cqc.isHandsome; // true
cqc.sayHi(); // hihihi

```

#### new 手写

```js
const _new = function (constructor, ...args) {
  if (typeof constructor !== "function") {
      throw "constructor 必须是一个方法";
    }

  const newObj = Object.create(constructor.prototype);
  const value = constructor.apply(newObj, args);

  // 如果构造函数有返回值，那么只返回构造函数返回的对象。
  return value instanceof Object ? value : newObj;
};


const cqc = _new(Person, 'cqc');
```

## 手写Promise

```ts
class MyPromise {
  state: 'pending' | 'fulfilled' | 'rejected' = 'pending';
  successTask: ((any) => any)[];
  failTask: ((any) => any)[];
  data: any;
  err: any;

  constructor(fn) {
    this.successTask = [];
    this.failTask = [];

    const resolve = (v) => {
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.data = v;

        setTimeout(() => {
          this.successTask.map((o) => o(v));
        });
      }
    };

    const reject = (err) => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.err = err;
        setTimeout(() => {
          this.failTask.map((o) => o(err));
        });
      }
    };

    try {
      fn(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(resolve: ((any) => any) | null, reject?: (any) => any) {
    return new MyPromise((_resolve, _reject) => {
      resolve &&
        this.successTask.push(() => {
          const res = resolve(this.data);

          if (res instanceof MyPromise) {
            res.then(_resolve, _reject);
          } else {
            _resolve(this.data);
          }
        });

      reject &&
        this.failTask.push(() => {
          const res = reject(this.err);
          if (res instanceof MyPromise) {
            res.then(_resolve, _reject);
          } else {
            _reject(this.err);
          }
        });
    });
  }

  catch(fn) {
    return this.then(null, fn);
  }

  static resolve(v) {
    return new MyPromise((r) => r(v));
  }

  static reject(err) {
    return new MyPromise((r, j) => j(err));
  }
}
```

## 事件轮询

js 中, 所有任务可以分为宏任务和微任务两种

- 宏任务: 在主线程上排队执行的任务, 只有前一个任务执行完毕, 才能执行下一个任务
  - script, setTimeout, setInterval 等都属于宏任务
- 微任务: 不进入主线程, 而进入 微任务列表 的任务
  - Promise, MutationObserver

### 事件轮询过程

- 1. 代码执行过程中, 宏任务和微任务放在不同的任务队列中
- 2. 当某个宏任务执行完后, 会查看微任务队列是否有任务, 如果有, 执行微任务队列中的**所有任务**
- 3. 微任务队列执行完成后, 会读取任务队列中的第一个宏任务(注意宏任务是一个个取), 执行该宏任务, 如果执行过程中, 遇到微任务, 依次加入微任务队列
- 4. 宏任务执行完成后, 再次读取微任务队列中的任务, 依次类推

```js
Promise.resolve()
  .then(function () {
    console.log('promise0');
  })
  .then(function () {
    console.log('promise5');
  });

setTimeout(() => {
  console.log('timer1');
  Promise.resolve().then(function () {
    console.log('promise2');
  });
  Promise.resolve().then(function () {
    console.log('promise4');
  });
}, 0);

setTimeout(() => {
  console.log('timer2');
  Promise.resolve().then(function () {
    console.log('promise3');
  });
}, 0);

Promise.resolve().then(function () {
  console.log('promise1');
});

console.log('start');

/**
 * start
 * promise0
 * promise1
 * promise5
 *
 * timer1
 * promise2
 * promise4
 *
 * timer2
 * promise3
 */


```

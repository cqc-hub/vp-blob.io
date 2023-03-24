---
pageClass: my-note
---

# vite(2023/03/23)

现在构建工具很多, 更新也快.

但是, 无论在工具层面怎么更新, 它们要解决的核心问题, 即前端工程的痛点是不变的:

- **模块化需求问题**, 业界的模块化标准非常多, 包括 ESM, CommonJS, AMD, CMD 等等, 前端工程一方面需要落实这些模块标准, 保证模块正常加载, 另一方面需要兼容不同的模块规范, 以适应不同的执行环境.

- **兼容浏览器, 编译高级语法问题**

- **线上代码的质量问题**, 和开发阶段考虑的侧重点不同, 生产环境中, 我们不仅要考虑代码的 安全性, 兼容性问题, 保证线上代码的正常运行, 也需要考虑代码运行时候的性能问题

- **开发效率问题**, 项目的冷启动/二次启动时间, 热更新时间, 都有可能严重影响开发效率, 特别是当项目变得特别庞大时候

那么, 构建工具是如何**解决以上问题**的呢:

- 模块化方面, 提供模块加载方案, 并兼容不同的模块规范.

- 语法转译方面, 配合 Sass, TSC, Babel 等前端工具链, 完成高级语法等转译功能, 同时对于静态资源也能进行处理, 使之能作为一个模块正常加载

- 产物质量方面, 在生产环境中, 配合 Terser 等压缩工具进行代码压缩和混淆, 通过 TreeShaking 删除未使用代码, 提供对于低版本浏览器等语法降级处理等等

- 开发效率方面, 构建工具本身通过各种方式来进行性能优化

## vite高效的原因

我们可以从上面的四个角度来说明:

- 首先是开发效率, 传统构建工具普遍的缺点就是太慢了, 与之相比, vite 将项目的启动性能提升了一个量级, 并且达到了毫秒级别的瞬间热更新效果.

  - 就拿 webpack 来说, 一般项目使用 webpack 后, 启动花个几分钟都是很常见的事情, 热更新也经常需要等待十秒以上, 这主要是因为:

    - 项目冷启动时候必须递归打包整个项目的依赖树
    - javascript 语言本身的性能限制, 导致构建性能遇到瓶颈, 直接影响开发效率

  - 这样一来, 代码改动后不能立即看到效果, 自然开发体验也越来越差. 而其中, 最占用时间的就是代码打包和文件编译

  - 而 vite 很好解决了这些问题.

    - vite 在开发阶段基于浏览器原生 ESM 的支持实现了 **no-bundle** 服务
    - 借助了 Esbuild 超快的变异速度来做第三方构建和 TS/JSX 语法编译, 从而有效提高开发效率

- 模块化方面, vite 基于浏览器原生 ESM 的支持实现模块加载, 并且无论是开发环境还是生产环境, 都可以将其他格式的产物(如 CommonJS) 转化为 ESM

- 语法转译方面, vite 内置了对 typescript, jsx, sass 等高级语法等支持, 也能够加载各种各样的静态资源, 如图片, worker 等等

- 产物质量方面, vite 基于成熟的打包工具 rollup 实现生产环境打包, 同时可以配合 Terser, Babel 等工具链, 可以极大程度保证构建产物的质量

## 模块化标准(非标准手段)

早在模块化标准还没有诞生的时候, 前端界已经产生了一些模块化的开发手段, 如 **文件划分**, **命名空间**, **IIFE 私有作用域**

### 1.文件划分

文件划分方式最原始的模块化实现, 简单来说就是将应用的状态和逻辑分散到不同的文件中, 然后通过 html 中的 script 来一一引入:

:::: code-group
::: code-group-item js

```typescript
// module-a.js
let data = 'data';



// module-b.js
function method() {
  console.log('execute method');
}
```

:::

::: code-group-item html

```html
// index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script src="./module-a.js"></script>
    <script src="./module-b.js"></script>
    <script>
      console.log(data);
      method();
    </script>
  </body>
</html>
```

:::
::::

从中可以看到, <a-mark>module-a</a-mark> 和 <a-mark>module-b</a-mark> 为两个不同的模块,
通过两个 script 标签分别引入到 html 中, 这么做看似是分散了不同模块的状态和运行逻辑, 但实际上也隐藏了一些分险:

- 模块变量相当于在全局声明和定义, 会有命名冲突的问题.

- 由于变量都在全局定义, 我们很难知道某个变量到底属于哪些模块, 因此也给调试带来了困难.

- 无法清晰的管理模块之间的依赖关系和加载顺序. 假如 <a-mark>module-a</a-mark> 依赖 <a-mark>module-b</a-mark>,
那么上述的 html 的执行顺序需要手动调整, 不然可能运行时候会产生错误.

### 2.命名空间

<a-mark>命名空间是模块化的另一种实现手段</a-mark>, 它可以解决上述文件划分方式中 <a-mark>全局变量定义</a-mark>
所带来的一系列问题

:::: code-group
::: code-group-item js

```typescript
// module-a.js
window.moduleA = {
  data: 'moduleA',
  method: function() {
    console.log('execute moduleA method')
  }
}


// module-b.js
window.moduleB = {
  data: 'moduleB',
  method: function() {
    console.log('execute moduleB method')
  }
}
```

:::

::: code-group-item html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script src="./module-a.js"></script>
    <script src="./module-b.js"></script>
    <script>
      // 此时 window 上已经绑定了 moduleA 和 moduleB
      console.log(moduleA.data);
      moduleB.method();
    </script>
  </body>
</html>

```

:::
::::

这样一来, 每个变量都有自己专属的命名空间, 我们可以清楚的知道某个变量到底属于哪个模块, 同时也避免全局变量命名的问题

### 3.IIFE(立即执行函数)

相比于 <a-mark>命名空间</a-mark> 的模块化手段, <a-mark>IIFE</a-mark> 实现的模块化安全性要更高,
对于模块作用域的区分更加彻底

:::: code-group
::: code-group-item js

```typescript
// module-a.js
(function() {
  let data = 'moduleA';

  function method() {
    console.log(data + 'execute')
  }

  window.moduleA = {
    method
  }
})()

// module-b.js
(function() {
  let data = 'moduleB';

  function method() {
    console.log(data + 'execute');
  }

  window.moduleB = {
    method
  }
})()
```

:::

::: code-group-item html

```html
// index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script src="./module-a.js"></script>
    <script src="./module-b.js"></script>
    <script>
      // 此时 window 上已经绑定了 moduleA 和 moduleB
      console.log(moduleA.data);
      moduleB.method();
    </script>
  </body>
</html>
```

:::
::::

我们知道, 每个 <a-mark>IIFE(立即执行函数)</a-mark> 都会创建一个私有的作用域, 在私有作用域中的变量外界是无法访问的,
只有模块内部的方法才能访问.

拿上述的 <a-mark>module-a</a-mark> 来说, 对于其中的 data 变量, 我们只能在模块内部的 method 函数中通过闭包访问, 而在其他模块中无法直接访问. 这就是模块 <a-mark>私有成员</a-mark> 功能, 避免模块私有成员被其他模块非法篡改, 相比于 <a-mark>命名空间</a-mark> 的实现方式更加安全.

但实际上, 无论是命名空间 还是 IIFE, 都是为了解决全局变量所带来的命名冲突及作用域不明确的问题, 也就是 <a-mark>文件划分方式中所总结的 问题1 和 问题2</a-mark>, 而并没有真正解决另外一个问题: **模块加载**:

如果模块间存在依赖关系, 那么 script 标签的加载顺序就需要受到严格的控制, 一旦顺序不对, 则很有可能产生运行时 Bug.

## 模块化标准

随着前端工程的日益庞大, 各个模块之间相互依赖已经是非常常见的事情, 模块加载的需求以及成为了业界刚需, 而以上的几种非标准手段不能满足这个需求, 因此我们迎来了业界主流的三大模块规范:

- <a-mark>CommonJs</a-mark>
- <a-mark>AMD</a-mark>
- <a-mark>ES Module</a-mark>

### CommonJS

CommonJS 是业界最早正式提出的 javascript 模块规范, 主要用于服务端, 随着 node.js 越来越普及, 这个规范也被业界广泛应用. 对于模块规范而言, 一般会包含 2 方面内容:

- 统一的模块化代码规范

- 实现自动加载模块的加载起(也称 <a-mark>loader</a-mark>)

对于 CommonJs 模块规范本身, 在 node.js 中经常被用到:

```typescript
// module-a.js
let data = 'hello world';

function getData() {
  return data;
}

module.exports = {
  getData
}

// index.js
const { getData } = require('./module-a.js');
console.log(getData());
```

代码中使用 require 来导入一个模块, 用 module.exports 来导出一个模块. 实际上 node.js 内部会有相应的 loader 转译模块代码, 最后模块代码会被处理成下面这样:

```typescript
(function(exports, require, module, __filename, __dirname) {
  // 执行模块代码
  // 返回 exports 对象
})
```

对 CommonJS 而言, 一方面它定义了一套完整的模块化代码规范, 另一方面 node.js 为之实现了自动加载模块 <a-mark>loader</a-mark>, 看上去是一个很不错的模块规范, 但也存在一些问题:

- 模块加载起由 node.js 提供, 依赖了 node.js 本身的功能实现, 比如文件系统, 如果 CommonJS 模块直接放到浏览器中是无法执行的.

- CommonJS 本身约定以同步的方式进行模块加载, 这种机制放在服务端是没有问题的, 依赖模块都在本地, 不需要进行 网络IO, 而来只有服务启动时候才会加载模块, 而服务通常启动后会一直执行, 所以对服务的性能并没有太大的影响. 但是如果这种加载机制放到浏览器端, 会带来明显的性能问题. 它会产生大量同步的模块请求, 浏览器需要等待响应返回后才能继续解析模块. 也就是说 <a-mark>模块请求会造成浏览器js解析过程的阻塞</a-mark>, 导致页面加载缓慢

总之, CommonJs 是一个不太适合在浏览器中运行的模块规范, 因此, 业界也设计出了全新的规范来作为浏览器的模块标准, 最知名的要数**AMD** 了

### AMD 规范

AMD 全称为 **Asynchronous Module Definition**, 即异步模块定义规范. 模块根据这个规范, 在浏览器中会被异步加载, 而不会像 CommonJs 规范同步加载, 就不存在浏览器解析过程阻塞的问题了.

首先我们看这个模块的使用:

```typescript
// print.js
define(function() {
  return {
    print: function(msg) {
      console.log('print' + msg);
    }
  }
})

// main.js
define(['./print'], function(printModule) {
  printModule.print('main');
})

// module-a.js
require(['./print.js', function(printModule) {
  printModule.print('module-a');
}])
```

在 AMD 规范中, 我们可以通过 define 去定义或加载一个模块(或者 require 关键字来加载一个模块), 比如上面的 main 模块 和 print 模块, 如果模块需要导出一些成员需要通过在定义模块的函数中 return 出去(参考 print 模块), 这样模块的代码执行之前浏览器会先**加载依赖模块**

由于没有得到浏览器的原生支持, AMD 规范需要由第三方的 loader 来实现, 最经典的就是 <a-mark>requireJS</a-mark> 库了, 它完整实现了 AMD 规范, 至今仍然有不少项目在使用

不过 AMD 规范使用起来稍显复杂, 代码阅读和书写都比较困难, 因此, 这个规范并不能成为前端模块化的终极解决方案, <a-mark>仅仅是社区中提出的一个妥协性的方案</a-mark>

### ES6 Module

<a-mark>ES6 Module</a-mark> 也被称为 <a-mark>ES Module(或 ESM)</a-mark>, 是由 ECMAScript 官方提出的模块化规范, 作为一个官方背景提出的规范,  <a-mark>ES Module已经得到了现代浏览器的内置支持</a-mark>

在现代浏览器中, 如果在html中加入含有<a-mark>type="module"</a-mark>
属性的 script 标签, 那么浏览器会按照 ES Module 规范来进行依赖加载和模块解析, 即使不打包也可以顺利运行模块代码

下面是一个使用 ES Module 的简单例子:

:::: code-group
::: code-group-item js

```typescript
// main.js
import { methodA } from './module-a.js';

methodA();

// module-a.js
const methodA = () => {
  console.log('a');
}

export {
  methodA
}
```

:::

::: code-group-item html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/src/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./main.js"></script>
  </body>
</html>
```

::::

如果是在 node.js 环境中, 你可以在 package.json 中 声明 `type: 'module'` 属性

```ts
{
  "type": "module"
}
```

然后 node.js 便会默认以 ES Module 规范去解析模块

```ts
node main.js
```

顺便说一句, 在 node.js 中, 即使在 CommonJs 模块里面, 也可以 通过 `import` 方法顺利加载 ES 模块

```ts
async function func() {
  // 文件名后缀需要是 mjs
  const { a } = await import('./module-a.mjs');

  console.log(a);
}

func();

module.exports = {
  func
}
```

ES Module 作为ECMAScript 官方提出的规范, 经过五年多的发展, 不仅得到了众多浏览器的原生支持, 也在 node.js 中得到了原生支持, 是一个
能够跨平台的模块规范. 同时, 他也是社区各种生态库的发展趋势, 尤其是被如今大火的构建工具 vite 所深度使用, 可以说, ES Module 前景一片光明

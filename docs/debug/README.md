---
sideBar: true

pageClass: my-note
---

#

作为前端开发, 调试是每天都会接触到概念, 那么什么是调试呢?

  代码在某个平台运行, 把运行时的状态通过某种方式暴露出来, 传递给开发工具做 UI 的展示和交互, 辅助开发者排查问题, 梳理流程, 了解代码运行状态, 这个就是调试

## 调试原理

### chrome devtools

chrome devtools 分为两部分, backend 和 frontend:

- backend 和 chrome 集成, 负责把 chrome 的网页运行时状态通过调试协议暴露出来.
- frontend 是独立的, 负责对接调试协议, 做 ui 的展示和交互.

两者之间的调试协议叫做 Chrome DevTools Protocol, 简称 CDP.

传输协议数据的方式叫做信道(message channel), 有很多种, 比如 Chrome DevTools 嵌入在 Chrome 里时, 两者通过全局的函数通信; 当 Chrome DevTools 远程调试
某个目标的代码时, 两者通过 WebSocket 通信.

frontend, backend, 调试协议, 信道, 这是 Chrome DevTools 的4个组成部分.

### vscode debugger

vscode debugger 的原理和 Chrome DevTools 差不多, 也是分为 frontend, backend, 调试协议这几部分, 只不过他多了一层适配器协议.

为了能直接用 chrome devtools 调试 node.js 代码, node.js 6 以上就使用 Chrome DevTools Protocol 作为调试协议了, 所以 vscode debugger 要调试也是通过这个协议.

但是中间多了一层适配器协议 Debug Adapter Protocol, 这是为什么呢?

因为 vscode 不是 js 专用编辑器, 他可能用来调试 python, rust 等等, 自然不能和某一种语言的调试协议深度耦合, 所以多了一层适配器

## sourcemap

平时我们至少在两个场景（开发时调试源码，生产时定位错误的源码位置）下会用到 sourcemap。

sourcemap 只是位置的映射, 可以用在任何代码上, 比如 ts, js, css 等. 而且 ts 的类型也支持 sourcemap:

```javascript
  compilerOptions.declaration: true;
  compilerOptions.declarationMap: true;
```

指定了 declaration 会生成 d.ts 的声明文件, 还可以指定 declarationMap 来生成 sourcemap

### webpack 的 sourcemap

#### eval

eval 的 api 是动态执行 js 代码的 比如:

```javascript
eval(`
  function add(a, b) {
    return a + b;
  }

  console.log(add(1, 2))
`)
```

但有个问题, eval 的代码打不了断电, 怎么解决这个问题呢?

浏览器支持了这样一种特性, 只要在 eval 代码的最后加上 `//# sourceURL=xxx`, 那么就会以 xxx 为名字把这段代码加到 sources 里面,
这样就可以进行断点了

```javascript
eval(`
  function add(a, b) {
    return a + b;
  }

  console.log(add(1, 2));
  //# sourceURL=cqc.js
`)
```

![eval 断点](https://phsdevoss.eheren.com/pcloud/phs3.0/Snipaste_2023-02-17_13-28-41.jpg)

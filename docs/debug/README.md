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

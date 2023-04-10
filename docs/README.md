---
home: true
heroImage: /image/favicon.ico
heroText: VuePress blob
tagline: 再坚持一下，之后你想要的，岁月都会给你

actions:
  - text: 快速上手
    link: /components/pages/Button
    type: primary

  - text: 项目简介
    link: /guide/
    type: secondary

features:
  - title: 简洁至上
    details: 以 Markdown 为中心的项目结构，以最少的配置帮助你专注于写作。
  - title: Vue驱动
    details: 享受 Vue + webpack 的开发体验，在 Markdown 中使用 Vue 组件，同时可以使用 Vue 来开发自定义主题。
  - title: 高性能
    details: VuePress 为每个页面预渲染生成静态的 HTML，同时在页面被加载的时候，将作为 SPA 运行。

footer: MIT Licensed | Copyright © 2018-present Evan You
---

# 你好，世界

## We can hide anything, even code

| First Header | Second Header |
| ------------ | ------------- |
| Content Cell | Content Cell  |
| Content Cell | Content Cell  |

## 表格

| Command    | Description                                                                         |
| ---------- | ----------------------------------------------------------------------------------- |
| git status | List all new or modified  |
| git diff   | Show file differences that haven't been staged                                      |

## 代码行高亮

```ts{1,6-8}
import { defaultTheme, defineUserConfig } from 'vuepress'

export default defineUserConfig({
  title: '你好， VuePress',

  theme: defaultTheme({
    logo: 'https://vuejs.org/images/logo.png',
  }),
})
```

:::: code-group
::: code-group-item FOO

```js
const foo = 'foo';
```

:::
::: code-group-item BAR

```js
const bar = 'bar';
```

:::
::::


<RouterLink to="/typescript">typescript</RouterLink>
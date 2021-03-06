---
theme: github
# sidebar: auto
# sidebarDepth: 2
---

# TypeScript

学习 typescript 之前当然需要让它跑在本地才行

## 环境配置

- ## 本地测试 ts （ts-node）

1.  npm i ts-node -g
2.  npm i tslib @types/node -g

> 之后通过 ts-node xxx.ts 来运行 ts 文件

- ## 本地测试 ts (webpack)

1.  npm init -y
2.  npm install webpack webpack-cli -D
3.  makedir ./webpack.config.js
4.  package.json -> scripts: { "build": "webpack", ... }
5.  npm install ts-loader typescript -D
6.  配置 webpack.config.js

```javascript
 module.exports = {
   ...,
   resolve: {
     extensions: ['.ts', '.js', '.cjs', '.json'] // 自动在 import ... from 'xxx' 补全后缀
   },
   module: {
     rules: [  // 使用对应loader 来加载 匹配到的对应文件
       {
         test: /\.ts$/,
         loader: 'ts-loader'
       }
     ]
   }
 }

```

7.  tsc --init (生成 tsconfig.json)
8.  npm install webpack-dev-server -D (本地服务)
9.  package.json -> scripts: { serve: 'webpack serve' }
10. webpack.config.js

```javascript
// webpack.config.js
module.exports = {
  ...,
  devServer: {  // 定义本地配置

  }
}

```

11. 新建 ./index.html （模板）

- npm install html-webpack-plugin -D

```javascript
// webpack.config.js
...

const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  ...,
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ]
}
```

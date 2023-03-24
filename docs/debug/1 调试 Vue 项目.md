#

## 调试 @vue/cli 创建的 webpack 项目

### vue3

- 首先安装 @vue/cli

  - `sudo yarn global add @vue/cli`

- 后面 `vue create xxx` 创建 vue3 模版项目 run server 启动项目

- 点击调试窗口的 create a launch.json 来创建配置文件

  - 把 Chrome 调试配置的 url 改成本地启动的项目 url 就可以调试了
  - 点击 debug 启动, 在 vue 组件打个端点, 你会发现断点没有生效:
    ![断点没有生效](https://phsdevoss.eheren.com/pcloud/phs3.0/Snipaste_2023-02-17_14-40-34.jpg)

    这是为什么呢?
    我们先加个 debugger 来跑一下:

    ![debugger 来跑一下](https://phsdevoss.eheren.com/pcloud/phs3.0/test/Snipaste_2023-02-17_14-43-16.jpg)

    然后在 chrome devtools 里看下:

    ![chrome devtools 里看下](https://phsdevoss.eheren.com/pcloud/phs3.0/test/Snipaste_2023-02-17_14-47-09.jpg)

    你会发现他从一个乱七八糟的路径, 映射到了 webpack://vue-demo1/src/App.vue91a0 的路径下.

    在 vscode debugger 里面看看这个路径:

    ![乱七八糟的路径](https://phsdevoss.eheren.com/pcloud/phs3.0/test/Snipaste_2023-02-17_14-54-23.jpg)

    发现是 /Users/chaoqincai/Documents/myPractice/test/vue 调试/vue-demo1/srC/App.vue?91a0

    本地明显没有这个文件, 所以只能只读了.

    其实这个路径已经做过了映射, 就是完成了从 webpack://vue-demo1/src/App.vue 到 /Users/chaoqincai/Documents/myPractice/test/vue 调试/vue-deApp.vue?91a0 的映射.

    看下 sourceMapPathOverrides 默认的这三条配置, 很容易看出是最后一条做的映射:

    ![映射](https://phsdevoss.eheren.com/pcloud/phs3.0/test/Snipaste_2023-02-17_15-04-29.jpg)

    但问题就出现在后面多了一个 ?hash 的字符串, 导致路径不对了.
    那为什么会多这样一个 hash 呢?

    这算因为 vue cli 默认的 devtool 设置是 eval-cheap-module-source-map, 即是每个模块用 eval 包裹, 并且通过 sourceURL 指定文sourceMappingURL 指定 sourcemap(`//# sourceURL=[module]\n//# sourceMappingURL=data:application...`)

    ![eval](https://phsdevoss.eheren.com/pcloud/phs3.0/test/Snipaste_2023-02-17_15-20-57.jpg)

    这些被 eval 包裹的就是一个个的模块代码.
    第一个 sourceURL 的路径是通过[module] 指定的, 二模块名后默认会带 ?hash

    所以我们想要去掉 hash 就不能用 eval 的方式, 我们需要修改下 webpack 的 devtools 配置.

 ```javascript
  module.exports = defineConfig({
   configureWebpack(config) {
    config.devtool = 'source-map';
    ...
   }
  });
```

  从 eval-cheap-module-source-map 变为 source-map。

  去掉 eval 是为了避免生成 ?hash 的路径, 去掉 cheap 是为了保留列的映射, 去掉 module 是因为这里不需要合并 loader 做的转换

  然后重启跑一下 dev server 再次调试, 这时候你会发现之前不能生效的断点现在能生效了, 在 devtools 里面查看 source, 路径里面的 hash 也没了;

### vue2

如果你创建的是 vue2 项目, 可能还要在 launch.json 的调试配置加这样一段映射(sourceMapPathOverrides 里面只保留这一条):

```javascript
  configurations.sourceMapPathOverrides['webpack://你的项目名/src/*']: '${workspaceFolder/src/*}'
```

我们映射的目的就是把这个路径映射到本地目录, 如果你在 chrome devtools 里面看到路径没有项目名 `webpack:///src/***`
那就直接这样映射:

```javascript
 configurations.sourceMapPathOverrides['webpack:///src/*']: '${workspaceFolder/src/*}';
```

## 调试 @vue/cli 创建的 vite 项目

create vue 是创建 vite 作为构建工具的 vue 项目的工具.

直接执行 `npm init vue@3` 即可

安装依赖启动项目

我们添加一个调试配置如下:

```javascript
{
  "type": "chrome",
  "request": "launch",
  "name": "调试 vite 项目",
  "url": "http://localhost:5173",
  // 注意此处修改了 webRoot 防止一些文件 被错误映射到源码
  "webRoot": "${workspaceFolder}/aaa"
}
```

找个 vue 文件打下断点, 启动调试

发现断点能够直接生效

我们在调试 @vue/cli 创建的项目时候, 还映射了下 sourcemap 的 path, 为啥 create vue 的项目就不需要了呢?

看下 sourcemap 到的文件路径就知道了:

![sourcemap 到的文件路径](https://phsdevoss.eheren.com/pcloud/phs3.0/test/Snipaste_2023-02-20_14-38-20.jpg)

从 `http://localhost:5173` 后开始, 把 `/src/components/HelloWord.vue` 文件 sourcemap 到了这里

![sourcemap 到的文件路径](https://phsdevoss.eheren.com/pcloud/phs3.0/test/Snipaste_2023-02-20_14-45-55.jpg)

这已经能够对应到本地的文件了, 自然也就不需要 sourceMapPathOverrides 的配置了

## 总结

- vue 项目创建有两种方式, @vue/cli 和 create vue, 分别是 创建 webpack 和 vite 作为构建工具的项目.

  - vue cli 创建的项目, 默认情况下打断点不生效, 这是因为文件路径后带了 ?hash, 这是默认的 eval-cheap-module-source-map 的 devtool 配置导致的, 去掉 eval, 改 source-map 即可

  - create vue 创建的 vite 作为构建工具的项目 sourcemap 到的路径直接就是本地的路径了, 更简单一些. 但是会有一些文件呗宠物哦映射到源码问题, 需要设置下 webRoot.

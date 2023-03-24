#

在进行断点的时候经常会遇到一些断点相关的问题, 比如:

- 在文件夹打得断点是灰的, 一直不生效
- 断点断在了奇怪的文件和位置

不知道是什么原因导致的, 该怎么解决.

这就是因为不清楚 VSCode Debugger 里打得断点是怎么在网页里面生效的

## 断点映射的原理

我们在 VSCode 中打断点的时候 VSCode 会记录你在哪个文件哪一行打了断点(在 debugger 的 breakpoints 中可以看到打的断点)

代码经过编译打包之后, 可能会产生一个 bundle.js, 网页里运行的是这个 js 文件:

- 运行时的网页: `http://xxx.com/bundle.js`

我们打得断点最终还是在代码的运行时候, 也就是网页里断住的, 所以在 VSCode 里打得断点会被传递给浏览器, 通过 CDP 调试协议

但是问题来了, 我们本地打得断点是一个绝对路径, 也就是包含 `${workspaceFolder}` 的路径, 而网页中根本没有这个路径, 那么是怎么断住的呢?

这是因为有的文件是关联了 sourcemap 的, 也就是文件末尾的这行注释:

```javascript
// # sourceMappingURL=@vue_reactivity.js.map
```

它会把文件路径映射到源码路径

如果映射到的源码路径直接就是本地的文件路径, 那不就对上了么, 那断点就生效了

vite 的项目, sourcemap 都是这种绝对路径, 所以断点直接就生效了
但是 webpack 的项目, sourcemap 到的路径不是绝对路径, 而是下面这俩种

- `webpack:///src/App.vue`

- `webpack://项目名/src/App.vue`

那怎么办呢? 本地打得断点都是绝对路径, 而 sourcemap 到的路径不是绝对路径, 根本打不上断点呀!

所以 VSCode Chrome Debugger 支持了 sourceMapPathOverrides 的配置:

```javascript
"sourceMapPathOverrides": {
  "meteor://💻app/*": "${workspaceFolder}/*",
  "webpack:///./~/*": "${workspaceFolder}/node_modules/*",
  "webpack://?:*/*": "${workspaceFolder}/*"
}
```

这是默认生成的三个配置, 最后一个就是映射 webpack 路径的, 其实是把以 `${workspaceFolder}` 开头的本地文件路径映射成了 `webpack://` 开头的路径传给浏览器

- `/Users/chaoqincai/Documents/myPractice/test/vue/项目名/src/App.vue` -> `webpack://项目名/src/App.vue`

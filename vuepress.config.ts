import { viteBundler } from '@vuepress/bundler-vite';
import { defineUserConfig } from '@vuepress/cli';
const path = require('path');


export default defineUserConfig({
  lang: 'zh-CN',
  title: '你好， VuePress ！',
  description: 'hello VuePress',
  bundler: viteBundler({
    // https://v2.vuepress.vuejs.org/zh/reference/bundler/vite.html#%E9%85%8D%E7%BD%AE%E9%A1%B9
    viteOptions: {
      // dist: path.resolve(__dirname, 'src')
    },
    vuePluginOptions: {},
  }),
  
  dest: path.resolve(__dirname, 'distc'),  // build outDir
  base: '/cqc/', // 如果你的网站部署在非根路径下，即 base 不是 "/" ，你需要把 base 添加到 Public 文件的绝对路径前。
  public: path.resolve('static'), // static source, 它们会被复制到最终生成的网站的根目录下。

  // devServer
  port: 3366
});

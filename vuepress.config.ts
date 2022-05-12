import { viteBundler } from '@vuepress/bundler-vite';
import { defineUserConfig } from '@vuepress/cli';
import { defaultTheme } from 'vuepress';

const path = require('path');
const basePath = path.resolve(__dirname);
const navbar = require(basePath + '/config/navbar');

export default defineUserConfig({
  lang: 'zh-CN',
  title: '你好， vp！',
  description: 'hello VuePress',
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: '/image/shaox_circle_绿色能量@2x.png',
      },
    ],
  ],

  bundler: viteBundler({
    // https://v2.vuepress.vuejs.org/zh/reference/bundler/vite.html#%E9%85%8D%E7%BD%AE%E9%A1%B9
    viteOptions: {
      // dist: path.resolve(__dirname, 'src')
    },
    vuePluginOptions: {},
  }),

  base: '/cqc/', // 如果你的网站部署在非根路径下，即 base 不是 "/" ，你需要把 base 添加到 Public 文件的绝对路径前。
  public: path.resolve('static'), // static source, 它们会被复制到最终生成的网站的根目录下。

  // devServer
  port: 3366,
  open: false,

  // build
  dest: path.resolve(__dirname, 'distc'), // build outDir

  // markdown
  markdown: {},

  theme: defaultTheme({
    logo: '/image/shaox_circle_绿色能量@2x.png',
    navbar,
    sidebarDepth: 2, // 侧边栏显示2级
  }),
});

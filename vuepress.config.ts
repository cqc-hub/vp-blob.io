import { viteBundler } from '@vuepress/bundler-vite';
import { defineUserConfig } from '@vuepress/cli';
import { defaultTheme } from 'vuepress';

const { path } = require('@vuepress/utils');
const {
  registerComponentsPlugin,
} = require('@vuepress/plugin-register-components');
const { docsearchPlugin } = require('@vuepress/plugin-docsearch');

const basePath = path.resolve(__dirname);
const navbar = require(basePath + '/config/navbar');
const sidebar = require(basePath + '/config/sidebar');

console.log(`${basePath}/config/clientAppEnhance`, '----------');


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

  base: '/vp-blob.io/',
  public: path.resolve('static'), // static source, 它们会被复制到最终生成的网站的根目录下。

  // devServer
  port: 8888,
  open: false,

  // build
  dest: path.resolve(__dirname, 'dist'), // build outDir

  // markdown
  markdown: {},
  // alias: {
  //   '@': path.resolve(__dirname, './components'),
  // },

  plugins: [
    // https://v2.vuepress.vuejs.org/zh/reference/plugin/docsearch.html#%E4%BD%BF%E7%94%A8%E6%96%B9%E6%B3%95
    docsearchPlugin({
      apiKey: '',
      appId: '',
      indexName: '',
    }),

    // https://v2.vuepress.vuejs.org/reference/plugin/register-components.html#usage
    registerComponentsPlugin({
      componentsDir: path.resolve(__dirname, './components'),
      // components: {
      //   FooBar: path.resolve(__dirname, './components/FooBar.vue'),
      //   clientAppEnhanceFiles: path.resolve(
      //     __dirname,
      //     './config/clientAppEnhance.ts'
      //   ),
      // },
    }),
  ],

  theme: defaultTheme({
    logo: '/image/shaox_circle_绿色能量@2x.png',
    navbar,
    sidebarDepth: 2, // 侧边栏显示2级
    sidebar,
  }),

  clientAppEnhanceFiles: [`${basePath}/config/clientAppEnhance.ts`]
});

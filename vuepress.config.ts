import { viteBundler } from '@vuepress/bundler-vite';
import { defineUserConfig } from '@vuepress/cli';
import { defaultTheme } from 'vuepress';

const { path } = require('@vuepress/utils');
const {
  registerComponentsPlugin,
} = require('@vuepress/plugin-register-components');
// const { docsearchPlugin } = require('@vuepress/plugin-docsearch');
// const { gitPlugin } = require('@vuepress/plugin-git');

const basePath = path.resolve(__dirname);
const navbar = require(basePath + '/config/navbar');
const sidebar = require(basePath + '/config/sidebar');

export default defineUserConfig({
  lang: 'zh-CN',
  title: '你好， 炒青菜！',
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
      build: {
        chunkSizeWarningLimit: 1500,
        brotliSize: false, // 不统计
        target: 'esnext',
        minify: 'esbuild', // 混淆器，terser构建后文件体积更小
      },
    },
    vuePluginOptions: {},
  }),

  base: '/vp-blob.io/',
  public: path.resolve('static'), // static source

  // devServer
  port: 8888,
  open: false,

  // build
  dest: path.resolve(__dirname, 'dist'), // build outDir

  // markdown
  markdown: {
  },

  plugins: [
    // ['vuepress-plugin-demoblock-plus'],
    // gitPlugin({
    //   createdTime: true,
    //   updatedTime: true,
    //   contributors: false,
    // }),

    // https://v2.vuepress.vuejs.org/zh/reference/plugin/docsearch.html#%E4%BD%BF%E7%94%A8%E6%96%B9%E6%B3%95
    // docsearchPlugin({
    //   apiKey: '',
    //   appId: '',
    //   indexName: '',
    // }),

    // https://v2.vuepress.vuejs.org/reference/plugin/register-components.html#usage
    registerComponentsPlugin({
      componentsDir: path.resolve(__dirname, './components'),
      components: {
        MyNote: path.resolve(__dirname, './pages/MyNote/MyNote.vue'),
      },
    }),
  ],

  theme: defaultTheme({
    logo: '/image/shaox_circle_绿色能量@2x.png',
    navbar,
    sidebarDepth: 2,
    sidebar,

    editLink: true,
    lastUpdated: false,
    repo: 'https://github.com/cqc-hub/vp-blob.io',
    docsDir: '/docs',
    docsBranch: 'master',
    editLinkPattern: ':repo/tree/:branch/:path',
  }),

  clientAppEnhanceFiles: [`${basePath}/config/clientAppEnhance.ts`],
});

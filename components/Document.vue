<template>
  <div class="document">
    <a-collapse v-model:activeKey="activeKey" :bordered="false" accordion>
      <template #expandIcon="{ isActive }">
        <SendOutlined :rotate="isActive ? 90 : 0" />
      </template>

      <a-collapse-panel v-for="(item, i) in data" :key="i">
        <template #header>
          <a :href="item.href" target="_blank">
            {{ item.title }}
          </a>
        </template>

        <div>
          <h5 v-html="item.description || '---'" />
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SendOutlined } from '@ant-design/icons-vue';

interface DataItem {
  title: string;
  description?: string;
  href: string;
}


const data: DataItem[] = [
  {
    title: 'V8',
    href: 'https://v8.js.cn/blog/',
    description: `
      </br> <a target="_blank" href="https://v8.js.cn/blog/fast-properties/">V8 中的快属性</a>
      </br> <a target="_blank" href="https://v8.js.cn/blog/elements-kinds/">V8 中的元素种类及性能优化</a>
    `,
  },

  {
    title: 'JSDoc 中文',
    href: 'https://www.shouce.ren/api/view/a/13233',
  },

  {
    title: '函数式编程指北 [电子书] ',
    href: 'https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/',
  },

  {
    title: 'Git 中文',
    description:
      'The entire Pro Git book, written by Scott Chacon and Ben Straub and published by Apress, is available here. All content is licensed under the Creative Commons Attribution Non Commercial Share Alike 3.0 license. Print versions of the book are available on Amazon.com.',
    href: 'https://git-scm.com/book/zh/v2/',
  },

  {
    title: 'Webpack 中文',
    description: `
      一个用于现代 JavaScript 应用程序的 静态模块打包工具。当 webpack 处理应用程序时，
      它会在内部从一个或多个入口点构建一个 依赖图(dependency graph)，然后将你项目中所需的每一个模块组合成一个或多个 bundles，
      它们均为静态资源，用于展示你的内容。
          </br>
          </br> <a target="_blank" href="http://webpack.wuhaolin.cn/">深入浅出Webpack [电子书]</a>
          </br> <a target="_blank" href="https://github.com/neutrinojs/webpack-chain">webpack-chain [库]</a>
    `,
    href: 'https://webpack.docschina.org/',
  },

  {
    title: 'Gulp 中文',
    description:
      '基于Nodejs的自动任务运行器, 能自动化地完成 javascript/coffee/sass/less/html/image/css 等文件的 合并、压缩、检查、监听文件变化、浏览器自动刷新、测试等任务',
    href: 'https://www.gulpjs.com.cn/docs/getting-started/quick-start/',
  },

  {
    title: 'Npm 中文',
    description:
      '世界上最大的软件注册表，每星期大约有 30 亿次的下载量，包含超过 600000 个 包（package） （即，代码模块）。',
    href: 'https://www.npmjs.cn/',
  },

  {
    title: 'Yarn 中文',
    description: '快速、可靠、安全的依赖管理工具。',
    href: 'https://yarn.bootcss.com/',
  },

  {
    title: 'qiankun',
    description: '构建自己的微前端系统',
    href: 'https://qiankun.umijs.org/zh/guide',
  },
  // {
  //   title: 'Ant Design Title 3',
  // },
  // {
  //   title: 'Ant Design Title 4',
  // },
];

const activeKey = ref([]);
</script>

<style lang="scss" scoped>
.document {
  padding: 20px;

  .document-row {
    margin-bottom: 20px;
  }
}
</style>

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

import { defineClientAppEnhance } from '@vuepress/client';

// https://v2.vuepress.vuejs.org/zh/advanced/cookbook/usage-of-client-app-enhance.html
export default defineClientAppEnhance(({ app, router, siteData }) => {
  app.use(Antd);
});

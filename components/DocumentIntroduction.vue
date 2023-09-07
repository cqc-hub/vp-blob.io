<template>
  <div class="document-introduction">
    <a-list item-layout="horizontal" :data-source="data">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-list-item-meta :description="item.description">
            <template #title>
              <h3>
                <a :href="item.href" target="_blank">
                  {{ item.title }}
                </a>
              </h3>
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script lang="ts" setup>
interface DataItem {
  title: string;
  description?: string;
  href: string;
}

const data: DataItem[] = [
  {
    title: 'freecodecamp',
    description: ' ',
    href: 'https://www.freecodecamp.org/learn/',
  },

  {
    title: 'HelloGitHub',
    description: '分享 GitHub 上, 有趣、入门级的开源项目',
    href: 'https://hellogithub.com/',
  },

  {
    title: '奇舞周刊',
    description: '领略前端技术 阅读奇舞周刊',
    href: 'https://weekly.75.team/',
  },

  {
    title: 'github',
    description: 'github 榜单',
    href: 'https://github.com/trending/typescript?since=daily',
  },

  {
    title: '微前端的那些事儿',
    description: '"技术栈无关", 整个架构方案的实现上，都应该秉持这一原则，任何违背这一原则的做法都应该被摒弃',
    href: 'https://github.com/phodal/microfrontends',
  },
  // {
  //   title: 'Ant Design Title 3',
  // },
  // {
  //   title: 'Ant Design Title 4',
  // },
];




class Polygon1 {
  sayHi() {
    console.log('cqc');

  }
}

class Polygon extends Polygon1 {
  height: number;
  width: number;

  constructor(height, width) {
    super();
    this.height = height;
    this.width = width;
  }
}

// class Square extends Polygon {
//   constructor() {

//   }
// }



</script>

<style lang="scss" scoped>
.document-introduction {}
</style>

<template>
  <div class="my-note">
    <My-Nav @item-click="navClick" :navs="navs" />566
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const navs = ref([
  {
    title: 'Home',
    link: '#',
  },
  {
    title: 'Works',
    link: '#',
  },
  {
    title: 'About',
    link: '#',
  },
  {
    title: 'Contact',
    link: '#',
  },
]);

const navClick = (nav) => {
  console.log(nav);
};
</script>

<style lang="scss" scoped>
.my-note {
  width: 100%;
  height: 100vh;
  padding: 1rem;
}
</style>

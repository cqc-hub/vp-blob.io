<template>
  <nav ref="nav" id="nav">
    <ul v-if="navs.length">
      <li v-for="(nav, i) in navs" :key="i">
        <a @click.stop="itemClick(nav)" href="#"> {{ nav.title }}</a>
      </li>
    </ul>
    <button @click="toggleNav" class="icon" id="toggle">
      <div class="line line1"></div>
      <div class="line line2"></div>
    </button>
  </nav>
</template>

<script lang="ts" setup>
import { ref, withDefaults, watchEffect } from 'vue';

interface INav {
  title: string;
  link: string;
  [key: string]: any;
}
interface IProps {
  navs?: INav[];
}

const emit = defineEmits(['item-click']);
const props = withDefaults(defineProps<IProps>(), {
  navs: () => [
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
  ],
});

const nav = ref<HTMLElement>();
const navWidth = ref('80px');

watchEffect(() => {
  navWidth.value = props.navs.length * 80 + 'px';
});

const toggleNav = () => {
  if (nav) {
    nav.value.classList.toggle('active');
  }
};

const itemClick = (item: INav) => {
  emit('item-click', item);
};
</script>

<style lang="scss" scoped>

nav {
  background-color: var(--c-bg-navbar);
  padding: 20px;
  width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  transition: width 0.6s linear;
  overflow-x: hidden;

  position: absolute;
}

nav.active {
  width: v-bind(navWidth);
}

nav ul {
  display: flex;
  list-style-type: none;
  padding: 0;
  margin: 0;
  width: 0;
  transition: width 0.6s linear;
}

nav.active ul {
  width: 100%;
}

nav ul li {
  transform: rotateY(0deg);
  opacity: 0;
  transition: transform 0.6s linear, opacity 0.6s linear;
}

nav.active ul li {
  opacity: 1;
  transform: rotateY(360deg);
}

nav ul a {
  position: relative;
  color: var(--c-text);
  text-decoration: none;
  margin: 0 10px;
}

.icon {
  background-color: var(--c-bg-navbar);
  border: 0;
  cursor: pointer;
  padding: 0;
  position: relative;
  height: 30px;
  width: 30px;
}

.icon:focus {
  outline: 0;
}

.icon .line {
  background-color: var(--c-text);
  height: 2px;
  width: 20px;
  position: absolute;
  top: 10px;
  left: 5px;
  transition: transform 0.6s linear;
}

.icon .line2 {
  top: auto;
  bottom: 10px;
}

nav.active .icon .line1 {
  transform: rotate(-765deg) translateY(5.5px);
}

nav.active .icon .line2 {
  transform: rotate(765deg) translateY(-5.5px);
}
</style>

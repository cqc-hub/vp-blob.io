<template>
  <div class="container">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    console.log('cqc');


    return {}
  }
})
</script>

<style lang="scss" scoped>
.container {
  display: inline;
  color: #f95838;
  background-color: #ff4f2c20;
  padding: 0 5px;
  font-weight: 500;
}
</style>
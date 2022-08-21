<template>
	<div>
		<a-button @click="count++" type="primary">Primary Button</a-button>
		<a-button>Default Button</a-button>
		<a-button type="dashed">Dashed Button</a-button>
		<a-button type="text">Text Button</a-button>
		<a-button type="link">Link Button</a-button>
		{{ count }}
	</div>
</template>

<script setup>
import { ref } from 'vue';

const count = ref(0);
</script>

<style lang="scss" scoped></style>

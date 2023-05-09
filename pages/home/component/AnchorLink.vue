<template>
	<div class="">
		<a-anchor-link :href="item.href" :title="item.title">
			<Anchor-Link
				v-if="item.children"
				v-for="_item in item.children"
				:key="item.href"
				:item="_item"
			/>
		</a-anchor-link>
	</div>
</template>

<script lang="ts" setup>
import { defineComponent, ref } from 'vue';
import { TLinkItem } from '../index';

import AnchorLink from './AnchorLink.vue';

defineProps<{
	item: TLinkItem;
}>();
</script>

<style lang="scss" scoped></style>

<template>
	<div>
		<div
			class="cursor"
			:style="{
				visibility: showCursor ? 'visible' : 'hidden',
				width: `${
					cursorSize === 'big'
						? cursorBigRadius * 2
						: cursorDefaultRadius * 2
				}px`,
				height: `${
					cursorSize === 'big'
						? cursorBigRadius * 2
						: cursorDefaultRadius * 2
				}px`
			}"
			ref="cursorRef"
		/>
	</div>
	<div
		class="myHome"
		@mousemove="onMouseMove"
		@mouseenter="onMouseEnter"
		@mouseleave="onMouseLeave"
		ref="containerRef"
	>
		<div class="layout">233</div>
		<div class="sideBarLeft">
			<a-anchor>
				<block v-for="item in linkList" :key="item.href">
					<Anchor-Link :item="item" />
				</block>
			</a-anchor>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { watchEffect, ref } from 'vue';

import { TLinkItem } from './index';

import AnchorLink from './component/AnchorLink.vue';

interface MousePos {
	mouseX: number | null;
	mouseY: number | null;
}

const cursorDefaultRadius = 13;
const cursorBigRadius = 40;
const cursorMoveVCoefficient = 0.12;

const showCursor = ref(false);
const containerRef = ref<HTMLDivElement>(null);
const cursorRef = ref<HTMLDivElement>(null);
const cursorSize = ref<'default' | 'big'>('default');

const linkList = ref(<TLinkItem[]>[
	{
		title: 'Basic demo',
		href: '#components-anchor-demo-basic1'
	},
	{
		title: 'Basic demo',
		href: '#components-anchor-demo-basic2'
	},
	{
		title: 'Basic demo',
		href: '#components-anchor-demo-basic3'
	},
	{
		title: 'Basic demo',
		href: '#components-anchor-demo-basic4'
	},
	{
		title: 'Basic demo',
		href: '#components-anchor-demo-basic5'
	}
]);

const mousePos = ref<MousePos>({
	mouseX: null,
	mouseY: null
});

const scrollTop = 0;
const onMouseEnter = (e: MouseEvent) => {
	const { clientX, clientY } = e;
	const containerNode = containerRef.value!;
	const { offsetLeft = 0, offsetTop = 0 } = containerNode;

	showCursor.value = true;
	mousePos.value = {
		mouseX: clientX - offsetLeft,
		// @ts-ignore
		mouseY: clientY - (offsetTop - scrollTop)
	};
	const cursorNode = cursorRef.value!;
	cursorNode.style.left = `${
		(mousePos.value.mouseX || 0) - cursorDefaultRadius
	}px`;
	cursorNode.style.top = `${
		(mousePos.value.mouseY || 0) - cursorDefaultRadius
	}px`;
};

const onMouseMove = (e: MouseEvent) => {
	const { clientX, clientY } = e;
	const containerNode = containerRef.value!;
	const { offsetLeft = 0, offsetTop = 0 } = containerNode;
	mousePos.value = {
		mouseX: clientX - offsetLeft,
		mouseY: clientY - (offsetTop - scrollTop)
	};
};

const onMouseLeave = (e: MouseEvent) => {
	const { clientX, clientY } = e;
	showCursor.value = false;
	const containerNode = containerRef.value;
	const { offsetLeft = 0, offsetTop = 0 } = containerNode;
	mousePos.value = {
		mouseX: clientX - offsetLeft,
		// @ts-ignore
		mouseY: clientY - (offsetTop - scrollTop)
	};
};

watchEffect(() => {
	const loop = () => {
		const { mouseX, mouseY } = mousePos.value;
		if (mouseX !== null && mouseY !== null) {
			let cursorRadius = cursorDefaultRadius;
			if (cursorSize.value === 'big') {
				cursorRadius = cursorBigRadius;
			}
			const cursorNode = cursorRef.value;

			const left = cursorNode.style.left
				? parseFloat(cursorNode.style.left)
				: null;
			const top = cursorNode.style.top
				? parseFloat(cursorNode.style.top)
				: null;
			if (left !== null && top !== null) {
				const distX = mouseX - (left + cursorRadius);
				const distY = mouseY - (top + cursorRadius);
				const dist = Math.hypot(distX, distY);
				if (dist > 0) {
					if (dist <= 0.1) {
						cursorNode.style.left = `${left}px`;
						cursorNode.style.top = `${top}px`;
					} else {
						const cursorMoveVX = distX * cursorMoveVCoefficient;
						const cursorMoveVY = distY * cursorMoveVCoefficient + 7;
						cursorNode.style.left = `${left + cursorMoveVX}px`;
						cursorNode.style.top = `${top + cursorMoveVY}px`;
					}
				}
			}
		}
	};

	loop();
	window.requestAnimationFrame(loop);
}, {});
</script>

<style lang="scss" scoped>
.cursor {
	position: absolute;
	border-radius: 50%;
	background-color: #fff;
	mix-blend-mode: difference;
	pointer-events: none;
	transition: width 0.4s, height 0.4s;
	transform-origin: 50% 50% 0;
}

.myHome {
	display: flex;
	min-height: 50vh;

	.layout {
		flex: 1;
		height: 100%;
	}

	.sideBarLeft {
		width: 200px;
	}
}
</style>

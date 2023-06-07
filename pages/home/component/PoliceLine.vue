<template>
	<div class="box">
		<div class="container">
			<div class="scroll" v-for="(item, i) in list" :key="i">
				<span>{{ warnText }}</span>
				<span class="span1">{{ warnText }}</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { defineComponent, ref } from 'vue';

const warnText = `Police line do not cross - Police line do not cross - Police line do not cross - Police line do not cross - Police line do not cross - Police line do not cross - Police line do not cross - Police line do not cross `;

const list = new Array(4).fill(0);
</script>

<style lang="scss" scoped>
.box {
	box-sizing: border-box;
	display: flex;
	width: 100%;
}

.container {
	height: 250px;
	flex: 1;
	background-color: #111;
	position: relative;
	overflow: hidden;

	.scroll {
		width: calc(100% + 400px);
		box-shadow: 0 15px 10px rgba(0, 0, 0, 0.5);
		position: relative;

		span {
			background-color: #e9c804;
			position: absolute;
			color: #1d1104;
			font-size: 26px;
			font-family: 'SourceHanSansCN-Bold' !important;
			font-weight: 600;
			text-transform: uppercase;
			letter-spacing: 0.2em;
			white-space: nowrap;
			animation: move 60s linear infinite;
			pointer-events: none;

			transform: translate(50%);
		}

		.span1 {
			animation-delay: -60s;
			animation: move 60s linear infinite reverse;
		}

		&:nth-of-type(1) {
			transform: rotate(25deg) translateY(180px);
		}
		&:nth-of-type(2) {
			transform: rotate(-20deg) translateY(160px);
		}
		&:nth-of-type(3) {
			transform: rotate(-15deg) translateY(-60px);
		}
		&:nth-of-type(4) {
			transform: rotate(25deg) translateY(380px);
		}
		&:nth-of-type(5) {
			transform: rotate(-20deg) translateY(390px);
		}
	}

	@keyframes move {
		0% {
			transform: translateX(100%);
		}
		100% {
			transform: translateX(-100%);
		}
	}
	@keyframes move2 {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-200%);
		}
	}
}
</style>

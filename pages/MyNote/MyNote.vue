<template>
	<div className="page">
		<div className="slider">
			<a-menu
				:inline-collapsed="collapsed"
				v-model:openKeys="openKeys"
				v-model:selectedKeys="selectedKeys"
				mode="inline"
				@click="handleClick"
				style="height: 100%"
			>
				<div className="collapse-btn">
					<a-button
						type="primary"
						style="margin: 16px"
						@click="collapsed = !collapsed"
					>
						<MenuUnfoldOutlined v-if="collapsed" />
						<MenuFoldOutlined v-else />
					</a-button>
				</div>

				<a-menu-item key="1">
					<template #icon>
						<MailOutlined />
					</template>
					Navigation One
				</a-menu-item>

				<a-menu-item key="2">
					<template #icon>
						<CalendarOutlined />
					</template>
					Navigation Two
				</a-menu-item>

				<a-sub-menu key="sub1">
					<template #icon>
						<AppstoreOutlined />
					</template>
					<template #title>Navigation Three</template>
					<a-menu-item key="3">Option 3</a-menu-item>
					<a-menu-item key="4">Option 4</a-menu-item>
					<a-sub-menu key="sub1-2" title="Submenu">
						<a-menu-item key="5">Option 5</a-menu-item>
						<a-menu-item key="6">Option 6</a-menu-item>
					</a-sub-menu>
				</a-sub-menu>

				<a-sub-menu key="sub2">
					<template #icon>
						<SettingOutlined />
					</template>
					<template #title>Navigation Four</template>
					<a-menu-item key="7">Option 7</a-menu-item>
					<a-menu-item key="8">Option 8</a-menu-item>
					<a-menu-item key="9">Option 9</a-menu-item>
					<a-menu-item key="10">Option 10</a-menu-item>
				</a-sub-menu>
			</a-menu>
		</div>
		<div className="container">
			<MyNav @item-click="navClick" :navs="navs" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { MenuProps } from 'ant-design-vue';
import {
	MailOutlined,
	CalendarOutlined,
	AppstoreOutlined,
	SettingOutlined,
	MenuUnfoldOutlined,
	MenuFoldOutlined
} from '@ant-design/icons-vue';

const navs = ref([
	{
		title: 'Home',
		link: '#'
	},
	{
		title: 'Works',
		link: '#'
	},
	{
		title: 'About',
		link: '#'
	},
	{
		title: 'Contact',
		link: '#'
	}
]);

const openKeys = ref(<string[]>[]);
const selectedKeys = ref(<string[]>[]);
const collapsed = ref(true);

const navClick = (nav) => {
	console.log(nav);
};

const handleClick = (e) => {
	console.log(e);
};
</script>

<style lang="scss" scoped>
.page {
	height: 100vh;
	width: 100vh;
	padding: 0;

	display: flex;
	flex-direction: row;
	.collapse-btn {
		display: flex;
		flex-direction: row-reverse;
	}

	.container {
		flex: 1;
		padding: 24px;
	}
}
</style>

import type { NavbarConfig } from '@vuepress/theme-default';

const navBar: NavbarConfig = [
	{
		text: 'vite',
		link: '/vite/'
	},

	{
		text: 'TypeScript',
		link: '/typescript/'
	},

	{
		text: '调试',
		link: '/debug/'
	},

	// {
	// 	text: '个人记录',
	// 	link: '/note/'
	// },

	// {
	// 	text: '组件',
	// 	link: '/components/'
	// },
	{
		text: '笔记',

		children: [
			{
				text: '前端',
				children: [
					{
						text: '分享',
						link: '/documents/introduction'
					},
					{
						text: '微信小程序',
						link: '/wxProgram/'
					}
				]
			}
		]
	},
	{
		text: '工具箱',
		children: [
			{
				text: '在线编辑',
				children: [
					{
						text: '图片压缩',
						link: 'https://tinypng.com/'
					}
				]
			},
			{
				text: '在线服务',
				children: [
					{
						text: '阿里云',
						link: 'https://www.aliyun.com/'
					},
					{
						text: '腾讯云',
						link: 'https://cloud.tencent.com/'
					}
				]
			},
			{
				text: '博客指南',
				children: [
					{
						text: '掘金',
						link: 'https://juejin.im/'
					},
					{
						text: 'CSDN',
						link: 'https://blog.csdn.net/'
					}
				]
			}
		]
	}
];

module.exports = navBar;

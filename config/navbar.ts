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
					},
					{
						text: '八股文',
						link: '/essay'
					}
				]
			}
		]
	}
];

module.exports = navBar;

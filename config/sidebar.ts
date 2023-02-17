import { SidebarConfig } from 'vuepress-vite';
const path = require('path');
const fs = require('fs');

// 固定取 ../docs/ 目录下
const readFileSync = function (path2): string[] {
	const bPath = '../docs/';
	const filePath = `${bPath + path2}`;

	return fs
		.readdirSync(path.resolve(__dirname, filePath))
		.filter((pathName) => pathName !== 'README.md')
		.map((p) => ({
			text: p.replace('.md', ''),
			link: '/' + path2 + '/' + p
		}));
};

const sliderBar: SidebarConfig = {
	'/components/': [
		{
			text: '通用',
			collapsible: true,
			children: [
				{
					text: 'Button 按钮',
					link: '/components/pages/Button'
				}
			]
		},
		{
			text: '数据录入',
			collapsible: true,
			children: [
				{
					text: 'Slider 滑动组件',
					link: '/components/pages/Slider'
				}
			]
		},
		{
			text: '数字输入框',
			collapsible: true,
			children: [
				{
					text: 'InputNumber 数字输入框',
					link: '/components/pages/InputNumber'
				}
			]
		}
	],

	'/documents/': [
		{
			text: 'introduction',
			children: [
				{
					text: '分享',
					link: '/documents/introduction'
				},

				{
					text: '文档',
					link: '/documents/'
				},

				{
					text: '社区',
					link: '/documents/community'
				}
			]
		}
	],

	'/typescript/': [
		{
			text: 'TypeScript',
			children: readFileSync('typescript'),
			link: '/typescript/'
		}
	],

	'/wxProgram/': [
		{
			text: 'WEIXIN',
			children: readFileSync('wxProgram')
		}
	],

	'/debug/': [
		{
			text: '代码调试',
			collapsible: true,
			children: readFileSync('debug')
		}
	]
};

module.exports = sliderBar;

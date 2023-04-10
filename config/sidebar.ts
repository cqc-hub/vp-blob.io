import { SidebarConfig } from 'vuepress-vite';
const path = require('path');
const fs = require('fs');
const bPath = '../docs/';

// 固定取 ../docs/ 目录下
const readFileSync = function (path2) {
	const filePath = `${bPath + path2}`;

	return fs
		.readdirSync(path.resolve(__dirname, filePath))
		.filter((pathName) => pathName !== 'README.md')
		.map((p) => ({
			text: p.replace('.md', ''),
			link: '/' + path2 + '/' + p
		}));
};
const pathAside = path.resolve(__dirname, bPath);
const defineRoute = (fullPath: string, path: string, isDir: boolean) => {
	const item: any = {
		text: path.replace('.md', '')
	};

	if (isDir) {
		item.children = [];
		item.collapse = true;
	} else {
		item.link = fullPath.slice(pathAside.length);
	}

	return item;
};

const readFileDeep = function (dir = path.resolve(__dirname, bPath)) {
	const routes = [];

	const _readFileDeep = function (dir: string, routes) {
		const files = fs.readdirSync(dir);

		files.forEach((item: string, index) => {
			const fullPath = path.join(dir, item);
			const stat = fs.statSync(fullPath);
			const isDir = stat.isDirectory();
			const _route = defineRoute(fullPath, item, isDir);

			if (!item.startsWith('.')) {
				if (isDir) {
					routes.push(_route);
					_readFileDeep(fullPath, _route.children);
				} else if (item !== 'README.md') {
					routes.push(_route);
				}
			}
		});
	};

	_readFileDeep(dir, routes);

	return routes;
};

const sliderBar: SidebarConfig = {
	// '/components': [
	// 	{
	// 		text: '通用',
	// 		collapsible: true,
	// 		children: [
	// 			{
	// 				text: 'Button 按钮',
	// 				link: '/components/pages/Button'
	// 			}
	// 		]
	// 	},
	// 	{
	// 		text: '数据录入',
	// 		collapsible: true,
	// 		children: [
	// 			{
	// 				text: 'Slider 滑动组件',
	// 				link: '/components/pages/Slider'
	// 			}
	// 		]
	// 	},
	// 	{
	// 		text: '数字输入框',
	// 		collapsible: true,
	// 		children: [
	// 			{
	// 				text: 'InputNumber 数字输入框',
	// 				link: '/components/pages/InputNumber'
	// 			}
	// 		]
	// 	}
	// ],

	'/documents': [
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

	'/wxProgram': [
		{
			text: 'WEIXIN',
			children: readFileSync('wxProgram')
		}
	],

	'/debug': [
		{
			text: '代码调试',
			link: '/debug/',
			collapsible: true
		},
		...readFileSync('debug')
	],

	'/vite': [
		{
			text: 'vite',
			link: '/vite/',
			collapsible: true
		},
		...readFileDeep(path.resolve(__dirname, bPath + 'vite'))
	],

	'/typescript': [
		{
			text: 'TypeScript',
			link: '/typescript/'
		},
		...readFileDeep(path.resolve(__dirname, bPath + 'typescript'))
	]
};

module.exports = sliderBar;

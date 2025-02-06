import createMDXPlugin from '@next/mdx';
import rehypeMdxCodeProps from 'rehype-mdx-code-props';
import {remarkPlugins, rehypePlugins} from 'renoun/mdx';
import webpack from 'webpack';
import path from 'path';

import {unwrapMdxBlockElements} from './plugins/remark-unwrap-paragraphs/index.mjs';
import {buildIcons} from './plugins/scss/index.mjs';

// @ts-ignore
import clay from '@clayui/css';

buildIcons();

const withMDX = createMDXPlugin({
	extension: /\.mdx?$/,
	options: {
		remarkPlugins: [...remarkPlugins, unwrapMdxBlockElements],
		rehypePlugins: [...rehypePlugins, rehypeMdxCodeProps],
	},
});

/** @type {import('next').NextConfig} */
const nextConfig = {
	output: 'export',
	images: {
		unoptimized: true,
	},
	pageExtensions: ['mdx', 'ts', 'tsx'],
	async redirects() {
		const redirects = [
			{
				destination: '/docs/components/alert',
				permanent: true,
				source: '/docs/components/alert.html',
			},
			{
				destination: '/docs/components/autocomplete',
				permanent: true,
				source: '/docs/components/autocomplete.html',
			},
			{
				destination: '/docs/components/badge',
				permanent: true,
				source: '/docs/components/badge.html',
			},
			{
				destination: '/docs/components/breadcrumb',
				permanent: true,
				source: '/docs/components/breadcrumb.html',
			},
			{
				destination: '/docs/components/button',
				permanent: true,
				source: '/docs/components/button.html',
			},
			{
				destination: '/docs/components/card',
				permanent: true,
				source: '/docs/components/card.html',
			},
			{
				destination: '/docs/components/color-picker',
				permanent: true,
				source: '/docs/components/color-picker.html',
			},
			{
				destination: '/docs/components/table',
				permanent: true,
				source: '/docs/components/table.html',
			},
			{
				destination: '/docs/components/text',
				permanent: true,
				source: '/docs/components/text.html',
			},
			{
				destination: '/docs/components/text',
				permanent: true,
				source: '/docs/components/text.html',
			},
			{
				destination: '/docs/components/tree-view',
				permanent: true,
				source: '/docs/components/treeview.html',
			},
			{
				destination: '/docs/components/date-picker',
				permanent: true,
				source: '/docs/components/date-picker.html',
			},
			{
				destination: '/docs/components/drop-down',
				permanent: true,
				source: '/docs/components/drop-down.html',
			},
			{
				destination: '/docs/components/empty-state',
				permanent: true,
				source: '/docs/components/empty-state.html',
			},
			{
				destination: '/docs/components/checkbox',
				permanent: true,
				source: '/docs/components/checkbox.html',
			},
			{
				destination: '/docs/components/dual-list-box',
				permanent: true,
				source: '/docs/components/dual-list-box.html',
			},
			{
				destination: '/docs/components/form',
				permanent: true,
				source: '/docs/components/form.html',
			},
			{
				destination: '/docs/components/input',
				permanent: true,
				source: '/docs/components/input.html',
			},
			{
				destination: '/docs/components/input-group',
				permanent: true,
				source: '/docs/components/input-group.html',
			},
			{
				destination: '/docs/components/select',
				permanent: true,
				source: '/docs/components/select.html',
			},
			{
				destination: '/docs/components/select-box',
				permanent: true,
				source: '/docs/components/select-box.html',
			},
			{
				destination: '/docs/components/toggle-switch',
				permanent: true,
				source: '/docs/components/toggle-switch.html',
			},
			{
				destination: '/docs/components/icon',
				permanent: true,
				source: '/docs/components/icon.html',
			},
			{
				destination: '/docs/components/label',
				permanent: true,
				source: '/docs/components/label.html',
			},
			{
				destination: '/docs/components/link',
				permanent: true,
				source: '/docs/components/link.html',
			},
			{
				destination: '/docs/components/list',
				permanent: true,
				source: '/docs/components/list.html',
			},
			{
				destination: '/docs/components/loading-indicator',
				permanent: true,
				source: '/docs/components/loading-indicator.html',
			},
			{
				destination: '/docs/components/localized-input',
				permanent: true,
				source: '/docs/components/localized-input.html',
			},
			{
				destination: '/docs/components/management-toolbar',
				permanent: true,
				source: '/docs/components/management-toolbar.html',
			},
			{
				destination: '/docs/components/modal',
				permanent: true,
				source: '/docs/components/modal.html',
			},
			{
				destination: '/docs/components/multi-select',
				permanent: true,
				source: '/docs/components/multi-select.html',
			},
			{
				destination: '/docs/components/multi-step-nav',
				permanent: true,
				source: '/docs/components/multi-step-nav.html',
			},
			{
				destination: '/docs/components/nav',
				permanent: true,
				source: '/docs/components/nav.html',
			},
			{
				destination: '/docs/components/navigation-bar',
				permanent: true,
				source: '/docs/components/navigation-bar.html',
			},
			{
				destination: '/docs/components/pagination-bar',
				permanent: true,
				source: '/docs/components/pagination-bar.html',
			},
			{
				destination: '/docs/components/panel',
				permanent: true,
				source: '/docs/components/panel.html',
			},
			{
				destination: '/docs/components/popover',
				permanent: true,
				source: '/docs/components/popover.html',
			},
			{
				destination: '/docs/components/progress-bar',
				permanent: true,
				source: '/docs/components/progress-bar.html',
			},
			{
				destination: '/docs/components/slider',
				permanent: true,
				source: '/docs/components/slider.html',
			},
			{
				destination: '/docs/components/sticker',
				permanent: true,
				source: '/docs/components/sticker.html',
			},
			{
				destination: '/docs/components/tabs',
				permanent: true,
				source: '/docs/components/tabs.html',
			},
			{
				destination: '/docs/components/toolbar',
				permanent: true,
				source: '/docs/components/toolbar.html',
			},
			{
				destination: '/docs/components/tooltip',
				permanent: true,
				source: '/docs/components/tooltip.html',
			},
		];

		return [
			{
				destination:
					'/blog/2022-05-02-api-consistency-improvements-for-controlled-and-uncontrolled-components',
				permanent: false,
				source: '/blog',
			},
			{
				destination: '/docs/introduction/how-to-use-clay',
				permanent: true,
				source: '/docs/components',
			},
			{
				destination: '/docs/contribute',
				permanent: true,
				source: '/docs/contributing.html',
			},
			{
				destination: '/docs/introduction/clay-in-jsps',
				permanent: true,
				source: '/docs/get-started/using-clay-in-jsps.html',
			},
			{
				destination: '/docs/components/text',
				permanent: true,
				source: '/docs/components/text.html',
			},
			{
				destination: '/docs/components/heading',
				permanent: true,
				source: '/docs/components/heading.html',
			},
			{
				destination: '/docs/components/focus-trap',
				permanent: true,
				source: '/docs/components/focus-trap.html',
			},
			{
				destination: '/docs/components/overlay-mask',
				permanent: true,
				source: '/docs/components/overlay-mask.html',
			},
			{
				destination: '/docs/components/reduced-motion',
				permanent: true,
				source: '/docs/components/reduced-motion.html',
			},
			{
				destination: '/docs/components/data-provider',
				permanent: true,
				source: '/docs/components/data-provider.html',
			},
			{
				destination: '/docs/components/vertical-bar',
				permanent: true,
				source: '/docs/components/vertical-bar.html',
			},
			{
				destination: '/docs/components/picker',
				permanent: true,
				source: '/docs/components/picker.html',
			},
			{
				destination: '/docs/components/radio-group',
				permanent: true,
				source: '/docs/components/radio-group.html',
			},
			{
				destination: '/docs/components/vertical-nav',
				permanent: true,
				source: '/docs/components/vertical-nav.html',
			},
			{
				destination: '/docs/components/layout',
				permanent: true,
				source: '/docs/components/layout.html',
			},
			{
				destination: '/docs/components/pagination',
				permanent: true,
				source: '/docs/components/pagination.html',
			},
			{
				destination: '/docs/introduction/how-to-use-clay',
				permanent: true,
				source: '/docs/get-started/how-to-use-clay.html',
			},
			{
				destination: '/docs/components/time-picker',
				permanent: true,
				source: '/docs/components/time-picker.html',
			},
			{
				destination: '/docs/components/provider',
				permanent: true,
				source: '/docs/components/provider.html',
			},
			{
				destination: '/docs/introduction/composition',
				permanent: true,
				source: '/docs/get-started/composing.html',
			},
			{
				destination: '/docs/components/upper-toolbar',
				permanent: true,
				source: '/docs/components/upper-toolbar.html',
			},
			...redirects,
			...redirects.map((item) => ({
				destination: `${item.destination}/markup`,
				permanent: true,
				source: `${item.source.replace('.html', '')}/markup.html`,
			})),
		];
	},
	sassOptions: {
		includePaths: [clay.includePaths[0]],
		precision: 8,
	},
	transpilePackages: ['renoun'],
	webpack(config) {
		config.module.rules.push({
			test: [/packages[\\/]clay-.*[\\/.].*\.(ts|tsx)/],
			loader: path.resolve('./use-client-loader.mjs'),
		});

		config.plugins.push(
			new webpack.ContextReplacementPlugin(
				/\/(@ts-morph\/common)\//,
				(data) => {
					for (const dependency of data.dependencies) {
						delete dependency.critical;
					}
					return data;
				}
			)
		);
		return config;
	},
};

export default withMDX(nextConfig);

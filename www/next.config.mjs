import createMDXPlugin from '@next/mdx';
import rehypeMdxCodeProps from 'rehype-mdx-code-props';
import {remarkPlugins, rehypePlugins} from 'renoun/mdx';
import webpack from 'webpack';
import path from 'path';

// @ts-ignore
import clay from '@clayui/css';

const withMDX = createMDXPlugin({
	extension: /\.mdx?$/,
	options: {
		remarkPlugins,
		rehypePlugins: [...rehypePlugins, rehypeMdxCodeProps],
	},
});

/** @type {import('next').NextConfig} */
const nextConfig = {
	pageExtensions: ['mdx', 'ts', 'tsx'],
	async redirects() {
		return [
			{
				destination: '/docs/introduction/how-to-use-clay',
				permanent: true,
				source: '/docs/components',
			},
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

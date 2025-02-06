import type {Metadata} from 'next';
import {AllCollection} from '@/data';
import {createLXCResource} from '@/lxc';

import {DocsLayout} from './DocsLayout';
import {RemoteLayout} from './RemoteLayout';

type Props = {
	params: Promise<{
		slug: Array<string>;
	}>;
};

const lxc = createLXCResource();

export async function generateStaticParams() {
	const collection = await AllCollection.getSources();
	const remoteCollection = await lxc.getResources();

	return [
		...collection.map((entry) => ({
			slug: entry.getPath().split('/').slice(1),
		})),
		...remoteCollection.map((item) => ({
			slug: ['components', item.slug.slice(1), 'design'],
		})),
	];
}

export async function generateMetadata(props: Props): Promise<Metadata> {
	const params = await props.params;
	const document = await AllCollection.getSource(
		params.slug.filter((item) => item !== 'design')
	);

	if (!document) {
		return {
			title: 'Not Found!',
		};
	}

	const frontmatter = await document.getExport('frontmatter').getValue();

	const title = `${frontmatter.title} - Clay by Liferay`;

	return {
		title: title,
		openGraph: {
			title: title,
			description: frontmatter.description,
		},
	};
}

export default async function Page(props: Props) {
	const params = await props.params;
	const Content = params.slug.includes('design') ? RemoteLayout : DocsLayout;

	return <Content slug={params.slug} />;
}

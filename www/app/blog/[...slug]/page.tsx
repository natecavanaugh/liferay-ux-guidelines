import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {AUTHORS, BlogCollection} from '@/data';
import Heading from '@/app/_components/Heading';

import styles from '../../docs/(layout)/[...slug]/page.module.css';
import Link from 'next/link';

type Props = {
	params: Promise<{
		slug: Array<string>;
	}>;
};

export async function generateStaticParams() {
	const collection = await BlogCollection.getSources();

	return collection.map((entry) => ({
		slug: entry.getPath().split('/').slice(2),
	}));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
	const params = await props.params;
	const document = await BlogCollection.getSource(params.slug);

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
		},
	};
}

export default async function Page(props: Props) {
	const params = await props.params;
	const file = await BlogCollection.getSource(params.slug);

	if (!file) {
		notFound();
	}

	const updatedAt = await file.getUpdatedAt();

	const headings = await file.getExport('headings').getValue();
	const frontmatter = await file.getExport('frontmatter').getValue();
	const Content = (await file.getExport('default').getValue()) as any;

	const tocContent = (
		<>
			<p className="text-5 font-weight-semi-bold">Table of Contents</p>
			<ul className={styles.toc_list}>
				{headings.map((item) => (
					<li
						style={{marginLeft: `${(item.depth - 2) * 10}px`}}
						key={item.id}
					>
						<a href={`#${item.id}`}>{item.text}</a>
					</li>
				))}
			</ul>
		</>
	);

	return (
		<div className={styles.content}>
			<div className={styles.article}>
				<Heading
					title={frontmatter.title}
					description={''}
					path={params.slug}
				/>

				<div className={styles.toc_mobile}>{tocContent}</div>

				<Content />

				<div className={styles.author_container}>
					<a
						className="link-primary mb-2"
						href={file.getEditPath()}
						target="_blank"
						rel="noreferrer"
						style={{
							display: 'inline-block',
						}}
					>
						Edit this page on GitHub
					</a>
					<p className="font-weight-semi-bold">Authors</p>
					<div className={styles.author_list}>
						{frontmatter.author.map((id) => {
							const item = AUTHORS[id];
							return (
								<Link
									key={id}
									rel="noopener noreferrer"
									target="_blank"
									href={item.url}
								>
									{item.name}
								</Link>
							);
						})}
					</div>

					{updatedAt && (
						<p className="text-secondary">
							Last edited{' '}
							{new Intl.DateTimeFormat('en-US', {
								dateStyle: 'long',
								timeStyle: 'medium',
							}).format(new Date(updatedAt))}
						</p>
					)}
				</div>
			</div>

			<div className={styles.toc}>{tocContent}</div>
		</div>
	);
}

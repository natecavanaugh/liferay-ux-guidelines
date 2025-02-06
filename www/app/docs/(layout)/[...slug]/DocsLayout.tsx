import {createLXCResource} from '@/lxc';
import {notFound} from 'next/navigation';
import Heading from '@/app/_components/Heading';
import {APIReference} from '@/app/_components/APIReference';
import {AllCollection} from '@/data';
import {CodeInline} from 'renoun/components';

import styles from './page.module.css';

type Props = {
	slug: Array<string>;
};

const lxc = createLXCResource();

export async function DocsLayout({slug}: Props) {
	const [file, fileMarkup, fileDesign] = await Promise.all([
		AllCollection.getSource(slug),
		slug.includes('markup')
			? true
			: AllCollection.getSource([...slug, 'markup']),
		lxc.getResource(slug),
	]);

	if (!file) {
		notFound();
	}

	const updatedAt = await file.getUpdatedAt();
	const authors = await file.getAuthors();

	const headings = await file.getExport('headings').getValue();
	const frontmatter = await file.getExport('frontmatter').getValue();
	const Content = (await file.getExport('default').getValue()) as any;

	const tocContent = (
		<>
			<p className="text-5 font-weight-semi-bold">Table of Contents</p>
			<ul className={styles.toc_list}>
				{[
					...(headings || []),
					...(frontmatter.packageTypes
						? [
								{
									text: 'API Reference',
									id: 'api-reference',
									depth: 2,
								},
						  ]
						: []),
				].map((item) => (
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
					description={frontmatter.description}
					lexicon={frontmatter.lexiconDefinition}
					packageStatus={frontmatter.packageStatus}
					path={slug}
					markup={!!fileMarkup}
					design={!!fileDesign}
					npmPackage={frontmatter.packageNpm}
					use={
						frontmatter.packageUse ? (
							<CodeInline
								value={frontmatter.packageUse}
								language="jsx"
								style={{
									backgroundColor: 'transparent',
									boxShadow: 'none',
								}}
							/>
						) : (
							''
						)
					}
				/>

				<div className={styles.toc_mobile}>{tocContent}</div>

				<Content />

				{frontmatter.packageTypes && (
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							overflow: 'hidden',
						}}
					>
						<h2 className="text-7 mb-4 mt-5" id="api-reference">
							API Reference
						</h2>

						{frontmatter.packageTypes.map((path) => (
							<APIReference
								key={path}
								source={path}
								workingDirectory="../packages"
								filter={(type) => {
									return (
										!type.name?.includes('Forward') &&
										(type.kind === 'Function' ||
											type.kind === 'Component')
									);
								}}
							/>
						))}
					</div>
				)}

				<div className={styles.author_container}>
					<a
						className="link-primary mb-3"
						href={file.getEditPath()}
						target="_blank"
						rel="noreferrer"
						style={{
							display: 'inline-block',
						}}
					>
						Edit this page on GitHub
					</a>

					{!!authors.length && (
						<>
							<p className="font-weight-semi-bold mb-1">
								Contributors
							</p>
							<div className={styles.author_list}>
								{authors.join(', ')}
							</div>
						</>
					)}

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

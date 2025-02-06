'use client';

import classNames from 'classnames';
import NavigationBar from '@clayui/navigation-bar';
import ClayLink, {ClayLinkContext} from '@clayui/link';
import Link from 'next/link';
import styles from './heading.module.css';

type Props = {
	description?: string;
	title: string;
	path: Array<string>;
	packageStatus?: string;
	lexicon?: string;
	markup?: boolean;
	design?: boolean;
	npmPackage?: string;
	use?: React.ReactNode;
};

export default function Heading({
	description,
	title,
	lexicon,
	packageStatus,
	path = [],
	markup,
	design,
	npmPackage,
	use,
}: Props) {
	const slugBase = path.filter(
		(item) => item !== 'design' && item !== 'markup'
	);
	const items = [
		{
			active: !path.includes('markup') && !path.includes('design'),
			href: `/docs/${slugBase.join('/')}`,
			label: 'React',
		},
		...(markup
			? [
					{
						active: path.includes('markup'),
						href: `/docs/${slugBase.join('/')}/markup`,
						label: 'HTML/CSS',
					},
			  ]
			: []),
		...(design
			? [
					{
						active: path.includes('design'),
						href: `/docs/${slugBase.join('/')}/design`,
						label: 'Design',
					},
			  ]
			: []),
	];

	return (
		<div className={styles.heading_container}>
			<div className={styles.heading_title}>
				<h1 className="text-10">{title}</h1>
				{lexicon && (
					<a
						className="badge badge-primary badge-translucent"
						href={lexicon}
						rel="noopener noreferrer"
						target="_blank"
					>
						View in Lexicon
					</a>
				)}
				{packageStatus && (
					<span
						className={classNames('badge badge-translucent', {
							'badge-success': packageStatus === 'Stable',
							'badge-warning': packageStatus === 'Beta',
							'badge-danger': packageStatus === 'Deprecated',
						})}
					>
						{packageStatus}
					</span>
				)}
			</div>
			{description && (
				<p className="text-6 text-secondary">{description}</p>
			)}

			{npmPackage && (
				<table className={classNames('table', styles.table)}>
					<tbody>
						<tr>
							<th>install</th>
							<td>yarn add {npmPackage}</td>
						</tr>
						<tr>
							<th>version</th>
							<td>
								<img
									alt="NPM Version"
									src={`https://img.shields.io/npm/v/${npmPackage}?style=flat-square&logo=npm&label=%20&labelColor=%23fff&color=%23fff`}
								/>
							</td>
						</tr>
						<tr>
							<th>use</th>
							<td>{use}</td>
						</tr>
					</tbody>
				</table>
			)}

			{(markup || design) && (
				<ClayLinkContext.Provider value={Link as any}>
					<NavigationBar
						triggerLabel="Navigation"
						className={styles.nav}
					>
						{items.map((item) => (
							<NavigationBar.Item
								key={item.label}
								active={item.active}
							>
								<ClayLink href={item.href}>
									{item.label}
								</ClayLink>
							</NavigationBar.Item>
						))}
					</NavigationBar>
				</ClayLinkContext.Provider>
			)}
		</div>
	);
}

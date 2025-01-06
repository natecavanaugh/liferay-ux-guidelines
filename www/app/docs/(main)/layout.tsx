import {Sidebar} from '../../_components/Sidebar';
import {Navbar} from '../../_components/Navbar';
import styles from '../(layout)/layout.module.css';

export default function MainDocsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Sidebar
				items={[
					{
						name: 'About',
						items: [
							{name: 'Blog', href: '#'},
							{name: 'Contribute', href: '/docs/contribute'},
							{name: 'Releases', href: '#'},
							{name: 'Support', href: '#'},
							{name: 'Lexicon', href: '#'},
						],
					},
					{
						name: 'Libraries',
						items: [
							{
								name: 'React Components',
								href: '/docs/components',
							},
							{name: 'CSS Framework', href: '/docs/css'},
						],
					},
				]}
			/>
			<div className={styles.main}>
				<Navbar />
				<main className={styles.content}>{children}</main>
			</div>
		</>
	);
}

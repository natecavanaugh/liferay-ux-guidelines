import {BlogCollection} from '@/data';

import {Sidebar} from '../_components/Sidebar';
import {Navbar} from '../_components/Navbar';
import styles from '../docs/(layout)/layout.module.css';

export default function DocsLayout({children}: {children: React.ReactNode}) {
	return (
		<>
			<Sidebar
				collection={[
					{
						name: 'Blog',
						collection: BlogCollection,
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

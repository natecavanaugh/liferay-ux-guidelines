import {
	DocumentsCollection,
	CSSDocumentsCollection,
	ComponentDocumentsCollection,
} from '@/data';

import {Sidebar} from '../../_components/Sidebar';
import {Navbar} from '../../_components/Navbar';
import styles from './layout.module.css';

export default function DocsLayout({children}: {children: React.ReactNode}) {
	return (
		<>
			<Sidebar
				collection={[
					{name: 'Introduction', collection: DocumentsCollection},
					{
						name: 'Components',
						collection: ComponentDocumentsCollection,
					},
					{
						name: 'CSS',
						collection: CSSDocumentsCollection,
					},
				]}
				path="docs"
			/>
			<div className={styles.main}>
				<Navbar />
				<main className={styles.content}>{children}</main>
			</div>
		</>
	);
}

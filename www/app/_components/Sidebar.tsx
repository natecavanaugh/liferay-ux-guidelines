import Link from 'next/link';
import type {FileSystemSource, Collection} from 'renoun/collections';
import type {AllCollection, ComponentDocumentsSchema} from '@/data';

import ClayLink from '../_components/Link';
import styles from './sidebar.module.css';
import {SidebarMobile} from './SidebarMobile';

type Item = {
	name: string;
	items: Array<{name: string; href: string}>;
};

type CollectionItem = {
	name: string;
	collection: Collection<ComponentDocumentsSchema | any>;
};

type Props = {
	items?: Array<Item>;
	path?: string;
	collection?: AllCollection | Collection<any> | Array<CollectionItem>;
};

export function Sidebar({collection, path, items}: Props) {
	const content = (
		<>
			{items?.map((item) => (
				<ul key={item.name} className={styles.sidebar_nav}>
					<p className={styles.sidebar_nav_title}>{item.name}</p>
					<ul>
						{item.items.map((item) => (
							<li key={item.name}>
								<ClayLink href={item.href}>
									{item.name}
								</ClayLink>
							</li>
						))}
					</ul>
				</ul>
			))}

			{collection &&
				Array.isArray(collection) &&
				collection.map((item) => (
					<ul key={item.name} className={styles.sidebar_nav}>
						<p className={styles.sidebar_nav_title}>{item.name}</p>
						<ul>
							<TreeCollection
								collection={item.collection}
								path={path}
							/>
						</ul>
					</ul>
				))}

			{collection && !Array.isArray(collection) && (
				<TreeCollection collection={collection} path={path} />
			)}
		</>
	);

	const logo = (
		<Link className={styles.logo} href="/docs">
			<svg width={27} height={37} viewBox="0 0 64 85">
				<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
					<g fill="#B3472D">
						<path d="M63.9134908,25.3330425 C63.9134908,20.3098732 60.3642372,14.1418975 56.0279342,11.6293683 L39.9291975,2.30467363 C35.5910117,-0.207855536 28.4943873,-0.207855536 24.1562014,2.30467363 L8.05746477,11.6293683 C3.71927889,14.1418975 0.170025254,20.3098732 0.170025254,25.3330425 L0.170025254,62.5449218 C0.170025254,65.0668966 2.20919856,67.1128132 4.72286095,67.1128132 C7.23840623,67.110924 9.27569665,65.0668966 9.27757954,62.5449218 L9.27757954,26.0414623 C9.27757954,23.5289332 11.0512649,20.4440007 13.2203579,19.1877362 L28.0989797,10.5714613 C30.2699556,9.31519674 33.8173263,9.31519674 35.9864192,10.5714613 L50.8650411,19.1896253 C53.034134,20.4440007 54.8078194,23.5289332 54.8078194,26.0414623 L54.8097023,47.220383 C54.8097023,49.7442469 56.8469927,51.7901635 59.3606551,51.7920526 C61.1305747,51.7901635 62.6613668,50.7775953 63.4145241,49.2984146 C63.7327331,48.6750051 63.9172566,47.9684744 63.9172566,47.2222721 L63.9134908,25.3330425 Z" />
						<path d="M63.9153737,63.4152392 C63.9153737,65.937214 61.8762004,67.9812415 59.3606551,67.9831306 C56.8469927,67.9831306 54.8097023,65.937214 54.8097023,63.4152392 L54.8097023,60.0752756 C54.8097023,57.5514118 56.8469927,55.5054952 59.3606551,55.5054952 C61.8762004,55.5054952 63.9153737,57.5514118 63.9153737,60.0733865 L63.9153737,63.4152392 Z" />
						<path d="M32.0423229,30.093624 C29.5286605,30.0955132 27.4894872,32.1395406 27.4894872,34.6634045 L27.4913701,63.415806 C27.4913701,65.9377807 29.5286605,67.9836973 32.0423229,67.9836973 C34.5578682,67.9836973 36.5951586,65.9377807 36.5951586,63.415806 L36.5951586,34.6634045 C36.5951586,32.1395406 34.5559853,30.0955132 32.0423229,30.093624" />
						<path d="M45.7006417,42.2538874 C48.2124212,42.2538874 50.2497116,40.211749 50.2534774,37.6916634 L50.2534774,28.6786734 C50.2534774,26.1661442 48.479792,23.0831009 46.3106991,21.8268363 L35.9867958,15.8458835 C33.8177029,14.5896189 30.2684492,14.5896189 28.0993563,15.8458835 L17.7735701,21.8268363 C15.6063601,23.0831009 13.8307918,26.1661442 13.8307918,28.6786734 L13.8307918,70.2714213 C13.8307918,72.7839504 15.6063601,75.8651046 17.7735701,77.1213692 L28.0993563,83.1042112 C30.2684492,84.3604758 33.8177029,84.3604758 35.9867958,83.1042112 L46.3106991,77.1213692 C48.479792,75.8651046 50.2534774,72.7839504 50.2534774,70.2714213 L50.2534774,50.5301207 C50.2497116,48.010035 48.2124212,45.9678967 45.7006417,45.9678967 C43.1869793,45.9678967 41.147806,48.0138133 41.147806,50.535788 L41.147806,67.2809448 C41.147806,68.5353203 40.2609633,70.0768419 39.1764169,70.7059188 L34.0135238,73.6963952 C32.9289773,74.3254721 31.1552919,74.3254721 30.0707455,73.6963952 L24.9097353,70.7059188 C23.8251888,70.0768419 22.9383461,68.5353203 22.9383461,67.2809448 L22.9383461,31.6691498 C22.9383461,30.4128853 23.8251888,28.8732527 24.9097353,28.2422868 L30.0707455,25.2518103 C31.1552919,24.6227335 32.9289773,24.6227335 34.0135238,25.2518103 L39.1764169,28.2422868 C40.2609633,28.8732527 41.147806,30.4128853 41.147806,31.6691498 L41.147806,37.685996 C41.147806,40.2079708 43.1869793,42.2538874 45.7006417,42.2538874" />
					</g>
				</g>
			</svg>
			<span className={styles.logo_title}>Clay</span>
		</Link>
	);

	return (
		<div className={styles.main}>
			<nav className={styles.sidebar}>
				{logo}

				{content}
			</nav>

			<SidebarMobile logo={logo}>{content}</SidebarMobile>
		</div>
	);
}

type TreeCollectionProps = {
	collection: AllCollection | Collection<ComponentDocumentsSchema>;
	path?: string;
};

async function TreeCollection({collection, path}: TreeCollectionProps) {
	const entries = await collection.getSources();

	return (
		<>
			{entries.map((entry) => (
				<ListNavigation
					key={entry.getPath()}
					entry={entry}
					path={path}
				/>
			))}
		</>
	);
}

type ListNavigationProps = {
	entry: FileSystemSource<any>;
	path?: string;
};

async function ListNavigation({entry, path: pathUrl}: ListNavigationProps) {
	const path = entry.getPath();
	const title = entry.getTitle();

	if (path.includes('/markup')) {
		return null;
	}

	const link = (
		<li>
			<ClayLink
				href={`${pathUrl ? `/${pathUrl}` : ''}${path}`}
				style={{textTransform: 'capitalize'}}
			>
				{title.replaceAll(/\d{4}\s\d{2}\s\d{2}/g, '')}
			</ClayLink>
		</li>
	);

	if (entry.isFile()) {
		return link;
	}

	const entries = await entry.getSources({depth: 1});

	if (entries.length === 0) {
		return link;
	}

	return (
		<ul key={path} className={styles.sidebar_nav}>
			<p className={styles.sidebar_nav_title}>{title}</p>
			<ul>
				{entries.map((entry) => (
					<ListNavigation key={entry.getPath()} entry={entry} />
				))}
			</ul>
		</ul>
	);
}

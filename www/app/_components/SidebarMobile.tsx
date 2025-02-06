'use client';

import Icon from '@clayui/icon';
import {useState} from 'react';

import styles from './sidebar.module.css';

type Props = {
	logo: React.ReactNode;
	children: React.ReactNode;
};

export function SidebarMobile({logo, children}: Props) {
	const [expand, setExpand] = useState(false);

	return (
		<nav className={styles.sidebar_mobile}>
			<div className={styles.sidebar_mobile_header}>
				{logo}

				<button
					aria-label="Toggle navigation"
					className={styles.sidebar_menu_button}
					onClick={() => setExpand(!expand)}
					type="button"
				>
					<Icon symbol="bars" spritemap="/images/icons/icons.svg" />
				</button>
			</div>

			{expand && children}
		</nav>
	);
}

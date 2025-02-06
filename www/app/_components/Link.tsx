'use client';

import {usePathname} from 'next/navigation';
import classNames from 'classnames';
import Link from 'next/link';
import styles from './link.module.css';

export default function ClayLink({
	children,
	href,
	...otherProps
}: React.ComponentProps<typeof Link>) {
	const pathname = usePathname();

	return (
		<Link
			{...otherProps}
			href={href}
			rel={
				typeof href === 'string' && href.includes('http')
					? 'noopener noreferrer'
					: undefined
			}
			target={
				typeof href === 'string' && href.includes('http')
					? '_blank'
					: undefined
			}
			className={classNames({
				[styles.link_active]: pathname === href,
			})}
		>
			{children}
		</Link>
	);
}

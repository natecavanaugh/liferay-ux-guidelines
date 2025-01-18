/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import Link from '@clayui/link';
import classNames from 'classnames';
import React from 'react';

type Props = React.HTMLAttributes<HTMLLIElement> & {
	/**
	 * Flag to indicate if the Breadcrumb item is active or not.
	 */
	active?: boolean;

	/**
	 * This value is used to be the target of the link.
	 */
	href?: string;

	/**
	 * Label of the Breadcrumb item
	 */
	label: string;

	/**
	 * Callback for when a Breadcrumb item is clicked.
	 */
	onClick?: (event: React.SyntheticEvent) => void;
};

export const Item = ({active, href, label, onClick, ...otherProps}: Props) => (
	<li
		className={classNames('breadcrumb-item', {
			active,
		})}
		{...otherProps}
	>
		<Link
			aria-current={active ? 'page' : undefined}
			className="breadcrumb-link"
			data-testid={`testId${label}`}
			href={active ? '#' : href}
			onClick={(event) => {
				if (onClick) {
					event.preventDefault();
					onClick(event);
				}
			}}
		>
			{label}
		</Link>
	</li>
);

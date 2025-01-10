/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import ClayLink from '@clayui/link';
import classNames from 'classnames';
import React from 'react';

interface IPaginationItemProps
	extends React.HTMLAttributes<HTMLAnchorElement | HTMLDivElement> {
	as?: 'div' | typeof ClayLink;
	active?: boolean;
	disabled?: boolean;
	href?: string;
}

export const Item = ({
	as: As = ClayLink,
	active = false,
	children,
	disabled = false,
	href,
	...otherProps
}: IPaginationItemProps) => {
	return (
		<li className={classNames('page-item', {active, disabled})}>
			{As === 'div' ? (
				<As {...otherProps} className="page-link">
					{children}
				</As>
			) : (
				<As
					{...otherProps}
					aria-current={active && href ? 'page' : undefined}
					className="page-link"
					href={disabled || active ? undefined : href}
					onClick={(event) => {
						if (!href) {
							event.preventDefault();
						}

						if (otherProps.onClick) {
							otherProps.onClick(event as any);
						}
					}}
					tabIndex={active || (!href && !disabled) ? 0 : undefined}
				>
					{children}
				</As>
			)}
		</li>
	);
};

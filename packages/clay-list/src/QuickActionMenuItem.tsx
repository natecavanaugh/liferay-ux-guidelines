/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import ClayIcon from '@clayui/icon';
import ClayLink from '@clayui/link';
import classNames from 'classnames';
import React from 'react';

interface IItemProps
	extends React.HTMLAttributes<HTMLAnchorElement | HTMLButtonElement> {
	/**
	 * Value of path the item should link to.
	 */
	href?: string;

	/**
	 * Path to icon spritemap.
	 */
	spritemap?: string;

	/**
	 * Name of icon symbol
	 */
	symbol: string;
}

const QuickActionMenuItem = React.forwardRef<
	HTMLAnchorElement & HTMLButtonElement,
	IItemProps
>(({className, href, spritemap, symbol, ...otherProps}: IItemProps, ref) => {
	const ElementTag = href ? ClayLink : 'button';

	return (
		<ElementTag
			{...otherProps}
			className={classNames(
				'component-action quick-action-item',
				className
			)}
			href={href}
			ref={ref}
			role="button"
		>
			<ClayIcon spritemap={spritemap} symbol={symbol} />
		</ElementTag>
	);
});

QuickActionMenuItem.displayName = 'ClayListQuickActionMenuItem';

export default QuickActionMenuItem;

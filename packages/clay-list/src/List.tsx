/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import ClayLayout from '@clayui/layout';
import classNames from 'classnames';
import React from 'react';
import warning from 'warning';

import Header from './Header';
import Item from './Item';
import ItemText from './ItemText';
import ItemTitle from './ItemTitle';
import QuickActionMenu from './QuickActionMenu';

interface IProps extends React.HTMLAttributes<HTMLUListElement> {
	children?:
		| React.ReactElement<React.HTMLAttributes<HTMLLIElement>>
		| Array<React.ReactElement<React.HTMLAttributes<HTMLLIElement>>>;

	/*
	 * Flag to indicate if action items should be shown on hover.
	 * Defaults to `true`
	 */
	showQuickActionsOnHover?: boolean;
}

const CLAY_REGEX = /Clay(?!ListItem|ListHeader).+/;

function List({
	children,
	className,
	showQuickActionsOnHover = true,
	...otherProps
}: IProps) {
	return (
		<ul
			{...otherProps}
			className={classNames('list-group', className, {
				'show-quick-actions-on-hover': showQuickActionsOnHover,
			})}
		>
			{process.env['NODE_ENV'] !== 'development' && children}

			{process.env['NODE_ENV'] === 'development' &&
				children &&
				React.Children.map(children, (child) => {
					warning(
						!(
							child &&
							// @ts-ignore
							child.type.displayName &&
							// @ts-ignore
							child.type.displayName.match(CLAY_REGEX)
						),
						// @ts-ignore
						`Direct descendant of ClayList must be either ClayList.Item or ClayList.Header. You used ${child.type.displayName}.`
					);

					return child;
				})}
		</ul>
	);
}

List.displayName = 'ClayList';

List.Header = Header;
List.Item = Item;
List.ItemField = ClayLayout.ContentCol;
List.ItemText = ItemText;
List.ItemTitle = ItemTitle;
List.QuickActionMenu = QuickActionMenu;

export default List;

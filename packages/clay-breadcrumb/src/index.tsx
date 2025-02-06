/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {ClayButtonWithIcon} from '@clayui/button';
import classNames from 'classnames';
import React, {useState} from 'react';
import warning from 'warning';

import Item from './Item';

type TItem = React.ComponentProps<typeof Item>;
type TItems = Array<TItem>;

interface IProps extends React.HTMLAttributes<HTMLOListElement> {
	/**
	 * Defines the aria label of component elements.
	 */
	ariaLabels?: {
		breadcrumb: string;
		open: string;
		close: string;
	};

	/**
	 * The number of Breadcrumb Items to show on each side of the active Breadcrumb Item before
	 * using an ellipsis dropdown.
	 * @deprecated since v3.91.0 - It is no longer necessary.
	 */
	ellipsisBuffer?: number;

	/**
	 * Use this property for defining `otherProps` that will be passed to ellipsis dropdown trigger.
	 * @deprecated since v3.91.0 - It is no longer necessary.
	 */
	ellipsisProps?: Object;

	/**
	 * Property to define Breadcrumb's items.
	 */
	items: Array<React.ComponentProps<typeof Item>>;

	/**
	 * Path to the location of the spritemap resource.
	 */
	spritemap?: string;
}

const findActiveItems = (items: TItems) => {
	return items.filter((item) => {
		return item.active;
	});
};

const Breadcrumb = ({
	ariaLabels = {
		breadcrumb: 'Breadcrumb',
		close: 'Partially nest breadcrumbs',
		open: 'See full nested',
	},
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	ellipsisBuffer = 1,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	ellipsisProps = {},
	className,
	items,
	spritemap,
	...otherProps
}: IProps) => {
	warning(
		findActiveItems(items).length === 1,
		'ClayBreadcrumb expects at least one `active` item on `items`.'
	);

	const [collapsed, setCollapsed] = useState(false);

	return (
		<nav
			aria-label={ariaLabels.breadcrumb}
			className="align-items-center d-flex"
		>
			{items.length > 3 && (
				<ClayButtonWithIcon
					aria-expanded={collapsed}
					aria-label={collapsed ? ariaLabels.close : ariaLabels.open}
					className="breadcrumb-toggle"
					displayType={null}
					onClick={() => setCollapsed(!collapsed)}
					size="xs"
					spritemap={spritemap}
					symbol={
						collapsed ? 'angle-double-left' : 'angle-double-right'
					}
					title={collapsed ? ariaLabels.close : ariaLabels.open}
				/>
			)}
			<ol {...otherProps} className={classNames('breadcrumb', className)}>
				{items.length > 3 && !collapsed ? (
					<Items
						items={[
							items[items.length - 2]!,
							items[items.length - 1]!,
						]}
					/>
				) : (
					<Items items={items} />
				)}
			</ol>
		</nav>
	);
};

type ItemsProps = {
	items: TItems;
};

function Items({items}: ItemsProps) {
	return (
		<>
			{items.map((item: TItem | React.ReactNode, i: number) =>
				React.isValidElement(item) ? (
					React.cloneElement(item, {key: `ellipsis${i}`})
				) : (
					<Item
						active={(item as TItem).active}
						href={(item as TItem).href}
						key={`breadcrumbItem${i}`}
						label={(item as TItem).label}
						onClick={(item as TItem).onClick}
					/>
				)
			)}
		</>
	);
}

export default Breadcrumb;

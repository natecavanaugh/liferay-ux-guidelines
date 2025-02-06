/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {Nav, VerticalNav} from '@clayui/core';
import React from 'react';
import warning from 'warning';

export type DisplayType = null | 'primary';

interface IItem extends React.ComponentProps<typeof Nav.Item> {
	/**
	 * Flag to indicate if item is active.
	 */
	active?: boolean | undefined;

	/**
	 * Callback for when item is clicked.
	 */
	onClick?: () => void;

	/**
	 * Link href for item.
	 */
	href?: string;

	/**
	 * Value of item.
	 */
	label?: string | React.ReactNode;
}

interface IItemWithItems extends IItem {
	/**
	 * Flag to indicate if nested items are expanded and shown.
	 */
	initialExpanded?: boolean;

	/**
	 * List of nested items under current item.
	 */
	items?: Array<IItem>;
}

interface IProps extends React.ComponentProps<typeof VerticalNav> {
	/**
	 * Flag to define if the item represents the current page. Disable this
	 * attribute only if there are multiple navigations on the page.
	 */
	itemAriaCurrent?: boolean;

	/**
	 * Flag to indicate the navigation behavior in the menu.
	 *
	 * - manual - it will just move the focus and menu activation is done just
	 * by pressing space or enter.
	 * - automatic - moves the focus to the menuitem and activates the menu.
	 */
	activation?: 'manual' | 'automatic';

	/**
	 * Label of item that is currently active.
	 * @deprecated since version 3.3.x
	 */
	activeLabel?: string;

	/**
	 * Determines the Vertical Nav variant to use.
	 */
	displayType?: DisplayType;

	/**
	 * Flag to activate the Decorator variation.
	 */
	decorated?: boolean;

	/**
	 * Label of the button that appears on smaller resolutions to open the vertical navigation.
	 */
	triggerLabel?: string;

	/**
	 * List of items.
	 */
	items: Array<IItemWithItems>;

	/**
	 * Flag to indicate if `menubar-vertical-expand-lg` class is applied.
	 */
	large?: boolean;

	/**
	 * Custom component that will be displayed on mobile resolutions that toggles the visibility of the navigation.
	 */
	trigger?: typeof VerticalNav.Trigger;

	/**
	 * Path to the spritemap that Icon should use when referencing symbols.
	 */
	spritemap?: string;
}

function ClayVerticalNav({
	activeLabel,
	children,
	displayType,
	triggerLabel = 'Menu',
	...otherProps
}: IProps) {
	warning(
		!activeLabel,
		'ClayVerticalNav: The `activeLabel` API has been deprecated in favor of `triggerLabel` and will be removed in the next major release.'
	);

	if (children && !displayType) {
		return (
			<VerticalNav
				{...otherProps}
				triggerLabel={activeLabel ?? triggerLabel}
			>
				{children}
			</VerticalNav>
		);
	}

	return (
		<VerticalNav {...otherProps} triggerLabel={activeLabel ?? triggerLabel}>
			{(item) => (
				<VerticalNav.Item
					active={item.active}
					href={item.href}
					initialExpanded={item.initialExpanded}
					items={item.items}
					onClick={item.onClick}
				>
					{item.label}
				</VerticalNav.Item>
			)}
		</VerticalNav>
	);
}

ClayVerticalNav.Trigger = VerticalNav.Trigger;
ClayVerticalNav.Item = VerticalNav.Item;

export {ClayVerticalNav};

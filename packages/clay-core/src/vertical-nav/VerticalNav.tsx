/**
 * SPDX-FileCopyrightText: © 2023 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import Icon from '@clayui/icon';
import {
	InternalDispatch,
	useControlledState,
	useNavigation,
} from '@clayui/shared';
import classNames from 'classnames';
import React, {useCallback, useMemo, useRef, useState} from 'react';

import {Collection, useCollection} from '../collection';
import {Nav} from '../nav';
import {Item} from './Item';
import {Trigger} from './Trigger';
import {VerticalNavContext} from './context';

import type {ChildrenFunction} from '../collection';

type Props<T extends Record<string, any> | string> = {
	/**
	 * Flag to define which item has the active state/current page.
	 */
	active?: React.Key;

	/**
	 * Flag to indicate the navigation behavior in the menu.
	 *
	 * - manual - it will just move the focus and menu activation is done just
	 * by pressing space or enter.
	 * - automatic - moves the focus to the menuitem and activates the menu.
	 */
	activation?: 'manual' | 'automatic';

	/**
	 * The component contents.
	 */
	children?: React.ReactNode | ChildrenFunction<T, null>;

	/**
	 * Flag to activate the Decorator variation.
	 */
	decorated?: boolean;

	/**
	 * Property to set the initial value of `expandedKeys` (uncontrolled).
	 */
	defaultExpandedKeys?: Set<React.Key>;

	/**
	 * The currently expanded keys in the collection (controlled).
	 */
	expandedKeys?: Set<React.Key>;

	/**
	 * Flag to define if the item represents the current page. Disable this
	 * attribute only if there are multiple navigations on the page.
	 */
	itemAriaCurrent?: boolean;

	/**
	 * Property to inform the dynamic data of the tree.
	 */
	items?: Array<T>;

	/**
	 * Flag to indicate if `menubar-vertical-expand-lg` class is applied.
	 */
	large?: boolean;

	/**
	 * A callback that is called when items are expanded or collapsed
	 * (controlled).
	 */
	onExpandedChange?: InternalDispatch<Set<React.Key>>;

	/**
	 * Path to the spritemap that Icon should use when referencing symbols.
	 */
	spritemap?: string;

	/**
	 * Custom component that will be displayed on mobile resolutions that
	 * toggles the visibility of the navigation.
	 */
	trigger?: typeof Trigger;

	/**
	 * Label of the button that appears on smaller resolutions to open the
	 * vertical navigation.
	 */
	triggerLabel?: string;
};

function depthActive<T extends Record<string, any>>(
	items: Array<T>
): T | undefined {
	return items.find((item) => {
		if (item['active']) {
			return true;
		}

		if ('items' in item) {
			return depthActive(item['items'] as Array<T>);
		}

		return false;
	});
}

function VerticalNav<T extends Record<string, any> | string>(
	props: Props<T>
): JSX.Element & {
	Trigger: typeof Trigger;
	Item: typeof Item;
};

function VerticalNav<T extends Record<string, any> | string>({
	active,
	activation = 'manual',
	children,
	decorated,
	defaultExpandedKeys = new Set(),
	expandedKeys: externalExpandedKeys,
	itemAriaCurrent: ariaCurrent = true,
	items,
	large,
	onExpandedChange,
	spritemap,
	trigger: CustomTrigger = Trigger,
	triggerLabel = 'Menu',
}: Props<T>) {
	const [isOpen, setIsOpen] = useState(false);

	const containerRef = useRef<HTMLDivElement | null>(null);

	const [expandedKeys, setExpandedKeys] = useControlledState({
		defaultName: 'defaultExpandedKeys',
		defaultValue: defaultExpandedKeys,
		handleName: 'onExpandedChange',
		name: 'expandedKeys',
		onChange: onExpandedChange,
		value: externalExpandedKeys,
	});

	const toggle = useCallback(
		(key: React.Key) => {
			const expanded = new Set(expandedKeys);

			if (expanded.has(key)) {
				expanded.delete(key);
			} else {
				expanded.add(key);
			}

			setExpandedKeys(expanded);
		},
		[expandedKeys]
	);

	const close = useCallback(
		(key: React.Key) => {
			const expanded = new Set(expandedKeys);

			if (expanded.has(key)) {
				expanded.delete(key);

				setExpandedKeys(expanded);

				return true;
			}

			return false;
		},
		[expandedKeys]
	);

	const open = useCallback(
		(key: React.Key) => {
			const expanded = new Set(expandedKeys);

			if (!expanded.has(key)) {
				expanded.add(key);

				setExpandedKeys(expanded);

				return true;
			}

			return false;
		},
		[expandedKeys]
	);

	const childrenRootRef = useRef(children);

	const {navigationProps} = useNavigation({
		activation,
		containerRef,
		orientation: 'vertical',
	});

	const collection = useCollection<T>({
		children,

		// Avoid collection list is obsolete because we have collection nesting
		// which is not based on group primitive like Picker with groups
		// or DropDown.
		forceDeepRootUpdate: true,
		items,
		suppressTextValueWarning: false,
	});

	// Checks if the `active` property exists in the items tree to maintain
	// compatibility with the previous version.
	const hasDepthActive = useMemo(() => {
		if (typeof active !== 'undefined' || !items) {
			return undefined;
		}

		return depthActive(items as Array<Record<string, any>>);
	}, [active, items]);

	return (
		<nav
			className={classNames('menubar menubar-transparent', {
				['menubar-decorated']: decorated,
				['menubar-vertical-expand-lg']: large,
				['menubar-vertical-expand-md']: !large,
			})}
		>
			<CustomTrigger onClick={() => setIsOpen(!isOpen)}>
				<span className="inline-item inline-item-before">
					{triggerLabel}
				</span>

				<Icon
					focusable="false"
					role="presentation"
					spritemap={spritemap}
					symbol="caret-bottom"
				/>
			</CustomTrigger>

			<div
				{...navigationProps}
				className={classNames('collapse menubar-collapse', {
					show: isOpen,
				})}
				ref={containerRef}
			>
				<Nav aria-orientation="vertical" nested role="menubar">
					<VerticalNavContext.Provider
						value={{
							activeKey:
								active && collection.hasItem(active)
									? active
									: hasDepthActive
									? null
									: undefined,
							ariaCurrent: ariaCurrent ? 'page' : null,
							childrenRoot: childrenRootRef,
							close,
							expandedKeys,
							firstKey: collection.getFirstItem().key,
							open,
							spritemap,
							toggle,
						}}
					>
						<Collection<T> collection={collection} />
					</VerticalNavContext.Provider>
				</Nav>
			</div>
		</nav>
	);
}

VerticalNav.Item = Item;
VerticalNav.Trigger = Trigger;

export {VerticalNav};

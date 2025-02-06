/**
 * SPDX-FileCopyrightText: © 2020 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {
	InternalDispatch,
	useControlledState,
	useInteractionFocus,
} from '@clayui/shared';
import classNames from 'classnames';
import React, {useEffect, useRef, useState} from 'react';

import ClayDropDown from './DropDown';
import ClayDropDownMenu from './Menu';
import Drilldown from './drilldown';

import type {Messages} from './drilldown';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
	/**
	 * Flag to indicate if the menu should be initially open (controlled).
	 */
	active?: boolean;

	/**
	 * Flag to align the DropDown menu within the viewport.
	 */
	alignmentByViewport?: React.ComponentProps<
		typeof ClayDropDownMenu
	>['alignmentByViewport'];

	/**
	 * Default position of menu element. Values come from `./Menu`.
	 */
	alignmentPosition?: React.ComponentProps<
		typeof ClayDropDownMenu
	>['alignmentPosition'];

	/**
	 * HTML element tag that the container should render.
	 */
	containerElement?: React.ComponentProps<
		typeof ClayDropDown
	>['containerElement'];

	/**
	 * Property to set the initial value of `active` (uncontrolled).
	 */
	defaultActive?: boolean;

	/**
	 * The unique identifier of the menu that should be active on mount.
	 */
	defaultActiveMenu?: string;

	/**
	 * The unique identifier of the menu that should be active on mount.
	 * @deprecated since v3.51.0 - use `defaultActiveMenu` instead.
	 */
	initialActiveMenu?: string;

	/**
	 * Prop to pass DOM element attributes to DropDown.Menu.
	 */
	menuElementAttrs?: React.ComponentProps<
		typeof ClayDropDown
	>['menuElementAttrs'];

	menuHeight?: React.ComponentProps<typeof ClayDropDown>['menuHeight'];

	menuWidth?: React.ComponentProps<typeof ClayDropDown>['menuWidth'];

	/**
	 * Messages for drilldown.
	 */
	messages?: Messages;

	/**
	 * Map of menus and items to be used in the drilldown. Each key should be a unique identifier for the menu.
	 */
	menus: {
		[id: string]: React.ComponentProps<typeof Drilldown.Menu>['items'];
	};

	/**
	 * Function for setting the offset of the menu from the trigger.
	 */
	offsetFn?: React.ComponentProps<typeof ClayDropDown>['offsetFn'];

	/**
	 * Callback the will be invoked when the active prop is changed (controlled).
	 */
	onActiveChange?: InternalDispatch<boolean>;

	/**
	 * Path to spritemap
	 */
	spritemap?: string;

	/**
	 * Flag indicating if the menu should be rendered lazily
	 */
	renderMenuOnClick?: React.ComponentProps<
		typeof ClayDropDown
	>['renderMenuOnClick'];

	/**
	 * Element that is used as the trigger which will activate the dropdown on click.
	 */
	trigger: React.ReactElement;

	/**
	 * Flag indicating if the caret icon should be displayed on the right side.
	 */
	triggerIcon?: string | null;
}

type History = {
	id: string;
	title: string;
};

export const ClayDropDownWithDrilldown = ({
	active: externalActive,
	alignmentByViewport,
	alignmentPosition,
	className,
	containerElement,
	defaultActive = false,
	defaultActiveMenu,
	initialActiveMenu,
	menuElementAttrs,
	menuHeight,
	menuWidth,
	menus,
	messages = {
		back: '',
		goTo: '',
	},
	offsetFn,
	onActiveChange,
	renderMenuOnClick,
	spritemap,
	trigger,
	triggerIcon = null,
}: IProps) => {
	const [activeMenu, setActiveMenu] = useState(
		defaultActiveMenu ?? initialActiveMenu
	);
	const [direction, setDirection] = useState<'prev' | 'next'>();
	const [history, setHistory] = useState<Array<History>>([]);

	const {isFocusVisible} = useInteractionFocus();

	const [active, setActive] = useControlledState({
		defaultName: 'defaultActive',
		defaultValue: defaultActive,
		handleName: 'onActiveChange',
		name: 'active',
		onChange: onActiveChange,
		value: externalActive,
	});

	const focusHistory = useRef<Array<HTMLElement>>([]);

	const innerRef = useRef<HTMLDivElement>(null);

	const menuIds = Object.keys(menus);

	useEffect(() => {
		if (!isFocusVisible()) {
			return;
		}

		if (innerRef.current) {
			if (direction === 'prev') {
				const [previous] = focusHistory.current.slice(-1);

				focusHistory.current = focusHistory.current.slice(
					0,
					focusHistory.current.length - 1
				);

				previous?.focus();
			} else {
				const itemEl = innerRef.current.querySelector<HTMLElement>(
					'.drilldown-current a.dropdown-item, .drilldown-current button.dropdown-item'
				);

				focusHistory.current = [
					...focusHistory.current,
					document.activeElement as HTMLElement,
				];
				itemEl?.focus();
			}
		}
	}, [activeMenu, direction, innerRef, focusHistory, menus]);

	return (
		<ClayDropDown
			active={active}
			alignmentByViewport={alignmentByViewport}
			alignmentPosition={alignmentPosition}
			className={className}
			containerElement={containerElement}
			hasRightSymbols
			menuElementAttrs={{
				...menuElementAttrs,
				className: classNames(menuElementAttrs?.className, 'drilldown'),
			}}
			menuHeight={menuHeight}
			menuWidth={menuWidth}
			offsetFn={offsetFn}
			onActiveChange={(value: boolean) => {
				if (!active) {
					setActiveMenu(defaultActiveMenu);
					focusHistory.current = [];
					setHistory([]);
					setDirection('prev');
				}

				setActive(value);
			}}
			renderMenuOnClick={renderMenuOnClick}
			trigger={trigger}
			triggerIcon={triggerIcon}
		>
			<Drilldown.Inner ref={innerRef}>
				{menuIds.map((menuKey) => {
					return (
						<Drilldown.Menu
							active={activeMenu === menuKey}
							direction={direction}
							header={
								activeMenu === menuKey && !!history.length
									? history.slice(-1)[0]!.title
									: undefined
							}
							items={menus[menuKey]!}
							key={menuKey}
							messages={messages}
							onBack={() => {
								const [parent] = history.slice(-1);

								setHistory(
									history.slice(0, history.length - 1)
								);

								setDirection('prev');

								setActiveMenu(parent!.id);
							}}
							onForward={(title, childId) => {
								setHistory([
									...history,
									{id: activeMenu, title} as History,
								]);

								setDirection('next');

								setActiveMenu(childId);
							}}
							spritemap={spritemap}
						/>
					);
				})}
			</Drilldown.Inner>
		</ClayDropDown>
	);
};

ClayDropDownWithDrilldown.displayName = 'ClayDropDownWithDrilldown';

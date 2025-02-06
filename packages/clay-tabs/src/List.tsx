/**
 * SPDX-FileCopyrightText: © 2022 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {InternalDispatch, useNavigation} from '@clayui/shared';
import classNames from 'classnames';
import React, {useEffect, useImperativeHandle, useRef} from 'react';

interface IProps extends React.HTMLAttributes<HTMLUListElement> {
	/**
	 * @ignore
	 */
	activation?: 'manual' | 'automatic';

	/**
	 * @ignore
	 */
	active?: React.Key;

	/**
	 * The tabs content.
	 */
	children: React.ReactNode;

	/**
	 * The custom class.
	 */
	className?: string;

	/**
	 * @ignore
	 */
	displayType?: null | 'basic' | 'light' | 'underline';

	/**
	 * @ignore
	 */
	justified?: boolean;

	/**
	 * @ignore
	 */
	modern?: boolean;

	/**
	 * @ignore
	 */
	onActiveChange?: InternalDispatch<number>;

	/**
	 * @ignore
	 */
	shouldUseActive?: boolean;

	/**
	 * @ignore
	 */
	tabsId?: string;
}

export const List = React.forwardRef<HTMLUListElement, IProps>(function List(
	{
		activation,
		active,
		children,
		className,
		displayType = null,
		justified,
		modern: __,
		onActiveChange,
		shouldUseActive = false,
		tabsId,
		...otherProps
	},
	ref
) {
	const tabsRef = useRef<HTMLUListElement>(null);

	const {navigationProps} = useNavigation({
		activation,
		containerRef: tabsRef,
		orientation: 'horizontal',
	});

	useImperativeHandle(ref, () => tabsRef.current!, [tabsRef]);

	useEffect(() => {
		// Internal API to maintain compatibility with the old Tabs pattern and to
		// only update the initial state when the component is in
		// uncontrolled mode.
		if (!shouldUseActive) {
			return;
		}

		const childrenArray = React.Children.toArray(children);

		// The `active` API in the new pattern has uncontrolled behavior, working
		// just like defaultActive as in the prop declared in the root component.
		for (let index = 0; index < childrenArray.length; index++) {
			const child = childrenArray[index];

			if (React.isValidElement(child) && child.props.active) {
				onActiveChange!(index);
				break;
			}
		}
	}, []);

	return (
		<ul
			{...otherProps}
			{...navigationProps}
			className={classNames(
				'nav nav-tabs',
				{'nav-justified': justified},
				{[`nav-tabs-${displayType}`]: displayType === 'light'},
				className
			)}
			ref={tabsRef}
			role="tablist"
		>
			{React.Children.map(children, (child, index) => {
				if (!React.isValidElement(child)) {
					return child;
				}

				return React.cloneElement(child as React.ReactElement, {
					active:
						!shouldUseActive &&
						(child as React.ReactElement).props.active !== undefined
							? (child as React.ReactElement).props.active
							: active === index,
					innerProps: {
						'aria-controls':
							tabsId && `${tabsId}-tabpanel-${index}`,
						id: tabsId && `${tabsId}-tab-${index}`,
						...(child.props.innerProps ?? {}),
					},
					onClick: (
						event: React.MouseEvent<HTMLButtonElement, MouseEvent>
					) => {
						const {onClick} = (child as React.ReactElement).props;

						if (onClick) {
							onClick(event);
						} else {
							onActiveChange!(index);
						}
					},
				});
			})}
		</ul>
	);
});

List.displayName = 'ClayTabsList';

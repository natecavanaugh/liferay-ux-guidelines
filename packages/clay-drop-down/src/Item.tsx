/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import ClayIcon from '@clayui/icon';
import ClayLink from '@clayui/link';
import classNames from 'classnames';
import React, {useContext} from 'react';

import {DropDownContext} from './DropDownContext';

interface IProps
	extends React.HTMLAttributes<
		HTMLSpanElement | HTMLButtonElement | HTMLAnchorElement
	> {
	/**
	 * Flag that indicates if item is selected.
	 */
	active?: boolean;

	/**
	 * Flag that indicates if item is disabled or not.
	 */
	disabled?: boolean;

	/**
	 * @ignore
	 */
	'data-index'?: number;

	/**
	 * Path for item to link to.
	 */
	href?: string;

	innerRef?: React.Ref<any>;

	/**
	 * Sets the role accessibility property of the item. Set the item's
	 * container (<li />) role use the role="" prop instead of roleItem="".
	 */
	roleItem?: string;

	/**
	 * Path to icon spritemap from clay-css.
	 */
	spritemap?: string;

	/**
	 * Flag that indicates if there is an icon symbol on the left side.
	 */
	symbolLeft?: string;

	/**
	 * Flag that indicates if there is an icon symbol on the right side.
	 */
	symbolRight?: string;
}

const Item = React.forwardRef<HTMLLIElement, IProps>(
	(
		{
			active,
			children,
			className,
			'data-index': dataIndex,
			disabled,
			href,
			innerRef,
			onClick,
			role = 'presentation',
			roleItem = 'menuitem',
			spritemap,
			style,
			symbolLeft,
			symbolRight,
			tabIndex,
			...otherProps
		}: IProps,
		ref
	) => {
		const clickableElement = onClick ? 'button' : 'span';
		const ItemElement = href ? ClayLink : clickableElement;

		const {close, closeOnClick, tabFocus} = useContext(DropDownContext);

		return (
			<li
				aria-selected={active}
				data-index={dataIndex}
				ref={ref}
				role={role}
				style={style}
			>
				<ItemElement
					{...otherProps}
					className={classNames('dropdown-item', className, {
						active,
						disabled,
					})}
					disabled={disabled}
					href={href}
					onClick={(
						event: React.MouseEvent<
							HTMLButtonElement | HTMLAnchorElement,
							MouseEvent
						>
					) => {
						if (onClick) {
							onClick(event);
						}

						if (event.defaultPrevented) {
							return;
						}

						if (closeOnClick) {
							close();
						}
					}}
					ref={innerRef}
					role={roleItem}
					tabIndex={disabled || !tabFocus ? -1 : tabIndex}
				>
					{symbolLeft && (
						<span className="dropdown-item-indicator-start">
							<ClayIcon
								spritemap={spritemap}
								symbol={symbolLeft}
							/>
						</span>
					)}

					{children}

					{symbolRight && (
						<span className="dropdown-item-indicator-end">
							<ClayIcon
								spritemap={spritemap}
								symbol={symbolRight}
							/>
						</span>
					)}
				</ItemElement>
			</li>
		);
	}
);

Item.displayName = 'ClayDropDownItem';

export default Item;

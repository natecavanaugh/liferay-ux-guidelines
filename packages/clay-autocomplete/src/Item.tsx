/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import DropDown from '@clayui/drop-down';
import {useHover, useInteractionFocus} from '@clayui/shared';
import classnames from 'classnames';
import fuzzy from 'fuzzy';
import React, {useCallback} from 'react';

import {useAutocompleteState} from './Context';

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

	/**
	 * The item content.
	 */
	children?: React.ReactNode;

	innerRef?: React.Ref<HTMLAnchorElement>;

	/**
	 * Match is the string that will be compared with value.
	 */
	match?: string;

	/**
	 * Value is the string that will be compared to the characters of
	 * the match property.
	 * @deprecated since v3.74.0 - use `children` instead.
	 */
	value?: string;

	/**
	 * Internal property.
	 * @ignore
	 */
	keyValue?: React.Key;

	/**
	 * Sets a text value if the component's content is not plain text. This value
	 * is used in the combobox element to show the selected option.
	 */
	textValue?: string;
}

const optionsFuzzy = {post: '|}', pre: '}|'};

const NewItem = React.forwardRef<HTMLLIElement, IProps>(function NewItem(
	{
		children,
		className,
		disabled,
		innerRef,
		keyValue,
		match = '',
		textValue,
		value,
		...otherProps
	}: IProps,
	ref
) {
	const {activeDescendant, onActiveDescendant} = useAutocompleteState();
	const {isFocusVisible} = useInteractionFocus();

	const isFocus = isFocusVisible();

	const hoverProps = useHover({
		disabled,
		onHover: useCallback(
			() => !isFocus && onActiveDescendant(keyValue!),
			[keyValue, isFocus]
		),
	});

	const currentValue = textValue ?? value ?? String(children);
	const fuzzyMatch = fuzzy.match(match, currentValue, optionsFuzzy);

	return (
		<DropDown.Item
			{...otherProps}
			{...hoverProps}
			aria-selected={activeDescendant === keyValue}
			className={classnames(className, {
				focus: activeDescendant === keyValue && isFocus,
				hover: activeDescendant === keyValue && !isFocus,
			})}
			id={String(keyValue)}
			innerRef={innerRef}
			ref={ref}
			tabIndex={-1}
		>
			{match && fuzzyMatch && typeof children === 'string'
				? fuzzyMatch.rendered
						.split('|')
						.map((item, index) => {
							const Text = item.includes('}') ? 'span' : 'strong';
							const value = item.replace(/\}/g, '');

							return value ? (
								<Text
									className={
										!item.includes('}') ? 'mark' : undefined
									}
									key={index}
								>
									{value}
								</Text>
							) : null;
						})
						.filter(Boolean)
				: children ?? currentValue}
		</DropDown.Item>
	);
});

const ItemLegacy = React.forwardRef<HTMLLIElement, IProps>(function ItemLegacy(
	{children, innerRef, match = '', value, ...otherProps}: IProps,
	ref
) {
	const currentValue = value ?? String(children);
	const fuzzyMatch = fuzzy.match(match, currentValue, optionsFuzzy);

	return (
		<DropDown.Item {...otherProps} innerRef={innerRef} ref={ref}>
			{match && fuzzyMatch
				? fuzzyMatch.rendered
						.split('|')
						.map((item, index) => {
							const Text = item.includes('}') ? 'span' : 'strong';
							const value = item.replace(/\}/g, '');

							return value ? (
								<Text key={index}>{value}</Text>
							) : null;
						})
						.filter(Boolean)
				: currentValue}
		</DropDown.Item>
	);
});

const Item = React.forwardRef<HTMLLIElement, IProps>(
	({children, match = '', ...otherProps}: IProps, ref) => {
		const {onActiveDescendant} = useAutocompleteState();

		const Component = onActiveDescendant! ? NewItem : ItemLegacy;

		return (
			<Component match={match} {...otherProps} ref={ref}>
				{children}
			</Component>
		);
	}
);

Item.displayName = 'Item';

export default Item;

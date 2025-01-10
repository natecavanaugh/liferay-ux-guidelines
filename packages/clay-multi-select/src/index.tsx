/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import ACT, {
	Autocomplete,
	Item as AutocompleteItem,
} from '@clayui/autocomplete';
import {ClayButtonWithIcon} from '@clayui/button';
import {ClayInput} from '@clayui/form';
import {
	FocusScope,
	InternalDispatch,
	sub,
	useControlledState,
	useId,
} from '@clayui/shared';
import classNames from 'classnames';
import React, {useCallback, useEffect, useRef, useState} from 'react';

import {Labels} from './Labels';

import type {ICollectionProps} from '@clayui/core';

import type {Item, LastChangeLiveRegion, Locator} from './types';

type Size = null | 'sm';

interface IMenuRendererProps {
	/**
	 * Value of input
	 * * @deprecated since v3.49.0 - use `value` instead.
	 */
	inputValue: string;

	locator: Locator;
	onItemClick?: (item: Item) => void;
	sourceItems: Array<Item>;

	/**
	 * The value property sets the current value (controlled).
	 */
	value: string;
}

type MenuRenderer = (props: IMenuRendererProps) => JSX.Element;

interface IProps<T>
	extends Omit<
			React.HTMLAttributes<HTMLInputElement>,
			'onChange' | 'children'
		>,
		Omit<Partial<ICollectionProps<T, unknown>>, 'virtualize' | 'items'> {
	/**
	 * Flag to indicate if menu is showing or not.
	 */
	active?: boolean;

	/**
	 * Whether MultiSelect allows an input value not corresponding to an item
	 * to be added.
	 */
	allowsCustomLabel?: boolean;

	/**
	 * Flag to align the Autocomplete within the viewport.
	 * @deprecated since v3.95.2 - it is no longer necessary...
	 */
	alignmentByViewport?: boolean;

	/**
	 * Title for the `Clear All` button.
	 */
	clearAllTitle?: string;

	/**
	 * Aria label for the Close button of the labels.
	 */
	closeButtonAriaLabel?: string;

	/**
	 * The initial value of the active state (uncontrolled).
	 */
	defaultActive?: boolean;

	/**
	 * Property to set the default value (uncontrolled).
	 */
	defaultValue?: string;

	/**
	 * Set the default value of label items (uncontrolled).
	 */
	defaultItems?: Array<T>;

	/**
	 * Direction the menu will render relative to the Autocomplete.
	 */
	direction?: 'bottom' | 'top';

	/**
	 * Adds a component to replace the default component that renders
	 * the content of the `<ClayDropDown />` component.
	 * @deprecated since v3.95.2
	 */
	menuRenderer?: MenuRenderer;

	/**
	 * Flag that indicates to disable all features of the component.
	 */
	disabled?: boolean;

	/**
	 * Flag to disabled Clear All functionality.
	 */
	disabledClearAll?: boolean;

	/**
	 * Defines the description of hotkeys for the component, use this
	 * to handle internationalization.
	 * @deprecated since v3.96.1 - use `messages` instead.
	 */
	hotkeysDescription?: string;

	/**
	 * Value used for each selected item's hidden input name attribute
	 */
	inputName?: string;

	/**
	 * Value of input
	 * * @deprecated since v3.49.0 - use `value` instead.
	 */
	inputValue?: string;

	/**
	 * Flag to indicate if loading icon should be rendered
	 * @deprecated since v3.95.2 - use `loadingState` instead.
	 */
	isLoading?: boolean;

	/**
	 * Flag to indicate if input is valid or not
	 */
	isValid?: boolean;

	/**
	 * Values that display as label items (controlled).
	 */
	items?: Array<T>;

	/**
	 * The off-screen live region informs screen reader users the result of
	 * removing or adding a label.
	 * @deprecated since v3.96.1 - use `messages` instead.
	 */
	liveRegion?: {
		added: string;
		removed: string;
	};

	/**
	 * Sets the name of the field to map the value/label of the item
	 */
	locator?: Locator;

	/**
	 * Messages for autocomplete.
	 */
	messages?: {
		listCount?: string;
		listCountPlural?: string;
		loading: string;
		notFound: string;

		// Defines the description of hotkeys for the component, use this
		// to handle internationalization.
		hotkeys: string;

		// The off-screen live region informs screen reader users the result of
		// removing or adding a label.
		labelAdded: string;
		labelRemoved: string;
	};

	/**
	 * Callback for when the active state changes (controlled).
	 */
	onActiveChange?: InternalDispatch<boolean>;

	/**
	 * Callback for when the clear all button is clicked
	 */
	onClearAllButtonClick?: () => void;

	/**
	 * Callback for when the input value changes (controlled).
	 */
	onChange?: InternalDispatch<string>;

	/**
	 * Callback for when items are added or removed (controlled).
	 */
	onItemsChange?: InternalDispatch<Array<T>>;

	/**
	 * Callback is called when more items need to be loaded when the scroll
	 * reaches the bottom.
	 */
	onLoadMore?: () => Promise<any> | null;

	/**
	 * Determines the size of the Multi Select component.
	 */
	size?: Size;

	/**
	 * List of pre-populated items that will show up in a dropdown menu
	 */
	sourceItems?: Array<T> | null;

	/**
	 * Path to spritemap for clay icons
	 */
	spritemap?: string;

	/**
	 * The value property sets the current value (controlled).
	 */
	value?: string;

	/**
	 * The current state of Autocomplete current loading. Determines whether the
	 * loading indicator should be shown or not.
	 */
	loadingState?: number;
}

interface IForwardRef<T, P = {}>
	extends React.ForwardRefExoticComponent<P & React.RefAttributes<T>> {
	Item: typeof AutocompleteItem;
}

function forwardRef<T, P = {}>(component: React.RefForwardingComponent<T, P>) {
	return React.forwardRef<T, P>(component) as IForwardRef<T, P>;
}

const MultiSelect = forwardRef(function MultiSelectInner<
	T extends Record<string, any> = Item
>(
	{
		active: externalActive,
		allowsCustomLabel = true,
		alignmentByViewport,
		children,
		clearAllTitle = 'Clear All',
		closeButtonAriaLabel = 'Remove {0}',
		defaultActive = false,
		defaultItems = [],
		defaultValue = '',
		disabled,
		disabledClearAll,
		hotkeysDescription,
		inputName,
		inputValue,
		isLoading: _i,
		isValid = true,
		items: externalItems,
		liveRegion,
		locator = {
			id: 'key',
			label: 'label',
			value: 'value',
		},
		loadingState,
		menuRenderer: MenuRenderer,
		messages = {
			hotkeys: 'Press backspace to delete the current row.',
			labelAdded: 'Label {0} added to the list',
			labelRemoved: 'Label {0} removed to the list',
			listCount: '{0} option available.',
			listCountPlural: '{0} options available.',
			loading: 'Loading...',
			notFound: 'No results found',
		},
		onActiveChange,
		onChange,
		onClearAllButtonClick,
		onItemsChange,
		onLoadMore,
		placeholder,
		size,
		sourceItems = null,
		spritemap,
		value: externalValue,
		...otherProps
	}: IProps<T>,
	ref: React.Ref<HTMLInputElement>
) {
	const containerRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement | null>(null);
	const lastChangesRef = useRef<LastChangeLiveRegion | null>(null);

	const [isFocused, setIsFocused] = useState(false);

	const [items, setItems] = useControlledState({
		defaultName: 'defaultItems',
		defaultValue: defaultItems,
		handleName: 'onItemsChange',
		name: 'items',
		onChange: onItemsChange,
		value: externalItems,
	});

	const [value, setValue] = useControlledState({
		defaultName: 'defaultValue',
		defaultValue,
		handleName: 'onChange',
		name: 'value',
		onChange,
		value: externalValue ?? inputValue,
	});

	const [active, setActive] = useControlledState({
		defaultName: 'defaultActive',
		defaultValue: defaultActive,
		handleName: 'onActiveChange',
		name: 'active',
		onChange: onActiveChange,
		value: externalActive,
	});

	const inputElementRef =
		(ref as React.RefObject<HTMLInputElement>) || inputRef;

	const ariaDescriptionId = useId();

	const hasAsyncItems = !!onLoadMore || typeof loadingState === 'number';

	const Container = MenuRenderer ? FocusScope : React.Fragment;
	const containerProps = MenuRenderer ? {arrowKeysUpDown: false} : {};

	// Throws the warning only when the component is mounted and avoids
	// throwing it every time a rerender happens.
	useEffect(() => {
		if (MenuRenderer) {
			console.warn(
				`<ClayMultiSelect />: You are using 'menuRenderer' which is deprecated and missing the new features and improvements that have been implemented in the component try to migrate to the new composition based API to custom list items.`
			);
		}
	}, []);

	useEffect(() => {
		// Backward compatibility with the `menuRenderer` API.
		if (MenuRenderer && sourceItems) {
			setActive(!!value && sourceItems.length !== 0);
		}
	}, [value, sourceItems]);

	const memoizedChildren = useCallback(
		(item: T) => {
			if (children && typeof children === 'function') {
				const child = children(item) as React.ReactElement<
					any,
					string | React.JSXElementConstructor<any>
				>;

				return React.cloneElement(child, {
					onClick: (
						event: React.MouseEvent<
							| HTMLSpanElement
							| HTMLButtonElement
							| HTMLAnchorElement,
							MouseEvent
						>
					) => {
						if (child.props.onClick) {
							child.props.onClick(event);
						}

						if (event.defaultPrevented) {
							return;
						}

						event.preventDefault();

						setActive(false);
						setItems([...items, item]);
						setValue('');
					},
				});
			}

			return (
				<AutocompleteItem
					key={item[locator.value]}
					onClick={(event) => {
						event.preventDefault();

						setActive(false);
						setItems([...items, item]);
						setValue('');
					}}
				>
					{item[locator.label]}
				</AutocompleteItem>
			);
		},
		[children, locator]
	);

	return (
		<Container {...containerProps}>
			<div
				className={classNames(
					'form-control form-control-tag-group input-group',
					{
						focus: isFocused && isValid,
						[`form-control-tag-group-${size}`]: size,
					}
				)}
				ref={containerRef}
			>
				<Autocomplete<T>
					{...otherProps}
					UNSAFE_loadingShrink
					active={MenuRenderer ? false : active}
					allowsCustomLabel={allowsCustomLabel}
					ariaDescriptionId={ariaDescriptionId}
					as={Labels}
					closeButtonAriaLabel={closeButtonAriaLabel}
					containerElementRef={containerRef}
					defaultItems={!hasAsyncItems ? sourceItems : undefined}
					disabled={disabled}
					filterKey={locator.label}
					inputName={inputName}
					items={hasAsyncItems ? sourceItems : undefined}
					labels={items}
					lastChangesRef={lastChangesRef}
					loadingState={loadingState}
					locator={locator}
					menuTrigger="focus"
					messages={messages}
					onActiveChange={MenuRenderer ? () => {} : setActive}
					onChange={setValue}
					onFocus={
						MenuRenderer && sourceItems
							? (event: React.FocusEvent<HTMLInputElement>) => {
									if (otherProps.onFocus) {
										otherProps.onFocus(event);
									}

									setActive(
										!!value && sourceItems.length !== 0
									);
							  }
							: otherProps.onFocus
					}
					onFocusChange={setIsFocused}
					onItemsChange={hasAsyncItems ? () => {} : undefined}
					onLabelsChange={setItems}
					onLoadMore={onLoadMore}
					placeholder={placeholder}
					ref={inputElementRef}
					spritemap={spritemap}
					suggestionList={sourceItems ?? []}
					value={value}
				>
					{memoizedChildren}
				</Autocomplete>

				{sourceItems && MenuRenderer && sourceItems.length > 0 && (
					<ACT.DropDown
						active={active}
						alignElementRef={containerRef}
						alignmentByViewport={alignmentByViewport}
						onActiveChange={setActive}
					>
						<MenuRenderer
							inputValue={value}
							locator={locator}
							onItemClick={(item) => {
								setItems([...items, item as unknown as T]);
								setValue('');

								if (inputElementRef.current) {
									inputElementRef.current.focus();
								}
							}}
							sourceItems={sourceItems}
							value={value}
						/>
					</ACT.DropDown>
				)}

				{!disabled && !disabledClearAll && (value || items.length > 0) && (
					<ClayInput.GroupItem shrink>
						<ClayButtonWithIcon
							aria-label={clearAllTitle}
							borderless
							className="component-action"
							displayType="secondary"
							onClick={() => {
								if (onClearAllButtonClick) {
									onClearAllButtonClick();
								} else {
									setItems([]);
									setValue('');
								}

								if (inputElementRef.current) {
									inputElementRef.current.focus();
								}
							}}
							outline
							spritemap={spritemap}
							symbol="times-circle"
							title={clearAllTitle}
						/>
					</ClayInput.GroupItem>
				)}

				<div className="sr-only">
					<span id={ariaDescriptionId}>
						{hotkeysDescription ?? messages.hotkeys}
					</span>
					<span aria-live="polite" aria-relevant="text">
						{lastChangesRef.current
							? sub(
									liveRegion
										? liveRegion[
												lastChangesRef.current.action
										  ]
										: lastChangesRef.current.action ===
										  'added'
										? messages.labelAdded
										: messages.labelRemoved,
									[lastChangesRef.current.label]
							  )
							: null}
					</span>
				</div>
			</div>
		</Container>
	);
});

MultiSelect.displayName = 'ClayMultiSelect';

/**
 * Utility used for filtering an array of items based off the locator which
 * is set to `label` by default.
 * @deprecated since v3.95.2 - it is no longer necessary...
 */
export const itemLabelFilter = (
	items: Array<Item>,
	_value: string,
	_locator = 'label'
) => items;

MultiSelect.Item = AutocompleteItem;

export default MultiSelect;

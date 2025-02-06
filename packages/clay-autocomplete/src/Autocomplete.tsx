/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {
	__NOT_PUBLIC_COLLECTION,
	__NOT_PUBLIC_LIVE_ANNOUNCER,
} from '@clayui/core';
import DropDown from '@clayui/drop-down';
import {ClayInput as Input} from '@clayui/form';
import LoadingIndicator from '@clayui/loading-indicator';
import {
	InternalDispatch,
	Keys,
	Overlay,
	isAppleDevice,
	sub,
	useControlledState,
	useDebounce,
	useId,
	useIsFirstRender,
	useNavigation,
	useOverlayPosition,
} from '@clayui/shared';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {AutocompleteContext} from './Context';

import type {AnnouncerAPI, ICollectionProps} from '@clayui/core';

const {Collection, useCollection, useVirtual} = __NOT_PUBLIC_COLLECTION;
const {LiveAnnouncer} = __NOT_PUBLIC_LIVE_ANNOUNCER;

type ItemProps<T> = {
	children: React.ReactElement;
	index: number;
	item: T;
	keyValue: React.Key;
};

export interface IProps<T>
	extends Omit<
			React.HTMLAttributes<HTMLInputElement>,
			'onChange' | 'children'
		>,
		Omit<Partial<ICollectionProps<T, unknown>>, 'virtualize' | 'items'> {
	/**
	 * Internal property to change the loading indicator markup to shrink.
	 * @ignore
	 */
	UNSAFE_loadingShrink?: boolean;

	/**
	 * Flag to indicate if menu is showing or not.
	 */
	active?: boolean;

	/**
	 * Custom input component.
	 */
	as?:
		| 'input'
		| React.ForwardRefExoticComponent<any>
		| ((props: React.ComponentProps<typeof Input>) => JSX.Element);

	/**
	 * Flag to align the DropDown menu within the viewport.
	 * @deprecated since v3.92.0 - it is no longer necessary..
	 */
	alignmentByViewport?: boolean;

	/**
	 * Flag to allow an input value not corresponding to an item to be set.
	 */
	allowsCustomValue?: boolean;

	/**
	 * The initial value of the active state (uncontrolled).
	 */
	defaultActive?: boolean;

	/**
	 * The initial value of the input (uncontrolled).
	 */
	defaultValue?: string;

	/**
	 * Direction the menu will render relative to the Autocomplete.
	 */
	direction?: 'bottom' | 'top';

	/**
	 * Defines the name of the property key that is used in the items filter
	 * test (Dynamic content).
	 */
	filterKey?: string;

	/**
	 * Property to render content with dynamic data.
	 */
	items?: Array<T> | null;

	/**
	 * Property to set the initial value of `items` (uncontrolled).
	 */
	defaultItems?: Array<T> | null;

	/**
	 * Messages for autocomplete.
	 */
	messages?: {
		listCount?: string;
		listCountPlural?: string;
		loading: string;
		notFound: string;
	};

	/**
	 * Callback for when the active state changes (controlled).
	 */
	onActiveChange?: InternalDispatch<boolean>;

	/**
	 * Callback called when input value changes (controlled).
	 */
	onChange?: InternalDispatch<string>;

	/**
	 * Callback called when items change (controlled).
	 */
	onItemsChange?: InternalDispatch<Array<T> | null>;

	/**
	 * Callback is called when more items need to be loaded when the scroll
	 * reaches the bottom.
	 */
	onLoadMore?: () => Promise<any> | null;

	/**
	 * The current value of the input (controlled).
	 */
	value?: string;

	/**
	 * The interaction required to display the menu.
	 */
	menuTrigger?: 'input' | 'focus';

	/**
	 * The current state of Autocomplete current loading. Determines whether the
	 * loading indicator should be shown or not.
	 */
	loadingState?: number;

	[key: string]: any;
}

const List = React.forwardRef<
	HTMLUListElement,
	React.HTMLAttributes<HTMLUListElement>
>(function List({children, ...otherProps}, ref) {
	return (
		<ul {...otherProps} className="list-unstyled" ref={ref}>
			{children}
		</ul>
	);
});

function hasItem<T extends Record<string, any> | string | number>(
	items: Array<T>,
	value: string,
	filterKey?: string
) {
	return items.find((item) => {
		if (typeof item === 'string') {
			return item === value;
		} else if (typeof item === 'object') {
			// filter key is not defined and we cannot infer the data type.
			if (!filterKey) {
				return false;
			}

			return item[filterKey] === value;
		}
	});
}

const ESCAPE_REGEXP = /[.*+?^${}()|[\]\\]/g;

const defaultMessages = {
	listCount: '{0} option available.',
	listCountPlural: '{0} options available.',
	loading: 'Loading...',
	notFound: 'No results found',
};

function AutocompleteInner<T extends Record<string, any> | string | number>(
	{
		UNSAFE_loadingShrink,
		active: externalActive,
		alignmentByViewport: _,
		allowsCustomValue,
		as: As = Input,
		children,
		containerElementRef,
		defaultActive,
		defaultItems,
		defaultValue,
		direction = 'bottom',
		filterKey,
		items: externalItems,
		loadingState,
		menuTrigger = 'input',
		messages,
		onActiveChange,
		onChange,
		onItemsChange,
		onLoadMore,
		value: externalValue,
		...otherProps
	}: IProps<T>,
	ref: React.Ref<HTMLInputElement>
) {
	messages = {
		...defaultMessages,
		...(messages ?? {}),
	};

	const [items, , isItemsUncontrolled] = useControlledState({
		defaultName: 'defaultItems',
		defaultValue: defaultItems,
		handleName: 'onItemsChange',
		name: 'items',
		onChange: onItemsChange,
		value: externalItems,
	});

	const [value = '', setValue, isUncontrolled] = useControlledState({
		defaultName: 'defaultValue',
		defaultValue,
		handleName: 'onChange',
		name: 'value',
		onChange,
		value: externalValue,
	});

	const [active, setActive] = useControlledState({
		defaultName: 'defaultActive',
		defaultValue: defaultActive,
		handleName: 'onActiveChange',
		name: 'active',
		onChange: onActiveChange,
		value: externalActive,
	});

	const inputRef = useRef<HTMLInputElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);
	const shouldIgnoreOpenMenuOnFocus = useRef(false);

	const inputElementRef =
		(ref as React.RefObject<HTMLInputElement>) || inputRef;

	const isLoading = Boolean(loadingState !== undefined && loadingState === 1);
	const debouncedLoadingChange = useDebounce(isLoading, 500);

	const currentItemSelected = useRef<string>('');

	const ariaControlsId = useId();

	const announcerAPI = useRef<AnnouncerAPI>(null);

	const isFirst = useIsFirstRender();

	const filterFn = useCallback(
		(itemValue: string) =>
			itemValue.match(
				new RegExp(value.replace(ESCAPE_REGEXP, '\\$&'), 'i')
			) !== null,
		[value]
	);

	useEffect(() => {
		// Validates that the initial value exists in the items.
		if (
			!allowsCustomValue &&
			!currentItemSelected.current &&
			value &&
			items
		) {
			if (hasItem(items, value, filterKey)) {
				currentItemSelected.current = value;
			}
		}
	}, []);

	useEffect(() => {
		// Does not update state on first render, if the custom value is allowed
		// or if the value is empty.
		if (isFirst || allowsCustomValue || !value) {
			return;
		}

		if (active === false && currentItemSelected.current !== value) {
			// The state is controlled so we have to revalidate if the typed value
			// exists in the suggestion list.
			if (!isUncontrolled && items && hasItem(items, value, filterKey)) {
				currentItemSelected.current = value;

				return;
			}

			setValue(currentItemSelected.current);
		}
	}, [active]);

	const filteredItems = useMemo(() => {
		if (debouncedLoadingChange) {
			return [];
		}

		if (!isItemsUncontrolled) {
			return items ?? [];
		}

		if (!items) {
			return [];
		}

		return items?.filter((option) => {
			if (!filterKey && typeof option === 'object') {
				console.warn(
					`<Autocomplete />: the component is trying to filter the list but it doesn't know which key to use for comparison, defines the key in 'filterKey' ('<Autocomplete filterKey="value" />'). option=`,
					option
				);

				return true;
			}

			return filterFn(
				filterKey && typeof option === 'object'
					? option[filterKey]
					: option
			);
		});
	}, [debouncedLoadingChange, isItemsUncontrolled, items, filterFn]);

	const virtualizer = useVirtual({
		estimateSize: 37,
		items: filteredItems,
		parentRef: menuRef,
	});

	// We initialize the collection in the picker and then pass it down so the
	// collection can be cached even before the listbox is not mounted.
	const collection = useCollection<T, unknown>({
		children,
		filter: isItemsUncontrolled ? filterFn : undefined,
		filterKey: 'value',
		itemContainer: useCallback(
			({children, keyValue}: ItemProps<any>) => {
				const itemValue =
					children.props.textValue ??
					children.props.value ??
					children.props.children;

				return React.cloneElement(children, {
					keyValue,
					match: value,
					onClick: (
						event: React.MouseEvent<
							| HTMLSpanElement
							| HTMLButtonElement
							| HTMLAnchorElement
						>
					) => {
						if (children.props.onClick) {
							children.props.onClick(event);
						}

						if (event.defaultPrevented) {
							return;
						}

						setActive(false);

						currentItemSelected.current = itemValue;
						setValue(itemValue);

						shouldIgnoreOpenMenuOnFocus.current = true;
						inputElementRef.current?.focus();
					},
					roleItem: 'option',
				}) as React.ReactElement;
			},
			[value]
		),
		items: filteredItems,
		notFound: (
			<DropDown.Item
				aria-disabled="true"
				className="disabled"
				roleItem="option"
			>
				{messages.notFound}
			</DropDown.Item>
		),
		suppressTextValueWarning: false,
		virtualizer: items ? virtualizer : undefined,
	});

	const [activeDescendant, setActiveDescendant] = useState<React.Key>('');

	useOverlayPosition(
		{
			alignmentByViewport: true,
			alignmentPosition: direction === 'bottom' ? 5 : 7,
			autoBestAlign: true,
			isOpen: active,
			ref: menuRef,
			triggerRef: containerElementRef,
		},
		[active, children]
	);

	const {navigationProps} = useNavigation({
		activation: 'manual',
		active: activeDescendant,
		collection,
		containerRef: menuRef,
		loop: true,
		onNavigate: (item) => setActiveDescendant(item as React.Key),
		orientation: 'vertical',
		visible: active,
	});

	// Resets `activeDescendant` when the menu is closed, this avoids a bug when
	// the `active` state is controlled and closes the menu with different
	// statements than what is expected internally.
	useEffect(() => {
		if (!active && activeDescendant) {
			setActiveDescendant('');
		}
	}, [active]);

	const optionCount = collection.getItems().length;
	const lastSize = useRef(optionCount);

	useEffect(() => {
		// Only announces the number of options available when the menu is open
		// if there is no item with focus, with the exception of Voice Over
		// which does not include the message.
		if (
			announcerAPI.current &&
			active &&
			(!activeDescendant ||
				isAppleDevice() ||
				optionCount !== lastSize.current)
		) {
			const optionCount = collection.getItems().length;

			announcerAPI.current.announce(
				sub(
					optionCount === 1
						? messages!.listCount!
						: messages!.listCountPlural!,
					[optionCount]
				)
			);
		}

		lastSize.current = optionCount;
	}, [active, value]);

	const onClose = useCallback(() => setActive(false), []);

	const onPress = useCallback(() => {
		if (menuRef.current && activeDescendant) {
			const item = document.getElementById(String(activeDescendant));

			if (item) {
				item.click();
			}
		}
	}, [activeDescendant]);

	const LoadingGroupItem = UNSAFE_loadingShrink
		? Input.GroupItem
		: Input.GroupInsetItem;

	return (
		<>
			<LiveAnnouncer ref={announcerAPI} />

			<As
				{...otherProps}
				aria-activedescendant={
					active ? String(activeDescendant) : undefined
				}
				aria-autocomplete="list"
				aria-controls={ariaControlsId}
				aria-expanded={active}
				autoComplete="off"
				autoCorrect="off"
				insetAfter={isLoading}
				onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
					const {value} = event.target;

					if (!value) {
						currentItemSelected.current = value;
					}

					if (items !== null) {
						setActive(true);
					}

					setValue(value);

					if (activeDescendant) {
						setActiveDescendant('');
					}
				}}
				onFocus={(event) => {
					if (otherProps.onFocus) {
						otherProps.onFocus(event);
					}

					if (menuTrigger === 'focus' && items !== null) {
						if (shouldIgnoreOpenMenuOnFocus.current) {
							shouldIgnoreOpenMenuOnFocus.current = false;

							return;
						}

						setActive(true);
					}
				}}
				onKeyDown={(event) => {
					if (otherProps.onKeyDown) {
						otherProps.onKeyDown(event);
					}

					switch (event.key) {
						case Keys.Tab:
						case Keys.Esc: {
							setActive(false);
							break;
						}
						case Keys.Enter: {
							setActive(false);

							if (active && activeDescendant) {
								onPress();
							}

							if (!active && event.key === Keys.Esc) {
								setValue('');
							}
							break;
						}
						case Keys.Home:
						case Keys.End: {
							setActiveDescendant('');
							break;
						}
						case Keys.Left:
						case Keys.Right: {
							if (activeDescendant) {
								setActiveDescendant('');
							}
							break;
						}
						case Keys.Up:
						case Keys.Down: {
							event.preventDefault();

							if (
								!active &&
								event.altKey &&
								event.key === Keys.Down &&
								items !== null
							) {
								event.stopPropagation();
								setActive(true);

								return;
							}

							if (!activeDescendant) {
								const item =
									event.key === Keys.Down
										? collection.getFirstItem()
										: collection.getLastItem();

								setActiveDescendant(item.key);
							}

							if (!active && items !== null) {
								return setActive(true);
							}

							navigationProps.onKeyDown(event);
							break;
						}
						default:
							navigationProps.onKeyDown(event);
							break;
					}
				}}
				ref={inputElementRef}
				role="combobox"
				spellCheck={false}
				value={value}
			/>

			{active && (
				<Overlay
					isCloseOnInteractOutside
					isKeyboardDismiss
					isOpen
					menuRef={menuRef}
					onClose={onClose}
					portalRef={menuRef}
					suppress={[menuRef, inputElementRef]}
					triggerRef={inputElementRef}
				>
					<div
						className="dropdown-menu dropdown-menu-select show"
						ref={menuRef}
						role="presentation"
						style={{
							maxWidth: 'none',
							width: `${containerElementRef.current?.clientWidth}px`,
						}}
					>
						<AutocompleteContext.Provider
							value={{
								activeDescendant,
								onActiveDescendant: setActiveDescendant,
								onClick: setValue,
							}}
						>
							<Collection<T>
								aria-label={otherProps['aria-label']}
								aria-labelledby={otherProps['aria-labelledby']}
								as={List}
								collection={collection}
								id={ariaControlsId}
								isLoading={isLoading}
								onLoadMore={onLoadMore}
								role="listbox"
							>
								{debouncedLoadingChange ? (
									<DropDown.Item
										aria-disabled="true"
										className="disabled"
										roleItem="option"
									>
										{messages.loading}
									</DropDown.Item>
								) : (
									children
								)}
							</Collection>
						</AutocompleteContext.Provider>
					</div>
				</Overlay>
			)}

			{isLoading && (
				<LoadingGroupItem
					after={!UNSAFE_loadingShrink ? true : undefined}
					aria-label={messages.loading}
					aria-valuemax={100}
					aria-valuemin={0}
					role="progressbar"
					shrink={UNSAFE_loadingShrink}
				>
					<span className="inline-item inline-item-middle">
						<LoadingIndicator size="sm" />
					</span>
				</LoadingGroupItem>
			)}
		</>
	);
}

type ForwardRef = {
	displayName: string;
	<T>(props: IProps<T> & {ref?: React.Ref<HTMLInputElement>}): JSX.Element;
};

export const Autocomplete = React.forwardRef(AutocompleteInner) as ForwardRef;

Autocomplete.displayName = 'Autocomplete';

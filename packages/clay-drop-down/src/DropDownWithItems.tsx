/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {ClayCheckbox, ClayRadio} from '@clayui/form';
import {
	FOCUSABLE_ELEMENTS,
	InternalDispatch,
	Keys,
	MouseSafeArea,
	throttle,
	useControlledState,
	useNavigation,
} from '@clayui/shared';
import classNames from 'classnames';
import React, {useCallback, useContext, useRef, useState} from 'react';
import warning from 'warning';

import Caption from './Caption';
import Divider from './Divider';
import ClayDropDown from './DropDown';
import {DropDownContext} from './DropDownContext';
import {FocusMenu} from './FocusMenu';
import ClayDropDownGroup from './Group';
import Help from './Help';
import ClayDropDownMenu from './Menu';
import Search from './Search';

type TType =
	| 'checkbox'
	| 'contextual'
	| 'group'
	| 'item'
	| 'radio'
	| 'radiogroup'
	| 'divider';

interface IItem {
	active?: boolean;
	checked?: boolean;
	disabled?: boolean;
	href?: string;
	items?: Array<IItem>;
	label?: string;
	name?: string;
	onChange?: Function;
	onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
	symbolLeft?: string;
	symbolRight?: string;
	type?: TType;
	value?: string;
}

interface IDropDownContentProps {
	'aria-label'?: string;

	/**
	 * The path to the SVG spritemap file containing the icons.
	 */
	spritemap?: string;

	/**
	 * List of items to display in drop down menu
	 */
	items: Array<IItem>;

	role?: string;
}

interface IProps extends Omit<IDropDownContentProps, 'role' | 'aria-label'> {
	/**
	 * Flag to indicate if the DropDown menu is active or not (controlled).
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
	 * Informational text that appears at the end or above the `footerContent` prop.
	 */
	caption?: string;

	className?: string;

	closeOnClickOutside?: React.ComponentProps<
		typeof ClayDropDown
	>['closeOnClickOutside'];

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
	 * Add an action button or any other element you want to be fixed position to the
	 * footer from the DropDown.
	 */
	footerContent?: React.ReactElement;

	/**
	 * Element that is used as the trigger which will activate the dropdown on click.
	 */
	trigger: React.ReactElement & {
		ref?: (node: HTMLButtonElement | null) => void;
	};

	/**
	 * Add informational text at the top of DropDown.
	 */
	helpText?: string;

	/**
	 * Prop to pass DOM element attributes to DropDown.Menu.
	 */
	menuElementAttrs?: React.ComponentProps<
		typeof ClayDropDown
	>['menuElementAttrs'];

	menuHeight?: React.ComponentProps<typeof ClayDropDown>['menuHeight'];

	menuWidth?: React.ComponentProps<typeof ClayDropDown>['menuWidth'];

	/**
	 * Prop to use language keys.
	 */
	messages?: string;

	/**
	 * Function for setting the offset of the menu from the trigger.
	 */
	offsetFn?: React.ComponentProps<typeof ClayDropDown>['offsetFn'];

	/**
	 * Callback for when the active state changes (controlled).
	 */
	onActiveChange?: InternalDispatch<boolean>;

	/**
	 * Callback will always be called when the user is interacting with search.
	 */
	onSearchValueChange?: (newValue: string) => void;

	/**
	 * Flag indicating if the menu should be rendered lazily
	 */
	renderMenuOnClick?: React.ComponentProps<
		typeof ClayDropDown
	>['renderMenuOnClick'];

	/**
	 * Flag to show search at the top of the DropDown.
	 */
	searchable?: boolean;

	/**
	 * Pass the props to the Search component.
	 */
	searchProps?: Omit<
		React.ComponentProps<typeof Search>,
		'onChange' | 'spritemap' | 'value'
	>;

	/**
	 * The value that will be passed to the search input element.
	 */
	searchValue?: string;

	/**
	 * Flag indicating if the caret icon should be displayed on the right side.
	 */
	triggerIcon?: string | null;
}

const findNested = <
	T extends {items?: Array<T>; [key: string]: any},
	K extends keyof T
>(
	items: Array<T>,
	key: K
): T | undefined =>
	items.find((item) => {
		if (item[key]) {
			return true;
		}

		// Ignore the search if the nested items are part of a contextual submenu
		// because it will be in another menu and the current menu does not need
		// to know the information of what exists inside the contextual one, like
		// knowing if there is an icon.
		if (item.items && item['type'] !== 'contextual') {
			return findNested(item.items, key);
		}

		return false;
	});

interface IInternalItem {
	spritemap?: string;
}

const Checkbox = ({
	checked = false,
	onChange = () => {},
	...otherProps
}: IItem & IInternalItem) => {
	const [value, setValue] = useState<boolean>(checked);

	const {tabFocus} = useContext(DropDownContext);

	return (
		<ClayDropDown.Section role="none">
			<ClayCheckbox
				{...otherProps}
				checked={value}
				onChange={() => {
					setValue((val) => !val);
					onChange(!value);
				}}
				tabIndex={!tabFocus ? -1 : undefined}
			/>
		</ClayDropDown.Section>
	);
};

type Context = {
	back?: () => void;
	close: () => void;
};

const ClayDropDownContext = React.createContext({
	close: () => {},
} as Context);

const Item = ({
	label,
	onClick,
	...props
}: Omit<IItem, 'onChange'> & IInternalItem) => {
	const {back, close} = useContext(ClayDropDownContext);

	return (
		<ClayDropDown.Item
			onClick={(event) => {
				if (onClick) {
					onClick(event);
				}

				close();
			}}
			onKeyDown={(event) => {
				if (back && event.key === Keys.Left) {
					back();
				}
			}}
			{...props}
		>
			{label}
		</ClayDropDown.Item>
	);
};

const Group = ({items, label, spritemap}: IItem & IInternalItem) => {
	warning(
		typeof items !== 'undefined',
		`ClayDropDownWithItems -> The '${label}' group contains no items to render.`
	);

	if (typeof items === 'undefined') {
		return null;
	}

	return (
		<ClayDropDownGroup header={label}>
			{items && <Items items={items} spritemap={spritemap} />}
		</ClayDropDownGroup>
	);
};

const BOTTOM_OFFSET = [0, 1] as const;
const LEFT_OFFSET = [-1, 6] as const;
const RIGHT_OFFSET = [1, -6] as const;
const TOP_OFFSET = [0, -1] as const;

const OFFSET_MAP = {
	bctc: TOP_OFFSET,
	blbr: RIGHT_OFFSET,
	bltl: TOP_OFFSET,
	brbl: LEFT_OFFSET,
	brtr: TOP_OFFSET,
	clcr: RIGHT_OFFSET,
	crcl: LEFT_OFFSET,
	tcbc: BOTTOM_OFFSET,
	tlbl: BOTTOM_OFFSET,
	tltr: RIGHT_OFFSET,
	trbr: BOTTOM_OFFSET,
	trtl: LEFT_OFFSET,
};

function offsetFn(points: any) {
	return OFFSET_MAP[points.join('') as keyof typeof OFFSET_MAP] as [
		number,
		number
	];
}

const Contextual = ({
	items,
	label,
	spritemap,
	...otherProps
}: Omit<IItem, 'onChange'> & IInternalItem) => {
	const [visible, setVisible] = useState(false);
	const {close} = useContext(ClayDropDownContext);

	const triggerElementRef = useRef<HTMLLIElement | null>(null);
	const menuElementRef = useRef<HTMLDivElement>(null);
	const timeoutHandleRef = useRef<any>(null);

	const keyboardRef = useRef(false);

	const hasRightSymbols = React.useMemo(
		() => items && !!findNested(items, 'symbolRight'),
		[items]
	);
	const hasLeftSymbols = React.useMemo(
		() => items && !!findNested(items, 'symbolLeft'),
		[items]
	);

	const {navigationProps} = useNavigation({
		activation: 'manual',
		containerRef: menuElementRef,
		loop: true,
		orientation: 'vertical',
		typeahead: true,
		visible,
	});

	const setThrottleVisible = useCallback(
		throttle((value: boolean) => setVisible(value), 100),
		[]
	);

	return (
		<ClayDropDown.Item
			{...otherProps}
			aria-expanded={visible}
			aria-haspopup={Boolean(items)}
			className={classNames({
				active: visible,
			})}
			onClick={(event) => {
				keyboardRef.current = false;
				if (event.currentTarget === event.target) {
					setVisible(true);

					clearTimeout(timeoutHandleRef.current);
					timeoutHandleRef.current = null;
				}
			}}
			onKeyDown={(event) => {
				switch (event.key) {
					case Keys.Enter:
					case Keys.Right:
						setVisible(true);
						keyboardRef.current = true;
						break;
					default:
						break;
				}
			}}
			onMouseEnter={() => {
				if (!visible) {
					keyboardRef.current = false;
					timeoutHandleRef.current = setTimeout(
						() => setThrottleVisible(true),
						400
					);
				}
			}}
			onMouseLeave={() => {
				keyboardRef.current = false;
				setThrottleVisible(false);

				clearTimeout(timeoutHandleRef.current);
				timeoutHandleRef.current = null;
			}}
			ref={triggerElementRef}
			spritemap={spritemap}
			symbolRight="angle-right"
		>
			{label}

			{items && (
				<ClayDropDown.Menu
					active={visible}
					alignElementRef={triggerElementRef}
					alignmentPosition={8}
					hasLeftSymbols={hasLeftSymbols}
					hasRightSymbols={hasRightSymbols}
					offsetFn={offsetFn}
					onActiveChange={setVisible}
					onKeyDown={navigationProps.onKeyDown}
					ref={menuElementRef}
				>
					{visible && <MouseSafeArea parentRef={menuElementRef} />}
					<ClayDropDownContext.Provider
						value={{
							back: () => {
								(
									triggerElementRef.current
										?.children[0] as HTMLElement
								).focus();
								setVisible(false);
							},
							close: () => {
								setVisible(false);
								close();
							},
						}}
					>
						<FocusMenu
							condition={visible}
							onRender={() => {
								if (
									menuElementRef.current &&
									keyboardRef.current
								) {
									const first =
										menuElementRef.current.querySelector<HTMLElement>(
											FOCUSABLE_ELEMENTS.join(',')
										);

									if (first) {
										first.focus();
									}
								}
							}}
						>
							<DropDownContent
								items={items}
								spritemap={spritemap}
							/>
						</FocusMenu>
					</ClayDropDownContext.Provider>
				</ClayDropDown.Menu>
			)}
		</ClayDropDown.Item>
	);
};

interface IRadioContext {
	checked: string;
	name?: string;
	onChange: (value: string) => void;
}

const RadioGroupContext = React.createContext({} as IRadioContext);

const Radio = ({value = '', ...otherProps}: IItem & IInternalItem) => {
	const {checked, name, onChange} = useContext(RadioGroupContext);

	const {tabFocus} = useContext(DropDownContext);

	return (
		<ClayDropDown.Section role="none">
			<ClayRadio
				{...otherProps}
				checked={checked === value}
				inline
				name={name}
				onChange={() => onChange(value as string)}
				tabIndex={!tabFocus ? -1 : undefined}
				value={value as string}
			/>
		</ClayDropDown.Section>
	);
};

const RadioGroup = ({
	items,
	label,
	name,
	onChange = () => {},
	spritemap,
	value: defaultValue = '',
}: IItem & IInternalItem) => {
	const [value, setValue] = useState(defaultValue);

	const params = {
		checked: value,
		name,
		onChange: (value: string) => {
			onChange(value);
			setValue(value);
		},
	};

	warning(
		items && items.filter((item) => item.type !== 'radio').length === 0,
		'ClayDropDownWithItems -> Items of type `radiogroup` should be used `radio` if you need to use others, it is recommended to use type `group`.'
	);

	return (
		<ClayDropDownGroup header={label} role="radiogroup">
			{items && (
				<RadioGroupContext.Provider value={params}>
					<Items items={items} spritemap={spritemap} />
				</RadioGroupContext.Provider>
			)}
		</ClayDropDownGroup>
	);
};

const DividerWithItem = () => <Divider />;

const TYPE_MAP = {
	checkbox: Checkbox,
	contextual: Contextual,
	divider: DividerWithItem,
	group: Group,
	item: Item,
	radio: Radio,
	radiogroup: RadioGroup,
};

const Items = ({items, spritemap}: IDropDownContentProps) => {
	return (
		<>
			{items.map(({type, ...item}, key) => {
				const Item = TYPE_MAP[type || 'item'];

				return <Item {...item} key={key} spritemap={spritemap} />;
			})}
		</>
	);
};

const DropDownContent = ({
	items,
	role,
	spritemap,
	...otherProps
}: IDropDownContentProps) => (
	<ClayDropDown.ItemList aria-label={otherProps['aria-label']} role={role}>
		<Items items={items} spritemap={spritemap} />
	</ClayDropDown.ItemList>
);

export const ClayDropDownWithItems = ({
	active,
	alignmentByViewport,
	alignmentPosition,
	caption,
	className,
	closeOnClickOutside,
	containerElement,
	defaultActive = false,
	footerContent,
	helpText,
	items,
	menuElementAttrs,
	menuHeight,
	menuWidth,
	offsetFn,
	onActiveChange,
	onSearchValueChange = () => {},
	renderMenuOnClick,
	searchable,
	searchProps,
	searchValue = '',
	triggerIcon = null,
	spritemap,
	trigger,
}: IProps) => {
	const triggerElementRef = useRef<HTMLButtonElement | null>(null);

	const [internalActive, setInternalActive] = useControlledState({
		defaultName: 'defaultActive',
		defaultValue: defaultActive,
		handleName: 'onActiveChange',
		name: 'active',
		onChange: onActiveChange,
		value: active,
	});

	const hasRightSymbols = React.useMemo(
		() => !!findNested(items, 'symbolRight'),
		[items]
	);
	const hasLeftSymbols = React.useMemo(
		() => !!findNested(items, 'symbolLeft'),
		[items]
	);

	const Wrap = footerContent ? 'form' : React.Fragment;

	return (
		<ClayDropDown
			active={internalActive}
			alignmentByViewport={alignmentByViewport}
			alignmentPosition={alignmentPosition}
			className={className}
			closeOnClickOutside={closeOnClickOutside}
			containerElement={containerElement}
			hasLeftSymbols={hasLeftSymbols}
			hasRightSymbols={hasRightSymbols}
			menuElementAttrs={menuElementAttrs}
			menuHeight={menuHeight}
			menuWidth={menuWidth}
			offsetFn={offsetFn}
			onActiveChange={setInternalActive}
			renderMenuOnClick={renderMenuOnClick}
			trigger={React.cloneElement(trigger, {
				ref: (node: HTMLButtonElement) => {
					if (node) {
						triggerElementRef.current = node;
						// Call the original ref, if any.
						const {ref} = trigger;
						if (typeof ref === 'function') {
							ref(node);
						}
					}
				},
			})}
			triggerIcon={triggerIcon}
		>
			<ClayDropDownContext.Provider
				value={{
					close: () => {
						setInternalActive(false);
						triggerElementRef.current?.focus();
					},
				}}
			>
				{helpText && <Help>{helpText}</Help>}

				{searchable && (
					<Search
						{...searchProps}
						onChange={onSearchValueChange}
						spritemap={spritemap}
						value={searchValue}
					/>
				)}

				<Wrap>
					{footerContent ? (
						<div className="inline-scroller">
							<DropDownContent
								items={items}
								spritemap={spritemap}
							/>
						</div>
					) : (
						<DropDownContent items={items} spritemap={spritemap} />
					)}

					{caption && <Caption>{caption}</Caption>}

					{footerContent && (
						<div className="dropdown-section" role="presentation">
							{footerContent}
						</div>
					)}
				</Wrap>
			</ClayDropDownContext.Provider>
		</ClayDropDown>
	);
};

ClayDropDownWithItems.displayName = 'ClayDropDownWithItems';

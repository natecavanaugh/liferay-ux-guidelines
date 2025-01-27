/**
 * SPDX-FileCopyrightText: © 2025 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import Button from '@clayui/button';
const spritemap = require('@clayui/css/lib/images/icons/icons.svg');
import {ClayInput} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import {
	InternalDispatch,
	Overlay,
	useControlledState,
	useId,
	useOverlayPosition,
} from '@clayui/shared';
import React, {useCallback, useEffect, useRef, useState} from 'react';

export type IProps<T> = {
	/**
	 * Flag to indicate if menu is showing or not.
	 */
	active?: boolean;

	/**
	 * Custom button component.
	 */
	as?:
		| 'button'
		| React.ForwardRefExoticComponent<any>
		| ((props: React.ComponentProps<typeof Button>) => JSX.Element);

	/**
	 * Value to display the trigger with an icon or text.
	 */
	buttonWithIcon?: boolean;

	/**
	 * The initial value of the active state (uncontrolled).
	 */
	defaultActive?: boolean;

	/**
	 * Property to set the initial value of `items` (uncontrolled).
	 */

	defaultItems?: Array<T> | null;

	/**
	 * The initial value of the input (uncontrolled).
	 */
	defaultValue?: string;

	/**
	 * Direction the menu will render relative to the Icon Selector.
	 */
	direction?: 'bottom' | 'top';

	/**
	 * Property to render content with dynamic data.
	 */
	items?: Array<T> | null;

	/**
	 * Funtion to select an icon
	 */
	handleIconSelect: (icon: string) => void;

	/**
	 * Callback for when the active state changes (controlled).
	 */
	onActiveChange?: InternalDispatch<boolean>;

	[key: string]: any;
};

export default function IconSelector<
	T extends Record<string, any> | string | number
>({
	active: externalActive,
	as: As = Button,
	buttonWithIcon = false,
	children,
	containerElementRef,
	defaultActive,
	direction = 'bottom',
	handleIconSelect,
	onActiveChange,
}: IProps<T>) {
	const menuRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLButtonElement | null>(null);

	const ariaControls = useId();

	const [iconNames, setIconNames] = useState<Array<string>>([]);
	const [searchTerm, setSearchTerm] = useState<string>('');

	const [active, setActive] = useControlledState({
		defaultName: 'defaultActive',
		defaultValue: defaultActive,
		handleName: 'onActiveChange',
		name: 'active',
		onChange: onActiveChange,
		value: externalActive,
	});

	const filteredIcons = iconNames.filter((icon) =>
		icon.toLowerCase().includes(searchTerm.toLowerCase())
	);
	const onClose = useCallback(() => setActive(false), []);

	useOverlayPosition(
		{
			alignmentByViewport: true,
			alignmentPosition: direction === 'bottom' ? 5 : 7,
			autoBestAlign: true,
			isOpen: active,
			ref: menuRef,
			triggerRef: containerElementRef ?? triggerRef,
		},
		[active, children]
	);

	const fetchIcons = () => {
		const iconNames: Array<string> = [];

		fetch(spritemap)
			.then((res) => res.text())
			.then((res) => {
				const parser = new DOMParser();
				const doc = parser.parseFromString(res, 'image/svg+xml');

				const symbols = doc.querySelectorAll('symbol');

				symbols.forEach((symbol) =>
					iconNames.push(symbol.getAttribute('id') || '')
				);

				setIconNames(iconNames);
			});
	};

	useEffect(() => {
		fetchIcons();
	}, []);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				menuRef.current &&
				!menuRef.current.contains(event.target as Node)
			) {
				onClose();
			}
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [onClose]);

	return (
		<>
			<As
				aria-controls={active ? ariaControls : undefined}
				aria-expanded={active}
				aria-label="select an icon"
				displayType="secondary"
				onClick={() => setActive(true)}
				ref={triggerRef}
				role="combobox"
			>
				{buttonWithIcon ? (
					<ClayIcon symbol="change" />
				) : (
					'Select an Icon'
				)}
			</As>

			{active && (
				<Overlay
					isOpen
					menuRef={menuRef}
					onClose={onClose}
					portalRef={menuRef}
					suppress={[triggerRef, menuRef]}
					triggerRef={triggerRef}
				>
					<div
						className="dropdown-menu dropdown-menu-select p-2 show"
						id={ariaControls}
						ref={menuRef}
						role="presentation"
						style={{
							maxWidth: 'none',
							width: `${containerElementRef?.current?.clientWidth}px`,
						}}
					>
						<ClayInput.Group>
							<ClayInput.GroupItem>
								<ClayInput
									id="basicInputText"
									insetBefore
									onChange={(event) =>
										setSearchTerm(event.target.value)
									}
									placeholder="Search"
									type="text"
									value={searchTerm}
								/>
								<ClayInput.GroupInsetItem
									before
									className="pl-3"
									tag="span"
								>
									<ClayIcon symbol="search" />
								</ClayInput.GroupInsetItem>
							</ClayInput.GroupItem>
						</ClayInput.Group>

						<div
							style={{
								display: 'grid',
								gap: 4,
								gridTemplateColumns: `repeat(${9}, 1fr)`,
							}}
						>
							{filteredIcons.map((item) => (
								<div className="p-2" key={item}>
									<Button
										aria-label={`${item} icon`}
										borderless
										displayType="secondary"
										onClick={() => {
											handleIconSelect(item);
											onClose();
										}}
										title={item}
									>
										<ClayIcon symbol={item} />
									</Button>
								</div>
							))}

							{filteredIcons.length === 0 && (
								<p className="col-span-6 text-center text-gray-500">
									No icons found
								</p>
							)}
						</div>
					</div>
				</Overlay>
			)}
		</>
	);
}

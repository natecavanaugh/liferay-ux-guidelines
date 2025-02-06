/**
 * SPDX-FileCopyrightText: © 2020 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import ClayButton, {ClayButtonWithIcon} from '@clayui/button';
import {Keys} from '@clayui/shared';
import classNames from 'classnames';
import React from 'react';

export type TItem = {
	label: string;
	value: string;
};

function arrayMove(
	arrayToMove: Array<TItem>,
	oldIndex: number,
	newIndex: number
) {
	arrayToMove.splice(newIndex, 0, arrayToMove.splice(oldIndex, 1)[0]!);

	return arrayToMove;
}

function reorderUp(array: Array<TItem>, selectedIndexes: Array<number>) {
	let clonedArray = [...array];

	for (let i = 0; i < selectedIndexes.length; i++) {
		const item = selectedIndexes[i]!;

		if (item === 0) {
			return clonedArray;
		}

		clonedArray = arrayMove(clonedArray, item, item - 1);
	}

	return clonedArray;
}

function reorderDown(array: Array<TItem>, selectedIndexes: Array<number>) {
	let clonedArray = [...array];

	for (let i = 0; i < selectedIndexes.length; i++) {
		const item = selectedIndexes[i]!;

		if (selectedIndexes.includes(clonedArray.length - 1)) {
			return clonedArray;
		}

		clonedArray = arrayMove(clonedArray, item, item + 1);
	}

	return clonedArray;
}

interface IProps extends React.HTMLAttributes<HTMLSelectElement> {
	/**
	 * Labels for aria attributes
	 */
	ariaLabels?: {
		reorderUp: string;
		reorderDown: string;
	};

	/**
	 * Aligns the buttons used to reorder items relative to the Select Box.
	 */
	buttonAlignment?: 'center' | 'end';

	/**
	 * Disables the component.
	 */
	disabled?: boolean;

	/**
	 * Items to be displayed in the Select Box.
	 */
	items: Array<TItem>;

	/**
	 * Label to be displayed above the Select Box.
	 */
	label?: string;

	/**
	 * Defines whether the Select Box supports selection of multiple items.
	 */
	multiple?: boolean;
	/**
	 * Handler that triggers when the content of the items prop are changed caused by reordering of items.
	 */
	onItemsChange?: (items: Array<TItem>) => void;

	/**
	 * Handler that triggers when a new item is selected.
	 */
	onSelectChange: (value: Array<string>) => void;

	/**
	 *  Selected indexes, most commonly used in combination with the  Dual Listbox component
	 */
	selectedIndexes?: Array<number>;

	/**
	 * Amount of items that can fit inside the both Select Boxes before a scrollbar is introduced.
	 */
	size?: number;
	/**
	 * Defines whether the component should render buttons that allow reordering of items.
	 */
	showArrows?: boolean;

	/**
	 * Value of the component.
	 */
	value: string | Array<string>;

	/**
	 * Path to the spritemap that Icon should use when referencing symbols.
	 */
	spritemap?: string;
}

export const getSelectedIndexes = (
	items: Array<TItem>,
	selectedValues: Array<number | string>
) =>
	items.reduce((acc: Array<number>, item: TItem, index) => {
		if (selectedValues.includes(item.value)) {
			return [...acc, index];
		}

		return acc;
	}, []);

const SelectBox = ({
	ariaLabels = {
		reorderDown: 'Reorder Down',
		reorderUp: 'Reorder Up',
	},
	buttonAlignment = 'end',
	className,
	disabled,
	id,
	items,
	label,
	multiple,
	onItemsChange,
	onSelectChange,
	showArrows,
	size,
	spritemap,
	value,
	...otherProps
}: IProps) => {
	const selectedIndexes = getSelectedIndexes(
		items,
		Array.isArray(value) ? value : [value]
	);

	const noItems = !items.length;

	const noItemsSelected = !selectedIndexes.length;

	const firstItemSelected = selectedIndexes.includes(0);

	const lastItemSelected = selectedIndexes.includes(items.length - 1);

	return (
		<div className={classNames(className, 'form-group')}>
			{label && (
				<label
					className={classNames('reorder-label', {
						disabled,
					})}
					htmlFor={id}
				>
					{label}
				</label>
			)}

			<div
				className={classNames('clay-reorder', {
					[`clay-reorder-footer-${buttonAlignment}`]: buttonAlignment,
				})}
			>
				<select
					{...otherProps}
					className="form-control form-control-inset"
					disabled={disabled}
					id={id}
					multiple={multiple}
					onChange={(event) => {
						const selectedItems = [...event.target.options]
							.filter(({selected}) => selected)
							.map((item) => item.value);

						onSelectChange(selectedItems);
					}}
					onKeyDown={(event) =>
						selectedIndexes.forEach((index) => {
							if (
								(event.key === Keys.Down &&
									index === items.length - 1) ||
								(event.key === Keys.Up && index === 0)
							) {
								event.preventDefault();
							}
						})
					}
					size={size}
					value={value}
				>
					{items.map((option) => (
						<option
							className="reorder-option"
							key={option.value}
							value={option.value}
						>
							{option.label}
						</option>
					))}
				</select>

				<div className="clay-reorder-underlay form-control" />

				{showArrows && onItemsChange && (
					<div className="clay-reorder-footer">
						<ClayButton.Group className="reorder-order-buttons">
							<ClayButtonWithIcon
								aria-label={ariaLabels.reorderUp}
								className="reorder-button reorder-button-up"
								disabled={
									firstItemSelected ||
									noItemsSelected ||
									noItems
								}
								displayType="secondary"
								onClick={() =>
									onItemsChange(
										reorderUp(items, selectedIndexes)
									)
								}
								small
								spritemap={spritemap}
								symbol="caret-top"
							/>

							<ClayButtonWithIcon
								aria-label={ariaLabels.reorderDown}
								className="reorder-button reorder-button-down"
								disabled={
									lastItemSelected ||
									noItemsSelected ||
									noItems
								}
								displayType="secondary"
								onClick={() =>
									onItemsChange(
										reorderDown(items, selectedIndexes)
									)
								}
								small
								spritemap={spritemap}
								symbol="caret-bottom"
							/>
						</ClayButton.Group>
					</div>
				)}
			</div>
		</div>
	);
};

export default SelectBox;

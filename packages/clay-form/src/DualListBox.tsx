/**
 * SPDX-FileCopyrightText: © 2020 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {ClayButtonWithIcon} from '@clayui/button';
import {sub} from '@clayui/shared';
import classNames from 'classnames';
import React from 'react';

import Form from './Form';
import ClaySelectBox, {TItem, getSelectedIndexes} from './SelectBox';

function swapArrayItems(
	arrays: Array<Array<TItem>>,
	selectedIndexes: Array<number>
) {
	const [sourceArray, targetArray] = arrays;

	const newTargetArray = [...targetArray!];

	const newSourceArray = sourceArray!.filter((item, index) => {
		if (selectedIndexes.includes(index)) {
			newTargetArray.push(item);

			return false;
		}

		return true;
	});

	return [newSourceArray, newTargetArray];
}

type BoxProps = {
	/**
	 * Id of the selectbox to be used with the label
	 */
	id?: string;

	/**
	 * Label of the left Select Box.
	 */
	label?: string;

	/**
	 * Handler that triggers when a new item is selected in the left Select Box.
	 */
	onSelectChange?: (val: Array<string>) => void;

	/**
	 * Array of selected items in the left Select Box.
	 */
	selected?: Array<string>;
};

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
	/**
	 * Labels for the aria attributes
	 */
	ariaLabels?: {
		error?: string;
		transferLTR: string;
		transferRTL: string;
	};

	/**
	 * Disables the component.
	 */
	disabled?: boolean;

	/**
	 * Disables the button responsible for moving items from right to left box.
	 */
	disableRTL?: boolean;

	/**
	 * Disables the button responsible for moving items from left to right box.
	 */
	disableLTR?: boolean;

	/**
	 * Items spread across two arrays that will be displayed in the two Select Boxes.
	 */
	items: Array<Array<TItem>>;

	/**
	 * Handler that triggers when the content of the items prop are changed. Caused by either reordering or transfering of items.
	 */
	onItemsChange: (value: Array<Array<TItem>>) => void;

	/**
	 * Props for the left Select Box.
	 */
	left?: BoxProps;

	/**
	 * Props for the right Select Box.
	 */
	right?: BoxProps;

	/**
	 * Amount of items that can fit inside the both Select Boxes before a scrollbar is introduced.
	 */
	size?: number;

	/**
	 * Path to the spritemap that Icon should use when referencing symbols.
	 */
	spritemap?: string;

	/**
	 * Sets the maximum value of items on the left side.
	 */
	leftMaxItems?: number;

	/**
	 * Sets the maximum value of items on the right side.
	 */
	rightMaxItems?: number;
}

const defaultError = 'The maximum number of items for {0} is {1}';

const DualListBox = ({
	ariaLabels = {
		error: defaultError,
		transferLTR: 'Transfer Item Left to Right',
		transferRTL: 'Transfer Item Right to Left',
	},
	className,
	disabled,
	disableLTR,
	disableRTL,
	items = [[], []],
	left = {},
	leftMaxItems,
	onItemsChange,
	right = {},
	rightMaxItems,
	size,
	spritemap,
	...otherProps
}: IProps) => {
	const [internalLeftSelected, setInternalLeftSelected] = React.useState(
		left.selected || []
	);
	const [internalRightSelected, setInternalRightSelected] = React.useState(
		right.selected || []
	);

	const handleLeftSelectedChange =
		left.onSelectChange || setInternalLeftSelected;
	const handleRightSelectedChange =
		right.onSelectChange || setInternalRightSelected;

	const leftSelected = left.selected || internalLeftSelected;
	const rightSelected = right.selected || internalRightSelected;

	const [leftItems, rightItems] = items;

	const selectedIndexesLeft = getSelectedIndexes(leftItems!, leftSelected);
	const selectedIndexesRight = getSelectedIndexes(rightItems!, rightSelected);

	const isLeftError = leftMaxItems
		? rightSelected.length + leftItems!.length > leftMaxItems
		: false;
	const isRightError = rightMaxItems
		? leftSelected.length + rightItems!.length > rightMaxItems
		: false;
	const hasMaxItemsLeft = leftMaxItems
		? leftItems!.length >= leftMaxItems
		: false;
	const hasMaxItemsRight = rightMaxItems
		? rightItems!.length >= rightMaxItems
		: false;

	return (
		<div {...otherProps} className={classNames(className, 'form-group')}>
			<div className="clay-dual-listbox">
				<ClaySelectBox
					className="clay-dual-listbox-item clay-dual-listbox-item-expand listbox-left"
					disabled={disabled}
					id={left.id}
					items={leftItems!}
					label={left.label}
					multiple
					onItemsChange={(newLeftItems) =>
						onItemsChange([newLeftItems, rightItems!])
					}
					onSelectChange={handleLeftSelectedChange}
					size={size}
					value={leftSelected}
				/>

				<div className="btn-group-vertical clay-dual-listbox-actions clay-dual-listbox-item">
					<ClayButtonWithIcon
						aria-label={ariaLabels.transferLTR}
						className="transfer-button-ltr"
						data-testid="ltr"
						disabled={
							disableLTR ||
							hasMaxItemsRight ||
							isRightError ||
							disabled
						}
						displayType="secondary"
						onClick={() => {
							const [arrayLeft, arrayRight] = swapArrayItems(
								[leftItems!, rightItems!],
								selectedIndexesLeft
							);

							onItemsChange([arrayLeft!, arrayRight!]);
						}}
						small
						spritemap={spritemap}
						symbol="caret-right"
					/>

					<ClayButtonWithIcon
						aria-label={ariaLabels.transferRTL}
						className="transfer-button-rtl"
						data-testid="rtl"
						disabled={
							disableRTL ||
							hasMaxItemsLeft ||
							isLeftError ||
							disabled
						}
						displayType="secondary"
						onClick={() => {
							const [arrayRight, arrayLeft] = swapArrayItems(
								[rightItems!, leftItems!],
								selectedIndexesRight
							);

							onItemsChange([arrayLeft!, arrayRight!]);
						}}
						small
						spritemap={spritemap}
						symbol="caret-left"
					/>
				</div>

				<ClaySelectBox
					className="clay-dual-listbox-item clay-dual-listbox-item-expand listbox-right"
					disabled={disabled}
					id={right.id}
					items={rightItems!}
					label={right.label}
					multiple
					onItemsChange={(newRightItems) =>
						onItemsChange([leftItems!, newRightItems])
					}
					onSelectChange={handleRightSelectedChange}
					showArrows
					size={size}
					spritemap={spritemap}
					value={rightSelected}
				/>
			</div>

			{(isLeftError || isRightError) && (
				<Form.FeedbackGroup className="has-error">
					<Form.FeedbackItem>
						{sub(ariaLabels.error || defaultError, [
							isLeftError ? left.label! : right.label!,
							isLeftError ? leftMaxItems! : rightMaxItems!,
						])}
					</Form.FeedbackItem>
				</Form.FeedbackGroup>
			)}
		</div>
	);
};

export default DualListBox;

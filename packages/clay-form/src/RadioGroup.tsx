/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {InternalDispatch, useControlledState} from '@clayui/shared';
import classNames from 'classnames';
import React from 'react';

import Radio from './Radio';
import Toggle from './Toggle';

interface IGroupProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
	/**
	 * Takes either Radio or Toggle as a child.
	 */
	children: Array<
		| React.ReactElement<React.ComponentProps<typeof Radio>>
		| React.ReactElement<React.ComponentProps<typeof Toggle>>
	>;

	/**
	 * Property to set the default value (uncontrolled).
	 */
	defaultValue?: React.ReactText;

	/**
	 * Flag to indicate if radio elements should display inline.
	 */
	inline?: boolean;

	/**
	 * Form element `name` that is applied to each radio element.
	 */
	name?: string;

	/**
	 * Callback function for whenever a radio element is selected (controlled).
	 */
	onChange?: InternalDispatch<React.ReactText>;

	/**
	 * Callback function for whenever a radio element is selected.
	 * @deprecated since v3.51.0 - use `onChange` instead.
	 */
	onSelectedValueChange?: InternalDispatch<React.ReactText>;

	/**
	 * The value that corresponds to the selected radio element. Leave
	 * undefined if no option is selected.
	 * @deprecated since v3.51.0 - use `value` instead.
	 */
	selectedValue?: React.ReactText;

	/**
	 * The value property sets the current value (controlled).
	 */
	value?: React.ReactText;
}

const RadioGroup = ({
	children,
	className,
	defaultValue,
	inline,
	name,
	onChange,
	onSelectedValueChange,
	selectedValue,
	value,
	...otherProps
}: IGroupProps) => {
	const [internalValue, setValue] = useControlledState({
		defaultName: 'defaultValue',
		defaultValue,
		handleName: 'onChange',
		name: 'value',
		onChange: onChange ?? onSelectedValueChange,
		value: value ?? selectedValue,
	});

	return (
		<div {...otherProps} className={classNames(className)}>
			{React.Children.map(
				children,
				(
					child: React.ReactElement<
						| React.ComponentProps<typeof Radio>
						| React.ComponentProps<typeof Toggle>
					>,
					i
				) => {
					return React.cloneElement(child, {
						...child.props,
						checked: internalValue === child.props.value,
						inline,
						key: i,
						name,
						onChange: () => setValue(child.props.value!),
						type: 'radio',
					});
				}
			)}
		</div>
	);
};

export default RadioGroup;

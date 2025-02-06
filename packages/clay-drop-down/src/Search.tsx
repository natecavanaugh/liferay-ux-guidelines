/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import ClayButton from '@clayui/button';
import {ClayInput} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import {InternalDispatch, useControlledState} from '@clayui/shared';
import classNames from 'classnames';
import React, {useContext, useEffect} from 'react';

import {DropDownContext} from './DropDownContext';

interface IProps
	extends Omit<React.HTMLAttributes<HTMLInputElement>, 'onChange'> {
	/**
	 * Initial value of the input (uncontrolled).
	 */
	defaultValue?: string;

	/**
	 * Props to add to form element
	 */
	formProps?: React.HTMLAttributes<HTMLFormElement>;

	/**
	 * Callback for when input value changes (controlled).
	 */
	onChange?: InternalDispatch<string>;

	/**
	 * Path to the location of the spritemap resource.
	 */
	spritemap?: string;

	/**
	 * Props to add to the button component.
	 */
	submitProps?: React.HTMLAttributes<HTMLButtonElement>;

	/**
	 * Current value of the input (controlled).
	 */
	value?: string;
}

const defaultOnSubmit = (event: React.SyntheticEvent) => event.preventDefault();

const defaultSubmitProps = {
	'aria-label': 'Search',
	type: 'button',
};

const Search = ({
	className,
	defaultValue = '',
	formProps = {},
	onChange,
	spritemap,
	submitProps = defaultSubmitProps,
	value: valueProp,
	...otherProps
}: IProps) => {
	const {className: formClassName, onSubmit, ...otherFormProps} = formProps;

	const [value, setValue, isUncontrolled] = useControlledState({
		defaultName: 'defaultValue',
		defaultValue,
		handleName: 'onChange',
		name: 'value',
		onChange,
		value: valueProp,
	});

	const {onSearch, tabFocus} = useContext(DropDownContext);

	useEffect(() => {
		if (isUncontrolled) {
			onSearch(value);
		}
	}, [isUncontrolled, value]);

	return (
		<form
			className={classNames(className, formClassName)}
			onSubmit={onSubmit ? onSubmit : defaultOnSubmit}
			{...otherFormProps}
		>
			<div className="dropdown-section">
				<ClayInput.Group small>
					<ClayInput.GroupItem className="input-group-item-focusable">
						<ClayInput
							{...otherProps}
							insetAfter
							onChange={(event) => setValue(event.target.value)}
							tabIndex={!tabFocus ? -1 : undefined}
							type="text"
							value={value}
						/>

						<ClayInput.GroupInsetItem after tag="span">
							<ClayButton
								{...submitProps}
								displayType="unstyled"
								tabIndex={!tabFocus ? -1 : undefined}
							>
								<ClayIcon
									spritemap={spritemap}
									symbol="search"
								/>
							</ClayButton>
						</ClayInput.GroupInsetItem>
					</ClayInput.GroupItem>
				</ClayInput.Group>
			</div>
		</form>
	);
};

export default Search;

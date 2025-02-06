/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import classNames from 'classnames';
import React from 'react';

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
	/**
	 * Flag to indicate if input is checked or not.
	 */
	checked: boolean;

	/**
	 * Props to add to the outer most container.
	 */
	containerProps?: React.HTMLAttributes<HTMLDivElement>;

	/**
	 * Props to disable checkbox.
	 */
	disabled?: boolean;

	/**
	 * Flag to indicate that checkbox is in an indeterminate state.
	 */
	indeterminate?: boolean;

	/**
	 * Flag to display element `inline`.
	 */
	inline?: boolean;

	/**
	 * Text describes what the checkbox is for.
	 */
	label?: React.ReactText;

	/**
	 * Callback for when checkbox value is changed.
	 */
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, IProps>(
	(
		{
			checked,
			children,
			className,
			containerProps = {},
			disabled,
			indeterminate = false,
			inline,
			label,
			...otherProps
		}: IProps,
		ref
	) => {
		const inputRef = React.useRef<HTMLInputElement | null>(null);

		React.useEffect(() => {
			if (inputRef.current) {
				inputRef.current.indeterminate = indeterminate;
			}
		}, [indeterminate]);

		return (
			<div
				{...containerProps}
				className={classNames(
					'custom-control custom-checkbox',
					containerProps.className,
					{
						'custom-control-inline': inline,
						'custom-control-outside': label,
					}
				)}
			>
				<label>
					<input
						{...otherProps}
						checked={checked}
						className={classNames(
							'custom-control-input',
							className
						)}
						disabled={disabled}
						ref={(r) => {
							inputRef.current = r;
							if (typeof ref === 'function') {
								ref(r);
							}
						}}
						type="checkbox"
					/>

					<span className="custom-control-label">
						{label && (
							<span className="custom-control-label-text">
								{label}
							</span>
						)}
					</span>

					{children}
				</label>
			</div>
		);
	}
);

Checkbox.displayName = 'ClayCheckbox';

export default Checkbox;

/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import classNames from 'classnames';
import React from 'react';
import warning from 'warning';

import Group from './Group';

type DisplayType =
	| null
	| 'primary'
	| 'secondary'
	| 'link'
	| 'success'
	| 'warning'
	| 'danger'
	| 'info'
	| 'beta'
	| 'beta-dark'
	| 'unstyled';

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	/**
	 * Flag to indicate if button is used within an alert component.
	 */
	alert?: boolean;

	/**
	 * Flag to indicate if the button should be borderless.
	 */
	borderless?: boolean;

	/**
	 * Renders the button as a block element.
	 */
	block?: boolean;

	/**
	 * Flag to indicate if the button should use the clay-dark variant.
	 */
	dark?: boolean;

	/**
	 * Determines the button variant to use.
	 * The values `beta` and `beta-dark` are deprecated since v3.100.0 - use
	 * `translucent` and `dark` instead.
	 * The values `null` and `unstyled` are for internal use only.
	 */
	displayType?: DisplayType;

	/**
	 * Flag to indicate if button should be monospaced.
	 */
	monospaced?: boolean;

	/**
	 * Flag to indicate if the button should use the outline variant.
	 */
	outline?: boolean;

	/**
	 * Flag to indicate if the button should be shaped like a pill.
	 */
	rounded?: boolean;

	/**
	 * Determines the size of a button.
	 */
	size?: 'xs' | 'regular' | 'sm';

	/**
	 * Indicates button should be a small variant.
	 * @deprecated since v3.72.0 - use `size` instead.
	 */
	small?: boolean;

	/**
	 * Flag to indicate if the button should use the translucent variant.
	 */
	translucent?: boolean;
}

export interface IForwardRef<T, P = {}>
	extends React.ForwardRefExoticComponent<P & React.RefAttributes<T>> {
	Group: typeof Group;
}

function forwardRef<T, P = {}>(component: React.RefForwardingComponent<T, P>) {
	return React.forwardRef<T, P>(component) as IForwardRef<T, P>;
}

const Button = forwardRef(
	(
		{
			alert,
			block,
			borderless,
			children,
			className,
			dark,
			displayType = 'primary',
			monospaced,
			outline,
			rounded,
			size = 'regular',
			small,
			translucent,
			type = 'button',
			...otherProps
		}: IProps,
		ref: React.Ref<HTMLButtonElement>
	) => {
		const childArray = React.Children.toArray(children);

		warning(
			!(
				childArray.length === 1 &&
				// @ts-ignore
				childArray[0].type?.displayName === 'ClayIcon' &&
				typeof otherProps['aria-label'] !== 'string' &&
				typeof otherProps['aria-labelledby'] !== 'string'
			),
			'Button Accessibility: Component has only the Icon declared. Define an `aria-label` or `aria-labelledby` attribute that labels the interactive button that screen readers can read. The `title` attribute is optional but consult your design team.'
		);

		if (displayType === 'beta') {
			displayType = 'info';
			translucent = true;
		} else if (displayType === 'beta-dark') {
			dark = true;
			displayType = 'info';
			translucent = true;
		}

		return (
			<button
				className={classNames(className, 'btn', {
					'alert-btn': alert,
					'btn-block': block,
					'btn-monospaced': monospaced,
					'btn-outline-borderless': borderless,
					'btn-sm': small && (!size || size === 'regular'),
					'btn-translucent': translucent,
					'clay-dark': dark,
					[`btn-${displayType}`]:
						displayType && !outline && !borderless,
					[`btn-outline-${displayType}`]:
						displayType && (outline || borderless),
					'rounded-pill': rounded,
					[`btn-${size}`]: size && size !== 'regular',
				})}
				ref={ref}
				type={type}
				{...otherProps}
			>
				{children}
			</button>
		);
	}
);

Button.Group = Group;
Button.displayName = 'ClayButton';

export default Button;

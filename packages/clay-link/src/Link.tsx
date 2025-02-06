/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import classNames from 'classnames';
import React from 'react';

import ClayLinkContext from './Context';

const LINK_PRESETS = {
	danger: {
		base: 'c-link text-danger',
		decoration: 'underline',
	},
	primary: {
		base: 'c-link link-primary',
		decoration: 'underline',
	},
	secondary: {
		base: 'c-link link-secondary',
		decoration: 'underline',
	},
	tertiary: {
		base: 'c-link text-tertiary',
		decoration: null,
	},
	unstyled: {
		base: 'link-unstyled',
		decoration: null,
	},
} as const;

const FONT_WEIGHTS = {
	normal: 'font-weight-normal',
	'semi-bold': 'font-weight-semi-bold',
};

interface IProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
	/**
	 * Renders the button as a block element.
	 */
	block?: boolean;

	/**
	 * Flag to indicate if link should be borderless.
	 */
	borderless?: boolean;

	/**
	 * Config for button props
	 */
	button?:
		| boolean
		| {
				block?: boolean;
				monospaced?: boolean;
				small?: boolean;
		  };

	/**
	 * Indicates if the text should be underlined
	 */
	decoration?: 'none' | 'underline' | null;

	/**
	 * Determines how the link is displayed.
	 */
	displayType?: 'danger' | 'primary' | 'secondary' | 'tertiary' | 'unstyled';

	/**
	 * Sets the text size based on a number scale.
	 */
	fontSize?: Number;

	/**
	 * Messages used for announcement to SR. Use this for internationalization.
	 */
	messages?: {
		opensNewWindow: string;
	};

	/**
	 * Flag to indicate if the link should be monospaced.
	 */
	monospaced?: boolean;

	/**
	 * Flag to indicate if the link should use the outlined style.
	 */
	outline?: boolean;

	/**
	 * Indicates whether the button should use the small variant.
	 */
	small?: boolean;

	/**
	 * Determines the font-weight of the link.
	 */
	weight?: 'normal' | 'semi-bold';
}

const defaultMessages = {
	opensNewWindow: '(Opens a new window)',
};

const Link = React.forwardRef<HTMLAnchorElement, IProps>(
	(
		{
			block,
			borderless,
			button,
			children,
			className,
			decoration,
			displayType,
			fontSize,
			messages = defaultMessages,
			monospaced,
			outline,
			rel,
			small,
			target,
			weight,
			...otherProps
		}: IProps,
		ref
	) => {
		const TagOrComponent = React.useContext(ClayLinkContext);

		let classes;

		if (button) {
			button = button === true ? {} : button;

			classes = {
				btn: !!button,
				'btn-block': button.block || block,
				'btn-monospaced': button.monospaced || monospaced,
				'btn-outline-borderless': borderless,
				'btn-sm': button.small || small,
				[`btn-${displayType}`]: displayType && !outline && !borderless,
				[`btn-outline-${displayType}`]:
					displayType && (outline || borderless),
				[FONT_WEIGHTS[weight!]]: weight,
				[`text-${fontSize}`]: fontSize,
				[`text-decoration-${decoration}`]: decoration,
			};
		} else {
			decoration =
				decoration === null || outline
					? undefined
					: decoration || LINK_PRESETS[displayType!]?.decoration;

			classes = {
				'link-monospaced': monospaced,
				'link-outline': outline,
				'link-outline-borderless': borderless,
				[LINK_PRESETS[displayType!]?.base]: displayType && !outline,
				[`link-outline-${displayType}`]: displayType && outline,
				[FONT_WEIGHTS[weight!]]: weight,
				[`text-${fontSize}`]: fontSize,
				[`text-decoration-${decoration}`]: decoration,
			};
		}

		if (target && !rel) {
			rel = 'noreferrer noopener';
		}

		return (
			<TagOrComponent
				className={classNames(className, classes)}
				ref={ref}
				rel={rel}
				target={target}
				{...otherProps}
			>
				{children}
				{target === '_blank' && (
					<span className="sr-only">{messages.opensNewWindow}</span>
				)}
			</TagOrComponent>
		);
	}
);

Link.displayName = 'ClayLink';

export default Link;

/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import Icon from '@clayui/icon';
import {LinkOrButton} from '@clayui/shared';
import classNames from 'classnames';
import React from 'react';

interface IProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
	/**
	 * Flag to indicate if `active` class should be applied.
	 */
	active?: boolean;

	/**
	 * Flag to indicate if `collapsed` class should be applied.
	 */
	collapsed?: boolean;

	/**
	 * Flag to indicate if `disabled` class should be applied.
	 */
	disabled?: boolean;

	/**
	 * Flag to indicate if icon should be shown.
	 */
	showIcon?: boolean;

	/**
	 * Path to the spritemap that Icon should use when referencing symbols.
	 */
	spritemap?: string;
}

export const Link = React.forwardRef<
	HTMLButtonElement | HTMLAnchorElement,
	IProps
>(
	(
		{
			active,
			children,
			className,
			collapsed,
			disabled,
			showIcon,
			spritemap,
			...otherProps
		},
		ref
	) => {
		return (
			<LinkOrButton
				{...otherProps}
				buttonDisplayType="unstyled"
				buttonType="button"
				className={classNames('nav-link', className, {
					active,
					['collapse-icon']: showIcon,
					collapsed,
					disabled,
				})}
				ref={ref}
			>
				{children}

				{showIcon && (
					<>
						<span className="collapse-icon-closed">
							<Icon
								focusable="false"
								role="presentation"
								spritemap={spritemap}
								symbol="caret-right"
							/>
						</span>

						<span className="collapse-icon-open">
							<Icon
								focusable="false"
								role="presentation"
								spritemap={spritemap}
								symbol="caret-bottom"
							/>
						</span>
					</>
				)}
			</LinkOrButton>
		);
	}
);

Link.displayName = 'NavLink';

/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import classNames from 'classnames';
import React from 'react';

type DisplayType =
	| 'primary'
	| 'secondary'
	| 'info'
	| 'danger'
	| 'success'
	| 'warning'
	| 'beta'
	| 'beta-dark';

interface IProps extends React.HTMLAttributes<HTMLSpanElement> {
	/**
	 * Flag to indicate if the badge should use the clay-dark variant.
	 */
	dark?: boolean;

	/**
	 * Determines the color of the badge.
	 * The values `beta` and `beta-dark` are deprecated since v3.100.0 - use
	 * `translucent` and `dark` instead.
	 */
	displayType?: DisplayType;

	/**
	 * Info that is shown inside of the badge itself.
	 */
	label?: string | number;

	/**
	 * Flag to indicate if the badge should use the translucent variant.
	 */
	translucent?: boolean;
}

const Badge = React.forwardRef<HTMLSpanElement, IProps>(
	(
		{
			className,
			dark,
			displayType = 'primary',
			label,
			translucent,
			...otherProps
		}: IProps,
		ref
	) => {
		if (displayType === 'beta') {
			displayType = 'info';
			translucent = true;
		} else if (displayType === 'beta-dark') {
			dark = true;
			displayType = 'info';
			translucent = true;
		}

		return (
			<span
				{...otherProps}
				className={classNames(
					'badge',
					`badge-${displayType}`,
					className,
					{
						'badge-translucent': translucent,
						'clay-dark': dark,
					}
				)}
				ref={ref}
			>
				<span className="badge-item badge-item-expand">{label}</span>
			</span>
		);
	}
);

Badge.displayName = 'ClayBadge';

export default Badge;

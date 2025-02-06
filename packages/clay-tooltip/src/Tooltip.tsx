/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import classNames from 'classnames';
import React from 'react';

export const ALIGN_POSITIONS = [
	'top',
	'top-left',
	'top-right',
	'bottom',
	'bottom-left',
	'bottom-right',
	'left',
	'right',
] as const;

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
	/**
	 * Position in which the tooltip will be aligned to the element.
	 */
	alignPosition?: typeof ALIGN_POSITIONS[number];

	/**
	 * Flag to indicate if tooltip is displayed.
	 */
	show?: boolean;
}

export const Tooltip = React.forwardRef<HTMLElement, IProps>(
	(
		{
			alignPosition = 'bottom',
			children,
			className,
			show,
			...otherProps
		}: IProps,
		ref
	) => {
		return (
			<div
				className={classNames(
					className,
					'tooltip',
					`clay-tooltip-${alignPosition}`,
					{show}
				)}
				role="tooltip"
				{...otherProps}
				ref={ref as React.RefObject<HTMLDivElement>}
			>
				<div className="arrow" />

				<div className="tooltip-inner">{children}</div>
			</div>
		);
	}
);

Tooltip.displayName = 'ClayTooltip';

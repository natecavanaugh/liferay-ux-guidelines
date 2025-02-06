/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import classNames from 'classnames';
import React from 'react';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
	/**
	 * Determines the color of the visual indicator.
	 */
	displayType?: null | 'primary' | 'secondary' | 'light';

	/**
	 * Determines the style of the visual indicator.
	 */
	shape?: null | 'circle' | 'squares';

	/**
	 * Determines the size of the visual indicator.
	 */
	size?: null | 'xs' | 'sm' | 'md' | 'lg';

	/**
	 * Flag to indicate the 'light' variant
	 * @deprecated since v3.59.0 - use `displayType` instead.
	 */
	light?: boolean;

	/**
	 * Flag to indicate the small size
	 * @deprecated since v3.59.0 - use `size` instead.
	 */
	small?: boolean;
}

const LoadingIndicator = React.forwardRef<HTMLSpanElement, IProps>(
	(
		{
			className,
			displayType,
			light,
			shape,
			size,
			small,
			...otherProps
		}: IProps,
		ref
	) => {
		return (
			<span
				aria-hidden="true"
				{...otherProps}
				className={classNames(className, {
					'loading-animation':
						[null, undefined, '', 'circle'].indexOf(shape) > -1,
					[`loading-animation-${shape}`]:
						shape && ['', 'circle'].indexOf(shape) === -1,
					'loading-animation-light': light,
					[`loading-animation-${displayType}`]: displayType && !light,
					'loading-animation-sm': small,
					[`loading-animation-${size}`]: size,
				})}
				ref={ref}
			/>
		);
	}
);

LoadingIndicator.displayName = 'ClayLoadingIndicator';

export default LoadingIndicator;

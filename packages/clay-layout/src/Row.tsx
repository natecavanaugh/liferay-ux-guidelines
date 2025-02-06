/**
 * SPDX-FileCopyrightText: © 2020 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import classNames from 'classnames';
import React from 'react';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
	/**
	 * Element or component to render for container
	 */
	containerElement?:
		| string
		| React.JSXElementConstructor<{
				className: string;
				[key: string]: any;
		  }>;

	/**
	 * This removes the negative margins from .row and the
	 * horizontal padding from all immediate children columns
	 */
	gutters?: boolean;

	/**
	 * Horizontal positioning of row contents
	 */
	justify?: 'start' | 'center' | 'end' | 'around' | 'between';
}

const Row = React.forwardRef<HTMLElement, IProps>(
	(
		{
			children,
			className,
			containerElement: ContainerElement = 'div',
			gutters = true,
			justify,
			...otherProps
		}: IProps,
		ref
	) => {
		return (
			<ContainerElement
				{...otherProps}
				className={classNames('row', className, {
					'no-gutters': !gutters,
					[`justify-content-${justify}`]: justify,
				})}
				ref={ref}
			>
				{children}
			</ContainerElement>
		);
	}
);

Row.displayName = 'ClayRow';

export default Row;

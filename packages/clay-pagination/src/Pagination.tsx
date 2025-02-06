/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import classNames from 'classnames';
import React from 'react';

import {Ellipsis} from './Ellipsis';
import {Item} from './Item';

interface IProps extends React.HTMLAttributes<HTMLUListElement> {
	/**
	 * The size of pagination element.
	 */
	size?: 'lg' | 'sm';
}

interface IForwardRef<T, P = {}>
	extends React.ForwardRefExoticComponent<P & React.RefAttributes<T>> {
	Ellipsis: typeof Ellipsis;
	Item: typeof Item;
}

function forwardRef<T, P = {}>(component: React.RefForwardingComponent<T, P>) {
	return React.forwardRef<T, P>(component) as IForwardRef<T, P>;
}

export const Pagination = forwardRef<HTMLUListElement, IProps>(
	({children, className, size, ...otherProps}: IProps, ref) => {
		return (
			<nav aria-label={otherProps['aria-label'] || 'Pagination'}>
				<ul
					{...otherProps}
					className={classNames(
						'pagination pagination-root',
						className,
						{
							[`pagination-${size}`]: size,
						}
					)}
					ref={ref}
				>
					{children}
				</ul>
			</nav>
		);
	}
);

Pagination.displayName = 'ClayPagination';

Pagination.Ellipsis = Ellipsis;
Pagination.Item = Item;

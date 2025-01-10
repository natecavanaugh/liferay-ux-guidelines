/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import classNames from 'classnames';
import React from 'react';

import {Item} from './Item';
import {Link} from './Link';

interface IProps extends React.HTMLAttributes<HTMLUListElement> {
	/**
	 * Flag to indicate if `nav-nested` class should be applied. Adds padding to indent each nested navigation.
	 */
	nested?: boolean;

	/**
	 * Flag to indicate if `nav-nested-margins` class should be applied. Adds margin to indent each nested navigation.
	 */
	nestMargins?: boolean;

	/**
	 * Flag to indicate if `nav-stacked` class should be applied.
	 */
	stacked?: boolean;
}

interface IForwardRef<T, P = {}>
	extends React.ForwardRefExoticComponent<P & React.RefAttributes<T>> {
	Item: typeof Item;
	Link: typeof Link;
}

function forwardRef<T, P = {}>(component: React.RefForwardingComponent<T, P>) {
	return React.forwardRef<T, P>(component) as IForwardRef<T, P>;
}

export const Nav = forwardRef<HTMLUListElement, IProps>(function Nav(
	{children, className, nestMargins, nested, stacked, ...otherProps},
	ref
) {
	return (
		<ul
			{...otherProps}
			className={classNames('nav', className, {
				['nav-nested']: nested,
				['nav-nested-margins']: nestMargins,
				['nav-stacked']: stacked,
			})}
			ref={ref}
		>
			{children}
		</ul>
	);
});

Nav.Item = Item;
Nav.Link = Link;

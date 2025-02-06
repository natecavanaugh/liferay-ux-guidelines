/**
 * SPDX-FileCopyrightText: © 2020 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import classNames from 'classnames';
import React from 'react';

interface IProps extends React.HTMLAttributes<HTMLUListElement> {
	/**
	 * Specifies whether the `tbar-nav-wrap` class should be added to the Toolbar.Nav
	 */
	wrap?: boolean;
}

export const Nav = ({children, className, wrap, ...otherProps}: IProps) => (
	<ul
		className={classNames(className, 'tbar-nav', {
			'tbar-nav-wrap': wrap,
		})}
		{...otherProps}
	>
		{children}
	</ul>
);

Nav.displayName = 'ClayToolbarNav';

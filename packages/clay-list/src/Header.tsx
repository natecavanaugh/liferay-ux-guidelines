/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import classNames from 'classnames';
import React from 'react';

const Header = React.forwardRef<
	HTMLLIElement,
	React.HTMLAttributes<HTMLLIElement>
>(({children, className, ...otherProps}, ref) => {
	return (
		<li
			{...otherProps}
			className={classNames('list-group-header', className)}
			ref={ref}
		>
			<p className="list-group-header-title">{children}</p>
		</li>
	);
});

Header.displayName = 'ClayListHeader';

export default Header;

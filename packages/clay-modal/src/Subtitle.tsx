/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import classNames from 'classnames';
import React from 'react';

const ItemGroup = ({
	children,
	className,
	...otherProps
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={classNames('modal-subtitle', className)} {...otherProps}>
		{children}
	</div>
);

export default ItemGroup;

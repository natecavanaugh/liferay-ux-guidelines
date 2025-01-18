/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import classNames from 'classnames';
import React from 'react';

export const AlertFooter = ({
	children,
	className,
	...otherProps
}: React.HTMLAttributes<HTMLDivElement>) => {
	return (
		<div className={classNames(className, 'alert-footer')} {...otherProps}>
			{children}
		</div>
	);
};

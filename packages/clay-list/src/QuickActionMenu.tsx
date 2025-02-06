/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import classNames from 'classnames';
import React from 'react';

import QuickActionMenuItem from './QuickActionMenuItem';

interface IForwardRef<T, P = {}>
	extends React.ForwardRefExoticComponent<P & React.RefAttributes<T>> {
	Item: typeof QuickActionMenuItem;
}

function forwardRef<T, P = {}>(component: React.RefForwardingComponent<T, P>) {
	return React.forwardRef<T, P>(component) as IForwardRef<T, P>;
}

const QuickActionMenu = forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({children, className, ...otherProps}, ref) => {
	return (
		<div
			{...otherProps}
			className={classNames('quick-action-menu', className)}
			ref={ref}
		>
			{children}
		</div>
	);
});

QuickActionMenu.displayName = 'ClayListQuickActionMenu';
QuickActionMenu.Item = QuickActionMenuItem;

export default QuickActionMenu;

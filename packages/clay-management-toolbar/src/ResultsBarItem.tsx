/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import classNames from 'classnames';
import React from 'react';

interface IProps extends React.HTMLAttributes<HTMLLIElement> {
	/**
	 * Flag to indicate the Management Toolbar Results Bar Item should fit the width of the parent container.
	 */
	expand?: boolean;
}

const ResultsBarItem = ({
	children,
	className,
	expand = false,
	...otherProps
}: IProps) => (
	<li
		{...otherProps}
		className={classNames('tbar-item', className, {
			'tbar-item-expand': expand,
		})}
	>
		<div className="tbar-section">{children}</div>
	</li>
);

export default ResultsBarItem;

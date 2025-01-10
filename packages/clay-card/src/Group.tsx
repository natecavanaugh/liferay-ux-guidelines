/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import classNames from 'classnames';
import React from 'react';

interface ICardGroupProps extends React.HTMLAttributes<HTMLUListElement> {
	/**
	 * Header's label of Card Group
	 */
	label?: string;
}

const Group = ({
	children,
	className,
	label,
	...otherProps
}: ICardGroupProps) => {
	return (
		<ul {...otherProps} className={classNames('card-page', className)}>
			{label && (
				<li className="card-page-item card-page-item-header">
					<p className="card-section-header">{label}</p>
				</li>
			)}

			{React.Children.map(children, (child, index) => (
				<li
					className="card-page-item card-page-item-directory"
					key={index}
				>
					{child}
				</li>
			))}
		</ul>
	);
};

export default Group;

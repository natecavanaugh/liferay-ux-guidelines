/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import classNames from 'classnames';
import React from 'react';

import Context from './Context';

interface IProps extends React.BaseHTMLAttributes<HTMLDivElement> {
	/**
	 * Flag that indicates if `active` class is applied
	 */
	active?: boolean;

	/**
	 * Flag that indicates if the card can be selectable.
	 */
	selectable?: boolean;
}

const Body = ({
	children,
	className,
	...otherProps
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={classNames('card card-horizontal', className)}
		{...otherProps}
	>
		{children}
	</div>
);

export function ClayCardHorizontal({
	active,
	children,
	className,
	selectable,
	...otherProps
}: IProps) {
	return (
		<Context.Provider value={{horizontal: true, interactive: false}}>
			<div
				className={classNames(
					className,
					{
						active,
						'card card-horizontal': !selectable,
						'form-check-card form-check form-check-middle-left':
							selectable,
					},
					'card-type-directory'
				)}
				{...otherProps}
			>
				{children}
			</div>
		</Context.Provider>
	);
}

ClayCardHorizontal.Body = Body;

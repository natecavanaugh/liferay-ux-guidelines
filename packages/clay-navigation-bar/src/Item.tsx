/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import classNames from 'classnames';
import React, {useContext} from 'react';

import {NavigationBarContext} from './context';

interface IProps extends React.HTMLAttributes<HTMLLIElement> {
	/**
	 * Determines the active state of an dropdown list item.
	 */
	active?: boolean;

	/**
	 * Children elements received from ClayNavigationBar.Item component.
	 */
	children: React.ReactElement;
}

export const Item = ({
	active = false,
	children,
	className,
	...otherProps
}: IProps) => {
	const {ariaCurrent} = useContext(NavigationBarContext);

	return (
		<li {...otherProps} className={classNames('nav-item', className)}>
			{React.Children.map(
				children,
				(child: React.ReactElement<IProps>, index) => {
					if (
						// @ts-ignore
						child?.type.displayName === 'ClayLink' ||
						// @ts-ignore
						child?.type.displayName === 'ClayButton'
					) {
						return React.cloneElement(child, {
							...child.props,
							'aria-current': active
								? ariaCurrent ?? undefined
								: undefined,
							children: <span>{child.props.children}</span>,
							className: classNames(
								'nav-link',
								child.props.className?.replace('nav-link', ''),
								{
									active,
								}
							),
							// @ts-ignore
							displayType: null,
							key: index,
						});
					}

					return React.cloneElement(child, {
						...child.props,
						className: classNames(child.props.className, {
							active,
						}),
						key: index,
					});
				}
			)}
		</li>
	);
};

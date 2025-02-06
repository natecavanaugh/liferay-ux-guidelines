/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import classNames from 'classnames';
import React from 'react';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
	/**
	 * @ignore
	 */
	active?: React.Key;

	/**
	 * Receives a number that indicates the `tabkey` to be rendered.
	 * @deprecated since v3.78.2 - No longer needed in new composition.
	 */
	activeIndex?: number;

	/**
	 * Children elements received from ClayTabs.Content component.
	 */
	children: React.ReactNode;

	/**
	 * Flag to indicate if `fade` classname that applies an fading animation should be applied.
	 */
	fade?: boolean;

	/**
	 * @ignore
	 */
	tabsId?: string;
}

const Content = React.forwardRef<HTMLDivElement, IProps>(function Content(
	{
		active,
		activeIndex = 0,
		children,
		className,
		fade = false,
		tabsId,
		...otherProps
	},
	ref
) {
	return (
		<div
			className={classNames('tab-content', className)}
			{...otherProps}
			ref={ref}
		>
			{React.Children.map(children, (child, index) => {
				if (!React.isValidElement(child)) {
					return child;
				}

				return React.cloneElement(child, {
					...child.props,
					active:
						typeof active === 'number'
							? active === index
							: activeIndex === index,
					'aria-labelledby': tabsId
						? `${tabsId}-tab-${index}`
						: child.props['aria-labelledby'],
					fade,
					id: tabsId ? `${tabsId}-tabpanel-${index}` : child.props.id,
					key: index,
				});
			})}
		</div>
	);
});

export default Content;

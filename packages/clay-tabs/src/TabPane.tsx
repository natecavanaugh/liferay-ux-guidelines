/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import classNames from 'classnames';
import React from 'react';

interface ITabPaneProps extends React.HTMLAttributes<HTMLDivElement> {
	/**
	 * Flag to indicate if `active` classname should be applied
	 */
	active?: boolean;

	/**
	 * Flag to indicate if `fade` classname that applies a fading animation should be applied.
	 */
	fade?: boolean;
}

const delay = (fn: Function, val: number = 150) =>
	setTimeout(() => {
		fn();
	}, val);

const TabPane = React.forwardRef<HTMLDivElement, ITabPaneProps>(
	function TabPane(
		{
			active = false,
			children,
			className,
			fade,
			tabIndex = 0,
			...otherProps
		},
		ref
	) {
		const [internalActive, setInternalActive] = React.useState(active);
		const [internalShow, setInternalShow] = React.useState(active);

		React.useEffect(() => {
			let delayFn = () => {
				setInternalActive(true);

				delay(() => setInternalShow(true), 50);
			};

			if (!active) {
				setInternalShow(false);

				delayFn = () => setInternalActive(false);
			}

			const timer = delay(delayFn);

			return () => {
				clearTimeout(timer);

				setInternalShow(false);
			};
		}, [active]);

		return (
			<div
				{...otherProps}
				className={classNames(
					'tab-pane',
					{
						active: internalActive,
						fade,
						show: internalShow,
					},
					className
				)}
				ref={ref}
				role="tabpanel"
				tabIndex={tabIndex}
			>
				{children}
			</div>
		);
	}
);

export default TabPane;

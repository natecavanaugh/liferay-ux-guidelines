/**
 * SPDX-FileCopyrightText: © 2020 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import ClayLink from '@clayui/link';
import classNames from 'classnames';
import React from 'react';

interface IProps extends React.ComponentProps<typeof ClayLink> {
	/**
	 * Flag that determines if the Link will have a `disabled` class, disabling interactions.
	 */
	disabled?: boolean;
}

export const Link = ({
	children,
	className,
	disabled,
	...otherProps
}: IProps) => (
	<ClayLink
		className={classNames(className, 'component-link tbar-link', {
			disabled,
		})}
		{...otherProps}
	>
		{children}
	</ClayLink>
);

Link.displayName = 'ClayToolbarLink';

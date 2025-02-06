/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import classNames from 'classnames';
import React from 'react';

type Props = {
	/**
	 * Flag to indicate the spacing between the buttons.
	 */
	spaced?: boolean;

	/**
	 * Flag to indicate if buttons are stacked vertically.
	 */
	vertical?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

const Group = ({
	children,
	className,
	role = 'group',
	spaced,
	vertical,
	...otherProps
}: Props) => (
	<div
		{...otherProps}
		className={classNames(className, {
			'btn-group': !spaced && !vertical,
			'btn-group-spaced': spaced,
			'btn-group-vertical': vertical,
		})}
		role={role}
	>
		{children}
	</div>
);

Group.displayName = 'ClayButtonGroup';

export default Group;

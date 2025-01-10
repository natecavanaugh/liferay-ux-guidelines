/**
 * SPDX-FileCopyrightText: © 2020 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import ClayIcon from '@clayui/icon';
import classNames from 'classnames';
import React from 'react';

interface IProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
	/**
	 * Flag that determines if the Action will have a `disabled` class, disabling interactions.
	 */
	disabled?: boolean;

	/**
	 * Path to clay icon spritemap
	 */
	spritemap?: string;

	/**
	 * Symbol of the icon used inside the Action. You can find available symbols here: https://clayui.com/docs/components/icon.html
	 */
	symbol: string;
}

export const Action = ({
	className,
	disabled,
	spritemap,
	symbol,
	...otherProps
}: IProps) => (
	<a
		className={classNames(className, 'component-action', {disabled})}
		role="button"
		{...otherProps}
	>
		<ClayIcon spritemap={spritemap} symbol={symbol} />
	</a>
);

Action.displayName = 'ClayToolbarAction';

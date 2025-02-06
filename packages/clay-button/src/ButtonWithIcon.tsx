/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import ClayIcon from '@clayui/icon';
import React from 'react';

import ClayButton from './Button';

type ButtonAria =
	| {
			/**
			 * Define a value that labels the button.
			 */
			'aria-label': string;
			'aria-labelledby'?: never;
	  }
	| {
			/**
			 * Define a value that labels the button.
			 */
			'aria-label'?: never;
			'aria-labelledby': string;
	  };

interface ICommonProps
	extends Omit<
		React.ComponentProps<typeof ClayButton>,
		'aria-label' | 'aria-labelledby'
	> {
	/**
	 * Path to the location of the spritemap resource.
	 */
	spritemap?: string;

	/**
	 * The id of the icon in the spritemap.
	 */
	symbol: string;
}

type Props = ICommonProps & ButtonAria;

const ClayButtonWithIcon = React.forwardRef<HTMLButtonElement, Props>(
	({monospaced = true, spritemap, symbol, ...otherProps}: Props, ref) => (
		<ClayButton {...otherProps} monospaced={monospaced} ref={ref}>
			<ClayIcon spritemap={spritemap} symbol={symbol} />
		</ClayButton>
	)
);

ClayButtonWithIcon.displayName = 'ClayButtonWithIcon';

export default ClayButtonWithIcon;

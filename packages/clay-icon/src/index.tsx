/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import classNames from 'classnames';
import React from 'react';
import warning from 'warning';

export const ClayIconSpriteContext = React.createContext('');

interface IProps extends React.SVGAttributes<SVGSVGElement> {
	className?: string;
	/**
	 * Path to the location of the spritemap resource.
	 */
	spritemap?: string;

	/**
	 * The id of the icon in the spritemap.
	 */
	symbol: string;
}

const Icon = React.forwardRef<SVGSVGElement, IProps>(
	({className, spritemap, symbol, ...otherProps}: IProps, ref) => {
		let spriteMapVal = React.useContext(ClayIconSpriteContext);

		if (spritemap) {
			spriteMapVal = spritemap;
		}

		warning(
			spriteMapVal,
			'ClayIcon requires a `spritemap` via prop or ClayIconSpriteContext'
		);

		return (
			<svg
				{...otherProps}
				className={classNames(
					`lexicon-icon lexicon-icon-${symbol}`,
					className
				)}
				key={symbol}
				ref={ref}
				role="presentation"
			>
				<use href={`${spriteMapVal}#${symbol}`} />
			</svg>
		);
	}
);

Icon.displayName = 'ClayIcon';

export default Icon;

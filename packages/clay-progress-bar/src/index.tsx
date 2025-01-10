/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import Icon from '@clayui/icon';
import classNames from 'classnames';
import React from 'react';
import warning from 'warning';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
	/**
	 * Flag to indicate if `children` should be wrapped as `feedback`.
	 */
	feedback?: boolean;

	/**
	 * The current value of the progress bar. Should range from 0 to 100.
	 */
	value: number;

	/**
	 * Path to spritemap for icon symbol.
	 */
	spritemap?: string;

	/**
	 * Flag to indicate whether a "warning" color for the bar.
	 */
	warn?: boolean;
}

const ProgressBar = ({
	children,
	className,
	feedback = false,
	spritemap,
	value = 0,
	warn,
	...otherProps
}: IProps) => {
	warning(
		value >= 0 && value <= 100,
		`ClayProgressBar requires \`value\` to be in the range of 0 to 100, it received ${value}.`
	);

	value = Math.min(Math.max(value, 0), 100);

	let addon =
		children ||
		(value === 100 ? (
			<Icon spritemap={spritemap} symbol="check-circle" />
		) : (
			`${value}%`
		));

	if (value === 100 || feedback) {
		addon = <div className="progress-group-feedback">{addon}</div>;
	}

	let status;

	if (warn) {
		status = 'warning';
	} else if (value === 100) {
		status = 'success';
	}

	return (
		<div
			{...otherProps}
			className={classNames(className, 'progress-group', {
				[`progress-${status}`]: status,
			})}
		>
			<div className="progress">
				<div
					aria-valuemax={100}
					aria-valuemin={0}
					aria-valuenow={value}
					className="progress-bar"
					role="progressbar"
					style={{width: `${value}%`}}
				/>
			</div>

			{addon && <div className="progress-group-addon">{addon}</div>}
		</div>
	);
};

export default ProgressBar;

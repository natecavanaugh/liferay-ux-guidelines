/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import classNames from 'classnames';
import React from 'react';

import {AlertProps} from './types';

export type Props = React.HTMLAttributes<HTMLDivElement> & {
	/**
	 * Children of the ToastContainer must be a ClayAlert
	 */
	children?:
		| React.ReactElement<AlertProps>
		| Array<React.ReactElement<AlertProps>>;
};

export const ToastContainer = ({children, className, ...otherProps}: Props) => {
	return (
		<div
			{...otherProps}
			className={classNames(className, 'alert-container container')}
		>
			<div className="alert-notifications alert-notifications-fixed">
				{children}
			</div>
		</div>
	);
};

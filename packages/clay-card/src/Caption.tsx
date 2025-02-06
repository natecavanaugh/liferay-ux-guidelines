/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import classNames from 'classnames';
import React from 'react';

import Context from './Context';

const Caption = ({
	children,
	className,
	...otherProps
}: React.HTMLAttributes<HTMLDivElement | HTMLSpanElement>) => {
	const {interactive} = React.useContext(Context);

	const TagName = interactive ? 'span' : 'div';

	return (
		<TagName
			className={classNames(className, 'card-detail')}
			{...otherProps}
		>
			{children}
		</TagName>
	);
};

export default Caption;

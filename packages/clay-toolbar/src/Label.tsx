/**
 * SPDX-FileCopyrightText: © 2020 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import ClayLabel from '@clayui/label';
import classNames from 'classnames';
import React from 'react';

interface IProps extends React.ComponentProps<typeof ClayLabel> {}

export const Label = ({children, className, ...otherProps}: IProps) => (
	<ClayLabel
		className={classNames(className, 'component-label tbar-label')}
		{...otherProps}
	>
		{children}
	</ClayLabel>
);

Label.displayName = 'ClayToolbarLabel';

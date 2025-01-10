/**
 * SPDX-FileCopyrightText: © 2020 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {ClayInput} from '@clayui/form';
import classNames from 'classnames';
import React from 'react';

interface IProps extends React.ComponentProps<typeof ClayInput> {}

export const Input = ({className, ...otherProps}: IProps) => (
	<ClayInput.Group>
		<ClayInput.GroupItem>
			<ClayInput
				className={classNames(className, 'form-control')}
				type="text"
				{...otherProps}
			/>
		</ClayInput.GroupItem>
	</ClayInput.Group>
);

Input.displayName = 'ClayToolbarInput';

/**
 * SPDX-FileCopyrightText: © 2020 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import React from 'react';

import Container from './Container';

interface IProps
	extends Omit<
		React.ComponentProps<typeof Container>,
		'fluid' | 'fluidSize'
	> {
	size?: React.ComponentProps<typeof Container>['fluidSize'] | false;
}

const ContainerFluid = React.forwardRef<HTMLElement, IProps>(
	({children, size = 'xl', ...otherProps}: IProps, ref) => {
		return (
			<Container
				{...otherProps}
				fluid
				fluidSize={size === false ? undefined : size}
				ref={ref}
			>
				{children}
			</Container>
		);
	}
);

ContainerFluid.displayName = 'ClayContainerFluid';

export default ContainerFluid;

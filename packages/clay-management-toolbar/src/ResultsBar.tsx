/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import ClayLayout from '@clayui/layout';
import React from 'react';

import ResultsBarItem from './ResultsBarItem';

function ResultsBar({
	children,
	...otherProps
}: React.HTMLAttributes<HTMLElement>) {
	return (
		<nav
			{...otherProps}
			className="subnav-tbar subnav-tbar-primary tbar tbar-inline-xs-down"
		>
			<ClayLayout.ContainerFluid>
				<ul className="tbar-nav tbar-nav-wrap">{children}</ul>
			</ClayLayout.ContainerFluid>
		</nav>
	);
}

ResultsBar.Item = ResultsBarItem;

export default ResultsBar;

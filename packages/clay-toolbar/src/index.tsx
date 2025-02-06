/**
 * SPDX-FileCopyrightText: © 2020 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import classNames from 'classnames';
import React from 'react';

import {Action} from './Action';
import {Input} from './Input';
import {Item} from './Item';
import {Label} from './Label';
import {Link} from './Link';
import {Nav} from './Nav';
import {Section} from './Section';

interface IProps extends React.HTMLAttributes<HTMLElement> {
	/**
	 * Adds a helper class that turns the Toolbar inline at a specified breakpoint.
	 */
	inlineBreakpoint?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';

	/**
	 * Determines if the tbar-light class should be added to the Toolbar, making it's background white.
	 */
	light?: boolean;

	/**
	 * Defines if the toolbar should have the `subnav-tbar` class.
	 */
	subnav?:
		| boolean
		| {
				disabled?: boolean;
				displayType?: 'light' | 'primary';
		  };
}

function Toolbar({
	children,
	className,
	inlineBreakpoint,
	light,
	subnav,
	...otherProps
}: IProps) {
	subnav = subnav === true ? {} : subnav;

	const classes = classNames(
		className,
		'tbar',
		{
			'component-tbar': !subnav,
			'subnav-tbar': !!subnav,
			'tbar-light': light,
		},
		subnav && {
			'subnav-tbar-disabled': subnav.disabled,
			[`tbar-inline-${inlineBreakpoint}-down`]: inlineBreakpoint,
			[`subnav-tbar-${subnav.displayType}`]: subnav.displayType,
		}
	);

	return (
		<nav {...otherProps} className={classes}>
			{children}
		</nav>
	);
}

Toolbar.Action = Action;
Toolbar.Item = Item;
Toolbar.Input = Input;
Toolbar.Label = Label;
Toolbar.Link = Link;
Toolbar.Nav = Nav;
Toolbar.Section = Section;

export default Toolbar;

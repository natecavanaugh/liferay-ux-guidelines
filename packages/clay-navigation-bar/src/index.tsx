/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import ClayButton from '@clayui/button';
import ClayIcon from '@clayui/icon';
import ClayLayout from '@clayui/layout';
import {useProvider} from '@clayui/provider';
import {setElementFullHeight, sub} from '@clayui/shared';
import classNames from 'classnames';
import React, {useState} from 'react';
import {CSSTransition} from 'react-transition-group';
import warning from 'warning';

import {Item} from './Item';
import {NavigationBarContext} from './context';

interface IProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, 'aria-current'> {
	/**
	 * Flag to define if the item represents the current page. Disable this
	 * attribute only if there are multiple navigations on the page.
	 */
	itemAriaCurrent?: boolean;

	/**
	 * Children elements received from ClayNavigationBar component.
	 */
	children:
		| Array<React.ReactElement<React.ComponentProps<typeof Item>>>
		| React.ReactElement<React.ComponentProps<typeof Item>>;

	/**
	 * Set a maximum width on container-fluid.
	 */
	fluidSize?:
		| React.ComponentProps<typeof ClayLayout.Container>['fluidSize']
		| false;

	/**
	 * Determines the style of the Navigation Bar
	 */
	inverted?: boolean;

	/**
	 * Defines aria-label messages to display for the screen reader.
	 */
	messages?: {
		close: 'Close';
		open: 'Open';
		trigger: '{0} Menu, Current Page: {1}';
	};

	/**
	 * Path to the location of the spritemap resource.
	 */
	spritemap?: string;

	/**
	 * Set up dropdown's trigger label.
	 */
	triggerLabel: string;
}

function NavigationBar({
	children,
	className,
	fluidSize,
	inverted = false,
	itemAriaCurrent: ariaCurrent = true,
	messages = {
		close: 'Close',
		open: 'Open',
		trigger: '{0} Menu, Current Page: {1}',
	},
	spritemap,
	triggerLabel,
	...otherProps
}: IProps) {
	const [expanded, setExpanded] = useState(false);

	const {prefersReducedMotion} = useProvider();

	const activeElementsCount = React.Children.map(
		children,
		(child) => child.props.active
	).filter(Boolean).length;

	warning(
		activeElementsCount <= 1,
		`ClayNavigationBar expects 0 or 1 active children, but received ${activeElementsCount}`
	);

	return (
		<nav
			{...otherProps}
			className={classNames(
				className,
				'navbar',
				'navbar-collapse-relative',
				'navbar-expand-md',
				'navbar-underline',
				'navigation-bar',
				{
					'navigation-bar-light': !inverted,
					'navigation-bar-secondary': inverted,
				}
			)}
		>
			<NavigationBarContext.Provider
				value={{ariaCurrent: ariaCurrent ? 'page' : null}}
			>
				<ClayLayout.ContainerFluid size={fluidSize}>
					<ClayButton
						aria-expanded={expanded}
						aria-label={sub(messages.trigger, [
							expanded ? messages.close : messages.open,
							triggerLabel ?? '',
						])}
						className={classNames(
							'navbar-toggler',
							'navbar-toggler-link',
							{
								collapsed: !expanded,
							}
						)}
						data-testid="navbarToggler"
						displayType="unstyled"
						onClick={() => setExpanded(!expanded)}
					>
						<span className="navbar-text-truncate">
							{triggerLabel}
						</span>

						<ClayIcon spritemap={spritemap} symbol="caret-bottom" />
					</ClayButton>

					<CSSTransition
						className={classNames('navbar-collapse', {
							collapse: !expanded,
						})}
						classNames={{
							enter: 'collapsing',
							enterActive: `show`,
							enterDone: 'show',
							exit: `show`,
							exitActive: 'collapsing',
						}}
						in={expanded}
						onEnter={(element: HTMLElement) =>
							element.setAttribute('style', `height: 0px`)
						}
						onEntered={(element: HTMLElement) =>
							element.setAttribute('style', `height: auto`)
						}
						onEntering={(element: HTMLElement) =>
							setElementFullHeight(element)
						}
						onExit={(element) => setElementFullHeight(element)}
						onExited={(element) =>
							element.setAttribute('style', `height: auto`)
						}
						onExiting={(element) =>
							element.setAttribute('style', `height: 0px`)
						}
						timeout={prefersReducedMotion ? 0 : 250}
					>
						<div>
							<ClayLayout.ContainerFluid size={fluidSize}>
								<ul className="navbar-nav">{children}</ul>
							</ClayLayout.ContainerFluid>
						</div>
					</CSSTransition>
				</ClayLayout.ContainerFluid>
			</NavigationBarContext.Provider>
		</nav>
	);
}

NavigationBar.Item = Item;

export default NavigationBar;

/**
 * SPDX-FileCopyrightText: © 2023 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {ClayButtonWithIcon} from '@clayui/button';
import {useProvider} from '@clayui/provider';
import {Keys, setElementFullHeight, useId} from '@clayui/shared';
import React, {useContext, useMemo, useRef, useState} from 'react';
import {CSSTransition} from 'react-transition-group';

import {Collection} from '../collection';
import {Nav} from '../nav';
import {useVertical} from './context';

interface IProps<T> extends React.HTMLAttributes<HTMLLIElement> {
	/**
	 * Flag to indicate if item is active.
	 * @deprecated since version 3.94.0 - uses the `active` property on the
	 * root component.
	 */
	active?: boolean;

	/**
	 * The contents of the component.
	 */
	children?: React.ReactNode;

	/**
	 * Link href for item.
	 */
	href?: string;

	/**
	 * Property to inform the dynamic data of the tree.
	 */
	items?: Array<T>;

	/**
	 * @ignore
	 */
	keyValue?: React.Key;

	/**
	 * Properties to pass to the menubar action
	 */
	menubarAction?: {
		ariaLabel: string;
		title: string;
	};

	/**
	 * @ignore
	 */
	textValue?: string;

	/**
	 * @ignore
	 */
	index?: number;

	/**
	 * @ignore
	 * @deprecated
	 */
	initialExpanded?: boolean;
}

function findSelectedNested<T extends object>(items: Array<T>): T | undefined {
	return items.find((item) => {
		if ('active' in item) {
			return true;
		}

		if ('items' in item) {
			return findSelectedNested(
				(item as Record<string, any>)['items'] as Array<T>
			);
		}

		return false;
	});
}

const ParentContext = React.createContext<React.RefObject<
	HTMLButtonElement | HTMLAnchorElement
> | null>(null);

export function Item<T extends Record<string, any>>({
	active: depreactedActive,
	children,
	href,
	index: _,
	initialExpanded,
	items,
	keyValue,
	menubarAction,
	onClick,
	textValue: _textValue,
	...otherProps
}: IProps<T>) {
	const {
		activeKey,
		ariaCurrent = 'page',
		childrenRoot,
		close,
		expandedKeys,
		firstKey,
		open,
		spritemap,
		toggle,
	} = useVertical();

	const {prefersReducedMotion} = useProvider();

	const itemRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
	const menusRef = useRef<HTMLUListElement | null>(null);
	const parentItemRef = useContext(ParentContext);

	// State only for compatibility with the old compositing version where state
	// was kept on each Item instead of centralized with `expandedKeys`.
	const [expanded, setExpanded] = useState(initialExpanded);
	const isOldVersion = typeof initialExpanded !== 'undefined';

	const isExpanded = isOldVersion ? expanded : expandedKeys.has(keyValue!);

	const hasItemSelectedNested = useMemo(() => {
		if (items) {
			return !!findSelectedNested(items);
		}

		return false;
	}, [items]);

	const active = depreactedActive ?? activeKey === keyValue;

	const ariaControlsId = useId();

	return (
		<Nav.Item role="none" {...otherProps}>
			<Nav.Link
				active={active}
				aria-controls={items ? ariaControlsId : undefined}
				aria-current={active ? ariaCurrent ?? undefined : undefined}
				aria-expanded={items ? isExpanded : undefined}
				className={menubarAction ? 'menubar-action-1' : ''}
				collapsed={!isExpanded}
				href={href}
				onClick={(event) => {
					if (onClick) {
						onClick(
							event as unknown as React.MouseEvent<
								HTMLLIElement,
								MouseEvent
							>
						);
					}

					if (isOldVersion) {
						setExpanded(!expanded);
					} else {
						toggle(keyValue!);
					}
				}}
				onKeyDown={(event) => {
					switch (event.key) {
						case Keys.Right: {
							if (items && !isExpanded) {
								if (isOldVersion) {
									setExpanded(true);
								} else {
									open(keyValue!);
								}
							} else if (items && menusRef.current) {
								const firstItemElement =
									menusRef.current.querySelector<HTMLElement>(
										'.nav-link:not([disabled])'
									);
								firstItemElement?.focus();
							}
							break;
						}
						case Keys.Left: {
							if (items && isExpanded) {
								if (isOldVersion) {
									setExpanded(false);
								} else {
									close(keyValue!);
								}
							} else if (!items && parentItemRef) {
								parentItemRef.current?.focus();
							}
							break;
						}
						default:
							break;
					}
				}}
				ref={itemRef}
				role="menuitem"
				showIcon={!!items}
				spritemap={spritemap}
				tabIndex={
					!active &&
					!(hasItemSelectedNested && items && !isExpanded) &&
					!(firstKey === keyValue && typeof activeKey === 'undefined')
						? -1
						: undefined
				}
			>
				{children}
			</Nav.Link>

			{menubarAction && (
				<ClayButtonWithIcon
					aria-label={menubarAction.ariaLabel}
					className="menubar-action"
					displayType="secondary"
					monospaced
					size="xs"
					symbol="plus"
					title={menubarAction.title}
				/>
			)}

			{items && (
				<CSSTransition
					className={isExpanded ? undefined : 'collapse'}
					classNames={{
						enter: 'collapsing',
						enterActive: `show`,
						enterDone: 'show',
						exit: `show`,
						exitActive: 'collapsing',
					}}
					in={isExpanded}
					onEnter={(element: HTMLElement) =>
						element.setAttribute('style', 'height: 0px')
					}
					onEntered={(element: HTMLElement) =>
						element.removeAttribute('style')
					}
					onEntering={(element: HTMLElement) =>
						setElementFullHeight(element)
					}
					onExit={(element) => setElementFullHeight(element)}
					onExiting={(element) =>
						element.setAttribute('style', 'height: 0px')
					}
					timeout={prefersReducedMotion ? 0 : 250}
					unmountOnExit
				>
					<Nav id={ariaControlsId} ref={menusRef} role="menu" stacked>
						<ParentContext.Provider value={itemRef}>
							<Collection<T> items={items} parentKey={keyValue}>
								{childrenRoot.current}
							</Collection>
						</ParentContext.Provider>
					</Nav>
				</CSSTransition>
			)}
		</Nav.Item>
	);
}

Item.displayName = 'Item';

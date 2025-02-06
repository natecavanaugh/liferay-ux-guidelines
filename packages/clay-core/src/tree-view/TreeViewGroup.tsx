/**
 * SPDX-FileCopyrightText: © 2021 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {useProvider} from '@clayui/provider';
import {setElementFullHeight} from '@clayui/shared';
import classNames from 'classnames';
import React from 'react';
import {CSSTransition} from 'react-transition-group';

import {Collection, ICollectionProps} from './Collection';
import {useTreeViewContext} from './context';
import {useItem} from './useItem';

interface ITreeViewGroupProps<T extends Record<string, any>>
	extends ICollectionProps<T>,
		Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {}

const List = React.forwardRef<
	HTMLUListElement,
	React.HTMLAttributes<HTMLUListElement>
>(function ListInner(
	{children, ...otherProps}: React.HTMLAttributes<HTMLUListElement>,
	ref
) {
	return (
		<ul {...otherProps} className="treeview-group" ref={ref} role="group">
			{children}
		</ul>
	);
});

export function Group<T extends Record<any, any>>({
	children,
	className,
	items,
	...otherProps
}: ITreeViewGroupProps<T>) {
	const {expandedKeys} = useTreeViewContext();

	const {prefersReducedMotion} = useProvider();

	const item = useItem();

	return (
		<CSSTransition
			className={classNames('collapse', className, {
				show: expandedKeys.has(item.key),
			})}
			classNames={{
				enter: 'collapsing',
				enterActive: 'show',
				enterDone: 'show',
				exit: 'show',
				exitActive: 'collapsing',
			}}
			data-id={
				typeof item.key === 'number'
					? `number,${item.key}`
					: `string,${item.key}`
			}
			id={item.key}
			in={expandedKeys.has(item.key)}
			onEnter={(element: HTMLElement) =>
				element.setAttribute('style', 'height: 0px')
			}
			onEntered={(element: HTMLElement) =>
				element.removeAttribute('style')
			}
			onEntering={(element: HTMLElement) => setElementFullHeight(element)}
			onExit={(element) => setElementFullHeight(element)}
			onExiting={(element) =>
				element.setAttribute('style', 'height: 0px')
			}
			timeout={prefersReducedMotion ? 0 : 250}
			unmountOnExit
		>
			<div>
				<Collection<T> as={List} items={items} {...otherProps}>
					{children}
				</Collection>
			</div>
		</CSSTransition>
	);
}

Group.displayName = 'ClayTreeViewGroup';

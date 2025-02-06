/**
 * SPDX-FileCopyrightText: © 2023 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {Keys} from '@clayui/shared';
import classNames from 'classnames';
import React, {useCallback, useMemo, useState} from 'react';

import {useFocusWithin} from '../aria';
import {ChildrenFunction, Collection, useCollection} from '../collection';
import {useForwardRef} from '../hooks';
import {Cell} from './Cell';
import {RowContext, useBody, useTable} from './context';

interface IProps<T> extends React.HTMLAttributes<HTMLTableRowElement> {
	/**
	 * Children content to render a dynamic or static content.
	 */
	children: React.ReactNode | ChildrenFunction<T, unknown>;

	/**
	 * This property can be added to the "new" first
	 * or last ClayTable.Row to maintain table styles on the top and bottom sides.
	 */
	delimiter?: 'start' | 'end';

	/**
	 * Applies a divider style inside the row.
	 */
	divider?: boolean;

	/**
	 * Property to render content with dynamic data.
	 */
	items?: Array<T>;

	/**
	 * @ignore
	 */
	keyValue?: React.Key;

	/**
	 * Flag to indicate that the row has children to be loaded lazily when
	 * `onLoadMore` is set.
	 */
	lazy?: boolean;

	/**
	 * @ignore
	 */
	_expandable?: boolean;

	/**
	 * @ignore
	 */
	_index?: number;

	/**
	 * @ignore
	 */
	_level?: number;

	/**
	 * @ignore
	 */
	_size?: number;

	/**
	 * @ignore
	 */
	_item?: T;

	/**
	 * @ignore
	 */
	_loc?: Array<number>;
}

export function Row<T extends Record<string, any>>(
	{
		_expandable,
		_index,
		_item,
		_level,
		_loc,
		_size,
		children,
		className,
		delimiter,
		divider = false,
		items,
		keyValue,
		lazy = false,
		...otherProps
	}: IProps<T>,
	outRef: React.Ref<HTMLTableRowElement>
) {
	const {
		columnsVisibility,
		expandedKeys,
		headCellsCount,
		onExpandedChange,
		onLoadMore,
		treegrid,
		visibleColumns,
	} = useTable();
	const {insert} = useBody();
	const [isFocused, setIsFocused] = useState(false);
	const focusWithinProps = useFocusWithin({
		disabled: !treegrid,
		id: keyValue!,
		onFocusChange: setIsFocused,
	});

	const [isLoading, setIsLoading] = useState(false);

	const loadMore = useCallback(() => {
		if (_expandable || !onLoadMore || !lazy) {
			return;
		}

		setIsLoading(true);
		onLoadMore(_item)
			.then((items) => {
				setIsLoading(false);
				if (!items) {
					return;
				}

				if (Array.isArray(items)) {
					insert([..._loc!, 0], items);
					const newExpandedKeys = new Set(expandedKeys);
					newExpandedKeys.add(keyValue!);
					onExpandedChange(newExpandedKeys);
				}
			})
			.catch((error) => {
				setIsLoading(false);
				console.error(error);
			});
	}, [insert, keyValue, _expandable, onLoadMore, lazy]);

	const ref = useForwardRef(outRef);

	const visibleKeys = useMemo(() => {
		// This is a speculation/inference about the size of items to decide
		// to render a last cell as an action.
		const count = items ? items.length : React.Children.count(children);

		return [
			...Array.from(visibleColumns.values()),
			...(columnsVisibility && count > headCellsCount ? [count - 1] : []),
		];
	}, [columnsVisibility, items?.length, visibleColumns, headCellsCount]);

	const collection = useCollection({
		children,
		items,
		visibleKeys,
	});

	return (
		<tr
			{...otherProps}
			{...focusWithinProps}
			aria-expanded={
				_expandable || lazy ? expandedKeys.has(keyValue!) : undefined
			}
			aria-level={treegrid ? _level : undefined}
			aria-posinset={treegrid ? _index! + 1 : undefined}
			aria-setsize={treegrid ? _size : undefined}
			className={classNames(className, {
				'table-divider': divider,
				[`table-row-${delimiter}`]: delimiter,
				'table-focus': focusWithinProps.tabIndex === 0 && isFocused,
			})}
			data-id={
				typeof keyValue === 'number'
					? `number,${keyValue}`
					: `string,${keyValue}`
			}
			onKeyDown={(event) => {
				if (
					document.activeElement !== ref.current ||
					event.defaultPrevented ||
					(!_expandable && !lazy)
				) {
					return;
				}

				switch (event.key) {
					case Keys.Left: {
						if (expandedKeys.has(keyValue!)) {
							const newExpandedKeys = new Set(expandedKeys);
							newExpandedKeys.delete(keyValue!);
							onExpandedChange(newExpandedKeys);
						}
						break;
					}
					case Keys.Right: {
						if (onLoadMore && lazy && !_expandable) {
							loadMore();
						} else {
							if (!expandedKeys.has(keyValue!)) {
								const newExpandedKeys = new Set(expandedKeys);
								newExpandedKeys.add(keyValue!);
								onExpandedChange(newExpandedKeys);
							}
						}
						break;
					}
					default:
						break;
				}
			}}
			ref={ref}
			role={treegrid ? 'row' : undefined}
		>
			<RowContext.Provider
				value={{
					divider,
					expandable: _expandable,
					isLoading,
					key: keyValue!,
					lazy,
					level: _level!,
					loadMore,
				}}
			>
				<Collection collection={collection} />

				{columnsVisibility &&
					!divider &&
					collection.getSize() === headCellsCount && (
						<Cell
							index={headCellsCount}
							keyValue={`${keyValue}:visibility`}
						>
							{null}
						</Cell>
					)}
			</RowContext.Provider>
		</tr>
	);
}

type ForwardRef = {
	displayName: string;
	<T>(props: IProps<T> & {ref?: React.Ref<HTMLTableRowElement>}): JSX.Element;
};

export const ForwardRow = React.forwardRef(Row) as ForwardRef;

ForwardRow.displayName = 'TableRow';

// @ts-ignore
ForwardRow.passthroughKey = true;

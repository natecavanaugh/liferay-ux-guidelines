/**
 * SPDX-FileCopyrightText: © 2023 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {sub, useControlledState, useId} from '@clayui/shared';
import RootTable from '@clayui/table';
import classNames from 'classnames';
import React, {useCallback, useRef, useState} from 'react';
import {createPortal} from 'react-dom';

import {FocusWithinProvider} from '../aria';
import {useForwardRef} from '../hooks';
import {LiveAnnouncer} from '../live-announcer';
import {Sorting, TableContext} from './context';
import {useTreeNavigation} from './useTreeNavigation';

import type {AnnouncerAPI} from '../live-announcer';

interface IProps extends React.HTMLAttributes<HTMLTableElement> {
	/**
	 * Defines the columns that are always visible and will be ignored by the
	 * visible columns functionality.
	 */
	alwaysVisibleColumns?: Set<React.Key>;

	/**
	 * Flag to enable column visibility control.
	 */
	columnsVisibility?: boolean;

	/**
	 * Property to set the initial value of `expandedKeys` (uncontrolled).
	 */
	defaultExpandedKeys?: Set<React.Key>;

	/**
	 * Default state of sort (uncontrolled).
	 */
	defaultSort?: Sorting | null;

	/**
	 * Default value for visible columns in the table (uncontrolled).
	 */
	defaultVisibleColumns?: Map<React.Key, number>;

	/**
	 * The currently expanded keys in the collection (controlled).
	 */
	expandedKeys?: Set<React.Key>;

	/**
	 * Defines which columns are visible in the table (controlled).
	 */
	visibleColumns?: Map<React.Key, number>;

	/**
	 * Texts used for assertive messages to SRs.
	 */
	messages?: {
		columnsVisibility: string;
		columnsVisibilityDescription: string;
		columnsVisibilityHeader: string;
		expandable: string;
		sortDescription: string;
		sorting: string;
	};

	/**
	 * A callback that is called when items are expanded or collapsed
	 * (controlled).
	 */
	onExpandedChange?: (keys: Set<React.Key>) => void;

	/**
	 * When a tree is very large, loading items (nodes) asynchronously is preferred to
	 * decrease the initial payload and memory space. The callback is called every time
	 * the item is a leaf node of the tree.
	 */
	onLoadMore?: (item: unknown) => Promise<Array<any> | undefined>;

	/**
	 * Callback for when the sorting change (controlled).
	 */
	onSortChange?: (sorting: Sorting | null) => void;

	/**
	 * Callback called when columns visibility changes (controlled).
	 */
	onVisibleColumnsChange?: (columns: Map<React.Key, number>) => void;

	/**
	 * Current state of sort (controlled).
	 */
	sort?: Sorting | null;

	/**
	 * Flag to indicate which key name matches the nested rendering of the tree.
	 */
	nestedKey?: string;

	/**
	 * Defines which key should be used as the item identifier.
	 */
	itemIdKey?: string;

	/**
	 * Defines the size of the table.
	 */
	size?: 'sm' | 'lg';

	/**
	 * This property vertically align the contents
	 * inside the table body according a given position.
	 */
	bodyVerticalAlignment?: 'bottom' | 'middle' | 'top';

	/**
	 * Applies a Bordered style on Table's columns.
	 */
	borderedColumns?: boolean;

	/**
	 * Removes the default border and rounded corners from table.
	 */
	borderless?: boolean;

	/**
	 * This property keeps all the headings on one line.
	 */
	headingNoWrap?: boolean;

	/**
	 * This property vertically align the contents
	 * inside the table header according a given position.
	 */
	headVerticalAlignment?: 'bottom' | 'middle' | 'top';

	/**
	 * Applies a Hover style on Table.
	 */
	hover?: boolean;

	/**
	 * This property enables keeping everything on one line.
	 */
	noWrap?: boolean;

	/**
	 * Turns the table responsive.
	 */
	responsive?: boolean;

	/**
	 * Defines the responsive sizing.
	 */
	responsiveSize?: 'lg' | 'md' | 'sm' | 'xl';

	/**
	 * Applies a Striped style on Table.
	 */
	striped?: boolean;

	/**
	 * This property vertically align the contents
	 * inside the table according a given position.
	 */
	tableVerticalAlignment?: 'bottom' | 'middle' | 'top';
}

const focusableElements = ['[role="row"]', 'td[role="gridcell"]'];
const locator = {
	cell: 'gridcell',
	row: 'row',
};
const defaultSet = new Set<React.Key>();

export const Table = React.forwardRef(
	(
		{
			alwaysVisibleColumns = new Set(),
			columnsVisibility = true,
			children,
			className,
			defaultExpandedKeys = defaultSet,
			defaultSort,
			defaultVisibleColumns = new Map(),
			expandedKeys: externalExpandedKeys,
			itemIdKey = 'id',
			messages = {
				columnsVisibility: 'Manage Columns Visibility',
				columnsVisibilityDescription:
					'At least one column must remain visible.',
				columnsVisibilityHeader: 'Columns Visibility',
				expandable: 'expandable',
				sortDescription: 'sortable column',
				sorting: 'sorted by column {0} in {1} order',
			},
			visibleColumns: externalVisibleColumns,
			onExpandedChange,
			onVisibleColumnsChange,
			onLoadMore,
			onSortChange,
			size,
			sort: externalSort,
			nestedKey,
			...otherProps
		}: IProps,
		outRef: React.Ref<HTMLTableElement>
	) => {
		const [expandedKeys, setExpandedKeys] = useControlledState<
			Set<React.Key>
		>({
			defaultName: 'defaultExpandedKeys',
			defaultValue: defaultExpandedKeys,
			handleName: 'onExpandedChange',
			name: 'expandedKeys',
			onChange: onExpandedChange,
			value: externalExpandedKeys,
		});

		const [sort, setSorting] = useControlledState({
			defaultName: 'defaultSort',
			defaultValue: defaultSort,
			handleName: 'onSortChange',
			name: 'sort',
			onChange: onSortChange,
			value: externalSort,
		});

		const [visibleColumns, setVisibleColumns] = useControlledState({
			defaultName: 'defaultVisibleColumns',
			defaultValue: defaultVisibleColumns,
			handleName: 'onVisibleColumnsChange',
			name: 'visibleColumns',
			onChange: onVisibleColumnsChange,
			value: externalVisibleColumns,
		});

		const ref = useForwardRef(outRef);
		const announcerAPI = useRef<AnnouncerAPI>(null);

		const {navigationProps} = useTreeNavigation({
			disabled: !nestedKey,
			locator,
			ref,
		});

		const sortDescriptionId = useId();

		const [headCellsCount, setHeadCellsCount] = useState(0);

		return (
			<RootTable
				{...otherProps}
				{...navigationProps}
				className={classNames(className, {
					'table-nested-rows': nestedKey,
					[`table-${size}`]: size,
					'table-sort': sort || sort === null,
				})}
				ref={ref}
				role={nestedKey ? 'treegrid' : undefined}
				style={{
					tableLayout: 'fixed',
				}}
				tableVerticalAlignment="middle"
			>
				<LiveAnnouncer ref={announcerAPI} />

				<FocusWithinProvider
					containerRef={ref}
					focusableElements={focusableElements}
				>
					<TableContext.Provider
						value={{
							alwaysVisibleColumns,
							columnsVisibility,
							expandedKeys,
							headCellsCount,
							itemIdKey,
							messages,
							nestedKey,
							onExpandedChange: setExpandedKeys,
							onHeadCellsChange: setHeadCellsCount,
							onLoadMore,
							onSortChange: useCallback(
								(sort, textValue) => {
									announcerAPI.current!.announce(
										sub(messages!.sorting, [
											textValue,
											sort!.direction,
										])
									);
									setSorting(sort);
								},
								[setSorting]
							),
							onVisibleColumnsChange: useCallback(
								(
									column: React.Key | Array<React.Key>,
									index: number
								) => {
									if (Array.isArray(column)) {
										const columns = new Map(visibleColumns);

										column.forEach((value, index) => {
											if (columns.has(value)) {
												columns.delete(value);
											} else {
												columns.set(value, index);
											}
										});

										setVisibleColumns(columns);

										return;
									}

									const columns = new Map(visibleColumns);

									if (columns.has(column)) {
										columns.delete(column);
									} else {
										columns.set(column, index);
									}

									setVisibleColumns(columns);
								},
								[setVisibleColumns, visibleColumns]
							),
							sort,
							sortDescriptionId,
							treegrid: !!nestedKey,
							visibleColumns,
						}}
					>
						{children}
					</TableContext.Provider>
				</FocusWithinProvider>

				{createPortal(
					<div
						aria-hidden="true"
						id={sortDescriptionId}
						style={{display: 'none'}}
					>
						{messages!.sortDescription}
					</div>,
					document.body
				)}
			</RootTable>
		);
	}
);

Table.displayName = 'Table';

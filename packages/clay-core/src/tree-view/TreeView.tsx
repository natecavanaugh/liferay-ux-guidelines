/**
 * SPDX-FileCopyrightText: © 2021 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {isAppleDevice, useNavigation} from '@clayui/shared';
import classNames from 'classnames';
import React, {useRef} from 'react';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';

import {FocusWithinProvider} from '../aria';
import {ChildrenFunction, Collection, ICollectionProps} from './Collection';
import {DragAndDropMessages, DragAndDropProvider} from './DragAndDrop';
import DragLayer from './DragLayer';
import {Group} from './TreeViewGroup';
import {Item, ItemStack} from './TreeViewItem';
import {Icons, MoveItemIndex, OnLoadMore, TreeViewContext} from './context';
import {ITreeProps, useTree} from './useTree';

interface ITreeViewProps<T extends Record<string, any>>
	extends Omit<
			React.HTMLAttributes<HTMLUListElement>,
			'children' | 'onSelect'
		>,
		ITreeProps<T>,
		ICollectionProps<T> {
	/**
	 * Flag to determine which style the TreeView will display.
	 */
	displayType?: 'light' | 'dark';

	/**
	 * Flag to enable Drag and Drop of Nodes over the Tree.
	 */
	dragAndDrop?: boolean;

	/**
	 * Optional drag and drop context: this is to avoid
	 * errors when using various drag and drop contexts
	 * on the same page.
	 */
	dragAndDropContext?: Window & typeof globalThis;

	/**
	 * Flag to expand the node's children when double-clicking the node.
	 */
	expandDoubleClick?: boolean;

	/**
	 * Flag to expand child nodes when a parent node is checked.
	 */
	expandOnCheck?: boolean;

	/**
	 * Extra classes passed to the expander button.
	 */
	expanderClassName?: string;

	/**
	 * Flag to modify Node expansion state icons.
	 */
	expanderIcons?: Icons;

	/**
	 * Flag to indicate which key name matches the item name to be displayed
	 * in drag preview.
	 */
	itemNameKey?: string;

	/**
	 * Messages that the TreeView uses to announce to the screen reader. Use
	 * this to handle internationalization.
	 */
	messages?: DragAndDropMessages;

	/**
	 * The callback is called whenever there is an item dragging over
	 * another item.
	 */
	onItemHover?: (item: T, parentItem: T, index: MoveItemIndex) => boolean;

	/**
	 * Callback is called when an item is about to be moved elsewhere in the tree.
	 */
	onItemMove?: (item: T, parentItem: T, index: MoveItemIndex) => boolean;

	/**
	 * When a tree is very large, loading items (nodes) asynchronously is preferred to
	 * decrease the initial payload and memory space. The callback is called every time
	 * the item is a leaf node of the tree.
	 */
	onLoadMore?: OnLoadMore<T>;

	/**
	 * Callback called whenever an item is selected. Similar to the `onSelectionChange`
	 * callback but instead of passing the selected keys it is called with the current
	 * item being selected.
	 */
	onSelect?: (item: T) => void;

	/**
	 * Calback is called when the user presses the R or F2 hotkey.
	 */
	onRenameItem?: (item: T) => Promise<T>;

	/**
	 * Flag changes the Node selection behavior when a checkbox is rendered on the Node.
	 * - single: select only node.
	 * - multiple: select multiple nodes.
	 * - multiple-recursive: selects multiple nodes and recursively.
	 */
	selectionMode?: 'single' | 'multiple' | 'multiple-recursive' | null;

	/**
	 * Flag to indicate if the TreeView will show the expander in the hover in the Node.
	 */
	showExpanderOnHover?: boolean;
}

const focusableElements = ['.treeview-link[tabindex]'];

const Application = ({children}: {children: React.ReactNode}) => (
	<div role="application">{children}</div>
);

export function TreeView<T extends Record<string, any>>({
	children,
	className,
	defaultExpandedKeys,
	defaultItems,
	defaultSelectedKeys,
	displayType = 'light',
	dragAndDrop = false,
	dragAndDropContext = window,
	expandDoubleClick = false,
	expandedKeys,
	expanderClassName,
	expanderIcons,
	expandOnCheck = false,
	indeterminate = true,
	itemNameKey = 'name',
	items,
	messages,
	nestedKey = 'children',
	onExpandedChange,
	onItemHover,
	onItemMove,
	onItemsChange,
	onLoadMore,
	onRenameItem,
	onSelect,
	onSelectionChange,
	selectedKeys,
	selectionHydrationMode = 'hydrate-first',
	selectionMode = 'single',
	showExpanderOnHover = true,
	...otherProps
}: ITreeViewProps<T>) {
	const rootRef = useRef<HTMLUListElement>(null);

	const state = useTree<T>({
		defaultExpandedKeys,
		defaultItems,
		defaultSelectedKeys,
		expandedKeys,
		indeterminate,
		items,
		nestedKey,
		onExpandedChange,
		onItemsChange,
		onSelectionChange,
		selectedKeys,
		selectionHydrationMode,
		selectionMode,
	});

	const childrenRootRef = useRef(
		typeof children === 'function'
			? (children as ChildrenFunction<Object>)
			: null
	);

	const context = {
		childrenRoot: childrenRootRef,
		dragAndDrop,
		expandDoubleClick,
		expandOnCheck,
		expanderClassName,
		expanderIcons,
		nestedKey,
		onItemHover,
		onItemMove,
		onLoadMore,
		onRenameItem,
		onSelect,
		rootRef,
		selectionMode,
		showExpanderOnHover,
		...state,
	};

	const {navigationProps} = useNavigation({
		containerRef: rootRef,
		focusableElements,
		orientation: 'vertical',
		typeahead: true,
		visible: true,
	});

	const Container = isAppleDevice() ? React.Fragment : Application;

	return (
		<Container>
			<ul
				{...otherProps}
				{...navigationProps}
				className={classNames(
					'treeview show-quick-actions-on-hover',
					className,
					{
						[`treeview-${displayType}`]: displayType,
						'show-component-expander-on-hover': showExpanderOnHover,
					}
				)}
				ref={rootRef}
				role="tree"
				tabIndex={-1}
			>
				<DndProvider
					backend={HTML5Backend}
					context={dragAndDropContext}
				>
					<TreeViewContext.Provider value={context}>
						<DragAndDropProvider<T>
							messages={messages}
							nestedKey={nestedKey}
							onItemHover={onItemHover}
							onItemMove={onItemMove}
							rootRef={rootRef}
						>
							<FocusWithinProvider
								containerRef={rootRef}
								focusableElements={focusableElements}
							>
								<Collection<T> items={state.items}>
									{children}
								</Collection>
								<DragLayer itemNameKey={itemNameKey} />
							</FocusWithinProvider>
						</DragAndDropProvider>
					</TreeViewContext.Provider>
				</DndProvider>
			</ul>
		</Container>
	);
}

TreeView.Group = Group;
TreeView.Item = Item;
TreeView.ItemStack = ItemStack;

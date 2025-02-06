/**
 * SPDX-FileCopyrightText: © 2023 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import Button from '@clayui/button';
import {ClayToggle as Toggle} from '@clayui/form';
import Icon from '@clayui/icon';
import Layout from '@clayui/layout';
import React, {useEffect, useLayoutEffect} from 'react';

import {ChildrenFunction, Collection, useCollection} from '../collection';
import {Item, Menu} from '../drop-down';
import {Cell} from './Cell';
import {Scope, ScopeContext} from './ScopeContext';
import {useTable} from './context';

type HeaderProps = {
	name: string;
	description: string;
};

const Header = React.forwardRef<HTMLLIElement, HeaderProps>(
	function HeaderInner({description, name}: HeaderProps, ref) {
		return (
			<li key={name} ref={ref} role="presentation" tabIndex={-1}>
				<div className="dropdown-subheader mb-0">
					{name.toUpperCase()}
				</div>
				<div className="dropdown-section py-0 text-secondary">
					{description}
				</div>
				<div className="dropdown-divider" />
			</li>
		);
	}
);

const useIsomorphicEffect =
	typeof window === 'undefined' ? useEffect : useLayoutEffect;

interface IProps<T> extends React.TableHTMLAttributes<HTMLTableSectionElement> {
	/**
	 * Children content to render a dynamic or static content.
	 */
	children: React.ReactNode | ChildrenFunction<T, unknown>;

	/**
	 * Property to render content with dynamic data.
	 */
	items?: Array<T>;
}

export function Head<T extends Record<string, any>>(
	{children, items, ...otherProps}: IProps<T>,
	ref: React.Ref<HTMLTableSectionElement>
) {
	const {
		alwaysVisibleColumns,
		columnsVisibility,
		messages,
		onHeadCellsChange,
		onVisibleColumnsChange,
		visibleColumns,
	} = useTable();

	const collection = useCollection<T>({
		children,
		items,
		suppressTextValueWarning: false,
		visibleKeys: new Set(visibleColumns.keys()),
	});

	useIsomorphicEffect(() => {
		if (visibleColumns.size === 0) {
			onVisibleColumnsChange(collection.getItems(), 0);
		}
		onHeadCellsChange(collection.getSize());
	}, [collection.getSize()]);

	return (
		<thead {...otherProps} ref={ref}>
			<ScopeContext.Provider value={Scope.Head}>
				<tr>
					<Collection<T> collection={collection} />

					{columnsVisibility && (
						<Cell keyValue="visibility" width="72px">
							<Menu
								UNSAFE_focusableElements={[
									'input[role="switch"]',
								]}
								alwaysClose={false}
								items={[
									{
										description:
											messages[
												'columnsVisibilityDescription'
											]!,
										name: messages[
											'columnsVisibilityHeader'
										]!,
									},
									...collection
										.getItems()
										.filter(
											(item) =>
												!alwaysVisibleColumns.has(item)
										),
								]}
								style={{
									maxWidth: '210px',
									minWidth: '210px',
								}}
								trigger={
									<Button
										aria-label={
											messages['columnsVisibility']
										}
										borderless
										displayType="secondary"
										monospaced
										title={messages['columnsVisibility']}
									>
										<Icon symbol="caret-bottom" />
									</Button>
								}
							>
								{(item) =>
									typeof item === 'object' ? (
										<Header
											description={item.description}
											key={item.name}
											name={item.name}
										/>
									) : (
										<Item
											key={item}
											onClick={() => {
												if (
													visibleColumns.has(item) &&
													visibleColumns.size === 1
												) {
													return;
												}

												onVisibleColumnsChange(
													item,
													collection.getItem(item)
														.index
												);
											}}
											tabIndex={-1}
											textValue={
												collection.getItem(item).value
											}
										>
											<Layout.ContentRow verticalAlign="center">
												<Layout.ContentCol expand>
													{
														collection.getItem(item)
															.value
													}
												</Layout.ContentCol>
												<Layout.ContentCol float="end">
													<Toggle
														containerProps={{
															style: {
																marginBottom: 0,
															},
														}}
														disabled={
															visibleColumns.has(
																item
															) &&
															visibleColumns.size -
																alwaysVisibleColumns.size ===
																1
														}
														onChange={(event) => {
															event.stopPropagation();

															onVisibleColumnsChange(
																item,
																collection.getItem(
																	item
																).index
															);
														}}
														onKeyDown={(event) => {
															switch (event.key) {
																case 'Enter':
																	onVisibleColumnsChange(
																		item,
																		collection.getItem(
																			item
																		).index
																	);
																	break;
																default:
																	break;
															}
														}}
														sizing="sm"
														toggled={visibleColumns.has(
															item
														)}
													/>
												</Layout.ContentCol>
											</Layout.ContentRow>
										</Item>
									)
								}
							</Menu>
						</Cell>
					)}
				</tr>
			</ScopeContext.Provider>
		</thead>
	);
}

type ForwardRef = {
	displayName: string;
	<T>(
		props: IProps<T> & {ref?: React.Ref<HTMLTableSectionElement>}
	): JSX.Element;
};

export const ForwardHead = React.forwardRef(Head) as ForwardRef;

ForwardHead.displayName = 'TableHead';

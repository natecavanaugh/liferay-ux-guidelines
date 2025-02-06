/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {__NOT_PUBLIC_COLLECTION} from '@clayui/core';
import classnames from 'classnames';
import React, {useCallback, useContext} from 'react';

import {DropDownContext} from './DropDownContext';

import type {ICollectionProps} from '@clayui/core';

const {Collection} = __NOT_PUBLIC_COLLECTION;

interface IProps<T>
	extends Omit<ICollectionProps<T, unknown>, 'virtualize'>,
		Omit<React.HTMLAttributes<HTMLUListElement>, 'children'> {}

const ItemList = React.forwardRef<HTMLUListElement, IProps<unknown>>(
	({children, className, items, role = 'menu', ...otherProps}, ref) => {
		const {search} = useContext(DropDownContext);

		const filterFn = useCallback(
			(value: string) => value.match(new RegExp(search, 'i')) !== null,
			[search]
		);

		return (
			<ul
				{...otherProps}
				className={classnames('list-unstyled', className)}
				ref={ref}
				role={role}
			>
				<Collection<any>
					filter={filterFn}
					filterKey="textValue"
					items={items}
					passthroughKey={false}
				>
					{children}
				</Collection>
			</ul>
		);
	}
);

ItemList.displayName = 'ClayDropDownItemList';

export default ItemList;

/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {__NOT_PUBLIC_COLLECTION} from '@clayui/core';
import React, {useCallback, useContext, useMemo} from 'react';

import {DropDownContext} from './DropDownContext';

import type {ICollectionProps} from '@clayui/core';

const {Collection} = __NOT_PUBLIC_COLLECTION;

interface IProps<T> extends Omit<ICollectionProps<T, unknown>, 'virtualize'> {
	/**
	 * Value provided is a display component that is a header for the items in the group.
	 */
	header?: string;

	/**
	 * ARIA to define semantic meaning to content.
	 */
	role?: string;
}

let counter = 0;

function Group<T>({children, header, items, role = 'group'}: IProps<T>) {
	const ariaLabel = useMemo(() => {
		counter++;

		return `clay-dropdown-menu-group-${counter}`;
	}, []);

	const {search} = useContext(DropDownContext);

	const filterFn = useCallback(
		(value: string) => value.match(new RegExp(search, 'i')) !== null,
		[search]
	);

	return (
		<>
			{header && (
				<li
					aria-hidden="true"
					className="dropdown-subheader"
					id={ariaLabel}
					role="presentation"
				>
					{header}
				</li>
			)}

			<li role="presentation">
				<ul
					aria-labelledby={ariaLabel}
					className="list-unstyled"
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
			</li>
		</>
	);
}

Group.displayName = 'Group';

export default Group;

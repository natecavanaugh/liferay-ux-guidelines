/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import Button from '@clayui/button';
import {__EXPERIMENTAL_MENU} from '@clayui/core';
import {AlignPoints, sub} from '@clayui/shared';
import React from 'react';

const {Item, Menu} = __EXPERIMENTAL_MENU;

type Props = {
	'aria-label'?: string;
	alignmentPosition?: number | AlignPoints;
	disabled?: boolean;
	disabledPages?: Array<number>;
	hrefConstructor?: (page?: number) => string;
	items?: Array<number>;
	onPageChange?: (page?: number) => void;
	title?: string;
};

export const Ellipsis = ({
	alignmentPosition: _alignmentPosition,
	disabled = false,
	disabledPages = [],
	hrefConstructor,
	items = [],
	onPageChange,
	...otherProps
}: Props) => {
	const ariaLabel =
		otherProps['aria-label'] && !disabled
			? sub(otherProps['aria-label'], [
					String(items[0]),
					String(items[items.length - 1]),
			  ])
			: undefined;

	const title =
		otherProps['title'] && !disabled
			? sub(otherProps['title'], [
					String(items[0]),
					String(items[items.length - 1]),
			  ])
			: undefined;

	return (
		<li className="page-item">
			<Menu
				disabled={disabled}
				items={items}
				trigger={
					<Button
						{...otherProps}
						aria-label={ariaLabel}
						className="page-link"
						displayType="unstyled"
						title={title}
					>
						...
					</Button>
				}
			>
				{(item) => (
					<Item
						disabled={disabledPages.includes(item)}
						href={
							hrefConstructor ? hrefConstructor(item) : undefined
						}
						key={item}
						onClick={() => onPageChange && onPageChange(item)}
					>
						{String(item)}
					</Item>
				)}
			</Menu>
		</li>
	);
};

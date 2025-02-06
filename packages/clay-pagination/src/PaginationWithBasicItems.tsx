/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import ClayIcon from '@clayui/icon';
import {
	AlignPoints,
	InternalDispatch,
	getEllipsisItems,
	sub,
	useControlledState,
} from '@clayui/shared';
import React from 'react';

import {Pagination} from './Pagination';

const ELLIPSIS_BUFFER = 2;

interface IProps extends React.ComponentProps<typeof Pagination> {
	/**
	 * Sets the currently active page (controlled).
	 */
	active?: number;

	/**
	 * The page that is currently active. The first page is `1`.
	 * @deprecated since v3.49.0 - use `active` instead.
	 */
	activePage?: number;

	/**
	 * Sets the default DropDown position of the component. The component
	 * receives the Align constant values from the `@clayui/drop-down` package.
	 */
	alignmentPosition?: number | AlignPoints;

	/**
	 * Labels for the aria attributes
	 */
	ariaLabels?: {
		link: string;
		previous: string;
		next: string;
	};

	/**
	 * The number of pages to show on each side of the active page before
	 * using an ellipsis dropdown.
	 */
	ellipsisBuffer?: number;

	/**
	 * Properties to pass to the ellipsis trigger.
	 */
	ellipsisProps?: {} | undefined;

	/**
	 * Sets the default active page (uncontrolled).
	 */
	defaultActive?: number;

	/**
	 * Flag to disable ellipsis button
	 */
	disableEllipsis?: boolean;

	/**
	 * The page numbers that should be disabled. For example, `[2,5,6]`.
	 */
	disabledPages?: Array<number>;

	/**
	 * Function used to create the href provided for each page link.
	 */
	hrefConstructor?: (page?: number) => string;

	/**
	 * Callback called when the state of the active page changes (controlled).
	 * This is only used if an href is not provided.
	 */
	onActiveChange?: InternalDispatch<number>;

	/**
	 * Callback for when the active page changes. This is only used if
	 * an href is not provided.
	 * @deprecated since v3.49.0 - use `onActiveChange` instead.
	 */
	onPageChange?: InternalDispatch<number>;

	/**
	 * The total number of pages in the pagination list.
	 */
	totalPages: number;

	/**
	 * Path to spritemap from clay-css.
	 */
	spritemap?: string;
}

export const ClayPaginationWithBasicItems = React.forwardRef(
	function ClayPaginationWithBasicItems(
		{
			active,
			activePage,
			alignmentPosition,
			ariaLabels = {
				link: 'Go to page, {0}',
				next: 'Go to the next page, {0}',
				previous: 'Go to the previous page, {0}',
			},
			defaultActive,
			disabledPages = [],
			disableEllipsis = false,
			ellipsisBuffer = ELLIPSIS_BUFFER,
			ellipsisProps = {
				'aria-label': 'Show pages {0} through {1}',
				title: 'Show pages {0} through {1}',
			},
			hrefConstructor,
			onActiveChange,
			onPageChange,
			spritemap,
			totalPages,
			...otherProps
		}: IProps,
		ref: React.Ref<HTMLUListElement>
	) {
		if (totalPages === 0) {
			totalPages = 1;
		}

		const [internalActive, setActive] = useControlledState({
			defaultName: 'defaultActive',
			defaultValue: defaultActive,
			handleName: 'onActiveChange',
			name: 'value',
			onChange: onActiveChange ?? onPageChange,
			value: typeof active === 'undefined' ? activePage : active,
		});

		const previousPage = internalActive - 1;
		const previousHref = hrefConstructor && hrefConstructor(previousPage);

		const nextPage = internalActive + 1;
		const nextHref = hrefConstructor && hrefConstructor(nextPage);

		const pages = Array(totalPages)
			.fill(0)
			.map((_item, index) => index + 1);

		return (
			<Pagination {...otherProps} ref={ref}>
				<Pagination.Item
					aria-label={
						internalActive !== 1
							? sub(ariaLabels.previous, [previousPage])
							: undefined
					}
					as={internalActive === 1 ? 'div' : undefined}
					data-testid="prevArrow"
					disabled={internalActive === 1}
					href={previousHref}
					onClick={() => setActive(previousPage)}
					role={
						previousHref || internalActive === 1
							? undefined
							: 'button'
					}
				>
					<ClayIcon spritemap={spritemap} symbol="angle-left" />
				</Pagination.Item>

				{(ellipsisBuffer
					? getEllipsisItems(
							{
								EllipsisComponent: Pagination.Ellipsis,
								ellipsisProps: {
									...ellipsisProps,
									alignmentPosition,
									disabled: disableEllipsis,
									disabledPages,
									hrefConstructor,
									onPageChange: setActive,
								},
								items: pages,
							},
							ellipsisBuffer,
							internalActive - 1
					  )
					: pages
				).map((page: number | JSX.Element | Object, index: number) =>
					React.isValidElement(page) ? (
						React.cloneElement(page, {key: `ellipsis${index}`})
					) : (
						<Pagination.Item
							active={page === internalActive}
							aria-label={sub(ariaLabels.link, [page as number])}
							disabled={disabledPages.includes(page as number)}
							href={
								hrefConstructor &&
								hrefConstructor(page as number)
							}
							key={page as number}
							onClick={() => setActive(page as number)}
						>
							{page}
						</Pagination.Item>
					)
				)}

				<Pagination.Item
					aria-label={
						internalActive !== totalPages
							? sub(ariaLabels.next, [nextPage])
							: undefined
					}
					as={internalActive === totalPages ? 'div' : undefined}
					data-testid="nextArrow"
					disabled={internalActive === totalPages}
					href={nextHref}
					onClick={() => setActive(nextPage)}
					role={
						nextHref || internalActive === totalPages
							? undefined
							: 'button'
					}
				>
					<ClayIcon spritemap={spritemap} symbol="angle-right" />
				</Pagination.Item>
			</Pagination>
		);
	}
);

ClayPaginationWithBasicItems.displayName = 'ClayPaginationWithBasicItems';

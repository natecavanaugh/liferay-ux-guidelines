/**
 * © 2019 Liferay, Inc. <https://liferay.com>
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from 'react';
import classNames from 'classnames';

interface CellProps extends TableCellBaseProps {
	/**
	 * Aligns the text inside the Cell.
	 */
	align?: TextCellAlignmentType;

	/**
	 * Sometimes we are unable to remove specific table columns from the DOM
	 * and need to hide it using CSS. This property can be added to the "new"
	 * first or last cell to maintain table styles on the left and right side.
	 */
	cellDelimiter?: CellDelimiterType;

	/**
	 * Aligns horizontally contents inside the Cell.
	 */
	columnTextAlignment?: ColumnTextAlignmentType;

	children?:
		| React.ReactElement<HTMLElement>[]
		| React.ReactElement<HTMLElement>
		| React.ReactText;

	/**
	 * Fills out the remaining space inside a Cell.
	 */
	expanded?: boolean;

	/**
	 * Defines the type of the Cell element, if true,
	 * cell element will be a `<th>`, otherwise `<td>`.
	 */
	headingCell?: boolean;

	/**
	 * Applies a style of heading inside a child of table
	 * header cell element.
	 */
	headingTitle?: boolean;
}

type CellDelimiterType = 'start' | 'end';

type ColumnTextAlignmentType = 'center' | 'end' | 'start';

type TextCellAlignmentType = 'center' | 'left' | 'right';

export type TableCellBaseProps = React.ThHTMLAttributes<
	HTMLTableHeaderCellElement
> &
	React.TdHTMLAttributes<HTMLTableDataCellElement>;

export type TableCellType = React.FunctionComponent<CellProps>;

const Cell: React.FunctionComponent<CellProps> = ({
	align,
	cellDelimiter,
	children,
	className,
	columnTextAlignment,
	expanded,
	headingCell = false,
	headingTitle = false,
	...otherProps
}) => {
	const TagName = headingCell ? 'th' : 'td';

	return (
		<TagName
			{...otherProps}
			className={classNames(className, {
				'table-cell-expand': expanded,
				[`table-cell-${cellDelimiter}`]: cellDelimiter,
				[`table-column-text-${columnTextAlignment}`]: columnTextAlignment,
				'table-focus': headingCell,
				[`text-${align}`]: align,
			})}
		>
			{headingTitle
				? React.Children.map(children, (child, i) =>
						React.cloneElement(
							<p className="table-list-title">{child}</p>,
							{key: i}
						)
				  )
				: children}
		</TagName>
	);
};

export default Cell;

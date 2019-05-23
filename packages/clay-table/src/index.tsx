/**
 * © 2019 Liferay, Inc. <https://liferay.com>
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as React from 'react';
import classNames from 'classnames';

import Body, {TableBodyType} from './Body';
import Cell, {TableCellType} from './Cell';
import Head, {TableHeadType} from './Head';
import Row, {TableRowType} from './Row';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
	/**
	 * This property vertically align the contents
	 * inside the table body according a given position.
	 */
	bodyVerticalAlignment?: VerticalAlignmentType;

	/**
	 * Applies a Bordered style on Table.
	 */
	bordered?: boolean;

	/**
	 * This property keeps all the headings on one line.
	 */
	headingNoWrap?: boolean;

	/**
	 * This property vertically align the contents
	 * inside the table header according a given position.
	 */
	headVerticalAlignment?: VerticalAlignmentType;

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
	responsiveSize?: ResposiveSizeType;

	/**
	 * Applies a Striped style on Table.
	 */
	striped?: boolean;

	/**
	 * This property vertically align the contents
	 * inside the table according a given position.
	 */
	tableVerticalAlignment?: VerticalAlignmentType;
}

type ResposiveSizeType = 'lg' | 'md' | 'sm' | 'xl';

type VerticalAlignmentType = 'bottom' | 'middle' | 'top';

const ClayTable: React.FunctionComponent<Props> & {
	Body: TableBodyType;
	Cell: TableCellType;
	Head: TableHeadType;
	Row: TableRowType;
} = ({
	bodyVerticalAlignment,
	bordered,
	children,
	className,
	headVerticalAlignment,
	headingNoWrap,
	hover,
	noWrap,
	responsive,
	responsiveSize,
	striped,
	tableVerticalAlignment,
	...otherProps
}) => {
	return (
		<div
			{...otherProps}
			className={classNames(className, {
				'table-responsive': responsive,
				[`table-responsive-${responsiveSize}`]: responsiveSize,
			})}
		>
			<table
				className={classNames('table table-autofit table-list', {
					'show-quick-actions-on-hover': hover,
					'table-bordered': bordered,
					'table-heading-nowrap': headingNoWrap,
					'table-hover': hover,
					'table-nowrap': noWrap,
					'table-striped': striped,
					[`tbody-valign-${bodyVerticalAlignment}`]: bodyVerticalAlignment,
					[`thead-valign-${headVerticalAlignment}`]: headVerticalAlignment,
					[`table-valign-${tableVerticalAlignment}`]: tableVerticalAlignment,
				})}
			>
				{children}
			</table>
		</div>
	);
};

ClayTable.Body = Body;
ClayTable.Cell = Cell;
ClayTable.Head = Head;
ClayTable.Row = Row;

export default ClayTable;

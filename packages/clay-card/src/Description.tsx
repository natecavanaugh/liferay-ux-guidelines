/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import ClayLink from '@clayui/link';
import classNames from 'classnames';
import React from 'react';

interface ICardDescriptionProps
	extends React.HTMLAttributes<
		HTMLHeadingElement | HTMLDivElement | HTMLSpanElement
	> {
	/**
	 * Type of description that can be applied for a text.
	 */
	displayType: 'text' | 'title' | 'subtitle';

	/**
	 * Flag to indicate if href will be disabled.
	 */
	disabled?: boolean;

	/**
	 * Path or URL
	 */
	href?: string;

	/**
	 * Define the name of the container element.
	 */
	tag?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

	/**
	 * Truncates the text inside a description.
	 */
	truncate?: boolean;
}

const Description = ({
	children,
	className,
	disabled,
	displayType,
	href,
	tag: Tag = 'p',
	truncate = true,
	...otherProps
}: ICardDescriptionProps) => {
	const InnerTag = href && !disabled ? ClayLink : 'span';

	return (
		<Tag
			className={classNames(className, `card-${displayType}`)}
			title={children ? children.toString() : undefined}
			{...otherProps}
		>
			{truncate ? (
				<span className="text-truncate-inline">
					<InnerTag
						className="text-truncate"
						href={disabled ? undefined : href}
					>
						{children}
					</InnerTag>
				</span>
			) : (
				children
			)}
		</Tag>
	);
};

export default Description;

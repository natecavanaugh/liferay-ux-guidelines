/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import ClayIcon from '@clayui/icon';
import ClayLink from '@clayui/link';
import classNames from 'classnames';
import React from 'react';

export const ItemAfter = React.forwardRef<
	HTMLSpanElement,
	React.HTMLAttributes<HTMLSpanElement>
>(({children, className, ...otherProps}, ref) => (
	<span
		{...otherProps}
		className={classNames(className, 'label-item label-item-after')}
		ref={ref}
	>
		{children}
	</span>
));

ItemAfter.displayName = 'ClayLabelItemAfter';

export const ItemBefore = React.forwardRef<
	HTMLSpanElement,
	React.HTMLAttributes<HTMLSpanElement>
>(({children, className, ...otherProps}, ref) => (
	<span
		{...otherProps}
		className={classNames(className, 'label-item label-item-before')}
		ref={ref}
	>
		{children}
	</span>
));

ItemBefore.displayName = 'ClayLabelItemBefore';

export const ItemExpand = React.forwardRef<
	HTMLAnchorElement | HTMLSpanElement,
	React.BaseHTMLAttributes<HTMLAnchorElement | HTMLSpanElement>
>(({children, className, href, ...otherProps}, ref) => {
	const TagName = href ? ClayLink : 'span';

	return (
		<TagName
			{...otherProps}
			className={classNames(className, 'label-item label-item-expand')}
			href={href}
			ref={ref as React.ComponentProps<typeof ClayLink>['ref']}
		>
			{children}
		</TagName>
	);
});

ItemExpand.displayName = 'ClayLabelItemExpand';

interface IBaseProps extends React.BaseHTMLAttributes<HTMLSpanElement> {
	/**
	 * Flag to indicate if `label-dismissible` class should be applied.
	 */
	dismissible?: boolean;

	/**
	 * Determines the style of the label.
	 */
	displayType?:
		| 'secondary'
		| 'info'
		| 'warning'
		| 'danger'
		| 'success'
		| 'unstyled';

	/**
	 * Flag to indicate if the label should be of the `large` variant.
	 */
	large?: boolean;
}

const OldLabel = React.forwardRef<HTMLSpanElement, IBaseProps>(
	(
		{
			children,
			className,
			dismissible,
			displayType = 'secondary',
			large = false,
			...otherProps
		},
		ref
	) => {
		return (
			<span
				{...otherProps}
				className={classNames('label', className, {
					'label-dismissible': dismissible,
					'label-lg': large,
					[`label-${displayType}`]: displayType,
				})}
				ref={ref}
			>
				{children}
			</span>
		);
	}
);

OldLabel.displayName = 'ClayLabel';

interface IProps extends IBaseProps {
	/**
	 * HTML properties that are applied to the 'x' button.
	 */
	closeButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement> & {
		ref?: (instance: HTMLButtonElement | null) => void;
	};

	/**
	 * Pros to add to the inner label item
	 */
	innerElementProps?: React.ComponentProps<typeof ItemExpand>;

	/**
	 * Path to the location of the spritemap resource used for Icon.
	 */
	spritemap?: string;

	/**
	 * Flag to indicate if component should include the close button
	 */
	withClose?: boolean;
}

interface IForwardRef<T, P = {}>
	extends React.ForwardRefExoticComponent<P & React.RefAttributes<T>> {
	ItemAfter: typeof ItemAfter;
	ItemBefore: typeof ItemBefore;
	ItemExpand: typeof ItemExpand;
}

function forwardRef<T, P = {}>(component: React.RefForwardingComponent<T, P>) {
	return React.forwardRef<T, P>(component) as IForwardRef<T, P>;
}

const Label = forwardRef<HTMLAnchorElement | HTMLSpanElement, IProps>(
	(
		{
			children,
			closeButtonProps,
			href,
			innerElementProps = {},
			withClose = true,
			spritemap,
			...otherProps
		}: IProps,
		ref
	) => {
		return (
			<OldLabel
				dismissible={withClose && !!closeButtonProps}
				{...otherProps}
				ref={ref}
			>
				{!withClose && children}

				{withClose && (
					<>
						<ItemExpand {...innerElementProps} href={href}>
							{children}
						</ItemExpand>

						{closeButtonProps && (
							<ItemAfter>
								<button
									{...closeButtonProps}
									className={classNames(
										closeButtonProps.className,
										'close'
									)}
									type="button"
								>
									<ClayIcon
										spritemap={spritemap}
										symbol="times-small"
									/>
								</button>
							</ItemAfter>
						)}
					</>
				)}
			</OldLabel>
		);
	}
);

Label.displayName = 'ClayLabel';

Label.ItemAfter = ItemAfter;
Label.ItemBefore = ItemBefore;
Label.ItemExpand = ItemExpand;

export default Label;

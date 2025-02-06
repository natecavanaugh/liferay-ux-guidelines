/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import classNames from 'classnames';
import React from 'react';

interface IGroupItemProps extends React.HTMLAttributes<HTMLDivElement> {
	/**
	 * Flag to indicate if `input-group-append` class should
	 * be applied
	 */
	append?: boolean;

	/**
	 * Flag to indicate if `input-group-prepend` class should
	 * be applied
	 */
	prepend?: boolean;

	/**
	 * Flag to indicate if `input-group-item-shrink` class should
	 * be applied
	 */
	shrink?: boolean;
}

export const GroupItem = React.forwardRef<HTMLDivElement, IGroupItemProps>(
	(
		{
			append,
			children,
			className,
			prepend,
			shrink,
			...otherProps
		}: IGroupItemProps,
		ref
	) => (
		<div
			{...otherProps}
			className={classNames('input-group-item', className, {
				['input-group-append']: append,
				['input-group-item-shrink']: shrink,
				['input-group-prepend']: prepend,
			})}
			ref={ref}
		>
			{children}
		</div>
	)
);

GroupItem.displayName = 'ClayInputGroupItem';

interface IGroupProps extends React.HTMLAttributes<HTMLDivElement> {
	/**
	 * Flag to indicate if `input-group-sm` class should
	 * be applied
	 */
	small?: boolean;

	/**
	 * Flag to indicate if `input-group-stacked-sm-down` class
	 * should be applied.
	 */
	stacked?: boolean;
}

export const Group = React.forwardRef<HTMLDivElement, IGroupProps>(
	(
		{children, className, small, stacked, ...otherProps}: IGroupProps,
		ref
	) => (
		<div
			{...otherProps}
			className={classNames('input-group', className, {
				['input-group-sm']: small,
				['input-group-stacked-sm-down']: stacked,
			})}
			ref={ref}
		>
			{children}
		</div>
	)
);

Group.displayName = 'ClayInputGroup';

export const GroupText = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({children, className, ...otherProps}, ref) => (
	<div
		{...otherProps}
		className={classNames('input-group-text', className)}
		ref={ref}
	>
		{children}
	</div>
));

GroupText.displayName = 'ClayInputGroupText';

interface IGroupInsetProps
	extends React.HTMLAttributes<
		HTMLDivElement | HTMLSpanElement | HTMLLabelElement
	> {
	/**
	 * Flag to indicate if `input-group-inset-item-after` class
	 * should be applied.
	 */
	after?: boolean;

	/**
	 * Flag to indicate if `input-group-inset-item-before` class
	 * should be applied.
	 */
	before?: boolean;

	/**
	 * Name of container element
	 */
	tag?: 'div' | 'span' | 'label';
}

const GroupInsetItem = React.forwardRef<
	HTMLDivElement | HTMLSpanElement | HTMLLabelElement,
	IGroupInsetProps
>(
	(
		{
			after,
			before,
			children,
			className,
			tag: Tag = 'div',
			...otherProps
		}: IGroupInsetProps,
		ref
	) => (
		<Tag
			{...otherProps}
			className={classNames('input-group-inset-item', className, {
				['input-group-inset-item-after']: after,
				['input-group-inset-item-before']: before,
			})}
			ref={ref as any} // Hack to get around TS inaccurately referring the ref type
		>
			{children}
		</Tag>
	)
);

GroupInsetItem.displayName = 'ClayInputGroupInsetItem';

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
	/**
	 * Input component to render. Can either be a string like 'input' or 'textarea' or a component.
	 */
	component?: 'input' | 'textarea' | React.ForwardRefExoticComponent<any>;

	/**
	 * Flag to indicate if `input-group-inset-after` class should be applied
	 */
	insetAfter?: boolean;

	/**
	 * Flag to indicate if `input-group-inset-before` class should be applied
	 */
	insetBefore?: boolean;

	/**
	 * Selects the height of the input.
	 */
	sizing?: 'lg' | 'regular' | 'sm';
}

interface IForwardRef<T, P = {}>
	extends React.ForwardRefExoticComponent<P & React.RefAttributes<T>> {
	Group: typeof Group;
	GroupInsetItem: typeof GroupInsetItem;
	GroupItem: typeof GroupItem;
	GroupText: typeof GroupText;
}

function forwardRef<T, P = {}>(component: React.RefForwardingComponent<T, P>) {
	return React.forwardRef<T, P>(component) as IForwardRef<T, P>;
}

export const Input = forwardRef<HTMLInputElement, IProps>(
	(
		{
			className,
			component: Component = 'input',
			insetAfter,
			insetBefore,
			sizing = 'regular',
			type = 'text',
			...otherProps
		}: IProps,
		ref
	) => (
		<Component
			{...otherProps}
			className={classNames('form-control', className, {
				[`form-control-${sizing}`]: sizing && sizing !== 'regular',
				['input-group-inset']: insetAfter || insetBefore,
				['input-group-inset-after']: insetAfter,
				['input-group-inset-before']: insetBefore,
			})}
			ref={ref}
			type={type}
		/>
	)
);

Input.displayName = 'ClayInput';
Input.Group = Group;
Input.GroupInsetItem = GroupInsetItem;
Input.GroupItem = GroupItem;
Input.GroupText = GroupText;

export default Input;

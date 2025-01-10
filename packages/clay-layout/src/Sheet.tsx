/**
 * SPDX-FileCopyrightText: © 2020 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import classNames from 'classnames';
import React from 'react';

interface IContainerProps extends React.HTMLAttributes<HTMLElement> {
	/**
	 * Element or component to render for container
	 */
	containerElement?:
		| string
		| React.JSXElementConstructor<{
				className: string;
				[key: string]: any;
		  }>;
}

const SheetHeader = React.forwardRef<HTMLElement, IContainerProps>(
	(
		{
			children,
			className,
			containerElement: ContainerElement = 'div',
			...otherProps
		}: IContainerProps,
		ref
	) => {
		return (
			<ContainerElement
				{...otherProps}
				className={classNames(className, 'sheet-header')}
				ref={ref}
			>
				{children}
			</ContainerElement>
		);
	}
);

SheetHeader.displayName = 'ClaySheetHeader';

const SheetFooter = React.forwardRef<HTMLElement, IContainerProps>(
	(
		{
			children,
			className,
			containerElement: ContainerElement = 'div',
			...otherProps
		}: IContainerProps,
		ref
	) => {
		return (
			<ContainerElement
				{...otherProps}
				className={classNames(className, 'sheet-footer')}
				ref={ref}
			>
				{children}
			</ContainerElement>
		);
	}
);

SheetFooter.displayName = 'ClaySheetFooter';

const SheetSection = React.forwardRef<HTMLElement, IContainerProps>(
	(
		{
			children,
			className,
			containerElement: ContainerElement = 'div',
			...otherProps
		}: IContainerProps,
		ref
	) => {
		return (
			<ContainerElement
				{...otherProps}
				className={classNames(className, 'sheet-section')}
				ref={ref}
			>
				{children}
			</ContainerElement>
		);
	}
);

SheetSection.displayName = 'ClaySheetSection';

const SheetRow = React.forwardRef<HTMLElement, IContainerProps>(
	(
		{
			children,
			className,
			containerElement: ContainerElement = 'div',
			...otherProps
		}: IContainerProps,
		ref
	) => {
		return (
			<ContainerElement
				{...otherProps}
				className={classNames(className, 'sheet-row')}
				ref={ref}
			>
				{children}
			</ContainerElement>
		);
	}
);

SheetRow.displayName = 'ClaySheetRow';

interface IProps extends IContainerProps {
	/**
	 * Setting this to sets a max-width on the sheet
	 */
	size?: 'lg';
}

const Sheet = React.forwardRef<HTMLElement, IProps>(
	(
		{
			children,
			className,
			containerElement: ContainerElement = 'div',
			size,
			...otherProps
		}: IProps,
		ref
	) => {
		return (
			<ContainerElement
				{...otherProps}
				className={classNames(className, 'sheet', {
					[`sheet-${size}`]: size,
				})}
				ref={ref}
			>
				{children}
			</ContainerElement>
		);
	}
);

Sheet.displayName = 'ClaySheet';

export {Sheet, SheetFooter, SheetHeader, SheetSection, SheetRow};

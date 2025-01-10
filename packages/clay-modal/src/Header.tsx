/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import ClayButton from '@clayui/button';
import ClayIcon from '@clayui/icon';
import classNames from 'classnames';
import React from 'react';

import Context, {IContext} from './Context';

export const ItemGroup = ({
	children,
	className,
	...otherProps
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={classNames('modal-item-group', className)} {...otherProps}>
		{children}
	</div>
);

interface IItemProps extends React.HTMLAttributes<HTMLDivElement> {
	/**
	 * Flag for indicating if item should autofitting the width
	 */
	shrink?: boolean;
}

export const Item = ({
	children,
	className,
	shrink,
	...otherProps
}: IItemProps) => (
	<div
		className={classNames('modal-item', className, {
			'modal-item-shrink': shrink,
		})}
		{...otherProps}
	>
		{children}
	</div>
);

export const TitleSection = ({
	children,
	className,
	...otherProps
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={classNames('modal-title-section', className)}
		{...otherProps}
	>
		{children}
	</div>
);

export const Title = ({
	children,
	className,
	...otherProps
}: React.HTMLAttributes<HTMLDivElement>) => {
	const {ariaLabelledby} = React.useContext(Context);

	return (
		<h1
			className={classNames('modal-title', className)}
			tabIndex={-1}
			{...otherProps}
			id={ariaLabelledby}
		>
			{children}
		</h1>
	);
};

export const TitleIndicator = ({
	children,
	className,
	...otherProps
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={classNames('modal-title-indicator', className)}
		{...otherProps}
	>
		{children}
	</div>
);

export const SubtitleSection = ({
	children,
	className,
	...otherProps
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={classNames('modal-subtitle-section', className)}
		{...otherProps}
	>
		{children}
	</div>
);

export const Subtitle = ({
	children,
	className,
	...otherProps
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={classNames('modal-subtitle', className)} {...otherProps}>
		{children}
	</div>
);

const ICON_MAP = {
	danger: 'exclamation-full',
	info: 'info-circle',
	success: 'check-circle-full',
	warning: 'warning-full',
};

const HighLevel = ({
	children,
	onClose,
	spritemap,
	status,
}: IContext & {children?: React.ReactNode}) => (
	<>
		<Title>
			{status && (
				<TitleIndicator>
					<ClayIcon spritemap={spritemap} symbol={ICON_MAP[status]} />
				</TitleIndicator>
			)}
			{children}
		</Title>

		<ClayButton
			aria-label="close"
			className="close"
			displayType="unstyled"
			onClick={onClose}
		>
			<ClayIcon spritemap={spritemap} symbol="times" />
		</ClayButton>
	</>
);

const ClayModalHeader = ({
	children,
	className,
	...otherProps
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={classNames('modal-header', className)} {...otherProps}>
		{children}
	</div>
);

interface IHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
	/**
	 * Flag for indicating if you want to use the Header its children being the title.
	 * Set to `false` if you want to use this as a low-level component.
	 */
	withTitle?: boolean;
}

const Header = ({children, withTitle = true, ...otherProps}: IHeaderProps) => {
	const {onClose, spritemap, status} = React.useContext(Context);

	return (
		<ClayModalHeader {...otherProps}>
			{withTitle && (
				<HighLevel
					onClose={onClose}
					spritemap={spritemap}
					status={status}
				>
					{children}
				</HighLevel>
			)}

			{!withTitle && children}
		</ClayModalHeader>
	);
};

export default Header;

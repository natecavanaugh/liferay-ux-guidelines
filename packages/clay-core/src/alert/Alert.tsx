/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import Icon from '@clayui/icon';
import Layout from '@clayui/layout';
import classNames from 'classnames';
import React, {useEffect, useRef} from 'react';

import {AlertFooter} from './Footer';
import {ToastContainer} from './ToastContainer';
import {AlertProps} from './types';

const useAutoClose = (autoClose?: boolean | number, onClose = () => {}) => {
	const startedTime = useRef<number>(0);
	const timer = useRef<number | undefined>(undefined);
	const timeToClose = useRef(autoClose === true ? 10000 : autoClose);

	let pauseTimer = () => {};
	let startTimer = () => {};

	if (autoClose) {
		pauseTimer = () => {
			if (timer.current) {
				timeToClose.current =
					(timeToClose.current as number) -
					(Date.now() - startedTime.current);

				clearTimeout(timer.current);

				timer.current = undefined;
			}
		};

		startTimer = () => {
			startedTime.current = Date.now();
			timer.current = window.setTimeout(
				onClose,
				timeToClose.current as number
			);
		};
	}

	useEffect(() => {
		if (autoClose) {
			startTimer();

			return pauseTimer;
		}
	}, []);

	return {
		pauseAutoCloseTimer: pauseTimer,
		startAutoCloseTimer: startTimer,
	};
};

const ICON_MAP = {
	danger: 'exclamation-full',
	info: 'info-circle',
	secondary: 'password-policies',
	success: 'check-circle-full',
	warning: 'warning-full',
};

const VARIANTS = ['inline', 'feedback'];

export function Alert(props: AlertProps): JSX.Element & {
	Footer: typeof AlertFooter;
	ToastContainer: typeof ToastContainer;
};

export function Alert({
	actions,
	autoClose,
	children,
	className,
	displayType = 'info',
	hideCloseIcon = false,
	onClose,
	role = 'alert',
	spritemap,
	symbol,
	title,
	variant,
	...otherProps
}: AlertProps) {
	const {pauseAutoCloseTimer, startAutoCloseTimer} = useAutoClose(
		autoClose,
		onClose
	);

	const ConditionalContainer = ({children}: any) =>
		variant === 'stripe' ? (
			<div className="container">{children}</div>
		) : (
			<>{children}</>
		);

	const showDismissible = onClose && !hideCloseIcon;

	const AlertIndicator = () => (
		<span className="alert-indicator">
			<Icon
				spritemap={spritemap}
				symbol={symbol || ICON_MAP[displayType]}
			/>
		</span>
	);

	return (
		<div
			{...otherProps}
			className={classNames(className, 'alert', {
				'alert-dismissible': showDismissible,
				'alert-feedback alert-indicator-start': variant === 'feedback',
				'alert-fluid': variant === 'stripe',
				'alert-inline': variant === 'inline',
				[`alert-${displayType}`]: displayType,
			})}
			onMouseOut={startAutoCloseTimer}
			onMouseOver={pauseAutoCloseTimer}
		>
			<ConditionalContainer>
				<Layout.ContentRow
					className="alert-autofit-row"
					role={role as string}
				>
					{!VARIANTS.includes(variant as string) && (
						<Layout.ContentCol>
							<Layout.ContentSection>
								<AlertIndicator />
							</Layout.ContentSection>
						</Layout.ContentCol>
					)}

					<Layout.ContentCol expand>
						<Layout.ContentSection>
							{VARIANTS.includes(variant as string) && (
								<AlertIndicator />
							)}

							{title && <strong className="lead">{title}</strong>}

							{children}

							{variant !== 'inline' && actions && (
								<AlertFooter>{actions}</AlertFooter>
							)}
						</Layout.ContentSection>
					</Layout.ContentCol>

					{variant === 'inline' && actions && (
						<Layout.ContentCol>
							<Layout.ContentSection>
								{actions}
							</Layout.ContentSection>
						</Layout.ContentCol>
					)}
				</Layout.ContentRow>

				{showDismissible && (
					<button
						aria-label="Close"
						className="close"
						onClick={onClose}
						type="button"
					>
						<Icon spritemap={spritemap} symbol="times" />
					</button>
				)}
			</ConditionalContainer>
		</div>
	);
}

Alert.Footer = AlertFooter;
Alert.ToastContainer = ToastContainer;

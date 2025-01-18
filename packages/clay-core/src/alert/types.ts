/**
 * SPDX-FileCopyrightText: © 2024 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

export type DisplayType =
	| 'danger'
	| 'info'
	| 'secondary'
	| 'success'
	| 'warning';

export type AlertProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'role'> & {
	/**
	 * A React Component to render the alert actions.
	 */
	actions?: React.ReactNode;

	/**
	 * Flag to indicate alert should automatically call `onClose`. It also
	 * accepts a duration (in ms) which indicates how long to wait. If `true`
	 * is passed in, the timeout will be 10000ms.
	 */
	autoClose?: boolean | number;

	/**
	 * Callback function for when the 'x' is clicked.
	 */
	onClose?: () => void;

	/**
	 * The alert role is for important, and usually time-sensitive, information.
	 */
	role?: string | null;

	/**
	 * Determines the style of the alert.
	 */
	displayType?: DisplayType;

	/**
	 * Flag to indicate if close icon should be show. This prop is used in
	 * conjunction with the `onClose`prop;
	 */
	hideCloseIcon?: boolean;

	/**
	 * Path to the spritemap that Icon should use when referencing symbols.
	 */
	spritemap?: string;

	/**
	 * The icon's symbol name in the spritemap.
	 */
	symbol?: string;

	/**
	 * The summary of the Alert, often is something like 'Error' or 'Info'.
	 */
	title?: string;

	/**
	 * Determines the variant of the alert.
	 */
	variant?: 'feedback' | 'stripe' | 'inline';
};

/**
 * SPDX-FileCopyrightText: © 2025 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {useEffect} from 'react';

type FocusMenuProps<T> = {
	children: T;
	condition: boolean;
	onRender: () => void;
};

export function FocusMenu<T>({
	children,
	condition,
	onRender,
}: FocusMenuProps<T>) {
	useEffect(() => {
		if (condition) {
			onRender();
		}
	}, [condition]);

	return children;
}

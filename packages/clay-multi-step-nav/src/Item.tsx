/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import classNames from 'classnames';
import React from 'react';

type State = 'error' | 'complete';

type Context = {
	state?: State;
};

export const ItemContext = React.createContext<Context>({});

interface IProps extends React.HTMLAttributes<HTMLLIElement> {
	/**
	 * Flag to indicate if `active` classname should be applied
	 */
	active?: boolean;

	/**
	 * Additional className to apply
	 */
	className?: string;

	/**
	 * Flag to indicate if `complete` classname should be applied
	 * @deprecated since v3.91.0 - use `state` instead.
	 */
	complete?: boolean;

	/**
	 * Flag to indicate if progress line should expand out from step
	 */
	expand?: boolean;

	/**
	 * Defines the status of the step.
	 */
	state?: State;
}

const Item = ({
	active,
	children,
	className,
	complete,
	expand,
	state,
	...otherProps
}: IProps) => {
	return (
		<li
			className={classNames('multi-step-item', {
				active,
				className,
				complete: complete ?? state === 'complete',
				error: state === 'error',
				['multi-step-item-expand']: expand,
			})}
			{...otherProps}
		>
			<ItemContext.Provider value={{state}}>
				{children}
			</ItemContext.Provider>
		</li>
	);
};

export default Item;

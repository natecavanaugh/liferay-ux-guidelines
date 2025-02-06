/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import React from 'react';

import ClayModal from './Modal';
import {Size, Status} from './types';
import {useModal} from './useModal';

enum Action {
	Close = 'CLOSE',
	Open = 'OPEN',
}

interface IProps {
	children: React.ReactNode;

	/**
	 * The path to the SVG spritemap file containing the icons.
	 */
	spritemap?: string;
}

type TState = {
	/**
	 * Renders an element in the modal body.
	 */
	body: React.ReactElement | React.ReactText;

	/**
	 * Flag indicating to vertically center the modal.
	 */
	center?: boolean;

	/**
	 * Render the action buttons on the footer following the order of `ClayModal.Footer`:
	 * - first
	 * - middle
	 * - last
	 */
	footer?: Array<React.ReactElement | undefined>;

	/**
	 * Renders an element in the modal header.
	 */
	header?: React.ReactElement | React.ReactText;

	/**
	 * The size of element modal.
	 */
	size?: Size;

	/**
	 * Status messages.
	 */
	status?: Status;

	/**
	 * Url to place an iframe in the body of the modal.
	 */
	url?: string;
};

type TAction =
	| {type: Action.Open | 1; payload: TState}
	| {type: Action.Close | 0};

type TProvider = [TState & {onClose: () => void}, React.Dispatch<TAction>];

const initialState = {
	body: <div />,
	footer: [],
	onClose: () => {},
	visible: false,
};

const reducer = (
	_state: TState,
	action: TAction
): TState & {visible: boolean} => {
	switch (action.type) {
		case 1:
		case Action.Open:
			return {...action.payload, visible: true};
		case 0:
		case Action.Close:
			return initialState;
		default:
			throw new TypeError();
	}
};

const Context = React.createContext<TProvider>([initialState, () => {}]);

const ModalProvider = ({children, spritemap}: IProps) => {
	const [{visible, ...otherState}, dispatch] = React.useReducer(
		reducer,
		initialState
	);
	const {observer, onClose} = useModal({
		onClose: () => dispatch({type: Action.Close}),
	});
	const {body, center, footer = [], header, size, status, url} = otherState;
	const [first, middle, last] = footer;
	const state = {
		...otherState,
		onClose,
	};

	return (
		<>
			{visible && (
				<ClayModal
					center={center}
					observer={observer}
					size={size}
					spritemap={spritemap}
					status={status}
				>
					{header && <ClayModal.Header>{header}</ClayModal.Header>}
					<ClayModal.Body url={url}>{body}</ClayModal.Body>
					{!!footer.length && (
						<ClayModal.Footer
							first={first}
							last={last}
							middle={middle}
						/>
					)}
				</ClayModal>
			)}
			<Context.Provider value={[state, dispatch]}>
				{children}
			</Context.Provider>
		</>
	);
};

export {Context};
export default ModalProvider;

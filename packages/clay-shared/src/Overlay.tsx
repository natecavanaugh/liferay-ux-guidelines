/**
 * SPDX-FileCopyrightText: © 2022 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {hideOthers, supportsInert, suppressOthers} from 'aria-hidden';
import React, {useCallback, useEffect, useRef} from 'react';

import {Keys} from './Keys';
import {ClayPortal} from './Portal';
import {useInteractOutside} from './useInteractOutside';

import type {Undo} from 'aria-hidden';

type Props = {
	children: React.ReactElement;
	inert?: boolean;
	isCloseOnInteractOutside?: boolean;
	isKeyboardDismiss?: boolean;
	isModal?: boolean;
	isOpen: boolean;
	menuClassName?: string;
	menuRef: React.RefObject<HTMLElement>;
	onClose: (action: 'escape' | 'blur') => void;
	portalRef?: React.RefObject<HTMLElement>;
	suppress?: Array<React.RefObject<HTMLElement>>;
	triggerRef: React.RefObject<HTMLElement>;
};

const overlayStack: Array<React.RefObject<Element>> = [];

/**
 * Overlay component is used for components like dialog and modal.
 * For example, Autocomplete, DatePicker, ColorPicker, DropDown are components
 * that can use and have the same consistent behavior.
 */
export function Overlay({
	children,
	inert,
	isCloseOnInteractOutside = false,
	isKeyboardDismiss = false,
	isModal = false,
	isOpen = false,
	menuClassName,
	menuRef,
	onClose,
	portalRef,
	suppress,
	triggerRef,
}: Props) {
	const unsuppressCallbackRef = useRef<Undo | null>(null);

	const onHide = useCallback(
		(action: 'escape' | 'blur') => {
			if (overlayStack[overlayStack.length - 1] === menuRef) {
				onClose(action);
			}
		},
		[onClose]
	);

	useEvent(
		'focus',
		useCallback(
			(event: FocusEvent) => {
				if (
					portalRef &&
					!portalRef.current?.contains(event.target as Node) &&
					triggerRef.current &&
					!triggerRef.current.contains(event.target as Node)
				) {
					onHide('blur');
				}
			},
			[onHide]
		),
		isOpen,
		true,
		[isOpen, onHide]
	);

	useEvent(
		'keydown',
		useCallback(
			(event: KeyboardEvent) => {
				if (
					event.key === Keys.Esc &&
					overlayStack[overlayStack.length - 1] === menuRef
				) {
					event.stopImmediatePropagation();
					event.preventDefault();

					if (triggerRef.current) {
						// When inert is used to suppress user interaction with the rest of
						// the document, to retrieve the focus in the trigger we need to
						// first undo and then move the focus.
						if (unsuppressCallbackRef.current) {
							unsuppressCallbackRef.current();
							unsuppressCallbackRef.current = null;
						}

						triggerRef.current.focus();
					}

					onClose('escape');
				}
			},
			[onClose]
		),
		isOpen && isKeyboardDismiss,
		true,
		[isOpen, onClose]
	);

	useInteractOutside({
		isDisabled: isOpen ? !isCloseOnInteractOutside : true,
		onInteract: () => {
			onHide('blur');
		},
		onInteractStart: (event) => {
			if (overlayStack[overlayStack.length - 1] === menuRef) {
				if (unsuppressCallbackRef.current) {
					unsuppressCallbackRef.current();
					unsuppressCallbackRef.current = null;
				}

				if (isModal) {
					event.stopPropagation();
					event.preventDefault();
				}
			}
		},
		ref: portalRef ?? menuRef,
		triggerRef,
	});

	useEffect(() => {
		if (isOpen) {
			overlayStack.push(menuRef);
		}

		return () => {
			const index = overlayStack.indexOf(menuRef);

			if (index >= 0) {
				overlayStack.splice(index, 1);
			}
		};
	}, [isOpen, menuRef]);

	useEffect(() => {
		if (menuRef.current && isOpen) {
			const elements = suppress
				? suppress.map((ref) => ref.current!)
				: menuRef.current;

			// Inert is a new native feature to better handle DOM arias that are not
			// assertive to a SR or that should ignore any user interaction.
			// https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/inert
			if ((isModal || inert) && supportsInert()) {
				unsuppressCallbackRef.current = suppressOthers(elements);
			} else {
				unsuppressCallbackRef.current = hideOthers(elements);
			}

			return () => {
				if (unsuppressCallbackRef.current) {
					unsuppressCallbackRef.current();
				}
				unsuppressCallbackRef.current = null;
			};
		}
	}, [isModal, inert, isOpen]);

	return (
		<ClayPortal className={menuClassName} subPortalRef={portalRef}>
			{isModal && <span data-focus-scope-start="true" tabIndex={0} />}
			{children}
			{isModal && <span data-focus-scope-end="true" tabIndex={0} />}
		</ClayPortal>
	);
}

function useEvent<T extends keyof DocumentEventMap>(
	name: T,
	onEvent: (event: DocumentEventMap[T]) => void,
	conditional: boolean,
	capture: boolean,
	deps: Array<any> = []
) {
	useEffect(() => {
		// This check should go away when the Overlay is shown using conditional
		// instead of class CSS.
		if (conditional) {
			document.addEventListener(name, onEvent, capture);

			return () => {
				document.removeEventListener(name, onEvent, capture);
			};
		}
	}, deps);
}

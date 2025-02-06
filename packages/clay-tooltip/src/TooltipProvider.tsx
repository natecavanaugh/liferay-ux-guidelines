/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {
	ClayPortal,
	IPortalBaseProps,
	Keys,
	delegate,
	useInteractionFocus,
} from '@clayui/shared';
import React, {useCallback, useEffect, useReducer, useRef} from 'react';
import warning from 'warning';

import {Tooltip} from './Tooltip';
import {Align, useAlign} from './useAlign';
import {useClosestTitle} from './useClosestTitle';
import {useTooltipState} from './useTooltipState';

interface IState {
	align: Align;
	floating: boolean;
	setAsHTML?: boolean;
	title?: string;
}

const initialState: IState = {
	align: 'top',
	floating: false,
	setAsHTML: false,
	title: '',
};

const TRIGGER_HIDE_EVENTS = [
	'dragstart',
	'mouseout',
	'mouseup',
	'pointerup',
	'touchend',
] as const;

const TRIGGER_SHOW_EVENTS = [
	'mouseover',
	'mouseup',
	'pointerdown',
	'touchstart',
] as const;

interface IAction extends Partial<IState> {
	type: 'reset' | 'update';
}

const reducer = (state: IState, {type, ...payload}: IAction): IState => {
	switch (type) {
		case 'update':
			return {...state, ...payload};
		case 'reset':
			return {
				...state,
				align: initialState.align,
				floating: false,
			};
		default:
			throw new TypeError();
	}
};

type TContentRenderer = (props: {
	targetNode?: HTMLElement | null;
	title: string;
}) => React.ReactElement | React.ReactNode;

type Props = {
	/**
	 * Flag to indicate if tooltip should automatically align based on the window
	 */
	autoAlign?: boolean;

	/**
	 * Props to add to the `<ClayPortal/>`.
	 */
	containerProps?: IPortalBaseProps;

	/**
	 * Custom function for rendering the contents of the tooltip
	 */
	contentRenderer?: TContentRenderer;

	/**
	 * Delay in miliseconds before showing tooltip
	 */
	delay?: number;

	children?: React.ReactElement;

	/**
	 * CSS selector to scope provider to. All titles within this scope will be
	 * rendered in the tooltip. Titles outside of this scope will be styled
	 * as with the default browser.
	 */
	scope?: string;
};

export const ClayTooltipProvider = ({
	autoAlign = true,
	children,
	containerProps = {},
	contentRenderer = (props) => props.title,
	delay = 600,
	scope,
}: Props) => {
	const [{align, floating, setAsHTML, title = ''}, dispatch] = useReducer(
		reducer,
		initialState
	);

	const tooltipRef = useRef<HTMLElement>(null);

	const {getInteraction, isFocusVisible} = useInteractionFocus();

	const isHovered = useRef(false);
	const isFocused = useRef(false);

	const {close, isOpen, open} = useTooltipState({delay});

	const {forceHide, getProps, onHide, target, titleNode} = useClosestTitle({
		forceHide: useCallback(() => {
			dispatch({type: 'reset'});
			close();
		}, []),
		onClick: useCallback(() => {
			isFocused.current = false;
			isHovered.current = false;
		}, []),
		onHide: useCallback(() => {
			if (!isHovered.current && !isFocused.current) {
				dispatch({type: 'reset'});
				close();
			}
		}, []),
		tooltipRef,
	});

	useAlign({
		align,
		autoAlign,
		floating,
		isOpen,
		onAlign: useCallback((align) => dispatch({align, type: 'update'}), []),
		sourceElement: tooltipRef,
		targetElement: titleNode,
		title,
	});

	const onShow = useCallback(
		(event: React.MouseEvent<HTMLElement, MouseEvent>) => {
			if (isHovered.current || isFocused.current) {
				const props = getProps(event, isHovered.current);

				if (props) {
					dispatch({
						align: (props.align as any) ?? align,
						floating: props.floating,
						setAsHTML: props.setAsHTML,
						title: props.title,
						type: 'update',
					});
					open(
						isFocused.current,
						props.delay ? Number(props.delay) : undefined
					);
				}
			}
		},
		[align]
	);

	useEffect(() => {
		const handleEsc = (event: KeyboardEvent) => {
			if (isOpen && event.key === Keys.Esc) {
				event.stopImmediatePropagation();

				forceHide();
			}
		};

		document.addEventListener('keyup', handleEsc, true);

		return () => document.removeEventListener('keyup', handleEsc, true);
	}, [isOpen]);

	const onHoverStart = (event: any) => {
		if (getInteraction() === 'pointer') {
			isHovered.current = true;
		} else {
			isHovered.current = false;
		}

		onShow(event);
	};

	const onHoverEnd = (event: any) => {
		isFocused.current = false;
		isHovered.current = false;

		onHide(event);
	};

	const onFocus = (event: any) => {
		if (isFocusVisible()) {
			isFocused.current = true;

			onShow(event);
		}
	};

	const onBlur = (event: any) => {
		isFocused.current = false;
		isHovered.current = false;

		onHide(event);
	};

	useEffect(() => {
		if (scope) {
			const disposeShowEvents = TRIGGER_SHOW_EVENTS.map((eventName) =>
				delegate(document.body, eventName, scope, onHoverStart)
			);
			const disposeHideEvents = TRIGGER_HIDE_EVENTS.map((eventName) =>
				delegate(
					document.body,
					eventName,
					`${scope}, .tooltip`,
					onHoverEnd
				)
			);

			const disposeShowFocus = delegate(
				document.body,
				'focus',
				`${scope}, .tooltip`,
				onFocus,
				true
			);
			const disposeCloseBlur = delegate(
				document.body,
				'blur',
				`${scope}, .tooltip`,
				onBlur,
				true
			);

			return () => {
				disposeShowEvents.forEach(({dispose}) => dispose());
				disposeHideEvents.forEach(({dispose}) => dispose());

				disposeShowFocus.dispose();
				disposeCloseBlur.dispose();
			};
		}
	}, [onShow]);

	warning(
		(typeof children === 'undefined' && typeof scope !== 'undefined') ||
			(typeof scope === 'undefined' && typeof children !== 'undefined'),
		'<TooltipProvider />: You must use at least one of the following props: `children` or `scope`.'
	);

	warning(
		typeof children !== 'undefined' || typeof scope !== 'undefined',
		'<TooltipProvider />: If you want to use `scope`, use <TooltipProvider /> as a singleton and do not pass `children`.'
	);

	warning(
		children?.type !== React.Fragment,
		'<TooltipProvider />: React Fragment is not allowed as a child to TooltipProvider. Child must be a single HTML element that accepts `onMouseOver` and `onMouseOut`.'
	);

	const titleContent = contentRenderer({
		targetNode: target.current,
		title,
	});

	const tooltip = isOpen && (
		<ClayPortal {...containerProps}>
			<Tooltip alignPosition={align} ref={tooltipRef} show>
				{setAsHTML && typeof titleContent === 'string' ? (
					<span
						dangerouslySetInnerHTML={{
							__html: titleContent,
						}}
					/>
				) : (
					titleContent
				)}
			</Tooltip>
		</ClayPortal>
	);

	return (
		<>
			{scope ? (
				<>
					{tooltip}
					{children}
				</>
			) : (
				children &&
				React.cloneElement(children, {
					...children.props,
					children: (
						<>
							{children.props.children}
							{tooltip}
						</>
					),
					onBlur,
					onFocus,
					onMouseOut: onHoverEnd,
					onMouseOver: onHoverStart,
				})
			)}
		</>
	);
};

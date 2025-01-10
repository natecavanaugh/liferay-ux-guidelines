/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {ClayInput} from '@clayui/form';
import {FocusScope} from '@clayui/shared';
import React from 'react';

import {Autocomplete} from './Autocomplete';
import {LegacyContext} from './Context';
import DropDown from './DropDown';
import Input from './Input';
import Item from './Item';
import LoadingIndicator from './LoadingIndicator';

import type {IProps as IAutocompleteProps} from './Autocomplete';

const AutocompleteMarkup = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({children, ...otherProps}, ref) => (
	<ClayInput.Group {...otherProps} ref={ref}>
		<ClayInput.GroupItem>{children}</ClayInput.GroupItem>
	</ClayInput.Group>
));

AutocompleteMarkup.displayName = 'ClayAutocompleteMarkup';

/**
 * Temporary helper function to determine which version of autocomplete
 * is being used.
 */
const hasItems = (children?: React.ReactNode) => {
	if (!children) {
		return [];
	}

	return React.Children.map(children, (child) => {
		if (
			React.isValidElement(child) &&
			// @ts-ignore
			child.type.displayName === 'Item'
		) {
			return true;
		}

		return false;
	}).filter(Boolean);
};

interface IProps<T> extends IAutocompleteProps<T> {
	/**
	 * Div component to render. It can be a one component that will replace the markup.
	 */
	component?: React.ForwardRefExoticComponent<any>;
}

interface IForwardRef<T, P = {}>
	extends React.ForwardRefExoticComponent<P & React.RefAttributes<T>> {
	DropDown: typeof DropDown;
	Input: typeof Input;
	Item: typeof Item;
	LoadingIndicator: typeof LoadingIndicator;
}

function forwardRef<T, P = {}>(component: React.RefForwardingComponent<T, P>) {
	return React.forwardRef<T, P>(component) as IForwardRef<T, P>;
}

const ClayAutocomplete = forwardRef(
	<T extends Record<string, any> | string | number>(
		{
			children,
			className,
			component: Component = AutocompleteMarkup,
			...otherProps
		}: IProps<T>,
		ref: React.Ref<HTMLInputElement>
	) => {
		const containerElementRef = React.useRef<null | HTMLDivElement>(null);
		const [loading, setLoading] = React.useState(false);

		const isNewBehavior =
			hasItems(children).length >= 1 || children instanceof Function;

		const Container = isNewBehavior ? React.Fragment : FocusScope;

		return (
			<Container>
				<Component
					{...(isNewBehavior ? {} : otherProps)}
					className={className}
					ref={(r: any) => {
						if (r) {
							containerElementRef.current = r;

							if (typeof ref === 'function') {
								ref(r);
							} else if (ref !== null) {
								(ref as React.MutableRefObject<any>).current =
									r;
							}
						}
					}}
				>
					{isNewBehavior ? (
						<Autocomplete<T>
							containerElementRef={containerElementRef}
							{...otherProps}
						>
							{children}
						</Autocomplete>
					) : (
						<LegacyContext.Provider
							value={{
								containerElementRef,
								loading,
								onLoadingChange: (loading: boolean) =>
									setLoading(loading),
							}}
						>
							{children}
						</LegacyContext.Provider>
					)}
				</Component>
			</Container>
		);
	}
);

ClayAutocomplete.DropDown = DropDown;
ClayAutocomplete.Input = Input;
ClayAutocomplete.Item = Item;
ClayAutocomplete.LoadingIndicator = LoadingIndicator;

export default ClayAutocomplete;

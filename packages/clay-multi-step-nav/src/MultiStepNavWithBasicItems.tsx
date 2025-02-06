/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {ClayDropDownWithItems} from '@clayui/drop-down';
import {InternalDispatch, useControlledState} from '@clayui/shared';
import React from 'react';

import ClayMultiStepNav from './MultiStepNav';

interface ISteps {
	/**
	 * Value that is displayed below the step icon.
	 */
	subTitle?: string;

	/**
	 * Value that is displayed above the step icon.
	 */
	title?: string;
}

interface IProps extends React.ComponentProps<typeof ClayMultiStepNav> {
	/**
	 * Value for which step index is active (controlled).
	 */
	active?: number;

	/**
	 * Value for which step index is active
	 * @deprecated since v3.52.0 - use `active` instead.
	 */
	activeIndex?: number;

	/**
	 * Set the default value of active state (uncontrolled).
	 */
	defaultActive?: number;

	/**
	 * Determines at what point a dropdown is show. The dropdown will
	 * always show as the 2nd to last step.
	 */
	maxStepsShown?: number;

	/**
	 * Callback for when step is clicked
	 */
	onActiveChange?: InternalDispatch<number>;

	/**
	 * Callback for when step is clicked
	 * @deprecated since v3.52.0 - use `onActiveChange` instead.
	 */
	onIndexChange?: InternalDispatch<number>;

	/**
	 * Path to spritemap for icon symbol.
	 */
	spritemap?: string;

	/**
	 * Defines the status of the current step.
	 */
	state?: 'error' | 'complete';

	/**
	 * List of steps to display
	 */
	steps: Array<ISteps>;
}

const MAX_STEPS_SHOWN = 7;

const IndicatorWithInnerRef = React.forwardRef<HTMLButtonElement, any>(
	({spritemap, ...otherProps}, ref) => (
		<ClayMultiStepNav.Indicator
			{...otherProps}
			innerRef={ref}
			label="..."
			spritemap={spritemap}
		/>
	)
);

IndicatorWithInnerRef.displayName = 'ClayIndicatorWithInnerRef';

export const MultiStepNavWithBasicItems = ({
	active,
	activeIndex,
	defaultActive,
	maxStepsShown = MAX_STEPS_SHOWN,
	onActiveChange,
	onIndexChange,
	spritemap,
	state = 'complete',
	steps,
	...otherProps
}: IProps) => {
	const [internalActive, setActive] = useControlledState({
		defaultName: 'defaultActive',
		defaultValue: defaultActive,
		handleName: 'onActiveChange',
		name: 'value',
		onChange: onActiveChange ?? onIndexChange,
		value: typeof active === 'undefined' ? activeIndex : active,
	});

	let dropdownItems;
	let showSteps = steps;
	const indexEnd = steps.length - 1;

	const lastStep = steps[indexEnd]!;

	if (steps.length > maxStepsShown) {
		const indexBeforeDropdown = maxStepsShown - 1;

		dropdownItems = steps
			.slice(indexBeforeDropdown, indexEnd)
			.map((step, i) => {
				const index = indexBeforeDropdown + i;

				return {
					active: internalActive === index,
					label: `${index + 1}. ${step.title}`,
					onClick: () => setActive(index),
					symbolRight: internalActive > index ? 'check' : undefined,
				};
			});

		showSteps = steps.slice(0, indexBeforeDropdown);
	}

	const activeInDropDown =
		internalActive > showSteps.length - 1 && internalActive < indexEnd;

	return (
		<ClayMultiStepNav {...otherProps}>
			{showSteps.map(({subTitle, title}, i: number) => {
				const error = state === 'error' && internalActive === i;
				const complete = !error ? internalActive > i : false;

				return (
					<ClayMultiStepNav.Item
						active={internalActive === i}
						expand={i + 1 !== steps.length}
						key={i}
						state={
							error ? 'error' : complete ? 'complete' : undefined
						}
					>
						<ClayMultiStepNav.Title>{title}</ClayMultiStepNav.Title>
						<ClayMultiStepNav.Divider />
						<ClayMultiStepNav.Indicator
							label={1 + i}
							onClick={() => setActive(i)}
							spritemap={spritemap}
							subTitle={subTitle}
						/>
					</ClayMultiStepNav.Item>
				);
			})}

			{dropdownItems && (
				<>
					<ClayMultiStepNav.Item
						active={activeInDropDown}
						complete={internalActive === indexEnd}
						expand
					>
						<ClayMultiStepNav.Title>
							{activeInDropDown
								? steps[internalActive]!.title
								: steps[showSteps.length]!.title}
						</ClayMultiStepNav.Title>
						<ClayMultiStepNav.Divider />

						<ClayDropDownWithItems
							items={dropdownItems}
							spritemap={spritemap}
							trigger={<IndicatorWithInnerRef />}
						/>
					</ClayMultiStepNav.Item>

					<ClayMultiStepNav.Item active={internalActive === indexEnd}>
						<ClayMultiStepNav.Title>
							{lastStep.title}
						</ClayMultiStepNav.Title>
						<ClayMultiStepNav.Divider />
						<ClayMultiStepNav.Indicator
							label={steps.length}
							onClick={() => setActive(indexEnd)}
							spritemap={spritemap}
							subTitle={lastStep.subTitle}
						/>
					</ClayMultiStepNav.Item>
				</>
			)}
		</ClayMultiStepNav>
	);
};

/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {InternalDispatch, useControlledState} from '@clayui/shared';
import classNames from 'classnames';
import React from 'react';

interface IProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
	/**
	 * Property to set the default value (uncontrolled).
	 */
	defaultValue?: number;

	/**
	 * Flag that will disable component features.
	 */
	disabled?: boolean;

	/**
	 * Sets maximum permitted value.
	 */
	max?: number;

	/**
	 * Sets minimum permitted value
	 */
	min?: number;

	/**
	 * Callback will always be called when the slider value changes (controlled).
	 */
	onChange?: InternalDispatch<number>;

	/**
	 * Callback will always be called when the slider value changes.
	 * @deprecated since v3.40.0 - use `onChange` instead.
	 */
	onValueChange?: InternalDispatch<number>;

	/**
	 * Flag to show tooltip or not.
	 */
	showTooltip?: boolean;

	/**
	 * Sets stepping interval.
	 */
	step?: number;

	/**
	 * Set tooltip position.
	 */
	tooltipPosition?: 'top' | 'bottom';

	/**
	 * Set the current value of the slider (controlled).
	 */
	value?: number;
}

const calcProgressWidth = (
	element: HTMLInputElement,
	thumbWidth: number,
	value: number,
	min: number,
	max: number,
	step: number
) => {
	const currentStep = (value - min) / step;
	const totalSteps = (max - min) / step;

	const progressWidth = (currentStep / totalSteps) * 100;
	const rangeWidth = element.clientWidth;

	const ratio =
		(((1 - progressWidth * 0.01) * (thumbWidth / 1.001)) / rangeWidth) *
		100;
	let offsetWidth = progressWidth;

	if (progressWidth !== 50) {
		offsetWidth =
			progressWidth - (thumbWidth / 2 / rangeWidth) * 100 + ratio;
	}

	return offsetWidth;
};

const useIsomorphicLayoutEffect =
	typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

const Slider = ({
	className,
	defaultValue,
	disabled,
	max = 100,
	min = 0,
	onChange,
	onValueChange,
	showTooltip = true,
	step = 1,
	tooltipPosition = 'top',
	value,
	...otherProps
}: IProps) => {
	const [internalValue, setValue] = useControlledState({
		defaultName: 'defaultValue',
		defaultValue,
		handleName: 'onChange',
		name: 'value',
		onChange: onChange ?? onValueChange,
		value,
	});

	const [offsetWidth, setOffsetWidth] = React.useState<number>(0);
	const sliderRef = React.useRef<HTMLInputElement | null>(null);
	const thumbRef = React.useRef<HTMLDivElement | null>(null);

	useIsomorphicLayoutEffect(() => {
		if (sliderRef.current && thumbRef.current) {
			const thumbWidth = thumbRef.current.clientWidth;

			setOffsetWidth(
				calcProgressWidth(
					sliderRef.current,
					thumbWidth,
					internalValue,
					min,
					max,
					step
				)
			);
		}
	}, [internalValue]);

	return (
		<div className={classNames('clay-range', className, {disabled})}>
			<div className="clay-range-input">
				<input
					{...otherProps}
					className="form-control-range"
					disabled={disabled}
					max={max}
					min={min}
					onChange={(event) => setValue(Number(event.target.value))}
					ref={sliderRef}
					step={step}
					type="range"
					value={internalValue}
				/>
				<div className="clay-range-track" />
				<div
					className="clay-range-progress"
					style={{width: `${offsetWidth}%`}}
				>
					<div className="clay-range-thumb" ref={thumbRef}>
						{showTooltip && (
							<div
								className={classNames(
									'tooltip',
									`clay-tooltip-${tooltipPosition}`
								)}
								role="tooltip"
							>
								<div className="tooltip-arrow" />
								<div className="tooltip-inner">
									<div className="clay-range-value">
										{internalValue}
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Slider;

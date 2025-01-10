/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import ClayIcon from '@clayui/icon';
import React, {useContext} from 'react';

import {ItemContext} from './Item';

type Props = {
	/**
	 * Flag to indicate if step should show its been completed
	 * @deprecated since v3.91.0 - this is no longer necessary.
	 */
	complete?: boolean;

	innerRef?: React.Ref<HTMLButtonElement>;

	/**
	 * Value to display above step icon
	 */
	label?: React.ReactText;

	/**
	 * Callback for when the icon is clicked
	 */
	onClick?: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;

	/**
	 * Path to clay-css spritemap
	 */
	spritemap?: string;

	/**
	 * Value to display below step icon
	 */
	subTitle?: React.ReactText;
};

const MultiStepNavIndicator = React.forwardRef<HTMLDivElement, Props>(
	({complete, innerRef, label, onClick, spritemap, subTitle}: Props, ref) => {
		const {state} = useContext(ItemContext);

		const isComplete = complete ?? state === 'complete';

		return (
			<div className="multi-step-indicator" ref={ref}>
				{subTitle && (
					<div className="multi-step-indicator-label">{subTitle}</div>
				)}

				<button
					className="multi-step-icon"
					onClick={onClick}
					ref={innerRef}
					type="button"
				>
					{isComplete && (
						<ClayIcon spritemap={spritemap} symbol="check" />
					)}

					{!isComplete && state !== 'error' && label}
				</button>
			</div>
		);
	}
);

MultiStepNavIndicator.displayName = 'ClayMultiStepNavIndicator';

export default MultiStepNavIndicator;

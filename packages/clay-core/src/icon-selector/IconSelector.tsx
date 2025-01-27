/**
 * SPDX-FileCopyrightText: © 2025 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import ClayButton from '@clayui/button';
import Input from '@clayui/form/src/Input';
import Icon from '@clayui/icon';
import React, {useState} from 'react';

import DropdownSelector from './DropdownSelector';

export function IconSelector() {
	const [selectedIcon, setSelectedIcon] = useState<string>('');

	const handleIconSelect = (icon: string) => {
		setSelectedIcon(icon);
	};

	const handleClearSelection = () => {
		setSelectedIcon('');
	};

	return (
		<>
			{selectedIcon ? (
				<div className="selected-icon-container">
					<Input.Group stacked>
						<ClayButton
							aria-label={selectedIcon}
							displayType="secondary"
						>
							<Icon symbol={selectedIcon} />
						</ClayButton>

						<Input
							readOnly
							value={
								selectedIcon.charAt(0).toUpperCase() +
								selectedIcon.slice(1)
							}
						/>
					</Input.Group>

					<DropdownSelector
						buttonWithIcon
						handleIconSelect={handleIconSelect}
					/>

					<ClayButton
						aria-label="delete icon"
						displayType="secondary"
						onClick={handleClearSelection}
					>
						<Icon symbol="trash" />
					</ClayButton>
				</div>
			) : (
				<DropdownSelector handleIconSelect={handleIconSelect} />
			)}
		</>
	);
}

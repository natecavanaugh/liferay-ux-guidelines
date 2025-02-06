/**
 * SPDX-FileCopyrightText: © 2020 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

'use client';

import ClayForm, {ClayInput} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import React, {useMemo, useState} from 'react';

const spritemap = '/images/icons/icons.svg';

/**
 * Component that allows searching through icons
 * @param {string} label - Label of the search input field.
 * @param {string} placeholder - Placeholder of the search input field.
 * @param {Array[Object]} source - Path to the source JSON. Needs to follow pattern of [{name: String, aliases: Array<String>}]
 * @param {string} type - Type of icons being provided, supports "icons" and "flags"
 */
export const IconSearch = ({
	label = 'Search Icons',
	placeholder = 'Search Icons...',
	source,
	type = 'icon',
}) => {
	const [searchQuery, setSearchQuery] = useState('');

	const filteredIcons = useMemo(() => {
		const query = searchQuery.toLowerCase();

		return source.filter(
			({aliases, name}) =>
				name.toLowerCase().includes(query) ||
				aliases.some((alias) => alias.toLowerCase().includes(query))
		);
	}, [searchQuery, source]);

	const list = searchQuery ? filteredIcons : source;

	return (
		<>
			<ClayForm.Group>
				<label className="form-control-label">
					<span className="form-control-label-text">{label}</span>

					<ClayInput
						onChange={(event) => setSearchQuery(event.target.value)}
						placeholder={placeholder}
						type="text"
						value={searchQuery}
					/>
				</label>
			</ClayForm.Group>

			<ul className="d-flex flex-wrap lexicon-icon-list list-unstyled">
				{list.map((icon) => {
					const name =
						type === 'icon' ? icon.name : icon.aliases.join(' - ');

					return (
						<li key={icon.name}>
							<ClayIcon
								spritemap={spritemap}
								symbol={icon.name}
							/>

							<span>{name}</span>
						</li>
					);
				})}
			</ul>

			{!list.length && (
				<span>{`No results found for ${searchQuery}`}</span>
			)}
		</>
	);
};

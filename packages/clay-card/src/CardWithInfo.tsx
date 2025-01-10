/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {ClayButtonWithIcon} from '@clayui/button';
import {ClayDropDownWithItems} from '@clayui/drop-down';
import {ClayCheckbox, ClayRadio} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import ClayLabel from '@clayui/label';
import ClayLayout from '@clayui/layout';
import ClaySticker, {IClayStickerProps} from '@clayui/sticker';
import classNames from 'classnames';
import React from 'react';

import ClayCard from './Card';

import type {ButtonWithIconProps} from '@clayui/button';

interface IProps extends React.BaseHTMLAttributes<HTMLDivElement> {
	/**
	 * List of actions in the dropdown menu
	 */
	actions?: React.ComponentProps<typeof ClayDropDownWithItems>['items'];

	/**
	 * Props to add to the checkbox element
	 */
	checkboxProps?: React.HTMLAttributes<HTMLInputElement>;

	/**
	 * Props to add to the radio element
	 */
	radioProps?: React.HTMLAttributes<HTMLInputElement> & {
		name: string;
		value: string;
	};

	/**
	 * Description of the file
	 */
	description?: React.ReactText;

	/**
	 * Flag to indicate that all interactions on the card will be disabled.
	 */
	disabled?: boolean;

	/**
	 * Determines the style of the card
	 */
	displayType?: 'file' | 'image';

	/**
	 * Props to add to the dropdown trigger element
	 */
	dropDownTriggerProps?: Omit<
		ButtonWithIconProps,
		'symbol' | 'spritemap' | 'displayType' | 'className'
	>;

	/**
	 * Flag to indicate if `aspect-ratio-item-flush` class should be
	 * applied to the image.
	 */
	flushHorizontal?: boolean;

	/**
	 * Flag to indicate if `aspect-ratio-item-vertical-flush` class should be
	 * applied to the image.
	 */
	flushVertical?: boolean;

	/**
	 * Path or URL to file
	 */
	href?: string;

	/**
	 * Object of props for `<img />` or string path to image
	 */
	imgProps?: React.ImgHTMLAttributes<HTMLImageElement> | string;

	/**
	 * List of labels that are applied to the file
	 */
	labels?: Array<
		React.ComponentProps<typeof ClayLabel> & {value: React.ReactText}
	>;

	/**
	 * Flag to indicate if card is selected
	 */
	selected?: boolean;

	/**
	 * Path to clay icon spritemap
	 */
	spritemap?: string;

	/**
	 * Values used in displaying bottom-left icon
	 */
	stickerProps?:
		| (IClayStickerProps & {
				content?: React.ReactNode;
		  })
		| null;

	/**
	 * Name of icon
	 */
	symbol?: string;

	/**
	 * Name of the file
	 */
	title: string;

	/**
	 * Flag to indicate if the card text is truncated
	 */
	truncate?: boolean;

	/**
	 * Callback for when item is selected.
	 */
	onSelectChange?: (value: boolean | string) => void;

	/**
	 * Determines what type of selectable it is.
	 */
	selectableType?: 'checkbox' | 'radio';
}

export const ClayCardWithInfo = ({
	'aria-label': ariaLabel,
	actions,
	checkboxProps = {},
	description,
	disabled,
	displayType,
	dropDownTriggerProps = {
		'aria-label': 'More actions',
	},
	flushHorizontal,
	flushVertical,
	href,
	imgProps,
	labels,
	onSelectChange,
	radioProps = {name: '', value: ''},
	selectableType,
	selected = false,
	spritemap,
	stickerProps = {},
	symbol,
	title,
	truncate = true,
	...otherProps
}: IProps) => {
	const isCardType = {
		file: displayType === 'file' && !imgProps,
		image: displayType === 'image' || imgProps,
	};

	const contentSymbol = symbol
		? symbol
		: isCardType.image
		? 'camera'
		: 'documents-and-media';

	const stickerSymbol = isCardType.image
		? 'document-image'
		: 'document-default';

	const headerContent = (
		<ClayCard.AspectRatio className="card-item-first">
			{!imgProps && (
				<div className="aspect-ratio-item aspect-ratio-item-center-middle aspect-ratio-item-fluid card-type-asset-icon">
					<ClayIcon spritemap={spritemap} symbol={contentSymbol} />
				</div>
			)}

			{imgProps && (
				<img
					className={classNames(
						'aspect-ratio-item aspect-ratio-item-center-middle',
						typeof imgProps !== 'string' && imgProps.className,
						{
							['aspect-ratio-item-fluid']:
								!flushHorizontal && !flushVertical,
							['aspect-ratio-item-flush']: flushHorizontal,
							['aspect-ratio-item-vertical-flush']: flushVertical,
						}
					)}
					{...(typeof imgProps === 'string'
						? {src: imgProps}
						: imgProps)}
				/>
			)}

			{stickerProps && (
				<ClaySticker
					displayType={
						stickerProps.displayType
							? stickerProps.displayType
							: 'primary'
					}
					position="bottom-left"
					title={stickerProps.title}
					{...stickerProps}
				>
					{stickerProps.children ? (
						stickerProps.children
					) : stickerProps.content ? (
						stickerProps.content
					) : (
						<ClayIcon
							spritemap={spritemap}
							symbol={stickerSymbol}
						/>
					)}
				</ClaySticker>
			)}
		</ClayCard.AspectRatio>
	);

	return (
		<ClayCard
			{...otherProps}
			active={selected}
			displayType={isCardType.image ? 'image' : 'file'}
			selectable={!!onSelectChange}
		>
			{onSelectChange &&
				(selectableType === 'radio' ? (
					<ClayRadio
						{...radioProps}
						checked={selected}
						disabled={disabled}
						onChange={({target: {value}}) => onSelectChange(value)}
					>
						{headerContent}
					</ClayRadio>
				) : (
					<ClayCheckbox
						{...checkboxProps}
						checked={selected}
						disabled={disabled}
						onChange={() => onSelectChange(!selected)}
					>
						{headerContent}
					</ClayCheckbox>
				))}

			{!onSelectChange && headerContent}

			<ClayCard.Body>
				<ClayCard.Row>
					<ClayLayout.ContentCol expand>
						<ClayCard.Description
							aria-label={ariaLabel ?? title}
							disabled={disabled}
							displayType="title"
							href={href}
							truncate={truncate}
						>
							{title}
						</ClayCard.Description>

						{description && (
							<ClayCard.Description
								displayType="subtitle"
								truncate={truncate}
							>
								{description}
							</ClayCard.Description>
						)}

						{labels && (
							<ClayCard.Caption>
								{labels.map(({value, ...others}, i: number) => (
									<ClayLabel {...others} key={i}>
										{value}
									</ClayLabel>
								))}
							</ClayCard.Caption>
						)}
					</ClayLayout.ContentCol>

					{actions && (
						<ClayLayout.ContentCol>
							<ClayDropDownWithItems
								items={actions}
								spritemap={spritemap}
								trigger={
									<ClayButtonWithIcon
										{...(dropDownTriggerProps as ButtonWithIconProps)}
										className="component-action"
										disabled={disabled}
										displayType="unstyled"
										spritemap={spritemap}
										symbol="ellipsis-v"
									/>
								}
							/>
						</ClayLayout.ContentCol>
					)}
				</ClayCard.Row>
			</ClayCard.Body>
		</ClayCard>
	);
};

/**
 * SPDX-FileCopyrightText: © 2025 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import ClayIcon from '@clayui/icon';
import ClayLabel from '@clayui/label';
import ClayLayout from '@clayui/layout';
import {InternalDispatch, sub} from '@clayui/shared';
import classNames from 'classnames';
import React from 'react';

import {Option, Picker} from '../picker';

type DisplayType = 'info' | 'secondary' | 'success' | 'warning';

type Item = {
	id: string;
	label: string;
	name?: string;
	symbol: string;
};

type Messages = {
	default: string;
	option: string;
	trigger: string;
	translated: string;
	translating: string;
	untranslated: string;
};

type Translation = {total: number; translated: number};

type Translations = {
	[key: string]: Translation;
};

type Props = {
	/**
	 * Flag to indicate if the Picker is active or not (controlled).
	 */
	active?: boolean;

	/**
	 * Class names for the trigger.
	 */
	classNamesTrigger?: string;

	/**
	 * Property to set the default value of `active` (uncontrolled).
	 */
	defaultActive?: boolean;

	/**
	 * The default locale id.
	 */
	defaultLocaleId?: React.Key;

	/**
	 * The initial selected locale id (uncontrolled).
	 */
	defaultSelectedLocaleId?: React.Key;

	/**
	 * Flag to hide the text in the trigger.
	 */

	hideTriggerText?: boolean;

	/**
	 * The id of the component.
	 */
	id?: string;

	/**
	 * Messages for the component.
	 */
	messages?: Messages;

	/**
	 * List of locales to allow localization for.
	 */
	locales: Array<Item>;

	/**
	 * Callback for when the active state changes (controlled).
	 */
	onActiveChange?: InternalDispatch<boolean>;

	/**
	 * Callback that gets called when a selected locale gets changed.
	 */
	onSelectedLocaleChange?: InternalDispatch<React.Key>;

	/**
	 * Exposes the currently selected locale id (controlled).
	 */
	selectedLocaleId?: React.Key;

	/**
	 * Flag to show the picker in small size.
	 */
	small?: boolean;

	/**
	 * Path to the location of the spritemap resource.
	 */
	spritemap?: string;

	/**
	 * Translations provided to the component to display the translation language status.
	 */
	translations?: Translations;
};

const getTranslationLabel = ({
	defaultLocaleId,
	localeId,
	messages,
	translation,
}: {
	defaultLocaleId: React.Key;
	localeId: React.Key;
	messages: Messages;
	translation: Translation;
}) => {
	let displayType: DisplayType = 'warning';
	let label: string = messages.untranslated;

	if (localeId === defaultLocaleId) {
		displayType = 'info';
		label = messages.default;
	} else if (translation) {
		const {total, translated} = translation;

		if (total && total === translated) {
			displayType = 'success';
			label = messages.translated;
		} else {
			displayType = 'secondary';
			label = sub(messages.translating, [translated, total]);
		}
	}

	return {displayType, label};
};

const Trigger = React.forwardRef<HTMLButtonElement>(
	(
		{
			classNamesTrigger,
			hideTriggerText,
			locales,
			selectedLocale,
			small,
			spritemap,
			triggerMessage,
			...otherProps
		}: Record<string, any>,
		ref
	) => {
		const selectedItem =
			selectedLocale ||
			locales.find(
				(locale: Item) => locale.label === otherProps['children']
			);

		return (
			<button
				{...otherProps}
				aria-label={sub(triggerMessage, [
					selectedItem?.name || selectedItem?.label,
				])}
				className={classNames(
					classNamesTrigger,
					'form-control form-control-select form-control-select-secondary',
					{
						'form-control-sm': small,
						'hidden-label': hideTriggerText,
					}
				)}
				ref={ref}
			>
				<span className="inline-item-before">
					<ClayIcon
						spritemap={spritemap}
						symbol={selectedItem.symbol}
					/>
				</span>

				{!hideTriggerText ? (
					<span className="inline-item-before">
						{selectedItem.label}
					</span>
				) : null}
			</button>
		);
	}
);

Trigger.displayName = 'Trigger';

export function LanguagePicker({
	active,
	classNamesTrigger,
	defaultActive = false,
	defaultLocaleId,
	defaultSelectedLocaleId,
	hideTriggerText,
	id,
	messages = {
		default: 'Default',
		option: '{0} language: {1}.',
		translated: 'Translated',
		translating: 'Translating {0}/{1}',
		trigger: 'Select a language, current language: {0}.',
		untranslated: 'Untranslated',
	},
	locales,
	onActiveChange,
	onSelectedLocaleChange,
	selectedLocaleId,
	small,
	spritemap,
	translations = {},
}: Props) {
	const hasTranslations = Object.keys(translations).length;
	const selectedLocale = locales.find(({id}) => id === selectedLocaleId);

	return (
		<Picker
			active={active}
			as={Trigger}
			classNamesTrigger={classNamesTrigger}
			defaultActive={defaultActive}
			defaultSelectedKey={defaultSelectedLocaleId || locales[0]!.id}
			hideTriggerText={hideTriggerText}
			id={id}
			items={locales}
			locales={locales}
			onActiveChange={onActiveChange}
			onSelectionChange={onSelectedLocaleChange}
			selectedKey={selectedLocaleId}
			selectedLocale={selectedLocale}
			small={small}
			spritemap={spritemap}
			triggerMessage={messages.trigger}
		>
			{(locale) => {
				const translationLabel = getTranslationLabel({
					defaultLocaleId: defaultLocaleId || locales[0]!.id,
					localeId: locale.id,
					messages,
					translation: translations[locale.label]!,
				});

				return (
					<Option
						aria-label={sub(messages.option, [
							locale.name || locale.label,
							translationLabel.label,
						])}
						key={locale.id}
						textValue={locale.label}
					>
						<ClayLayout.ContentRow containerElement="span">
							<ClayLayout.ContentCol
								containerElement="span"
								expand
							>
								<ClayLayout.ContentSection>
									<ClayIcon
										className="inline-item inline-item-before"
										spritemap={spritemap}
										symbol={locale.symbol}
									/>

									<span aria-hidden="true">
										{locale.label}
									</span>
								</ClayLayout.ContentSection>
							</ClayLayout.ContentCol>
							{hasTranslations ? (
								<ClayLayout.ContentCol containerElement="span">
									<ClayLayout.ContentSection>
										<ClayLabel
											aria-hidden="true"
											className="c-ml-3"
											displayType={
												translationLabel.displayType
											}
										>
											{translationLabel.label}

											<span className="sr-only">
												{sub(messages.option, [
													locale.name || locale.label,
													translationLabel.label,
												])}
											</span>
										</ClayLabel>
									</ClayLayout.ContentSection>
								</ClayLayout.ContentCol>
							) : null}
						</ClayLayout.ContentRow>
					</Option>
				);
			}}
		</Picker>
	);
}

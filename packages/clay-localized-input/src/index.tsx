/**
 * SPDX-FileCopyrightText: © 2020 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import ClayButton from '@clayui/button';
import ClayDropDown from '@clayui/drop-down';
import ClayForm, {ClayInput} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import ClayLabel from '@clayui/label';
import ClayLayout from '@clayui/layout';
import React from 'react';

interface IItem {
	label: string;
	symbol: string;
}

interface ITranslations {
	[key: string]: string;
}

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
	/**
	 * Labels for the aria attributes
	 */
	ariaLabels?: {
		default: string;
		openLocalizations: string;
		translated: string;
		untranslated: string;
	};

	/**
	 * Add informational text at the top of Localized Input.
	 */
	helpText?: React.ReactText;

	/**
	 * Label of the input
	 */
	label?: React.ReactText;

	/**
	 * Content to be prepended in case you want to localize a URL.
	 */
	prependContent?: React.ReactText;

	/**
	 * List of locales to allow localization for
	 */
	locales: Array<IItem>;

	/**
	 * Callback that gets called when a selected locale gets changed
	 */
	onSelectedLocaleChange: (val: IItem) => void;

	/**
	 * Callback that gets called when a translation of the selected locale gets changed
	 */
	onTranslationsChange: (val: ITranslations) => void;

	/**
	 * Allows specifying custom formatter, for example for formatting URLs, to be output after translating
	 */
	resultFormatter?: (val: string) => React.ReactNode;

	/**
	 * Exposes the currently selected locale
	 */
	selectedLocale: IItem;

	/**
	 * Path to the location of the spritemap resource.
	 */
	spritemap?: string;

	/**
	 * Translations provided to the component to be used and modified by it
	 */
	translations: ITranslations;
}

const LocalizedInput = React.forwardRef<HTMLInputElement, IProps>(
	(
		{
			ariaLabels = {
				default: 'Default',
				openLocalizations: 'Open Localizations',
				translated: 'Translated',
				untranslated: 'Untranslated',
			},
			helpText,
			id,
			label = 'Check for translations',
			locales,
			onSelectedLocaleChange,
			onTranslationsChange,
			placeholder = 'Text to translate...',
			prependContent,
			resultFormatter = (val) => val,
			selectedLocale,
			spritemap,
			translations,
			...otherProps
		}: IProps,
		ref
	) => {
		const [active, setActive] = React.useState(false);

		const defaultLanguage = locales[0]!;

		return (
			<ClayForm.Group>
				{label && <label htmlFor={id}>{label}</label>}

				{helpText && <ClayForm.Text>{helpText}</ClayForm.Text>}

				<ClayInput.Group>
					{prependContent && (
						<ClayInput.GroupItem prepend shrink>
							<ClayInput.GroupText>
								{prependContent}
							</ClayInput.GroupText>
						</ClayInput.GroupItem>
					)}

					<ClayInput.GroupItem append={prependContent ? true : false}>
						<ClayInput
							{...otherProps}
							id={id}
							onChange={(event) => {
								onTranslationsChange({
									...translations,
									[selectedLocale.label]: event.target.value,
								});
							}}
							placeholder={placeholder}
							ref={ref}
							type="text"
							value={translations[selectedLocale.label] || ''}
						/>
					</ClayInput.GroupItem>

					<ClayInput.GroupItem shrink>
						<ClayDropDown
							active={active}
							onActiveChange={setActive}
							trigger={
								<ClayButton
									displayType="secondary"
									monospaced
									onClick={() => setActive(!active)}
									title={ariaLabels.openLocalizations}
								>
									<span className="inline-item">
										<ClayIcon
											spritemap={spritemap}
											symbol={selectedLocale.symbol}
										/>
									</span>
									<span className="btn-section">
										{selectedLocale.label}
									</span>
								</ClayButton>
							}
						>
							<ClayDropDown.ItemList>
								{locales.map((locale) => {
									const value = translations[locale.label];

									return (
										<ClayDropDown.Item
											key={locale.label}
											onClick={() =>
												onSelectedLocaleChange(locale)
											}
										>
											<ClayLayout.ContentRow containerElement="span">
												<ClayLayout.ContentCol
													containerElement="span"
													expand
												>
													<ClayLayout.ContentSection>
														<ClayIcon
															className="inline-item inline-item-before"
															spritemap={
																spritemap
															}
															symbol={
																locale.symbol
															}
														/>

														{locale.label}
													</ClayLayout.ContentSection>
												</ClayLayout.ContentCol>
												<ClayLayout.ContentCol containerElement="span">
													<ClayLayout.ContentSection>
														<ClayLabel
															displayType={
																locale.label ===
																defaultLanguage.label
																	? 'info'
																	: value
																	? 'success'
																	: 'warning'
															}
														>
															{locale.label ===
															defaultLanguage.label
																? ariaLabels.default
																: value
																? ariaLabels.translated
																: ariaLabels.untranslated}
														</ClayLabel>
													</ClayLayout.ContentSection>
												</ClayLayout.ContentCol>
											</ClayLayout.ContentRow>
										</ClayDropDown.Item>
									);
								})}
							</ClayDropDown.ItemList>
						</ClayDropDown>
					</ClayInput.GroupItem>
				</ClayInput.Group>

				<ClayForm.Text>
					{resultFormatter(translations[defaultLanguage.label]!)}
				</ClayForm.Text>
			</ClayForm.Group>
		);
	}
);

LocalizedInput.displayName = 'ClayLocalizedInput';

export default LocalizedInput;

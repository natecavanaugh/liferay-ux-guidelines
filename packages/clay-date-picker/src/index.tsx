/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import Button from '@clayui/button';
import DropDown from '@clayui/drop-down';
import {ClayInput} from '@clayui/form';
import Icon from '@clayui/icon';
import {
	FocusScope,
	InternalDispatch,
	useControlledState,
	useId,
} from '@clayui/shared';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import DateNavigation from './DateNavigation';
import DayNumber from './DayNumber';
import DaysTable from './DaysTable';
import {
	formatDate,
	isValid,
	parseDate,
	range as createRange,
	setDate,
	setMonth,
} from './Helpers';
import {
	useCalendarNavigation,
	useCurrentTime,
	useDaysSelected,
	useWeeks,
} from './Hooks';
import InputDate from './InputDate';
import TimePicker from './TimePicker';
import Weekday from './Weekday';
import WeekdayHeader from './WeekdayHeader';
import {IAriaLabels, IYears} from './types';

import type {Input} from '@clayui/time-picker';

import type {ISelectOption} from './Select';

enum FirstDayOfWeek {
	Sunday = 0,
	Monday = 1,
	Tuesday = 2,
	Wednesday = 3,
	Thursday = 4,
	Friday = 5,
	Saturday = 6,
}

interface IProps
	extends Omit<React.HTMLAttributes<HTMLInputElement>, 'onChange'> {
	/**
	 * Labels for the aria attributes
	 */
	ariaLabels?: IAriaLabels;

	/**
	 * Set the format of how the date will appear in the input element.
	 * See available: https://date-fns.org/v2.14.0/docs/format
	 */
	dateFormat?: string;

	/**
	 * Property to set if expanded by default (uncontrolled).
	 */
	defaultExpanded?: boolean;

	/**
	 * The start date to be displayed on the calendar as "Today". Used to mark
	 * the start date of the day and when resetting.
	 */
	defaultMonth?: Date;

	/**
	 * Property to set the default value (uncontrolled).
	 */
	defaultValue?: string;

	/**
	 * Flag to disable the component, buttons, open the datepicker, etc...
	 */
	disabled?: boolean;

	/**
	 * Determines if menu is expanded or not (controlled).
	 */
	expanded?: boolean;

	/**
	 * Set the first day of the week, starting from
	 * 0 (Sunday) to 6 (Saturday).
	 */
	firstDayOfWeek?: FirstDayOfWeek;

	/**
	 * Function that should return the React element to
	 * render on the datepicker footer.
	 */
	footerElement?: (object: {spritemap?: string}) => React.ReactNode;

	/**
	 * Id to be applied to the element.
	 */
	id?: string;

	/**
	 * Flag to indicate if date is initially expanded when
	 * `expand` and `onExpandChange` are not being used.
	 * @deprecated since v3.51.0 - use `defaultExpanded` instead.
	 */
	initialExpanded?: boolean;

	/**
	 * The start date to be displayed on the calendar as "Today". Used to mark
	 * the start date of the day and when resetting.
	 * @deprecated since v3.51.0 - use `defaultMonth` instead.
	 */
	initialMonth?: Date;

	/**
	 * Name of the input.
	 */
	inputName?: string;

	/**
	 * The names of the months.
	 */
	months?: Array<string>;

	/**
	 * Callback that is called when the value changes (controlled).
	 */
	onChange?: InternalDispatch<string>;

	/**
	 * Callback for when dropdown changes its expanded state (controlled).
	 */
	onExpandedChange?: InternalDispatch<boolean>;

	/**
	 * Called when the user is browsing the date picker, changing the
	 * month, year and navigating with arrows.
	 */
	onNavigation?: (data: Date) => void;

	/**
	 * Called when the input change.
	 *
	 * Second argument gives the type that caused the value change
	 * @deprecated since v3.51.0 - use `onChange` instead.
	 */
	onValueChange?: InternalDispatch<string>;

	/**
	 * Describe a brief tip to help users interact.
	 */
	placeholder?: string;

	/** *
	 * Flag to indicate the user will use the date-range date-picker
	 */
	range?: boolean;

	/**
	 * Path to the location of the spritemap resource.
	 */
	spritemap?: string;

	/**
	 * Flag to enable datetime selection.
	 */
	time?: boolean;

	/**
	 * Flag to indicate the timezone of the Time Picker.
	 */
	timezone?: string;

	/**
	 * Flag to indicate if 12-hour use, when true, should show am/pm input.
	 */
	use12Hours?: boolean;

	/**
	 * Flag to indicate whether to use native date picker
	 */
	useNative?: boolean;

	/**
	 * The value property sets the current value (controlled).
	 */
	value?: string;

	/**
	 * Short names of days of the week to use in the header
	 * of the month. It should start from Sunday.
	 */
	weekdaysShort?: Array<string>;

	/**
	 * List of years available for navigation within the selector.
	 */
	years?: {
		end: number;
		start: number;
	};

	/**
	 * Flag to indicate whether the DatePicker should validate if the year
	 * is included in the range of years. Disable only if your range is dynamic.
	 */
	yearsCheck?: boolean;
}

const DEFAULT_DATE_TIME = {
	hours: 12,
	milliseconds: 0,
	minutes: 0,
	seconds: 0,
};

const NEW_DATE = new Date();

const TIME_FORMAT = 'HH:mm';

const TIME_FORMAT_12H = 'hh:mm aa';

const normalizeTime = (date: Date) =>
	setDate(date, {hours: 12, milliseconds: 0, minutes: 0, seconds: 0});

const DatePicker = React.forwardRef<HTMLInputElement, IProps>(
	(
		{
			ariaLabels = {
				buttonChooseDate: 'Choose date',
				buttonDot: 'Select current date',
				buttonNextMonth: 'Select the next month',
				buttonPreviousMonth: 'Select the previous month',
				dialog: 'Choose date',
			},
			dateFormat = 'yyyy-MM-dd',
			defaultExpanded,
			defaultMonth,
			defaultValue,
			disabled,
			expanded,
			firstDayOfWeek = 0,
			footerElement,
			id,
			initialExpanded = false,
			initialMonth = NEW_DATE,
			inputName,
			months = [
				'January',
				'February',
				'March',
				'April',
				'May',
				'June',
				'July',
				'August',
				'September',
				'October',
				'November',
				'December',
			],
			onChange,
			onExpandedChange,
			onNavigation = () => {},
			onValueChange,
			placeholder,
			range,
			spritemap,
			time = false,
			timezone,
			use12Hours = false,
			useNative = false,
			value,
			weekdaysShort = ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
			years = {
				end: NEW_DATE.getFullYear(),
				start: NEW_DATE.getFullYear(),
			},
			yearsCheck = true,
			...otherProps
		}: IProps,
		ref
	) => {
		// For backward compatibility `defaultMonth` is just an alias for
		// `initialMonth`.
		initialMonth = defaultMonth ?? initialMonth;

		const [internalValue, setValue, isUncontrolled] = useControlledState({
			defaultName: 'defaultValue',
			defaultValue,
			handleName: 'onChange',
			name: 'value',
			onChange: onChange ?? onValueChange,
			value,
		});

		/**
		 * DaysSelected is a tuple that represents [startDate, endDate]
		 * in the cases where We have a date range and when `range` property
		 * is disabled we will just use the first element of the tuple(startDate)
		 */
		const [daysSelected, setDaysSelected] = useDaysSelected(() => {
			if (internalValue) {
				const days = hasDaysSelected({
					checkRangeYears: yearsCheck,
					dateFormat,
					is12Hours: use12Hours,
					isTime: time,
					value: internalValue,
					years,
				});

				if (days) {
					return [normalizeTime(days[0]!), normalizeTime(days[1]!)];
				}
			}

			const date = normalizeTime(initialMonth);

			return [date, date] as const;
		});

		/**
		 * Indicates the current month rendered on the screen.
		 */
		const [currentMonth, setCurrentMonth] = useState(() =>
			// Normalize the date to always set noon to avoid time zone problems
			// and to the 1st of the month.
			setDate(daysSelected[0], {date: 1, ...DEFAULT_DATE_TIME})
		);

		const chooseDateRef = useRef<HTMLButtonElement>(null);

		/**
		 * Indicates the time selected by the user.
		 */
		const [currentTime, setCurrentTime] = useCurrentTime(() => {
			if (time && internalValue) {
				const [startDate] = fromStringToRange(
					internalValue,
					`${dateFormat} ${
						use12Hours ? TIME_FORMAT_12H : TIME_FORMAT
					}`,
					NEW_DATE
				);

				if (startDate.toString() !== 'Invalid Date') {
					const hours = use12Hours
						? formatDate(startDate, 'hh')
						: formatDate(startDate, 'HH');

					const minutes = formatDate(startDate, 'mm');

					return use12Hours
						? `${hours}:${minutes} ${formatDate(startDate, 'a')}`
						: `${hours}:${minutes}`;
				}
			}

			return '--:--';
		}, use12Hours);

		/**
		 * An array of the weeks and days list for the current month
		 */
		const [weeks, setWeeks] = useWeeks(currentMonth, firstDayOfWeek);

		/**
		 * Flag to indicate if date is expanded. Uses an internal state value
		 * if component is not controlled by props.
		 */
		const [expandedValue, setExpandedValue] = useControlledState({
			defaultName: 'defaultExpanded',
			defaultValue:
				defaultExpanded === undefined
					? initialExpanded
					: defaultExpanded,
			handleName: 'onExpandedChange',
			name: 'expanded',
			onChange: onExpandedChange,
			value: expanded,
		});

		/**
		 * Create a ref to store the datepicker DOM element
		 */
		const triggerElementRef = useRef<HTMLDivElement | null>(null);

		/**
		 * Handles the change of the current month of the Date Picker
		 * content and takes care of updating the weeks.
		 */
		const changeMonth = (date: Date) => {
			const dateNormalized = setDate(date, {
				date: 1,
				...DEFAULT_DATE_TIME,
			});

			setCurrentMonth(dateNormalized);
			onNavigation(dateNormalized);

			// It is not necessary to update the weeks when the native
			// date is enabled. Unnecessary rendering and processing.
			if (!useNative) {
				setWeeks(dateNormalized);
			}
		};

		const memoizedYears = useMemo<Array<ISelectOption>>(
			() =>
				createRange(years).map((elem) => {
					return {
						label: elem,
						value: elem,
					};
				}),
			[years]
		);

		const memoizedMonths = useMemo<Array<ISelectOption>>(
			() =>
				months.map((month, index) => {
					return {
						label: month,
						value: index,
					};
				}),
			[months]
		);

		/**
		 * Handles the click on element of the day
		 */
		const handleDayClicked = (date: Date) => {
			const [startDate, endDate] = daysSelected;

			let newDaysSelected: [Date, Date];
			let daysSelectedToString;

			if (range) {
				if (startDate.toString() !== endDate.toString()) {
					newDaysSelected = [date, date];
				} else if (date < startDate) {
					newDaysSelected = [date, endDate];
				} else {
					newDaysSelected = [startDate, date];
				}

				daysSelectedToString = fromRangeToString(
					newDaysSelected,
					dateFormat
				);

				const [newStartDate, newEndDate] = newDaysSelected;

				if (newStartDate.getMonth() !== newEndDate.getMonth()) {
					changeMonth(startDate);
				}
			} else {
				newDaysSelected = [date, date];

				daysSelectedToString = formatDate(date, dateFormat);

				if (time) {
					daysSelectedToString = `${daysSelectedToString} ${currentTime}`;
				}
			}

			setDaysSelected(newDaysSelected);
			setValue(daysSelectedToString);
		};

		const updateDate = useCallback(
			(value: string) => {
				if (!value) {
					changeMonth(initialMonth);

					setDaysSelected([initialMonth, initialMonth]);

					if (time) {
						setCurrentTime('--', '--', undefined);
					}
				} else {
					const days = hasDaysSelected({
						checkRangeYears: yearsCheck,
						dateFormat,
						is12Hours: use12Hours,
						isTime: time,
						value,
						years,
					});

					if (days) {
						const [startDate, endDate] = days;

						changeMonth(startDate!);

						setDaysSelected([startDate!, endDate!]);

						if (time) {
							setCurrentTime(
								startDate!.getHours(),
								startDate!.getMinutes(),
								use12Hours
									? (formatDate(
											startDate!,
											'a'
									  ) as Input['ampm'])
									: undefined
							);
						}
					}
				}
			},
			[dateFormat, use12Hours, time, years, yearsCheck]
		);

		/**
		 * Control the value of the input propagating with the call
		 * of `onChange` but does not change what the user types,
		 * if a date is valid the month of the Date Picker is changed.
		 */
		const inputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
			const {value} = event.target;

			updateDate(value);
			setValue(value);
		};

		useEffect(() => {
			if (!isUncontrolled) {
				updateDate(internalValue);
			}
		}, [isUncontrolled, internalValue]);

		/**
		 * Changes selected date to the current date. The same happens when there
		 * is no date selected.
		 */
		const handleDotClicked = () => {
			const [, endDate] = daysSelected;

			changeMonth(initialMonth);

			const newDaysSelected: [Date, Date] =
				range && endDate < initialMonth
					? [endDate, initialMonth]
					: [initialMonth, endDate];

			let dateFormatted;

			if (range) {
				dateFormatted = fromRangeToString(newDaysSelected, dateFormat);
			} else if (time) {
				dateFormatted = `${formatDate(
					initialMonth,
					dateFormat
				)} ${setCurrentTime(
					initialMonth.getHours(),
					initialMonth.getMinutes(),
					use12Hours
						? (formatDate(initialMonth, 'a') as Input['ampm'])
						: undefined
				)}`;
			} else {
				dateFormatted = formatDate(initialMonth, dateFormat);
			}

			setDaysSelected(newDaysSelected);
			setValue(dateFormatted);
		};

		const handleTimeChange = (
			hours: number | string,
			minutes: number | string,
			ampm?: Input['ampm']
		) => {
			const [day] = daysSelected;

			if (hours === '--' && typeof minutes === 'number') {
				hours = 0;
			}

			if (minutes === '--' && typeof hours === 'number') {
				minutes = 0;
			}

			if (internalValue) {
				let date =
					typeof hours === 'string' && typeof minutes === 'string'
						? `${formatDate(day, dateFormat)} ${hours}:${minutes}`
						: formatDate(
								setDate(day, {hours, minutes}),
								`${dateFormat} ${TIME_FORMAT}`
						  );

				if (use12Hours) {
					date += ` ${ampm}`;
				}

				setValue(date);
			}

			setCurrentTime(hours, minutes, use12Hours ? ampm : undefined);
		};

		/**
		 * Handles datepicker view
		 */
		const handleCalendarButtonClicked = () =>
			setExpandedValue(!expandedValue);

		const calendarNavigation = useCalendarNavigation({
			daysSelected,
			isOpen: expandedValue,
			onChangeMonth: (month, year) => {
				if (typeof year === 'number') {
					changeMonth(
						setDate(currentMonth, {
							year: currentMonth.getFullYear() + year,
						})
					);
				} else {
					const date = setMonth(memoizedYears, month, currentMonth);

					if (date) {
						changeMonth(date);
					}
				}
			},
			weeks,
		});

		const ariaControls = useId();

		return (
			<FocusScope arrowKeysUpDown={false}>
				<div className="date-picker">
					<ClayInput.Group ref={triggerElementRef}>
						<ClayInput.GroupItem className="input-group-item-focusable">
							<InputDate
								{...otherProps}
								ariaLabel={ariaLabels.input}
								disabled={disabled}
								id={id}
								inputName={inputName}
								onChange={inputChange}
								placeholder={placeholder}
								ref={ref}
								useNative={useNative}
								value={internalValue}
							/>
							{!useNative && (
								<ClayInput.GroupInsetItem after>
									<Button
										aria-controls={ariaControls}
										aria-expanded={expandedValue}
										aria-haspopup="dialog"
										aria-label={ariaLabels.buttonChooseDate}
										className="date-picker-dropdown-toggle"
										data-testid="date-button"
										disabled={disabled}
										displayType="unstyled"
										onClick={handleCalendarButtonClicked}
										ref={chooseDateRef}
									>
										<Icon
											spritemap={spritemap}
											symbol="calendar"
										/>
									</Button>
								</ClayInput.GroupInsetItem>
							)}
						</ClayInput.GroupItem>
					</ClayInput.Group>

					{!useNative && (
						<DropDown.Menu
							active={expandedValue}
							alignElementRef={triggerElementRef}
							aria-label={ariaLabels.dialog}
							className="date-picker date-picker-dropdown-menu"
							data-testid="dropdown"
							id={ariaControls}
							lock
							onActiveChange={setExpandedValue}
							role="dialog"
							triggerRef={chooseDateRef}
						>
							<div
								aria-label={formatDate(
									currentMonth,
									'MMMM yyyy'
								)}
								className="date-picker-calendar"
								role="group"
							>
								<DateNavigation
									ariaLabels={ariaLabels}
									currentMonth={currentMonth}
									disabled={disabled}
									months={memoizedMonths}
									onDotClicked={handleDotClicked}
									onMonthChange={changeMonth}
									spritemap={spritemap}
									years={memoizedYears}
								/>
								<div
									{...calendarNavigation.gridProps}
									className="date-picker-calendar-body"
									role="grid"
								>
									<WeekdayHeader
										firstDayOfWeek={firstDayOfWeek}
										weekdaysShort={weekdaysShort}
									>
										{({key, weekday}) => (
											<Weekday
												key={key}
												weekday={weekday}
											/>
										)}
									</WeekdayHeader>
									<DaysTable weeks={weeks}>
										{({day, key}) => (
											<DayNumber
												day={day}
												daysSelected={daysSelected}
												disabled={disabled}
												index={key}
												isFocused={calendarNavigation.isFocused(
													day
												)}
												key={key}
												onClick={handleDayClicked}
												range={range}
											/>
										)}
									</DaysTable>
								</div>
								{(footerElement || time) && (
									<div className="date-picker-calendar-footer">
										{time && (
											<TimePicker
												currentTime={currentTime}
												disabled={disabled}
												onTimeChange={handleTimeChange}
												spritemap={spritemap}
												timezone={timezone}
												use12Hours={use12Hours}
											/>
										)}
										{!time &&
											footerElement &&
											React.Children.only(
												footerElement({spritemap})
											)}
									</div>
								)}
							</div>
						</DropDown.Menu>
					)}
				</div>
			</FocusScope>
		);
	}
);

const RANGE_SEPARATOR = ' - ';

function isYearWithinYears(year: number, years: IYears) {
	return years.start <= year && year <= years.end;
}

function fromStringToRange(
	value: string,
	dateFormat: string,
	referenceDate: Date
): readonly [Date, Date] {
	const [startDateString, endDateString] = value.split(RANGE_SEPARATOR);

	const startDate = parseDate(startDateString!, dateFormat, referenceDate);

	return [
		startDate,
		endDateString
			? parseDate(endDateString, dateFormat, referenceDate)
			: startDate,
	];
}

type Options = {
	checkRangeYears: boolean;
	dateFormat: string;
	is12Hours: boolean;
	isTime: boolean;
	value: string;
	years: IYears;
};

function hasDaysSelected({
	checkRangeYears,
	dateFormat,
	is12Hours,
	isTime,
	value,
	years,
}: Options) {
	const [startDate, endDate] = fromStringToRange(
		value,
		isTime
			? `${dateFormat} ${is12Hours ? TIME_FORMAT_12H : TIME_FORMAT}`
			: dateFormat,
		NEW_DATE
	);

	const isValidYear = checkRangeYears
		? isYearWithinYears(startDate.getFullYear(), years) &&
		  isYearWithinYears(endDate.getFullYear(), years)
		: true;

	if (isValid(startDate) && isValid(endDate) && isValidYear) {
		return [startDate, endDate];
	}
}

function fromRangeToString(range: [Date, Date], dateFormat: string) {
	const [startDate, endDate] = range;

	return `${formatDate(startDate, dateFormat)}${RANGE_SEPARATOR}${formatDate(
		endDate,
		dateFormat
	)}`;
}

DatePicker.displayName = 'ClayDatePicker';

export {FirstDayOfWeek};
export default DatePicker;

/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {Keys} from '@clayui/shared';
import React, {useCallback, useEffect, useRef, useState} from 'react';

import {IDay, Month, WeekDays, clone, formatDate, setDate} from './Helpers';
import {FirstDayOfWeek} from './types';

import type {Input} from '@clayui/time-picker';

const normalizeTime = (date: Date) =>
	setDate(date, {hours: 12, milliseconds: 0, minutes: 0, seconds: 0});

/**
 * Handles selected days and stabilize date time when set to avoid problems
 * when the range is used to check intervals.
 */
export const useDaysSelected = (defaultDays: () => readonly [Date, Date]) => {
	const [daysSelected, set] = useState(defaultDays);

	const setDaysSelected = useCallback(([start, end]: [Date, Date]) => {
		// Preserves the reference of dates
		if (start === end) {
			const date = normalizeTime(start);

			set([date, date]);
		} else {
			set([normalizeTime(start), normalizeTime(end)]);
		}
	}, []);

	return [daysSelected, setDaysSelected] as const;
};

/**
 * Generates the table of days of the month.
 */
export const useWeeks = (
	currentMonth: Date,
	firstDayOfWeek: FirstDayOfWeek
) => {
	const [weeks, set] = useState<Month>(() =>
		getWeekArray(currentMonth, firstDayOfWeek)
	);

	const setWeeks = useCallback(
		(value: Date) => set(getWeekArray(value, firstDayOfWeek)),
		[firstDayOfWeek]
	);

	return [weeks, setWeeks] as [Month, (value: Date) => void];
};

/**
 * Sets the current time
 */
export const useCurrentTime = (
	defaultTime: () => string,
	use12Hours: boolean
) => {
	const [currentTime, set] = useState<string>(defaultTime);

	const setCurrentTime = useCallback(
		(
			hours: number | string,
			minutes: number | string,
			ampm?: Input['ampm']
		) => {
			const date = setDate(new Date(), {hours, minutes});

			if (typeof hours !== 'string') {
				if (use12Hours) {
					hours = formatDate(date, 'hh');
				} else {
					hours = formatDate(date, 'HH');
				}
			}

			if (typeof minutes !== 'string') {
				minutes = formatDate(date, 'mm');
			}

			const value = ampm
				? `${hours}:${minutes} ${ampm}`
				: `${hours}:${minutes}`;

			set(value);

			return value;
		},
		[use12Hours]
	);

	return [currentTime, setCurrentTime] as const;
};

type CalendarNavigationProps = {
	daysSelected: readonly [Date, Date];
	isOpen: boolean;
	onChangeMonth: (month: number, year?: number) => void;
	weeks: Month;
};

export const useCalendarNavigation = ({
	daysSelected,
	isOpen,
	onChangeMonth,
	weeks,
}: CalendarNavigationProps) => {
	const [lastItemFocused, setLastItemFocused] = useState<string | null>(null);

	const gridRef = useRef<HTMLDivElement>(null);
	const lastKeyPressed = useRef<string>('');
	const hasNextFocus = useRef<boolean>(false);

	const focusNext = useCallback((day: IDay) => {
		if (!gridRef.current) {
			return;
		}

		const nextFocusElement =
			gridRef.current.querySelector<HTMLButtonElement>(
				`button[aria-label="${setDate(day.date, {
					hours: 12,
					milliseconds: 0,
					minutes: 0,
					seconds: 0,
				}).toDateString()}"]`
			);

		if (nextFocusElement) {
			nextFocusElement!.focus();
			setLastItemFocused(String(day.date.getDate()));
		}
	}, []);

	const onKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLElement>) => {
			switch (event.key) {
				case Keys.Down:
				case Keys.Up:
				case Keys.Right:
				case Keys.Left: {
					event.preventDefault();

					const currentRowPosition = Number(
						document
							.activeElement!.closest('[role=row]')!
							.getAttribute('data-index')
					);
					const position = Number(
						document.activeElement!.getAttribute('data-index')
					);

					const currentRow = weeks[currentRowPosition]!;

					let nextFocus: IDay | null | undefined = null;

					switch (event.key) {
						case Keys.Right:
						case Keys.Left: {
							nextFocus =
								currentRow[
									event.key === Keys.Left
										? position - 1
										: position + 1
								];

							if (!nextFocus) {
								nextFocus =
									weeks[
										event.key === Keys.Left
											? currentRowPosition - 1
											: currentRowPosition + 1
									]?.[
										event.key === Keys.Left
											? currentRow.length - 1
											: 0
									];
							}
							break;
						}
						case Keys.Up:
						case Keys.Down: {
							nextFocus =
								weeks[
									event.key === Keys.Up
										? currentRowPosition - 1
										: currentRowPosition + 1
								]?.[position];
							break;
						}
						default:
							break;
					}

					if (
						nextFocus &&
						!nextFocus.nextMonth &&
						!nextFocus.previousMonth
					) {
						focusNext(nextFocus);
					} else {
						onChangeMonth(
							event.key === Keys.Left || event.key === Keys.Up
								? -1
								: 1
						);
						lastKeyPressed.current = event.key;
						hasNextFocus.current = true;
					}

					break;
				}
				case Keys.End:
				case Keys.Home: {
					event.preventDefault();

					const grid =
						event.currentTarget.querySelectorAll<HTMLElement>(
							'button:not(.previous-month-date):not(.next-month-date)'
						);

					const day =
						grid[event.key === Keys.Home ? 0 : grid.length - 1];

					if (day) {
						day.focus();
						setLastItemFocused(day.innerText);
					}
					break;
				}
				case 'PageDown':
				case 'PageUp': {
					event.preventDefault();

					const value = event.key === 'PageUp' ? -1 : 1;

					if (event.shiftKey) {
						onChangeMonth(0, value);
					} else {
						onChangeMonth(value);
					}

					lastKeyPressed.current = event.key;
					hasNextFocus.current = true;
					break;
				}
				default:
					break;
			}
		},
		[weeks]
	);

	const onFocus = useCallback((event: React.FocusEvent<HTMLElement>) => {
		setLastItemFocused(event.target.innerText);
	}, []);

	const isFocused = useCallback(
		(day: IDay) => {
			return (
				!day.nextMonth &&
				!day.previousMonth &&
				(lastItemFocused === String(day.date.getDate()) ||
					(lastItemFocused === null &&
						day.date.toDateString() ===
							daysSelected[0].toDateString()))
			);
		},
		[lastItemFocused, daysSelected]
	);

	// Moves the focus to the cell when selected if it is not yet in focus.
	useEffect(() => {
		if (gridRef.current && isOpen) {
			focusNext({date: daysSelected[0]});
		}
	}, [daysSelected]);

	useEffect(() => {
		if (gridRef.current) {
			if (isOpen) {
				const focusNext = gridRef.current.querySelector<HTMLElement>(
					'button:not([tabindex="-1"])'
				);

				if (focusNext) {
					focusNext.focus();
				}
			} else {
				setLastItemFocused(null);
			}
		}
	}, [isOpen]);

	useEffect(() => {
		// Recalculates the focus position when changing the calendar month when
		// navigating via keyboard.
		if (hasNextFocus.current && gridRef.current) {
			hasNextFocus.current = false;

			const position = Number(
				document.activeElement!.getAttribute('data-index')
			);
			const row =
				weeks[
					lastKeyPressed.current === Keys.Left ||
					lastKeyPressed.current === Keys.Up
						? weeks.length - 1
						: 0
				]!;

			switch (lastKeyPressed.current) {
				case Keys.Right:
				case Keys.Left: {
					// Remaps the row to remove out-of-month dates for horizontal
					// navigation.
					const newRow = row.filter(
						(value) => !value.nextMonth && !value.previousMonth
					);

					focusNext(
						newRow[
							lastKeyPressed.current === Keys.Left
								? newRow.length - 1
								: 0
						]!
					);
					break;
				}
				case Keys.Down:
				case Keys.Up: {
					// Remap the row to remove dates outside the month but keep the
					// position to find the next element in the vertical navigation.
					let nextFocus = row.map((value) =>
						!value.nextMonth && !value.previousMonth ? value : null
					)[position];

					if (!nextFocus) {
						nextFocus =
							weeks[
								lastKeyPressed.current === Keys.Up
									? weeks.length - 2
									: 1
							]![position]!;
					}

					focusNext(nextFocus);
					break;
				}
				case 'PageDown':
				case 'PageUp': {
					const focusNext =
						gridRef.current.querySelector<HTMLElement>(
							'button:not([tabindex="-1"])'
						);

					if (focusNext) {
						focusNext.focus();
					}
					break;
				}
				default:
					break;
			}

			lastKeyPressed.current = '';
		}
	}, [weeks]);

	const gridProps = {onFocus, onKeyDown, ref: gridRef};

	return {
		gridProps,
		isFocused,
	};
};

function getDaysInMonth(d: Date) {
	const firstDayOfMonth = new Date(d.getFullYear(), d.getMonth(), 1, 12);

	firstDayOfMonth.setMonth(firstDayOfMonth.getMonth() + 1);
	firstDayOfMonth.setDate(firstDayOfMonth.getDate() - 1);

	return firstDayOfMonth.getDate();
}

/**
 * Utility function to generate a table two days of the month.
 * Based on (This implementation does not have the fixation of
 * 6 weeks) https://github.com/gpbl/react-day-picker/blob/master/src/Helpers.js#L55
 *
 * @example
 * getWeekArray(new Date(), 0);
 *
 * [
 *   [
 *     {
 *       date: Sun Dec 30 2018 12:00:00 GMT-0300...
 *       nextMonth: false
 *       previousMonth: true
 * 	   },
 *     ...
 *   ]
 *   ...
 * ]
 *
 * The `outside` property references when a day
 * does not belong to the current month.
 */
function getWeekArray(d: Date, firstDayOfWeek = 0): Month {
	const daysInMonth = getDaysInMonth(d);
	const dayArray: Array<IDay> = [];

	let week: WeekDays = [];
	const weekArray: Month = [];

	for (let i = 1; i <= daysInMonth; i += 1) {
		const genDay = new Date(d.getFullYear(), d.getMonth(), i, 12);
		dayArray.push({date: genDay});
	}

	dayArray.forEach((day) => {
		if (week.length > 0 && day.date.getDay() === firstDayOfWeek) {
			weekArray.push(week);
			week = [];
		}
		week.push(day);
		if (dayArray.indexOf(day) === dayArray.length - 1) {
			weekArray.push(week);
		}
	});

	// unshift days from start of the first week
	const firstWeek = weekArray[0]!;
	for (let i = 7 - firstWeek.length; i > 0; i -= 1) {
		const outsideDate = clone(firstWeek[0]!.date);
		outsideDate.setDate(firstWeek[0]!.date.getDate() - 1);
		firstWeek.unshift({date: outsideDate, previousMonth: true});
	}

	// push days until the end of the last week
	const lastWeek = weekArray[weekArray.length - 1]!;
	for (let i = lastWeek.length; i < 7; i += 1) {
		const outsideDate = clone(lastWeek[lastWeek.length - 1]!.date);
		outsideDate.setDate(lastWeek[lastWeek.length - 1]!.date.getDate() + 1);
		lastWeek.push({date: outsideDate, nextMonth: true});
	}

	return weekArray;
}

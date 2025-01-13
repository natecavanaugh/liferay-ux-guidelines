/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {format as formatDate, parse as parseDate} from 'date-fns';

import type {ISelectOption} from './Select';

export {formatDate, parseDate};

export interface IDay {
	date: Date;
	nextMonth?: boolean;
	previousMonth?: boolean;
}

export type WeekDays = Array<IDay>;

export type Month = Array<WeekDays>;

/**
 * Clone a date object.
 */
export function clone(date: number | Date) {
	return new Date(date instanceof Date ? date.getTime() : date);
}

export function range({end, start}: {end: number; start: number}) {
	return Array.from(
		{
			length: end - start + 1,
		},
		(_v, k) => k + start
	);
}

export function addMonths(date: number | Date, months: number) {
	date = clone(date);

	date.setMonth(date.getMonth() + months);

	return date;
}

export function setDate(
	date: Date,
	options: {
		date?: number | string;
		seconds?: number | string;
		milliseconds?: number | string;
		hours?: number | string;
		minutes?: number | string;
		year?: number | string;
	}
) {
	date = clone(date);

	return Object.keys(options).reduce((acc, key) => {
		const method = `set${key.charAt(0).toUpperCase() + key.slice(1)}`;
		// @ts-ignore
		acc[method](options[key]);

		return acc;
	}, date);
}

export function isValid(date: Date) {
	return date instanceof Date && !isNaN(date.getTime());
}

export function setMonth(
	range: Array<ISelectOption>,
	month: number,
	currentMonth: Date
) {
	const date = addMonths(currentMonth, month);
	const year = date.getFullYear();

	if (range.find((elem) => elem.value === year)) {
		return date;
	}
}

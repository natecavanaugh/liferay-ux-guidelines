/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {__UNSTABLE_DataClient, useProvider} from '@clayui/provider';
import {useDebounce} from '@clayui/shared';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import warning from 'warning';

import {getIdentifier, timeout} from './util';

export type Sorting = {
	column: React.Key;
	direction: 'ascending' | 'descending';
};

export enum FetchPolicy {
	CacheFirst = 'cache-first',
	NoCache = 'no-cache',
	CacheAndNetwork = 'cache-and-network',
}

/**
 * - Loading (1) The status is set to `loading` only when the first
 *   requisition occurs.
 * - Refetch (2) The status is set to `refetch` when a change in the variables API
 *   or refetch method is called.
 * - Polling (3) The status is set to `polling` when pollInterval is set above 0.
 * - Unused (4) When no request is happening the status will be `unused`.
 * - Error (5) When any timeout or request `error` occurs, the status will be set
 *   to error.
 */
export enum NetworkStatus {
	Error = 5,
	Loading = 1,
	Polling = 3,
	Refetch = 2,
	Unused = 4,
}

type Variables = Record<string, any> | null;

type LinkFunction = (variables: string) => Promise<any>;

type FetchRetryDelay = {
	/**
	 * The number of milliseconds to wait before attempting the first retry.
	 *
	 * Delays will increase exponentially for each attempt.  E.g. if this is
	 * set to 100, subsequent retries will be delayed by 200, 400, 800, etc...
	 *
	 * Note that if jittering is enabled, this is the average delay.
	 */
	initial?: number;

	/**
	 * Whether delays between attempts should be randomized.
	 *
	 * This helps avoid thundering herd type situations by better
	 * distributing load during major outages.
	 */
	jitter?: boolean;
};

type FetchRetry = {
	/**
	 * The maximum number of times to try a single request before giving up.
	 */
	attempts?: number;

	/**
	 * Configuration for the delay strategy to use.
	 */
	delay?: FetchRetryDelay;
};

type FetchCursor<T> = {
	items: T;
	cursor: string;
};

type Props = {
	/**
	 * A Promise returning function to fetch your data, this replaces the
	 * use of `fetch` by default.
	 */
	fetch?: <T = unknown>(
		link: string,
		init?: RequestInit | undefined,
		sort?: Sorting | undefined
	) => Promise<Response> | Promise<FetchCursor<T>> | Promise<T>;

	/**
	 * This API is used in conjunction with variables API, if it is always
	 * changing its value set a debounce time to make a new request.
	 *
	 * Set a value in ms.
	 */
	fetchDelay?: number;

	/**
	 * Options passed to request configuration.
	 */
	fetchOptions?: RequestInit;

	/**
	 * Fetch policy is an option that allows you to specify how you
	 * want your component to interact with the cache.
	 *
	 * (cache-first) Whenever a new request occurs, the data provider
	 * will first look at the cache and return it if it satisfies the
	 * data, otherwise it will perform the request.
	 * (no-cache) It will always make a new request and return the result
	 * and the cache is deactivated. When using this with suspense enabled
	 * the policy changes to `cache-and-network` to make it work better, you
	 * can still change it to `cache-first` as well.
	 * (cache-and-network) This case is specific to when you want your
	 * users to have a quick response, when a new request happens, it
	 * will first go to the cache and if it exists it will return and
	 * regardless if it is in the cache it will make a new request on
	 * the network.
	 *
	 * The data provider takes only the cached data when they meet the
	 * requirements, the variables and URL are what they define when
	 * the cache satisfies their request. Be careful if your request
	 * is needed to cache to avoid problems.
	 */
	fetchPolicy?: FetchPolicy;

	/**
	 * Define the strategies for attempting new requests when it
	 * fails.
	 */
	fetchRetry?: FetchRetry;

	/**
	 * Set a request timeout in ms, if it reaches this limit it will
	 * go through the retry rules and if it still persists, it will
	 * set the networkStatus to 4 (Error).
	 */
	fetchTimeout?: number;

	/**
	 * Set the URL to where the data provider will have to make a
	 * request, by default the request is solved with json, if it does
	 * not cover your use case you can also pass a function by returning
	 * a Promise. We do not recommend that you use a function to do so,
	 * you will lose some benefits of the data provider,
	 * always try to avoid.
	 *
	 * (!) The behavior of the `link` accepting a function has been deprecated
	 * in favor of the `fetcher` API.
	 */
	link: string | LinkFunction;

	/**
	 * Callback is called when the network status is changed.
	 */
	onNetworkStatusChange?: (status: NetworkStatus) => void;

	/**
	 * The interval is set in milliseconds, setting the value to zero
	 * will disable polling.
	 */
	pollInterval?: number;

	/**
	 * Reference your storage provider, like Context, Store Object...
	 * Whenever a new request happens the data provider will look at
	 * storage, respecting the fetch policy.
	 *
	 * If you have a context serving as your store in your application
	 * independent of where the user is interacting the data provider
	 * can retrieve the data from the cache again if it is satisfied.
	 * The data is removed in LRU (least recently used) order.
	 * @deprecated since v3.67.0 - declare the `<ClayProvider />`
	 * component at the root of your application to cache globally.
	 */
	storage?: Record<string, any>;

	/**
	 * Set the amount of items that can be cached, set to zero will be
	 * treated as infinite, be aware to set an ideal size to offer a
	 * positive experience for your user but not use a large amount of memory.
	 * @deprecated since v3.67.0 - declare the `<ClayProvider />`
	 * component at the root of your application to to configure maximum
	 * cache usage.
	 */
	storageMaxSize?: number;

	/**
	 * Flag to enable `useResource` integration with suspense.
	 */
	suspense?: boolean;

	/**
	 * Variables are analyzed and converted to be passed as parameters
	 * to the query of a GET request, for example.
	 *
	 * @example
	 * {
	 *   name: 'Matu',
	 * }
	 *
	 * output for the link:
	 * '/?name=Matu'
	 */
	variables?: Variables;
};

let idCounter = 0;

const useResource = ({
	fetch: fetcher,
	fetchDelay = 300,
	fetchOptions,
	fetchPolicy = FetchPolicy.NoCache,
	fetchRetry = {},
	fetchTimeout = 6000,
	link,
	onNetworkStatusChange = () => {},
	pollInterval = 0,
	storageMaxSize,
	suspense = false,
	variables = null,
}: Props) => {
	// We changed the cache policy when suspense is enabled so that the
	// integration with suspense and the client works better, we need
	// to store the data that was retrieved from the promise in progress
	// on the client and then get it again to fill in the hook.
	// When we throw the promise at render time, suspense invokes and resets
	// the hook states and refs every time, when realizes the promise has been
	// resolved starts the hooks lifecycle with useEffects and other states.
	if (fetchPolicy === FetchPolicy.NoCache && suspense) {
		fetchPolicy = FetchPolicy.CacheAndNetwork;
	}

	const pollingTimeoutIdRef = useRef<null | NodeJS.Timeout>(null);

	const retryDelayTimeoutIdRef = useRef<null | NodeJS.Timeout>(null);

	const abortController = useRef<AbortController | null>(null);

	const networkStatusRef = useRef<NetworkStatus>();

	const pollIntervalRef = useRef(pollInterval);

	const uid = useMemo(() => {
		idCounter++;

		return String(idCounter);
	}, []);

	// A flag to identify if the first rendering happened to avoid
	// two requests.
	const firstRenderRef = useRef<boolean>(true);

	const firstRequestRef = useRef<boolean>(false);

	const shouldUseCache =
		fetchPolicy === FetchPolicy.CacheFirst ||
		fetchPolicy === FetchPolicy.CacheAndNetwork;

	const identifier = useMemo(() => {
		if (typeof link === 'string') {
			return getIdentifier(link, variables, fetchOptions);
		}

		return uid;
	}, [link, variables, fetchOptions]);

	const {client: globalClient} = useProvider();

	const client = useRef(
		globalClient ?? new __UNSTABLE_DataClient({storageMaxSize})
	);

	warning(
		!(suspense && typeof globalClient === 'undefined'),
		'DataProvider: for the integration with Suspense to work correctly, the ClayProvider must be declared at the root of the project.'
	);

	const [sort, setSort] = useState<Sorting | null>(null);

	const [resource, setResource] = useState<any>(
		client.current.read(identifier) ?? null
	);

	const debouncedVariablesChange = useDebounce(variables, fetchDelay);

	const dispatchNetworkStatus = (status: NetworkStatus) => {
		onNetworkStatusChange(status);
		networkStatusRef.current = status;
	};

	const cleanRetry = () => {
		if (retryDelayTimeoutIdRef.current) {
			clearTimeout(retryDelayTimeoutIdRef.current);
		}
	};

	const getRetryDelay = (retryAttempts: number) => {
		const {delay = {}} = fetchRetry;
		const {initial = 300, jitter = true} = delay;

		const baseDelay = jitter ? initial : initial / 2;

		let value = baseDelay * 2 ** retryAttempts;

		if (jitter) {
			value = Math.random() * value;
		}

		return value;
	};

	const handleFetchRetry = (error: any, retryAttempts: number) => {
		const {attempts = 5} = fetchRetry;

		cleanRetry();

		if (attempts > 0 && retryAttempts < attempts) {
			const delay = getRetryDelay(retryAttempts);

			// eslint-disable-next-line no-console
			console.warn(
				`DataProvider: Trying ${
					retryAttempts + 1
				} of ${attempts} will happen in ${delay}ms`
			);

			retryDelayTimeoutIdRef.current = setTimeout(() => {
				// eslint-disable-next-line @typescript-eslint/no-use-before-define
				doFetch(retryAttempts + 1);
			}, delay);
		} else {
			if (suspense) {
				client.current.update(identifier, error);
			} else {
				dispatchNetworkStatus(NetworkStatus.Error);
			}

			warning(
				false,
				`DataProvider: Error making the requisition ${error}`
			);
		}
	};

	const cleanPoll = () =>
		pollingTimeoutIdRef.current &&
		clearTimeout(pollingTimeoutIdRef.current);

	const setPoll = () => {
		cleanPoll();

		pollingTimeoutIdRef.current = setTimeout(() => {
			// eslint-disable-next-line @typescript-eslint/no-use-before-define
			maybeFetch(NetworkStatus.Polling);
		}, pollIntervalRef.current);
	};

	const fetchOnComplete = (result: any) => {
		// Should clear retry interval if any of the
		// attempts are successful.
		cleanRetry();

		let data = result;

		const cursor = client.current.getCursor(identifier);

		if (
			networkStatusRef.current === NetworkStatus.Loading &&
			(cursor || cursor === null) &&
			resource !== null &&
			resource !== undefined
		) {
			if (Array.isArray(result) && Array.isArray(resource)) {
				data = [...resource, ...result];
			} else if (
				typeof result === 'object' &&
				typeof resource === 'object'
			) {
				data = {...resource, ...result};
			}
		}

		setResource(data);
		dispatchNetworkStatus(NetworkStatus.Unused);

		if (shouldUseCache) {
			client.current.update(identifier, data);
		}

		if (pollIntervalRef.current > 0) {
			setPoll();
		}

		return result;
	};

	const populateSearchParams = (uri: URL, variables: Variables) => {
		if (!variables) {
			return uri;
		}

		const keys = Object.keys(variables);

		keys.forEach((key) => uri.searchParams.set(key, variables[key]));

		return uri;
	};

	const getUrlFormat = (link: string, variables: Variables) => {
		const uri = new URL(link);

		if (client.current.getCursor(identifier) === null) {
			warning(
				uri.searchParams.toString() === '',
				'DataProvider: We recommend that instead of passing parameters over the link, use the variables API. \n More details: https://clayui.com/docs/components/data-provider.html'
			);
		}

		if (!variables) {
			return uri.toString();
		}

		populateSearchParams(uri, variables);

		return uri.toString();
	};

	const doFetch = (retryAttempts = 0, doSort?: Sorting | null) => {
		warning(
			typeof link === 'string',
			'DataProvider: The behavior of the `link` accepting a function has been deprecated in favor of the `fetcher` API. \n More details: https://clayui.com/docs/components/data-provider.html#data-fetching'
		);

		switch (typeof link) {
			case 'function':
				return timeout(
					fetchTimeout,
					link(
						populateSearchParams(
							// This is just a hack to be able to instantiate the URL and make
							// `populateSearchParams` reusable in `getUrlFormat` and make
							// things easier.
							new URL('http://clay.data.provider'),
							variables
						).searchParams.toString()
					)
				)
					.then(fetchOnComplete)
					.catch((error) => handleFetchRetry(error, retryAttempts));
			case 'string': {
				const fn = fetcher ?? fetch;

				let nextCursor: any = undefined;

				if (abortController.current) {
					abortController.current.abort();
				}

				abortController.current = new AbortController();

				return timeout(
					fetchTimeout,
					fn(
						getUrlFormat(
							client.current.getCursor(identifier) ?? link,
							variables
						),
						{
							...fetchOptions,
							signal: abortController.current.signal,
						},
						doSort || sort || undefined
					),
					abortController.current
				)
					.then((res: any) => {
						if (
							res instanceof Response &&
							res.ok &&
							!res.bodyUsed
						) {
							return res.json();
						} else if (
							!(res instanceof Response) &&
							res.items &&
							(res.cursor || res.cursor === null)
						) {
							nextCursor = res.cursor;

							return res.items;
						}

						return res;
					})
					.then(fetchOnComplete)
					.then((res) => {
						if (nextCursor !== undefined) {
							client.current.setCursor(identifier, nextCursor);
						}

						return res;
					})
					.catch((error) => handleFetchRetry(error, retryAttempts));
			}
			default:
				return null;
		}
	};

	const maybeFetch = (status: NetworkStatus) => {
		const data = client.current.read(identifier);

		if (shouldUseCache && data) {
			fetchOnComplete(data);

			// When fetch policy is only cache-first and gets the data from
			// the cache, it should not perform a request, only when it is
			// cache-and-network.
			if (fetchPolicy === FetchPolicy.CacheFirst) {
				return false;
			}
		}

		dispatchNetworkStatus(status);

		return doFetch();
	};

	const loadMore = () => {
		if (!client.current.getCursor(identifier)) {
			return null;
		}

		dispatchNetworkStatus(NetworkStatus.Loading);

		return doFetch();
	};

	const refetch = () => {
		if (!shouldUseCache) {
			// Resets the cursor
			delete client.current.cursors[identifier];
		}

		dispatchNetworkStatus(NetworkStatus.Refetch);
		doFetch();
	};

	const onSortChange = (sort: Sorting | null) => {
		setSort(sort);
		doFetch(0, sort);
	};

	useEffect(() => {
		pollIntervalRef.current = pollInterval;

		if (pollInterval > 0) {
			setPoll();
		}
	}, [pollInterval]);

	useEffect(() => {
		if (!firstRenderRef.current) {
			if (!shouldUseCache) {
				// Resets the cursor
				delete client.current.cursors[identifier];
			}

			maybeFetch(NetworkStatus.Refetch);
		}
	}, [debouncedVariablesChange]);

	useEffect(() => {
		firstRenderRef.current = false;

		return () => {
			// Set to zero to prevent any unfinished requests
			// from continuing polling after umount has occurred.
			pollIntervalRef.current = 0;

			cleanPoll();
			cleanRetry();
		};
	}, []);

	let fetchingOrError = client.current.isFetching(identifier);

	// Makes first request if not started at render time
	if (!fetchingOrError && firstRenderRef.current) {
		const result = maybeFetch(NetworkStatus.Loading);

		if (result) {
			firstRequestRef.current = true;
			fetchingOrError = result;

			client.current.update(identifier, result);
		}
	}

	// Attach the promise to the instance if it is not the that started
	// the request.
	if (fetchingOrError && firstRequestRef.current === false && !suspense) {
		firstRequestRef.current = true;

		if (fetchingOrError instanceof Promise) {
			fetchingOrError.then(fetchOnComplete);
		}
	}

	// Integration with React.Suspense
	if (
		suspense &&
		resource === null &&
		(fetchingOrError instanceof Promise || fetchingOrError instanceof Error)
	) {
		// Integration with React.Suspense, throwing a throw with the promise in
		// progress at render time for Suspense to catch.
		// Integration with ErrorBoundary, when a network error happens we throw
		// an error at render time so that ErrorBoundary catches the error.
		throw fetchingOrError;
	}

	return {loadMore, refetch, resource, sort, sortChange: onSortChange};
};

export {useResource};

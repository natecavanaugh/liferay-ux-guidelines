import {parse} from 'node-html-parser';

async function fetchLiferay(slug: string, siteId: string, host: string) {
	const response = await fetch(
		new URL(
			`/o/headless-delivery/v1.0/sites/${siteId}/site-pages${slug}`,
			host
		),
		{
			headers: new Headers({
				'User-Agent': 'Clay',
				'content-type': 'application/json',
			}),
		}
	);

	const {status} = response;

	const responseContentType = response.headers.get('content-type');

	if (!response.ok || status === 204) {
		const error = await response.text();

		throw new Error('Error calling Liferay fetch.', {
			cause: new Error(error),
		});
	} else if (response.ok && responseContentType === 'application/json') {
		return response.json();
	} else {
		const data = await response.text();

		return data;
	}
}

type Resource = {
	dateCreated: string;
	dateModified: string;
	datePublished: string;
	html: string;
	id: string;
	slug: string;
	title: string;
	type: 'LiferayDocument';
};

async function getResource(siteId: string, host: string) {
	try {
		const {items} = await fetchLiferay('', siteId, host);

		return await Promise.all<Resource>(
			items
				.filter(
					(resource: any) =>
						!['Home', 'Search'].includes(resource.title)
				)
				.map(async (resource: any) => {
					const data = await fetchLiferay(
						`${resource.friendlyUrlPath}/rendered-page`,
						siteId,
						host
					);

					const html = parse(data);
					const body = html.getElementById('main-content')!;

					Array.from(body.querySelectorAll('source,img')).forEach(
						(element) => {
							const path =
								element.getAttribute('src') ||
								element.getAttribute('srcset');
							const url = `${host}${path}`;

							if (element.tagName === 'IMG') {
								element.setAttribute('src', url);
							} else {
								element.setAttribute('srcset', url);
							}
						}
					);

					return {
						dateCreated: resource.dateCreated,
						dateModified: resource.dateModified,
						datePublished: resource.datePublished,
						html: body.innerHTML,
						id: resource.uuid,
						slug: resource.friendlyUrlPath,
						title: resource.title,
						type: 'LiferayDocument',
					};
				})
		);
	} catch (error) {
		return [];
	}
}

const cache = new Map<string, Promise<Resource[]>>();

async function getResourceCache(siteId: string, host: string) {
	const id = `${siteId}:${host}`;

	if (!cache.has(id)) {
		cache.set(id, getResource(siteId, host));
	}

	return await cache.get(id)!;
}

export function createLXCResource() {
	return {
		getResources: () =>
			getResourceCache(
				process.env.LIFERAY_SITE_ID!,
				process.env.LIFERAY_HOST!
			),
		getResource: async (slug: Array<string>) => {
			const resource = await getResourceCache(
				process.env.LIFERAY_SITE_ID!,
				process.env.LIFERAY_HOST!
			);

			const normalizedSlug = slug.filter(
				(item) => item !== 'design' && item !== 'markup'
			);
			const id = normalizedSlug[normalizedSlug.length - 1];
			return resource.find((item) => item.slug === `/${id}`);
		},
	};
}

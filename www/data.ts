import {
	Collection,
	isFileSystemSource,
	CompositeCollection,
} from 'renoun/collections';
import {Directory, isDirectory, isFile, withSchema} from 'renoun/file-system';
import type {MDXContent, MDXHeadings} from 'renoun/mdx';
import {z} from 'zod';

const frontmatterSchema = z.object({
	title: z.string(),
	description: z.string(),
	packageNpm: z.optional(z.string()),
	packageUse: z.optional(z.string()),
	packageTypes: z.optional(z.array(z.string())),
});

export type DocsType = {
	default: MDXContent;
	headings: MDXHeadings;
	frontmatter: z.infer<typeof frontmatterSchema>;
};

export interface ComponentTypes {
	tsx: {[exportName: string]: React.ComponentType};
	mdx: DocsType;
}

export type ComponentDocumentsSchema = {
	default: MDXContent;
	headings: MDXHeadings;
	frontmatter: z.infer<typeof frontmatterSchema>;
};

export const DocumentsCollection = new Collection<ComponentDocumentsSchema>(
	{
		filePattern: '**/*.mdx',
		baseDirectory: './docs',
		filter: (source) => isFileSystemSource(source) && source.isFile(),
		schema: {
			frontmatter: frontmatterSchema.parse,
		},
	},
	(slug) => import(`./docs/${slug}.mdx`)
);

const PATHS = [
	'core',
	'alert',
	'form',
	'autocomplete',
	'badge',
	'breadcrumb',
	'button',
	'card',
	'color-picker',
	'data-provider',
	'date-picker',
	'drop-down',
	'empty-state',
	'icon',
	'label',
	'layout',
	'link',
	'list',
	'loading-indicator',
	'localized-input',
	'management-toolbar',
	'modal',
	'multi-select',
	'multi-step-nav',
	'nav',
	'navigation-bar',
	'pagination',
	'pagination-bar',
	'panel',
	'popover',
	'progress-bar',
	'provider',
	'slider',
	'sticker',
	'table',
	'tabs',
	'time-picker',
	'toolbar',
	'tooltip',
	'upper-toolbar',
];

export const ComponentDocumentsCollection =
	new Collection<ComponentDocumentsSchema>(
		{
			filePattern: 'clay-*/docs/**/*.mdx',
			baseDirectory: '../packages',
			basePath: 'components',
			filter: (source) => {
				const path = source.getEditPath();

				return (
					isFileSystemSource(source) &&
					source.isFile() &&
					PATHS.some((item) => path.includes(item))
				);
			},
			schema: {
				frontmatter: frontmatterSchema.parse,
			},
			rewrites: (path) => {
				return path.replace(/clay-[^/]+\/docs\//, '');
			},
			tsConfigFilePath: './tsconfig.json',
		},
		(slug) => import(`../packages/${slug}.mdx`)
	);

export const AllCollection = new CompositeCollection(
	DocumentsCollection,
	ComponentDocumentsCollection
);

type ComponentSchema = Record<string, React.ComponentType>;

export const ComponentsCollection = new Directory({
	path: '../packages/clay-core/src/table',
	tsConfigPath: '../packages/tsconfig.json',
	loaders: {
		ts: withSchema<ComponentSchema>((path) =>
			require(`../packages/clay-core/src/table/${path}.ts`)
		),
		tsx: withSchema<ComponentSchema>((path) =>
			require(`../packages/clay-core/src/table/${path}.tsx`)
		),
	},
	include: (entry) => {
		if (isFile(entry, ['ts', 'tsx'])) {
			const path = entry.getPath();

			return PATHS.some((item) => path.includes(item));
		}

		return isDirectory(entry);
	},
});

export type AllCollection = typeof AllCollection;

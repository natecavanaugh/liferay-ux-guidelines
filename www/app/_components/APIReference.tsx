import {Fragment, Suspense} from 'react';
import type {CSSObject} from 'restyle';
import {resolve} from 'node:path';
import {JavaScriptFile} from 'renoun/file-system';
import type {JavaScriptFileExport} from 'renoun/file-system';
import {CodeInline, MDXRenderer, MDXComponents} from 'renoun/components';
import {ComponentsCollection} from '@/data';

import {ErrorBoundary} from './ErrorBoundary';

const mdxComponents = {
	p: (props) => <p {...props} style={{margin: 0}} />,
	code: (props) => <MDXComponents.code {...props} paddingY="0" />,
} as MDXComponents;

interface SourceString {
	/** The file path to the source code. */
	source: string;

	/** The working directory to resolve the file path from. Will use the base URL if a URL is provided. */
	workingDirectory?: string;
}

interface SourceExport {
	/** The export source from a collection export source to get types from. */
	source: JavaScriptFile<any> | JavaScriptFileExport<any>;
}

interface Filter {
	/** A filter to apply to the exported types. */
	filter: (type: Record<string, any>) => boolean;
}

export type APIReferenceProps =
	| (SourceString & Filter)
	| (SourceExport & Filter);

/** Displays type documentation for all types exported from a file path or types related to a collection export source. */
export function APIReference(props: APIReferenceProps) {
	const path = (props.source as string).split('/');

	return (
		<ErrorBoundary
			fallback={
				<div className="alert alert-danger">
					<strong className="lead">Error:</strong> An error occurred
					while generating the Table API for the{' '}
					{path[path.length - 1]} component.
				</div>
			}
		>
			<Suspense fallback="Loading API references...">
				<APIReferenceAsync {...props} />
			</Suspense>
		</ErrorBoundary>
	);
}

async function APIReferenceAsync({
	source,
	filter,
	...props
}: APIReferenceProps) {
	if (typeof source === 'string') {
		let workingDirectory: string | undefined;

		if ('workingDirectory' in props && props.workingDirectory) {
			if (URL.canParse(props.workingDirectory)) {
				const {pathname} = new URL(props.workingDirectory);
				workingDirectory = pathname.slice(0, pathname.lastIndexOf('/'));
			} else {
				workingDirectory = props.workingDirectory;
			}
		}

		// @ts-ignore
		source = new JavaScriptFile({
			path: workingDirectory ? resolve(workingDirectory, source) : source,
			directory: ComponentsCollection,
		});
	}

	if (source instanceof JavaScriptFile) {
		const exportedTypes = await Promise.all(
			(
				await source.getExports()
			).map((exportSource) => exportSource.getType())
		);

		return exportedTypes
			.filter((type): type is any => Boolean(type) && filter(type!))
			.map((type) => (
				<div
					key={type.name}
					style={{
						display: 'flex',
						flexDirection: 'column',
						padding: '1.6rem 0',
						borderBottom:
							'1px solid var(--color-separator-secondary)',
					}}
				>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: '0.8rem',
						}}
					>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: '1rem',
							}}
						>
							<h3
								id={
									type.name
										? createSlug(type.name, 'kebab')
										: undefined
								}
								style={{flexShrink: 0, margin: '0 !important'}}
							>
								{type.name}
							</h3>

							<CodeInline
								value={type.text}
								language="typescript"
							/>

							{/* {type.path && <ViewSource href={type.path} />} */}
						</div>

						{type.description ? (
							<MDXRenderer
								value={type.description}
								components={mdxComponents}
							/>
						) : null}
					</div>

					<div style={{display: 'flex'}}>
						<TypeChildren type={type} css={{marginTop: '2rem'}} />
					</div>
				</div>
			));
	}

	const type = await source.getType(filter);

	if (type === undefined) {
		return null;
	}

	return (
		<div
			key={type.name}
			style={{
				display: 'flex',
				flexDirection: 'column',
				padding: '1.6rem 0',
				borderBottom: '1px solid var(--color-separator-secondary)',
			}}
		>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: '0.8rem',
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: '1rem',
					}}
				>
					<h3
						id={
							type.name
								? createSlug(type.name, 'kebab')
								: undefined
						}
						style={{flexShrink: 0, margin: 0}}
					>
						{type.name}
					</h3>

					<CodeInline value={type.text} language="typescript" />

					{/* {type.path && <ViewSource href={type.path} />} */}
				</div>

				{type.description ? (
					<MDXRenderer
						value={type.description}
						components={mdxComponents}
					/>
				) : null}
			</div>

			<div style={{display: 'flex'}}>
				<TypeChildren type={type} css={{marginTop: '2rem'}} />
			</div>
		</div>
	);
}

/** Determines how to render the immediate type children based on its kind. */
function TypeChildren({type, css: cssProp}: {type: any; css: CSSObject}) {
	if (
		type.kind === 'Enum' ||
		type.kind === 'Generic' ||
		type.kind === 'Symbol' ||
		type.kind === 'Reference'
	) {
		return <CodeInline value={type.text} language="typescript" />;
	}

	if (
		type.kind === 'Object' ||
		type.kind === 'Intersection' ||
		type.kind === 'Union'
	) {
		return <TypeProperties type={type} css={cssProp} />;
	}

	if (type.kind === 'Class') {
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					marginTop: '1.5rem',
					gap: '1.2rem',
					minWidth: 0,
					...cssProp,
				}}
			>
				{type.accessors && type.accessors.length > 0 ? (
					<div>
						<h4 style={{margin: 0}}>Accessors</h4>
						{type.accessors.map((accessor: any, index: number) => (
							<TypeValue key={index} type={accessor} />
						))}
					</div>
				) : null}

				{type.constructors && type.constructors.length > 0 ? (
					<div>
						<h4 style={{margin: 0}}>Constructors</h4>
						{type.constructors.map(
							(constructor: any, index: number) => (
								<TypeValue key={index} type={constructor} />
							)
						)}
					</div>
				) : null}

				{type.methods && type.methods.length > 0 ? (
					<div>
						<h4 style={{margin: 0}}>Methods</h4>
						{type.methods.map((method: any, index: number) => (
							<TypeValue key={index} type={method} />
						))}
					</div>
				) : null}

				{type.properties && type.properties.length > 0 ? (
					<div>
						<h5 style={{margin: 0}}>Properties</h5>
						{type.properties.map((property: any, index: number) => (
							<TypeValue key={index} type={property} />
						))}
					</div>
				) : null}
			</div>
		);
	}

	if (type.kind === 'Component') {
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					marginTop: '1.5rem',
					gap: '1.2rem',
					minWidth: 0,
					...cssProp,
				}}
			>
				{type.signatures.length > 1 ? (
					<h4 style={{margin: 0, marginBottom: '1rem'}}>
						Signatures
					</h4>
				) : null}
				{type.signatures.map((signature: any, index: number) => {
					return (
						<Fragment key={index}>
							{signature.parameter ? (
								<div>
									<h5 style={{margin: '0'}}>Parameters</h5>
									{signature.parameter.kind === 'Object' ? (
										<TypeProperties
											type={signature.parameter}
										/>
									) : signature.parameter.kind ===
									  'Reference' ? (
										<CodeInline
											value={signature.parameter.text}
											language="typescript"
											style={{
												display: 'inline-block',
												marginTop: '1.5rem',
											}}
										/>
									) : (
										<TypeValue type={signature.parameter} />
									)}
								</div>
							) : null}
							{signature.returnType ? (
								<div>
									<h5
										style={{
											margin: 0,
											marginBottom: '1.5rem',
										}}
									>
										Returns
									</h5>
									{signature.returnType}
								</div>
							) : null}
						</Fragment>
					);
				})}
			</div>
		);
	}

	if (type.kind === 'Function') {
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					marginTop: '1.5rem',
					gap: '1.2rem',
					minWidth: 0,
					...cssProp,
				}}
			>
				{type.signatures.length > 1 ? (
					<h4 style={{margin: 0, marginBottom: '1rem'}}>
						Signatures
					</h4>
				) : null}
				{type.signatures.map((signature: any, index: number) => {
					return (
						<Fragment key={index}>
							{signature.parameters.length > 0 ? (
								<div>
									<h5 style={{margin: 0}}>Parameters</h5>
									{signature.parameters.map(
										(parameter: any, index: number) => (
											<TypeValue
												key={index}
												type={parameter}
											/>
										)
									)}
								</div>
							) : null}
							{signature.returnType ? (
								<div>
									<h5
										style={{
											margin: 0,
											marginBottom: '1.5rem',
										}}
									>
										Returns
									</h5>
									{signature.returnType}
								</div>
							) : null}
						</Fragment>
					);
				})}
			</div>
		);
	}

	console.log('[APIReference:TypeChildren] Did not render: ', type);

	return null;
}

/** Determines how to render the immediate type properties accounting for unions. */
function TypeProperties({type, css: cssProp}: {type: any; css?: CSSObject}) {
	if (type.kind === 'Union') {
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					marginTop: '1.5rem',
					gap: '1.2rem',
					minWidth: 0,
					...cssProp,
				}}
			>
				{type.members.map((member: any, index: number) =>
					member.kind === 'Object' ||
					member.kind === 'Intersection' ||
					member.kind === 'Union' ? (
						<TypeProperties key={index} type={member} />
					) : member.kind === 'Reference' ? (
						member.text
					) : (
						<TypeValue key={index} type={member} />
					)
				)}
			</div>
		);
	}

	if (type.properties.length) {
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					marginTop: '1.5rem',
					gap: '1.2rem',
					minWidth: 0,
					...cssProp,
				}}
			>
				<h5
					style={{
						margin: 0,
						color: 'var(--color-foreground-secondary)',
					}}
				>
					Properties
				</h5>
				{type.properties
					.filter((type: any) => {
						if (type.tags) {
							return !type.tags.some(
								(tag: any) => tag.tagName === 'ignore'
							);
						}

						return true;
					})
					.map((propertyType: any, index: number) => (
						<TypeValue key={index} type={propertyType} />
					))}
			</div>
		);
	}

	console.log('[APIReference:TypeProperties] Did not render: ', type);

	return null;
}

/** Renders a type value with its name, type, and description. */
function TypeValue({type, css: cssProp}: {type: any; css?: CSSObject}) {
	const isNameSameAsType = type.name === type.text;
	let isRequired = false;
	let defaultValue;

	if (isParameterType(type) || isPropertyType(type)) {
		isRequired = !type.isOptional;
		defaultValue = type.defaultValue;
	}

	return (
		<div
			key={type.name + type.text}
			style={{
				display: 'flex',
				flexDirection: 'column',
				padding: '1.5rem 0',
				gap: '0.8rem',
				minWidth: 0,
				...cssProp,
			}}
		>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 8,
				}}
			>
				<h4
					style={{
						display: 'flex',
						alignItems: 'flex-start',
						flexShrink: 0,
						margin: 0,
						fontWeight: 400,
						color: 'var(--color-foreground-secondary)',
					}}
				>
					{type.name}{' '}
					{isRequired && (
						<span
							style={{color: 'oklch(0.8 0.15 36.71)'}}
							title="required"
						>
							*
						</span>
					)}
				</h4>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: '0.25rem',
						minWidth: 0,
					}}
				>
					{isNameSameAsType ? null : (
						<CodeInline
							value={type.text}
							language="typescript"
							paddingX="0.5rem"
							paddingY="0.2rem"
							style={{fontSize: 'var(--font-size-body-2)'}}
						/>
					)}
					{defaultValue ? (
						<span
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: '0.25rem',
								minWidth: 0,
							}}
						>
							={' '}
							<CodeInline
								value={JSON.stringify(defaultValue)}
								language="typescript"
							/>
						</span>
					) : null}
				</div>
			</div>

			{type.description && (
				<MDXRenderer
					value={type.description}
					components={mdxComponents}
				/>
			)}

			{type.kind === 'Object' && type.properties
				? type.properties
						.filter((type: any) => {
							if (type.tags) {
								return !type.tags.some(
									(tag: any) => tag.tagName === 'ignore'
								);
							}

							return true;
						})
						.map((propertyType: any, index: number) => (
							<TypeValue
								key={index}
								type={propertyType}
								css={{paddingLeft: '1.5rem'}}
							/>
						))
				: null}

			{type.kind === 'Function' &&
			type.signatures &&
			type.signatures.length
				? type.signatures.map((signature: any) =>
						signature.parameters.map(
							(parameter: any, index: number) => (
								<TypeValue
									key={index}
									type={parameter}
									css={{paddingLeft: '1.5rem'}}
								/>
							)
						)
				  )
				: null}
		</div>
	);
}

/** Create a slug from a string. */
function createSlug(
	input: string,
	format: 'none' | 'kebab' | 'snake' = 'none'
) {
	if (format === 'none') return input;

	const separator = format === 'snake' ? '_' : '-';

	return input
		.replace(/([a-z])([A-Z])/g, `$1${separator}$2`) // Add the separator between lower and upper case letters
		.replace(/([A-Z])([A-Z][a-z])/g, `$1${separator}$2`) // Add the separator between consecutive upper case letters followed by a lower case letter
		.replace(/[_\s]+/g, separator) // Replace underscores and spaces with the separator
		.toLowerCase(); // Convert the entire string to lowercase
}

/** Determines if the type is a parameter type. */
function isParameterType(property: any) {
	return property.context === 'parameter';
}

/** Determines if the type is a property type. */
function isPropertyType(property: any) {
	return property.context === 'property';
}

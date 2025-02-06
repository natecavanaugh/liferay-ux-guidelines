import {promises as fs} from 'fs';
import {
	SandpackProvider,
	SandpackLayout,
	SandpackCodeEditor,
	SandpackPreview,
	theme,
} from './Sandpack';
import classNames from 'classnames';
import styles from './sandpack.module.css';

type Props = {
	language: string;
	children: any;
};

export async function Sandpack({language, children}: Props) {
	const file = await fs.readFile(
		process.cwd() + '/node_modules/@clayui/css/lib/images/icons/icons.svg',
		'utf-8'
	);

	return (
		<SandpackProvider
			className={classNames('mb-4', styles.code_editor_open)}
			theme={theme as any}
			template={language === 'jsx' ? 'react' : undefined}
			customSetup={{
				dependencies: {
					'@clayui/core': 'latest',
					'@clayui/icon': 'latest',
					'@clayui/button': 'latest',
					'@clayui/css': 'latest',
					'@clayui/form': 'latest',
					'@clayui/shared': 'latest',
					'@clayui/layout': 'latest',
					'@clayui/drop-down': 'latest',
					'@clayui/label': 'latest',
					'@clayui/alert': 'latest',
					'@clayui/autocomplete': 'latest',
					'@clayui/badge': 'latest',
					'@clayui/breadcrumb': 'latest',
					'@clayui/card': 'latest',
					'@clayui/color-picker': 'latest',
					'@clayui/date-picker': 'latest',
					'@clayui/empty-state': 'latest',
					'@clayui/link': 'latest',
					'@clayui/list': 'latest',
					'@clayui/loading-indicator': 'latest',
					'@clayui/localized-input': 'latest',
					'@clayui/management-toolbar': 'latest',
					'@clayui/modal': 'latest',
					'@clayui/multi-select': 'latest',
					'@clayui/sticker': 'latest',
					'@clayui/multi-step-nav': 'latest',
					'@clayui/nav': 'latest',
					'@clayui/navigation-bar': 'latest',
					'@clayui/pagination': 'latest',
					'@clayui/pagination-bar': 'latest',
					'@clayui/panel': 'latest',
					'@clayui/popover': 'latest',
					'@clayui/progress-bar': 'latest',
					'@clayui/tabs': 'latest',
					'@clayui/time-picker': 'latest',
					'@clayui/toolbar': 'latest',
					'@clayui/tooltip': 'latest',
					'@clayui/upper-toolbar': 'latest',
				},
			}}
			files={{
				'/public/icons.svg': file,
				'/App.js': {
					active: true,
					code: children,
				},
			}}
			options={{
				experimental_enableServiceWorker: true,
			}}
		>
			<div className={styles.code_preview}>
				<SandpackPreview />
			</div>
			<SandpackLayout>
				<SandpackCodeEditor
					showLineNumbers
					showReadOnly={false}
					showTabs={false}
					readOnly
				/>
			</SandpackLayout>
		</SandpackProvider>
	);
}

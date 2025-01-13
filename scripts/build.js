/**
 * SPDX-FileCopyrightText: © 2025 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

/* eslint-disable no-console */

import esbuild from 'esbuild';
import fg from 'fast-glob';
import fs from 'fs';
import path from 'path';

const entryPoints = fg.sync([path.join(process.cwd(), '/src/**/*.tsx')], {
	ignore: ['**/__tests__/**'],
});

const buildESM = async () => {
	try {
		await esbuild.build({
			entryPoints,
			format: 'esm',
			outdir: path.join(process.cwd(), 'lib/esm'),
			platform: 'node',
			sourcemap: true,
			target: 'esnext',
		});
		console.log('🟢 ESM compilation successful');
	} catch (error) {
		console.error('🔴 ESM compilation failed:', error.message);
	}
};

const buildCJS = async () => {
	try {
		await esbuild.build({
			entryPoints,
			format: 'cjs',
			outdir: path.join(process.cwd(), 'lib/cjs'),
			platform: 'node',
			sourcemap: true,
			target: 'esnext',
		});

		console.log('🟢 CJS compilation successful');
	} catch (error) {
		console.error('🔴 CJS compilation failed:', error.message);
	}
};

const updatePackageJson = async () => {
	try {
		const pkjJson = JSON.parse(
			fs.readFileSync(path.join(process.cwd(), 'package.json'))
		);

		pkjJson.exports = {
			'.': {
				import: './lib/esm/index.js',
				require: './lib/cjs/index.js',
			},
		};
		pkjJson.main = './lib/cjs/index.js';
		pkjJson.module = './lib/esm/index.js';
		pkjJson.type = 'module';
		pkjJson.types = './lib/index.d.ts';

		fs.writeFileSync(
			path.join(process.cwd(), 'package.json'),
			JSON.stringify(pkjJson, null, '\t')
		);

		console.log('🟢 Update package.json successful');
	} catch (error) {
		console.error('🔴 Update package.json failed:', error.message);
	}
};

try {
	await buildESM();
	await buildCJS();
	await updatePackageJson();
	console.log('🟢 Overall compilation successful');
} catch (error) {
	console.error('🔴 Overall compilation failed:', error.message);
}

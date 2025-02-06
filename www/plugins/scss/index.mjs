import clay from '@clayui/css';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import fs from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function buildIcons() {
	const path = join(clay.srcDir, 'images', 'icons');
	const staticPath = join(__dirname, '../..', 'public');

	const REGEX_FILE_EXT_SVG = /(?:flags-|\.svg$)/g;
	const REGEX_HTML_COMMENTS = /<!--(?:.+?)-->\n?/gs;
	const REGEX_SVG_TAG = /(?:<\/svg|<svg[^>]+)>(?:\n|)/g;
	const REGEX_SVG_VIEWBOX = /\bviewBox="[^"]+"/g;

	const files = fs.readdirSync(path);

	let strSprite = `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">`;

	files.forEach((file) => {
		let icon = fs.readFileSync(join(path, file), 'utf8').toString();

		const id = file.replace(REGEX_FILE_EXT_SVG, '').toLowerCase();

		const viewBox = icon.match(REGEX_SVG_VIEWBOX);

		try {
			if (!viewBox) {
				throw `Viewbox attribute not found for icon: ${id}`;
			}
		} catch (error) {
			console.warn(error);
		}

		const symbol = `<symbol id="${id}" ${viewBox}>`;

		icon = icon.replace(REGEX_HTML_COMMENTS, '');
		icon = icon.replace(REGEX_SVG_TAG, '');

		strSprite += `${symbol}${icon}</symbol>`;
	});

	strSprite += '</svg>';

	fs.writeFileSync(
		join(staticPath, 'images', 'icons', 'icons.svg'),
		strSprite
	);
}

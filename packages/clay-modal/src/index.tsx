/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import Body from './Body';
import Header, {
	Item,
	ItemGroup,
	Subtitle,
	SubtitleSection,
	Title,
	TitleIndicator,
	TitleSection,
} from './Header';
import Modal from './Modal';
import ClayModalProvider, {Context} from './Provider';
import {useModal} from './useModal';

export {
	ClayModalProvider,
	Modal,
	useModal,
	Context,
	Body,
	Header,
	Item,
	ItemGroup,
	Subtitle,
	SubtitleSection,
	Title,
	TitleIndicator,
	TitleSection,
};
export default Modal;

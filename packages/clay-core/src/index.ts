/**
 * SPDX-FileCopyrightText: © 2021 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

export {
	default as Button,
	ClayButtonWithIcon as ButtonWithIcon,
} from '@clayui/button';
export {default as Icon} from '@clayui/icon';
export {
	default as Modal,
	Context as ModalContext,
	useModal,
} from '@clayui/modal';
export {Provider, useProvider} from '@clayui/provider';

export {Alert} from './alert';
export {Badge} from './badge';
export {Breadcrumb} from './breadcrumb';
export {Heading, Text, TextHighlight} from './typography';
export {OverlayMask} from './overlay-mask';
export {TreeView} from './tree-view';
export {VerticalBar} from './vertical-bar';
export {VerticalNav} from './vertical-nav';
export {Picker, Option} from './picker';
export {FocusTrap} from './focus-trap';
export {Nav} from './nav';
export {Body, Cell, Head, Row, Table} from './table';

// Experimental components
export * as __EXPERIMENTAL_MENU from './drop-down';

// Internal dependencies not public but exposed to other Clay packages.
export * as __NOT_PUBLIC_COLLECTION from './collection';
export * as __NOT_PUBLIC_LIVE_ANNOUNCER from './live-announcer';
export type {AnnouncerAPI} from './live-announcer';
export type {ICollectionProps} from './collection';

/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import Button from './Button';
import ClayButtonWithIcon from './ButtonWithIcon';

type ButtonProps = React.ComponentProps<typeof Button>;
type ButtonWithIconProps = React.ComponentProps<typeof ClayButtonWithIcon>;

export type {ButtonWithIconProps, ButtonProps};
export {ClayButtonWithIcon};
export default Button;

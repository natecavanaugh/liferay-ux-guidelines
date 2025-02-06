/**
 * SPDX-FileCopyrightText: © 2020 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import classNames from 'classnames';
import React, {useMemo, useState} from 'react';

interface IProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
	/**
	 * Message the user will see describing what they can do when on this screen
	 */
	description?: string;

	/**
	 * HTMLImage element attributes to add to the image within the component
	 */
	imgProps?: React.ImgHTMLAttributes<HTMLImageElement>;

	/**
	 * HTMLImage element attributes to add to the reduced motion image within the component
	 */
	imgPropsReducedMotion?: React.ImgHTMLAttributes<HTMLImageElement>;

	/**
	 * Source of the image to signify the state
	 */
	imgSrc?: string;

	/**
	 * Source of the image to show when `.c-prefers-reduced-motion` is active
	 */
	imgSrcReducedMotion?: string | null;

	/**
	 * Indicates empty state should be a small variant.
	 */
	small?: boolean;

	/**
	 * Title of the message highlighting the description
	 */
	title?: string | null;
}
const defaultTile = 'No results found';

const EmptyState = ({
	children,
	className,
	description = 'Sorry, there are no results found',
	imgProps,
	imgPropsReducedMotion,
	imgSrc,
	imgSrcReducedMotion,
	small,
	title = defaultTile,
	...otherProps
}: IProps) => {
	const hasImg = imgSrc || imgProps;
	const [error, setError] = useState(false);

	const reducedMotionImage = useMemo(() => {
		if (error) {
			console.warn(
				'The image url defined in `imgSrcReducedMotion` does not exist on the server. You can provide an updated url through the attribute `imgSrcReducedMotion` or set it to `{null}`.'
			);

			return null;
		}
		if (imgSrcReducedMotion) {
			return imgSrcReducedMotion;
		} else if (imgSrc && imgSrcReducedMotion !== null) {
			const url = new URL(
				imgSrc,
				imgSrc?.match(/http:\/\/|https:\/\//)
					? undefined
					: `https://${location.host}`
			);

			const hasImgExtension = url.pathname.match(
				/.(gif|png|jpeg|jpg|svg)/
			);

			return hasImgExtension
				? `${url.pathname.substring(
						0,
						hasImgExtension.index
				  )}_reduced_motion${url.pathname.substring(
						hasImgExtension.index!
				  )}`
				: null;
		}
	}, [error, imgSrcReducedMotion]);

	imgPropsReducedMotion = imgPropsReducedMotion
		? imgPropsReducedMotion
		: imgProps;

	return (
		<div
			className={classNames(className, 'c-empty-state', {
				'c-empty-state-animation': hasImg,
				'c-empty-state-sm': small,
			})}
			{...otherProps}
		>
			{hasImg && (
				<div className="c-empty-state-image">
					<div className="c-empty-state-aspect-ratio">
						<img
							alt=""
							className={classNames(
								'aspect-ratio-item aspect-ratio-item-fluid',
								reducedMotionImage &&
									'd-none-c-prefers-reduced-motion',
								imgProps && imgProps.className
							)}
							src={imgSrc}
							{...imgProps}
						/>
						{reducedMotionImage && (
							<img
								alt=""
								className={classNames(
									'aspect-ratio-item aspect-ratio-item-fluid d-block-c-prefers-reduced-motion',
									imgPropsReducedMotion &&
										imgPropsReducedMotion.className
								)}
								onError={() => setError(true)}
								src={reducedMotionImage}
								{...imgPropsReducedMotion}
							/>
						)}
					</div>
				</div>
			)}

			<div className="c-empty-state-title">
				<span>{title || defaultTile}</span>
			</div>
			<div className="c-empty-state-text">{description}</div>
			{children && <div className="c-empty-state-footer">{children}</div>}
		</div>
	);
};

export default EmptyState;

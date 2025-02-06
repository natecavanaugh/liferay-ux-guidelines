import Image from 'next/image';
import Link from 'next/link';
import styles from './docs.module.css';

export default function Docs() {
	return (
		<article>
			<h1 className="text-10">Clay Libraries</h1>
			<p className="text-6 text-secondary">
				A collection of libraries and tools that help you build
				adaptive, accessible, and robust user experiences.
			</p>
			<Image
				className={styles.banner}
				alt="Clay banner"
				width={869}
				height={365}
				priority
				src="/banner.png"
			/>
			<section className={styles.section}>
				<section>
					<h2 className="text-4 text-weight-semi-bold">
						React Components
					</h2>
					<p>
						A React implementation of Clay, Liferay is design
						system. Clay provide adaptive, accessible, and cohesive
						experiences for all Liferay applications.
					</p>
					<Link
						className="text-weight-semi-bold"
						href="/docs/components"
					>
						Get started
					</Link>
				</section>
				<section>
					<h2 className="text-4 text-weight-semi-bold">
						CSS Framework
					</h2>
					<p>
						Styles can compose a series of variations using our Sass
						variables and mixins, responsive grid system, and
						extensive pre-built components.
					</p>
					<Link className="text-weight-semi-bold" href="/docs/scss">
						Get started
					</Link>
				</section>
			</section>
		</article>
	);
}

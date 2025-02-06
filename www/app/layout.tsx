import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import {SandPackCSS} from './_components/SandpackStyles';
import './clay.scss';
import './globals.scss';

const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
	metadataBase: new URL('https://clayui.com'),
	title: 'Clay by Liferay',
	description:
		'This is Clay. A web implementation of the Lexicon Experience Language; built by Liferay.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<SandPackCSS />
			</head>
			<body className={inter.className}>{children}</body>
		</html>
	);
}

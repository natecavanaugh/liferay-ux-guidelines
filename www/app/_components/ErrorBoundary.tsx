'use client';

import React from 'react';

type Props = {
	fallback: React.ReactNode;
	children: React.ReactNode;
};

export class ErrorBoundary extends React.Component<Props, any> {
	constructor(props: any) {
		super(props);
		this.state = {hasError: false};
	}

	static getDerivedStateFromError() {
		return {hasError: true};
	}

	componentDidCatch(error: any, info: any) {
		console.log(error, info);
	}

	render() {
		if (this.state.hasError) {
			return this.props.fallback;
		}

		return this.props.children;
	}
}

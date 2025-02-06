type Props = {
	children: React.ReactNode;
};

export function Sheet({children}: Props) {
	return <div className="sheet-example">{children}</div>;
}

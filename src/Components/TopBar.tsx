import {Helmet} from "react-helmet";
export function TopBar({
	float,
	children,
	leftToRight,
	style,
}: {
	float?: boolean | undefined;
	children: React.ReactNode;
	leftToRight?: boolean;
	style?: React.CSSProperties;
}) {
	return (
		<>
            <Helmet>
                <meta name="theme-color" content="#201d1f" />
            </Helmet>
			<div id="TopBar" className={float ? "floatbar" : ""} style={style}>
				<div className={leftToRight ? "InnerTopBar LTR" : "InnerTopBar"}>{children}</div>
			</div>
		</>
	);
}

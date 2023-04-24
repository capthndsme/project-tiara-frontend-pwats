import {Helmet} from "react-helmet";
export function TopBar({
	float,
	children,
	leftToRight,
}: {
	float?: boolean | undefined;
	children: React.ReactNode;
	leftToRight?: boolean;
}) {
	return (
		<>
            <Helmet>
                <meta name="theme-color" content="#201d1f" />
            </Helmet>
			<div id="TopBar" className={float ? "floatbar" : ""}>
				<div className={leftToRight ? "InnerTopBar LTR" : "InnerTopBar"}>{children}</div>
			</div>
		</>
	);
}

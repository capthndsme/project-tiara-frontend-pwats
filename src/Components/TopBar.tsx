import {Helmet} from "react-helmet-async";
export function TopBar({
	float,
	children,
	leftToRight,
	style,
	hideArc
}: {
	float?: boolean | undefined;
	children: React.ReactNode;
	leftToRight?: boolean;
	style?: React.CSSProperties;
	hideArc?: boolean;
}) {
	return (
		<>
            <Helmet>
                <meta name="theme-color" content="#201d1f" />
            </Helmet>
			<div id="TopBar" className={float ? "floatbar" : ""} style={style}>
				<div className={leftToRight ? "InnerTopBar LTR" : "InnerTopBar"}>{children}</div>
				<div className="ARC" style={{
					display: hideArc ? "none" : "block",
					position: "absolute",
					overflow: "hidden",
					width: 18, height: 18,
					background: "var(--darker-bg-colour-translucent)",
				}}>
				<div className="arc-top-l"></div>
				</div>
				<div className="ARCRIGHT" style={{
					opacity: hideArc ? 0 : 1,
					position: "absolute",
					overflow: "hidden",
					width: 18, height: 18,
					right: 0,
					background: "var(--darker-bg-colour-translucent)",
				}}>
				<div className="arc-top-r"></div>
				</div>
				
			</div>
		</>
	);
}

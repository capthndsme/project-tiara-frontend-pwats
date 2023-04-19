import { Spin } from "./Spin";

export function DisconnectedOverlay({ disconnected }: { disconnected: boolean }) {
	if (!disconnected) {
		return <></>; // Return nothing if we're not disconnected.
	}
	return (
		<div className="fullscreen overlaid loading centreText">
			<div
				style={{
					position: "fixed",
					top: 0,
					left: 0,
					lineHeight: "30px",
					height: "30px",
					width: "100%",
					background: "rgba(0,0,0,0.5)",
				}}
			>
				Disconnected...
			</div>
			<div>
				<Spin />
				<br />
				Connecting to Project Tiara services...
				<div className="refreshBox">
					Taking a while? <br />
					You can try to reload the page.
					<br />
					Or our servers might be down.
					<button className="refreshButton" onClick={() => window.location.reload()}>
						Reload page
					</button>
					<span className="toggleSmall white">
						Service status (soon)
					</span>
				</div>
			</div>
		</div>
	);
}

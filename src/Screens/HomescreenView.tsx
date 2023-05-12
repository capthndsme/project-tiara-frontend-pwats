import { Helmet } from "react-helmet";
import { DeviceControls } from "../Components/DeviceControls";
import { DeviceGlance } from "../Components/DeviceGlance";
import { DeviceSelector } from "../Components/DeviceSelector";
import { useContext } from "react";
import { ActiveDeviceContext } from "../Components/ActiveDeviceContext";

export function HomescreenView() {
	const activeState = useContext(ActiveDeviceContext);
	if (activeState.deviceDetails) {
		return (
			<div className="screen">
				<Helmet>
					<meta name="theme-color" content="#3a3539" />
				</Helmet>
				<div className="maxWidth" style={{ maxWidth: 600 }}>
					<DeviceSelector />
					<DeviceGlance />
					<DeviceControls />
				</div>
			</div>
		);
	} else {
		return (
			<div className="screen">
				<Helmet>
					<meta name="theme-color" content="#3a3539" />
				</Helmet>
				<div className="maxWidth" style={{ maxWidth: 600 , textAlign:"center"}}>
					<h1>You do not own or have access to any devices.</h1>
					<br />
					<a target="_blank" style={{color: "var(--highlight-colour)"}} rel="noreferrer" href="https://github.com/capthndsme/project-tiara-device-client-v2">
						Learn how to make your own device here.
					</a>
				</div>
			</div>
		);
	}
}

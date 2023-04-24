import { Helmet } from "react-helmet";
import { DeviceControls } from "../Components/DeviceControls";
import { DeviceGlance } from "../Components/DeviceGlance";
import { DeviceSelector } from "../Components/DeviceSelector";

export function HomescreenView() {
	return (
		<div className="screen">
			<Helmet>
				<meta name="theme-color" content="#3a3539" />
			</Helmet>
			<div className="maxWidth">
				<DeviceSelector />
				<DeviceGlance />
				<DeviceControls />
			</div>
		</div>
	);
}

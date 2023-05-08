import { useContext } from "react";
import { ActiveDeviceContext } from "./ActiveDeviceContext";
import { DeviceToggle } from "./DeviceToggle";
import { Link } from "react-router-dom";
import Delayed from "./Delayed";

export function DeviceControls() {
	const localDevice = useContext(ActiveDeviceContext);
	console.log(localDevice);
	let controls = [];
	if (localDevice.deviceToggles) {
		for (let i = 0; i < localDevice.deviceToggles.length; i++) {
			controls.push(
			<Delayed delay={125 + (i*20)}> <DeviceToggle key={i} toggle={localDevice.deviceToggles[i]} /> </Delayed>);
		}
	}
	return (
		<div className="deviceControls">
			<Delayed delay={125}>
				<div className="cameraImage">
					<Link to="/camera">Video Camera</Link>
					<img
						className="cameraBehind"
						alt="Camera Preview of your device."
						src={"https://ptserver.capthndsme.xyz/preview_images/" + localDevice.deviceDetails?.DeviceHWID + ".jpg"}
					></img>
				</div>
			</Delayed>

			{controls}
		</div>
	);
}

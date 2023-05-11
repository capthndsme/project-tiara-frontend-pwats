import { useContext } from "react";
import { ActiveDeviceContext } from "./ActiveDeviceContext";
import { DeviceToggle } from "./DeviceToggle";
import { Link } from "react-router-dom";
import Delayed from "./Delayed";
import { CameraImage } from "./CameraImage";

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
				<CameraImage hwid={localDevice.deviceDetails?.DeviceHWID} />
			</Delayed>

			{controls}
		</div>
	);
}

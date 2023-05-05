import { useContext } from "react";
import { ActiveDeviceContext } from "./ActiveDeviceContext";
import { DeviceToggle } from "./DeviceToggle";
import { Link } from "react-router-dom";

export function DeviceControls() {
	const localDevice = useContext(ActiveDeviceContext);
	console.log(localDevice);
	let controls = [];
	if (localDevice.deviceToggles) {
		for (let i = 0; i < localDevice.deviceToggles.length; i++) {
			controls.push(<DeviceToggle key={i} toggle={localDevice.deviceToggles[i]} />);
		}
	}
	return (
		<div className="deviceControls">
			<div className="cameraImage">

				<Link to="/camera">Video Camera</Link>
            <img className="cameraBehind"
            alt="Camera Preview of your device."
             src={
               "https://ptserver.capthndsme.xyz/preview_images/" + localDevice.deviceDetails?.DeviceHWID + ".jpg"
            }></img>
			</div>
			{controls}
		</div>
	);
}

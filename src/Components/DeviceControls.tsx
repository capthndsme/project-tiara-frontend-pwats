import { useContext } from "react";
import { ActiveDeviceContext } from "./ActiveDeviceContext";
import { DeviceToggle } from "./DeviceToggle";
  

 
import { CameraImage } from "./CameraImage";

export function DeviceControls() {
	const localDevice = useContext(ActiveDeviceContext);
	console.log(localDevice);
	let controls = [];
	if (localDevice.deviceToggles) {
		for (let i = 0; i < localDevice.deviceToggles.length; i++) {
			controls.push(
		 <DeviceToggle key={i} toggle={localDevice.deviceToggles[i]} />  );
		}
	}
	return (
		<div className="deviceControls">
 
				<CameraImage hwid={localDevice.deviceDetails?.DeviceHWID} />
 

			{controls}
		</div>
	);
}

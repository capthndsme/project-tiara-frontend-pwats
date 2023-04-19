import { useContext } from "react";
import { ActiveDeviceContext } from "./ActiveDeviceContext";

export function DeviceSelector() {
	const activeDeviceContext = useContext(ActiveDeviceContext);
	 
	// Check if the active device is set. If not, return an empty fragment.
	if (!activeDeviceContext) return (<></>);
	 
	return (<>
	{activeDeviceContext.deviceDetails?.AccessType === "owner" ? "My Home" : "%owner's home"}
	<h1 className="noMargin">{activeDeviceContext.deviceDetails?.DeviceName}</h1>
	</>);
}

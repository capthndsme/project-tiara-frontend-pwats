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
	return (<div className="deviceControls">
      <Link to="/camera">Video Camera</Link>
      {controls}
   </div>);
}

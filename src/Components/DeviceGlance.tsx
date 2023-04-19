import moment from "moment/moment";
import { useContext } from "react";
import { FaThermometerHalf } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";
import { ActiveDeviceContext } from "./ActiveDeviceContext";
export function DeviceGlance() {
	const activeDeviceContext = useContext(ActiveDeviceContext);
	if (activeDeviceContext && activeDeviceContext.deviceIsOnline) {
		let ThermometerView = <div>No temperature sensors</div>;
		if (activeDeviceContext.deviceSensors && activeDeviceContext.deviceSensors.Thermometers) {
			ThermometerView = (
				<>
					<div className="sensor">
						<FaThermometerHalf size={24} />
						<div className="value">
							{activeDeviceContext.deviceSensors.Thermometers.Inside?.Temperature.toFixed(2)}°C inside /{" "}
							{activeDeviceContext.deviceSensors.Thermometers.Outside?.Temperature.toFixed(2)} °C outside{" "}
						</div>
					</div>
					<div className="sensor">
						<WiHumidity size={24} />
						<div className="value">
							{activeDeviceContext.deviceSensors.Thermometers.Inside?.Humidity.toFixed(2)}% inside /{" "}
							{activeDeviceContext.deviceSensors.Thermometers.Outside?.Humidity.toFixed(2)}% outside{" "}
						</div>
					</div>
				</>
			);
		}
		return (
			<>
				Last updated: {moment(activeDeviceContext.deviceLastUpdate).fromNow()}
				{ThermometerView}
				<br />
			</>
		);
	} else {
		return (<>
        Your device seems to be offline.
        </>);
	}
}

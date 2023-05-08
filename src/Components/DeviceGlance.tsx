import moment from "moment/moment";
import { useContext } from "react";
import { FaThermometerHalf } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";
import { ActiveDeviceContext } from "./ActiveDeviceContext";
import { HeatIndex, celsiusToFahrenheit, fahrenheitToCelsius } from "./HeatIndex";
export function DeviceGlance() {
	const activeDeviceContext = useContext(ActiveDeviceContext);
	if (activeDeviceContext && activeDeviceContext.deviceIsOnline) {
		let ThermometerView = <div>No temperature sensors</div>;
		let HeatIndexView = <></>;
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
					System temp: {activeDeviceContext.deviceSensors.Thermometers.CPU?.Temperature.toFixed(2)}°C 
				</>
			);
			let hIndex: number | null;
			if (activeDeviceContext.deviceSensors.Thermometers.Inside?.Temperature && activeDeviceContext.deviceSensors.Thermometers.Inside?.Humidity) {
				// TODO: Find a celsius-native heat index formula.
				hIndex = HeatIndex(celsiusToFahrenheit(activeDeviceContext.deviceSensors.Thermometers.Inside?.Temperature), activeDeviceContext.deviceSensors.Thermometers.Inside?.Humidity);
				if (hIndex) {
					HeatIndexView = <div>Heat index: {fahrenheitToCelsius(hIndex).toFixed(2)}°C</div>;
				}
			}
			
		}
		return (
			<>
				Last updated: {moment(activeDeviceContext.deviceLastUpdate?? 0 - 10000).fromNow()}
				{ThermometerView}
				{HeatIndexView}
				<br />
			</>
		);
	} else {
		return (<>
        Your device seems to be offline.
        </>);
	}
}

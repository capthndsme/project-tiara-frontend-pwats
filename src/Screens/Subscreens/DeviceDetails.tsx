import { useContext, useState } from "react";
import { SimpleBackButton } from "../../Components/SimpleBackButton";
import { TopBar } from "../../Components/TopBar";

import { ActiveDeviceContext } from "../../Components/ActiveDeviceContext";
import { socket } from "../../Components/socket";
import { toast } from "react-hot-toast";
import { FunctionContext } from "../../Components/FunctionContext";
import { DeviceState } from "../../Types/DeviceState";

export function DeviceDetails() {
	const Details = useContext(ActiveDeviceContext);
	const Functions = useContext(FunctionContext);
	const [saveEnabled, setSaveEnabled] = useState(true);
	const [deviceName, setDeviceName] = useState(Details.deviceDetails?.DeviceName || "");
	const [deviceDescription, setDeviceDescription] = useState(Details.deviceDetails?.DeviceDescription || "");
	return (
		<div className="screen">
			<TopBar float={true} leftToRight={true}>
				<SimpleBackButton />
				Edit device details
			</TopBar>
			<div className="maxWidth">
				<div
					className="genericEntry"
					style={{
						padding: "8px 4px",
					}}
				>
					<div className="LTR">Device Name</div>
					<input
						className="triggerstyle left buttonMargin "
						value={deviceName}
						onChange={(e) => {
							setDeviceName(e.target.value);
						}}
					></input>
					<div className="LTR">Device Description</div>
					<input
						className="triggerstyle left buttonMargin "
						value={deviceDescription}
						onChange={(e) => {
							setDeviceDescription(e.target.value);
						}}
					></input>
					<button
						className="refreshButton buttonMargin"
						disabled={!saveEnabled}
						onClick={() => {
							setSaveEnabled(false);
							toast("Updating device details");
							socket.timeout(5000).emit(
								"UpdateSubscribedDevice",
								{
									DeviceName: deviceName,
									DeviceDescription: deviceDescription,
								},

								(err: boolean, data: never) => {
									if (err) {
										toast.error("Failed to update device details");
										setSaveEnabled(true);
									} else {
										toast.success("Device details updated successfully");
										if (Functions.setActiveDeviceState)
											Functions.setActiveDeviceState((state: DeviceState) => ({
												...state,
												deviceDetails: {
													DeviceHWID: Details.deviceDetails?.DeviceHWID || "",
													DeviceID: Details.deviceDetails?.DeviceID || 0,
													DeviceName: deviceName,
													DeviceDescription: deviceDescription,
                                       AccessType: Details.deviceDetails?.AccessType || "Unknown",
												},
											}));
										setSaveEnabled(true);
									}
								}
							);
						}}
					>
						Save changes
					</button>
				</div>
			</div>
		</div>
	);
}

import { useContext } from "react";
import { DeviceBaseToggle, ToggleType } from "../Types/DeviceBaseToggle";
import { FunctionContext } from "./FunctionContext";
import { toast } from "react-hot-toast";
import moment from "moment";

function ToggleRipple() {
	return (
		<div className="rippleoverlay">
			<div className="lds-ripple">
				<div>x</div>
				<div></div>
			</div>
		</div>
	);
}

export function DeviceToggle({ toggle }: { toggle: DeviceBaseToggle | null }) {
	const appFunctions = useContext(FunctionContext);

	function clickToggle() {
		if (toggle?.hasLock) {
			toast("You are already toggling this...", { icon: "⏳" });
			console.log("Toggle already pending...");
			return;
		}
		if (appFunctions && appFunctions.mutateToggle && toggle) appFunctions.mutateToggle(!toggle.toggleValue, toggle);
	}
	let toggleClass = "";
	// If toggle is not oneoff, do not show the toggle as on if it is loading.
	if (toggle?.hasLock && toggle?.toggleValue && toggle?.toggleType !== ToggleType.ONEOFF) {
		toggleClass = "toggleLoading toggleOn";
	} else if (toggle?.hasLock) {
		toggleClass = "toggleLoading";
	} else if (toggle?.toggleValue && toggle?.toggleType !== ToggleType.ONEOFF) {
		toggleClass = "toggleOn";
	} else {
		toggleClass = "";
	}
	if (toggle) {
		return (
			<div onClick={clickToggle} className={toggleClass}>
				{toggle.toggleDescription}
				{(toggle?.hasLock)?<ToggleRipple/>:<></>}
				<div className="toggleSmall">
					Last selected:
					<br />
					{moment((toggle.lastChanged??Date.now())-10000).fromNow()}
				</div>
			</div>
		);
	} else {
		return <></>;
	}
}
 
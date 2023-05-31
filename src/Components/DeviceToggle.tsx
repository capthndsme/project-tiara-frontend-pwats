import { useContext, useEffect } from "react";
import { DeviceBaseToggle, ToggleType } from "../Types/DeviceBaseToggle";
import { FunctionContext } from "./FunctionContext";
import { toast } from "react-hot-toast";
import moment from "moment";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const MySwal = withReactContent(Swal);
function ToggleRipple() {
	return (
		<div className="rippleoverlay">
			<div className="lds-ripple">
				<div></div>
				<div></div>
			</div>
		</div>
	);
}

export function DeviceToggle({ toggle }: { toggle: DeviceBaseToggle | null }) {
	const appFunctions = useContext(FunctionContext);
	useEffect(() => {
		return () => {
			// Ensure close the modal.
			MySwal.close();
		}
	}, [])
	
	function clickToggle() {
		if (toggle?.hasLock) {
			toast("You are already toggling this...", { icon: "⏳" });
			console.log("Toggle already pending...");
			return;
		}
		// A minimum time between toggles and display a warning.
		// if they wish to proceed.
		const DISPENSE_MULTIPLIER = 12; // 6 hours
		// 30 minutes for everything else, 6 hours for food dispense.
		const minimumTime = 30 * 60 * 1000 * (toggle?.toggleName === "foodDispense"?DISPENSE_MULTIPLIER:1);
		const lastChanged = toggle?.lastChanged ?? Date.now();
		const timeSince = Date.now() - lastChanged;
		console.log("Time since last toggle:", timeSince, "ms")
		console.log("Last changed:", moment(lastChanged).format("YYYY-MM-DD HH:mm:ss"), "ms")
		if (timeSince < minimumTime && toggle?.toggleType === ToggleType.ONEOFF) {
			// Show a warning.
			// ToggleType Oneoff is a toggle that can only be toggled best once every 30 minutes.
			MySwal.fire({
				title: "Are you sure?",
				text: `You last selected ${toggle.toggleDescription} ${moment(lastChanged).fromNow()}. Are you sure you want to select this option again?`,
				icon: "warning",
				showCancelButton: true,
				confirmButtonText: "Do it anyway",
 
			}).then((result) => {
				if (result.isConfirmed) {
					// Toggle the toggle.
					if (appFunctions && appFunctions.mutateToggle && toggle) appFunctions.mutateToggle(!toggle.toggleValue, toggle);
				} else {
					// Do nothing.
					toast("Toggle cancelled.", { icon: "🚫" })
				}
			});
		} else {
			// Toggle the toggle.
			if (appFunctions && appFunctions.mutateToggle && toggle) appFunctions.mutateToggle(!toggle.toggleValue, toggle);
			
		}
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
 
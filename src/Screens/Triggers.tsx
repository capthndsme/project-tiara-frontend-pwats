import { useEffect, useState } from "react";
import { TopBar } from "../Components/TopBar";
import { socket } from "../Components/socket";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { DeviceReqStatus } from "../Types/DeviceReqStatus";
import { ScheduledTask } from "../Types/SchedulerTypes";

export function Triggers() {
	// Load triggers
	const [triggers, setTriggers] = useState<Array<ScheduledTask>>([]);
	const navigate = useNavigate();
	useEffect(() => {
		if (socket.disconnected) {
			// If the socket is disconnected, redirect to the main app page
			toast("Cannot load triggers due to disconnected socket.")
			navigate("/");
		}
		// Get Scheduler Data For Subscribed Device (SchedGetSD)
		// The server will send back a list of triggers for the client's currently subscribed device.
		socket.timeout(15000).emit("SchedGetSD", {}, (err: Boolean, data: DeviceReqStatus<Array<ScheduledTask>>) => {
			if (err) {
				toast.error("Failed to get triggers for your device.");
				return; 
			} else {
				if (data.success && data.data) {
					setTriggers(data.data);
				} else {
					toast.error("Failed to get triggers for your device.");
				}
				console.log("Trigger Receive", data);
			}
		});
		return () => {
			// Cleanup function. 
			// It seems that we don't need to do anything here.
			// for now? 
		}
	}, [navigate]);
	console.log("Triggers", triggers)
	return (
		<div className="screen">
			<TopBar> Triggers </TopBar>
		</div>
	);
}

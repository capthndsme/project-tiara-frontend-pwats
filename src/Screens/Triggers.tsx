import { useEffect, useState } from "react";
import { socket } from "../Components/socket";
import { Route, Routes } from "react-router-dom";
import { toast } from "react-hot-toast";
import { DeviceReqStatus } from "../Types/DeviceReqStatus";
import { ScheduledTask } from "../Types/SchedulerTypes";
import { TriggerScreen } from "./Subscreens/TriggerScreen";
import { AddTriggers } from "./Subscreens/AddTriggers";
import { EditTrigger } from "./Subscreens/EditTrigger";

export function Triggers() {
	// Load triggers
	const [triggers, setTriggers] = useState<Array<ScheduledTask>>([]);
	const [simpleForceUpdate, setSimpleForceUpdate] = useState<number>(0);
	function incrementSimpleForceUpdate() {
		setSimpleForceUpdate((prev) => prev + 1);
	}
	useEffect(() => {
		if (socket.disconnected) {
			// If the socket is disconnected, redirect to the main app page
			socket.connect();
			//navigate("/");
			//return;
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
	}, [simpleForceUpdate]);
 
	return(
	<div className="screen">
		<Routes>
			<Route path="/" element={<TriggerScreen setTriggers={setTriggers} reload={incrementSimpleForceUpdate} triggers={triggers} />} />
			<Route path="/add" element={<AddTriggers reload={incrementSimpleForceUpdate} />} />
			<Route path="/edit/:id" element={<EditTrigger reload={incrementSimpleForceUpdate}  triggers={triggers}/>} />
		</Routes>
		
	</div>
		
	)
	
}

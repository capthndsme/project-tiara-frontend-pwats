import ReactPlayer from "react-player";
import { useContext, useEffect, useState } from "react";
import { TopBar } from "../Components/TopBar";
import { socket } from "../Components/socket";
import { ActiveDeviceContext } from "../Components/ActiveDeviceContext";
import { DeviceReqStatus } from "../Types/DeviceReqStatus";
import { StreamState } from "../Types/StreamState";
import toast from "react-hot-toast";
import { Spin } from "../Components/Spin";
import { SimpleBackButton } from "../Components/SimpleBackButton";
export function VideoCameraView() {
	const activeDeviceContext = useContext(ActiveDeviceContext);
	const activeDeviceID = activeDeviceContext.deviceDetails?.DeviceHWID;
	const [streamLoaded, setStreamLoaded] = useState("");

	useEffect(() => {
		let unmounted = false;
		let timeout: NodeJS.Timeout; // We actually need a number here, but for some reason the type definition uses NodeJS.Timeout
		console.log("Requesting stream for device ", activeDeviceID);
		function getStream() {
			if (activeDeviceID) {
				socket.timeout(15000).emit("StreamRequest", {}, (err: Boolean, reqStatus: DeviceReqStatus<StreamState>) => {
					if (err || !reqStatus.success) {
						console.log("Stream request failed.");
						// Simple retry logic that checks if the component is still mounted before retrying.
						if (!err) toast.error("Failed to stream: " + (reqStatus.error ? reqStatus.error : "Unknown error") + ". Retrying.");
						if (!unmounted) timeout = setTimeout(getStream, 15000);
						return;
					}
					console.log("StreamStatus", reqStatus);
					reqStatus.data?.streamKey && setStreamLoaded(reqStatus.data.streamKey);
				});
			}
		}
		getStream();
		return () => {
			unmounted = true;
			clearTimeout(timeout);
		};
	}, [activeDeviceID]);

	if (streamLoaded) {
		return (
			<div className="screen blackOut">
				<TopBar float={true} leftToRight={true}>
					<SimpleBackButton />
					Camera Stream
				</TopBar>
				<ReactPlayer
					muted={true}
					// @ts-ignore // Fix this later.
					onReady={() => this.player.seekTo(this.getProgress())}
					width="100%"
					height="calc(100% - 60px)"
					playing={true}
					url={"https://ptserver.capthndsme.xyz:8443/live/" + streamLoaded + "/index.m3u8"}
				/>
			</div>
		);
	} else {
		return (
			<div className="screen">
				<TopBar float={true} leftToRight={true}>
					<SimpleBackButton />
					Camera Stream
				</TopBar>
				<div className="loading fullscreen centreText">
					<Spin />
					<br />
					{activeDeviceContext.deviceIsOnline ? "Loading stream" : "Your device seems to be offline. Cannot stream."}
				</div>
			</div>
		);
	}
}

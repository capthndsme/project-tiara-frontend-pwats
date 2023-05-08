import ReactPlayer from "react-player";
import { useContext, useEffect, useState } from "react";
import { TopBar } from "../Components/TopBar";
import { socket } from "../Components/socket";
import { MdOutlineZoomInMap, MdOutlineZoomOutMap } from "react-icons/md";
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
	const [fullscreen, setFullscreen] = useState(false);
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
			<div className="screen" style={{background: "black"}}>
				 
				<button
					style={{
						position: "absolute",

						border: "none",
						width: 48,
						height: 48,
						background: "var(--darker-bg-colour-translucent)",
						color: "white",
						padding: 4,
						
						margin: 0,
						marginLeft: 16,
						marginTop: 16,
						zIndex: 5,
						borderRadius: 32,
					}}
					className="fullscreenButton"
					onClick={() => setFullscreen(!fullscreen)}
				>
 
					{fullscreen ? <MdOutlineZoomOutMap size={24} /> : <MdOutlineZoomInMap size={24} />}{" "}
				</button>
				<div className={fullscreen ? "player player-cover" : "player"}>
					<ReactPlayer
						muted={true}
						playsinline={true}
						// @ts-ignore // Fix this later.
						onReady={() => this.player.seekTo(this.getProgress())}
						width="100%"
						height="100%"
						playing={true}
						loop={true}
						url={"https://ptserver.capthndsme.xyz:8443/live/" + streamLoaded + "/index.m3u8"}
					/>
				</div>
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

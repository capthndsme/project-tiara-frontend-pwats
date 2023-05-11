import ReactPlayer from "react-player";
import { useContext, useEffect, useRef, useState } from "react";
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
	const [load, setLoad] = useState(false);
	const playerRef = useRef<ReactPlayer>(null);
	const [fullscreen, setFullscreen] = useState(false);
	useEffect(() => {
		let unmounted = false;
		let timeout: NodeJS.Timeout; // We actually need a number here, but for some reason the type definition uses NodeJS.Timeout
		console.log("Requesting stream for device ", activeDeviceID);
		function disconnectListener() {
			console.log("Disconnected from server.");
			setLoad(false);
		}
		socket.on("disconnect", disconnectListener);
		function getStream() {
			if (activeDeviceID) {
				  socket.timeout(15000).emit("StreamRequest", {}, (err: Boolean, reqStatus: DeviceReqStatus<StreamState>) => {
					if (err || !reqStatus.success) {
						console.log("Stream request failed.");
						// Simple retry logic that checks if the component is still mounted before retrying.
						if (!err) {
							toast.error("Failed to stream: " + (reqStatus.error ? reqStatus.error : "Unknown error") + ". Retrying.");
							setLoad(false);
						}
						if (!unmounted) timeout = setTimeout(getStream, 15000);
						return;
					}
					console.log("StreamStatus", reqStatus);
					reqStatus.data?.streamKey && setStreamLoaded(reqStatus.data.streamKey);
					setLoad(reqStatus.success);
					if (!unmounted) timeout = setTimeout(getStream, 15000);
				});
			}
		}
		getStream();
		return () =>  {
			unmounted = true;
			socket.off("disconnect", disconnectListener);
			clearTimeout(timeout);
 
			 
			
		};
	}, [activeDeviceID]);

	if (load) {
		return (
			<div
				className="loading fullscreen"
				style={{
					position: "fixed",
					top: 0,
					left: 0,
					background: "black",
					display: "block",
					zIndex: 20,
				}}
			>
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
					onClick={() => window.history.back()}
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
						<path fill="none" d="M0 0h24v24H0z" />
						<path fill="white" d="M20 11H7.828l5.657-5.657-1.414-1.414L3.515 12l7.071 7.071 1.414-1.414L7.828 13H20v-2z" />
					</svg>
				</button>
				<div
					style={{
						position: "fixed",
						width: 200,
						lineHeight: "74px",
						textShadow: "0px 2px 10px black",
						left: "calc(50% - 100px)",
						top: 0,
						textAlign: "center",
					}}
				>
					Camera view
				</div>
				<button
					style={{
						position: "absolute",

						border: "none",
						width: 48,
						height: 48,
						background: "var(--darker-bg-colour-translucent)",
						color: "white",
						padding: 4,
						right: 16,
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
						ref={playerRef}
						onReady={(player) => {
							console.log("Player ready", player);
					 
							setLoad(true);
						}}
						onError={(err) => {
							console.log("Error playing stream", err);
						}}
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
			<div
				className="loading fullscreen"
				style={{
					display: "block",
					zIndex: 20,
				}}
			>
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

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { socket } from "./socket";

export function CameraImage({hwid}: {hwid: string|undefined}) {
   const [update, setUpdate] = useState(0);
   useEffect(() => {
      function updateImageReceiver() {
         console.log("[CameraImage] Received update.")
         setUpdate(Date.now());
      }
      console.log("Registering CameraPreviewUpdated")
      socket.on("CameraPreviewUpdated", updateImageReceiver);
      return () => {
         socket.off("CameraPreviewUpdated", updateImageReceiver);
      }
   }, []);
	return (
		<div className="cameraImage">
			<Link to="/camera">Video Camera</Link>
			<img
				className="cameraBehind"
				alt="Camera Preview of your device."
				src={"https://ptserver.capthndsme.xyz/preview_images/" + hwid + ".jpg?" + update}
			></img>
		</div>
	);
}

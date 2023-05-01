import ReactPlayer from "react-player"
import { useContext, useEffect, useState } from "react";
import { TopBar } from "../Components/TopBar";
import { socket } from "../Components/socket";
import { ActiveDeviceContext } from "../Components/ActiveDeviceContext";
export function VideoCameraView() {
 
   const activeDeviceContext = useContext(ActiveDeviceContext)
   const activeDeviceID = activeDeviceContext.deviceDetails?.DeviceHWID;
   const [streamLoaded, setStreamLoaded] = useState(false);

   useEffect(() => {
      let timeout: NodeJS.Timeout; // We actually need a number here, but for some reason the type definition uses NodeJS.Timeout
      console.log("Requesting stream for device ", activeDeviceID)
      function getStream() {
         if (activeDeviceID) {
         
         }
      }
      getStream();
      return () => {
         clearTimeout(timeout);
      }

   }, [activeDeviceID]);
 
   if (streamLoaded) {
      return (
         <div className="screen blackOut">
             <TopBar > Camera </TopBar>
            <ReactPlayer 
            muted={true}
            // @ts-ignore // Fix this later. 
            onReady={() => this.player.seekTo(this.getProgress())}
             width="100%" height="calc(100% - 60px)"
 
             playing={true} url={'https://ptserver.capthndsme.xyz:8443/live/' + streamLoaded + '/index.m3u8'} />
         </div>


      );
   } else {
      return (<div className="rippleoverlay"> <div className="lds-ripple"><div></div><div></div></div></div>);
   }
} 
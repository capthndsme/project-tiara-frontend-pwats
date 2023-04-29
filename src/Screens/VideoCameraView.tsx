import ReactPlayer from "react-player"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TopBar } from "../Components/TopBar";
import { socket } from "../Components/socket";
export function VideoCameraView() {
 
   let { device } = useParams();
   
   
   const [streamLoaded, setStreamLoaded] = useState(false);

   useEffect(() => {
      let timeout: NodeJS.Timeout; // We actually need a number here, but for some reason the type definition uses NodeJS.Timeout
      console.log("Requesting stream for device " + device)
      function getStream() {
         if (device) {
            axios.get("https://ptserver.capthndsme.xyz/camera/streamRequest/" + device, {
               headers: {
                  "Authorization": localStorage.getItem("session"),
                  "X-app-username": localStorage.getItem("username")
               }
            }).then((res) => {
               if (res.data.status === "success") {
   
                  timeout = setTimeout(getStream, 20000);
                  if (res.data.streamID) {
                     setStreamLoaded(res.data.streamID);
                  } else {
                     setStreamLoaded(false);
                  }
   
               } else {
                  setStreamLoaded(false); // This is redundant, but I'm leaving it in for clarity
                  timeout = setTimeout(getStream, 20000);
               }
            });
         }
      }
      getStream();
      return () => {
         clearTimeout(timeout);
      }

   }, [device]);
   console.log("Render");
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
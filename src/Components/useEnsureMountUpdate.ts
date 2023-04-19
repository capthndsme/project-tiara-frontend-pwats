import { useEffect } from "react"
 
import { socket } from "./socket";
import { DeviceState } from "../Types/DeviceState";

export const useEnsureMountUpdate = (ds: DeviceState) => {
   useEffect(() => {
      console.log('useEnsureMountUpdate');
      const currentDevState = ds.deviceDetails;
      if (currentDevState) {
         // if device last update is greater than 10 seconds ago, update it.
         // this ensures any realtime components on mount will update.
         // TODO: Complete this.
         // deviceLastUpdate is from device itself, and not inside our React app.
         socket.emit("getLastCachedDeviceState", currentDevState.DeviceHWID);
      }
   }, [ds]);
}
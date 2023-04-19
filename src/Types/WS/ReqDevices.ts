import { Device } from "../Device";
import { DeviceState } from "../DeviceState";

export type ReqDevices = {
   devices: Array<Device> | null;
   success: boolean,
   firstDeviceStateCache: DeviceState
}
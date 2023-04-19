import { createContext } from "react";
import { DeviceBaseToggle } from "../Types/DeviceBaseToggle";

export const DefaultToggles: Array<DeviceBaseToggle> = []
export const TogglesContext = createContext<Partial<DeviceBaseToggle[]>>(DefaultToggles);

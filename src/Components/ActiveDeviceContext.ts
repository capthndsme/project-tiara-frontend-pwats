import { createContext } from 'react';
import { DefaultDeviceState, DeviceState } from '../Types/DeviceState';
 

export const ActiveDeviceContext = createContext<Partial<DeviceState>>(DefaultDeviceState);
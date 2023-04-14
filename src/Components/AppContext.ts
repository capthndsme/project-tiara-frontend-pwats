import { createContext } from 'react';
import { Device } from '../Types/Device';
export type AppStateType = {
   authenticated: boolean
   accountId: number,
   devices: Array<Device> | null,
   connected: boolean
  
 }
export const DefaultAppState: AppStateType = {
   authenticated: false,
   accountId: 0,
   devices: [],
   connected: false,
  
};

export const AppContext = createContext<Partial<AppStateType>>(DefaultAppState);
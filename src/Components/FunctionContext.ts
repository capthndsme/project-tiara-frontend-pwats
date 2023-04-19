import { createContext } from 'react';
import { AppStateType } from './AppContext';
import { DeviceState } from '../Types/DeviceState';
import { DeviceBaseToggle } from '../Types/DeviceBaseToggle';


export type FunctionContextType = {
   setAppState: React.Dispatch<React.SetStateAction<AppStateType>>;
   setActiveDeviceState: React.Dispatch<React.SetStateAction<DeviceState>>;
   
   mutateToggle: (val: boolean, name: string) => void;
   
}
export const DefaultFunctionContext: FunctionContextType = {
   setAppState: () => { },
   setActiveDeviceState: () => { },

   mutateToggle: () => {}
};

export const FunctionContext = createContext<Partial<FunctionContextType>>(DefaultFunctionContext);
import { createContext } from 'react';
import { AppStateType } from './AppContext';
import { DeviceState } from '../Types/DeviceState';


export type FunctionContextType = {
   setAppState: React.Dispatch<React.SetStateAction<AppStateType>>;
   setActiveDeviceState: React.Dispatch<React.SetStateAction<DeviceState>>;
   reloadTheme: () => void;
   mutateToggle: (val: boolean, name: string) => void;
   
}
export const DefaultFunctionContext: FunctionContextType = {
   setAppState: () => { },
   setActiveDeviceState: () => { },
   reloadTheme: () => { },
   mutateToggle: () => {}
};

export const FunctionContext = createContext<Partial<FunctionContextType>>(DefaultFunctionContext);
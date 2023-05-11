import { createContext } from 'react';
import { AppStateType } from './AppContext';
import { DeviceState } from '../Types/DeviceState';
import { DeviceBaseToggle } from '../Types/DeviceBaseToggle';


export type FunctionContextType = {
   setAppState: React.Dispatch<React.SetStateAction<AppStateType>>;
   setActiveDeviceState: React.Dispatch<React.SetStateAction<DeviceState>>;
   reloadTheme: () => void;
   mutateToggle: (val: boolean, name: DeviceBaseToggle) => void;
   authenticate: () => void,
   
}
export const DefaultFunctionContext: FunctionContextType = {
   setAppState: () => { },
   setActiveDeviceState: () => { },
   reloadTheme: () => { },
   mutateToggle: () => {},
   authenticate: () => {}
};

export const FunctionContext = createContext<Partial<FunctionContextType>>(DefaultFunctionContext);
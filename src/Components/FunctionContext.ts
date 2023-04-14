import { createContext } from 'react';
import { AppStateType } from './AppContext';

export type FunctionContext = {
   setAppState: React.Dispatch<React.SetStateAction<AppStateType>>;
   setConnected: React.Dispatch<React.SetStateAction<boolean>>;
}
export const DefaultFunctionContext: FunctionContext = {
   setAppState: () => { },
   setConnected: () => { }
};

export const FunctionContext = createContext<Partial<FunctionContext>>(DefaultFunctionContext);
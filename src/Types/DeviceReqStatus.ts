export type DeviceReqStatus<T = {}> = {
   success: boolean, 
   data?: T // If success is false, data is undefined.  
   error?: string // If success is true, error is undefined.
}
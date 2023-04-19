export interface DeviceBaseToggle {
   toggleName: string,
   toggleValue: boolean,
   toggleDescription: boolean,
   hasLock: boolean | null,
   lastChanged: number | null // Null means the toggle has never been changed.
}
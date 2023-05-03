import { ToggleType } from "../Types/DeviceBaseToggle";
import { ScheduledTask, SchedulerTime } from "../Types/SchedulerTypes";

export enum ValidationErrors {
	TempLower = "Temperature is lower than the minimum allowed",
	TempHigher = "Temperature is higher than the maximum allowed",
	TempMaxLower = "Temperature is invalid. Make sure higher temperature is higher than lower temperature",
	TimeEndLower = "End time is lower than start time",
	DuplicateTime = "Duplicate time found",
	NullTask = "Scheduled task is null",
   EmptyTimes = "No times were specified",
   ValidationPassed = "Validation passed",
}

function createTimestampFromTime(time: SchedulerTime): number {
   // Create a timestamp from our SchedulerTime type
   // with date set to the Unix epoch so it wouldn't be unnecessarily large.
   // and maybe to be 32-bit compatible? But who cares about 32-bit anymore?
	if (time.time) return new Date(1970, 0, 1, time.time[0], time.time[0], 0, 0).getTime();
	return Date.now();
}

export function TriggerValidator(scheduledTask: ScheduledTask, toggleType: ToggleType): ValidationErrors {
	if (scheduledTask) {
		// Temp-range validation
		if (scheduledTask.tempRange &&
         toggleType === ToggleType.SWITCH // Only switch-type toggles have time range
      ) {
			if (scheduledTask.tempRange?.[0] > scheduledTask.tempRange?.[1]) {
				return ValidationErrors.TempMaxLower;
			}
		}

		// Time-range validation
		if (
			scheduledTask.timeRange &&
         toggleType === ToggleType.SWITCH && // Only switch-type toggles have time range
			// Check if the end time is lower than the start time by using the timestamp
			createTimestampFromTime(scheduledTask.timeRange.from) >= createTimestampFromTime(scheduledTask.timeRange.to)
		) {
			return ValidationErrors.TimeEndLower;
		}
      
      // EveryTask validation: check if there are duplicate times
      let timestamps: number[] = [];
      if (
         scheduledTask.every &&
         toggleType === ToggleType.ONEOFF && // Only one-off type toggles have everytask 
         scheduledTask.every.length === 0 || scheduledTask.every.length > 4 // Check if there are no times or more than 4 times
      ) {
         for (let i = 0; i < scheduledTask.every.length; i++) {
            const time = scheduledTask.every[i];
            const timestamp = createTimestampFromTime(time);
            if (timestamps.includes(timestamp)) {
               return ValidationErrors.DuplicateTime;
            }
            timestamps.push(timestamp);
         } 
         return ValidationErrors.EmptyTimes;
      }
	} else {
      return ValidationErrors.NullTask;
   }
   return ValidationErrors.ValidationPassed
}



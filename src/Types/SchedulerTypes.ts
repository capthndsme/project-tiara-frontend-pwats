export interface ScheduledTask {
	every: SchedulerTime[];
	tempRange: [number, number] | null;
	timeRange: {
		from: SchedulerTime;
		to: SchedulerTime;
	};
}

export interface SchedulerTime {
   time: [number, number] | null;
	lastExecuted: number;
}

export interface TempTriggerArray {
	scheduledTaskName: string;
	triggerOffTemp: number;
	triggerOnTemp: number;
}

export const ScheduledTaskBase = {
	every: [],
	tempRange: null,
	timeRange: {
		from: {
			time: null,
			lastExecuted: 0,
		},
		to: {
			time: null,
			lastExecuted: 0,
		},
	},
}
import { Stats, ThermometerStat } from "../Types/Stats";
import { socket } from "./socket";

export function GetStats(
	limit: number = 100,
	offset: number = 0,
	getByPastDays?: number,
	getByParams?: {
		byDay?: boolean;
		byMonth?: boolean;
		byYear?: boolean;
	},
	getByTimestamp?: number
): Promise<Array<Stats<ThermometerStat>>> {
	return new Promise((resolve, reject) => {
		if (!socket.connected) {
			return reject("Socket not connected.");
		} else {
			socket.timeout(30000).emit("GetStats", {
				limit,
				offset,
				getByPastDays,
				getByParams,
				getByTimestamp,
			}, (error: boolean, data: Array<Stats<ThermometerStat>>) => {
				if (error) return reject("Error getting stats.");
				return resolve(data); // Pass-through this data.
			});
		}
	});
}

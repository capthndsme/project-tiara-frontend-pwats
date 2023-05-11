import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";
import { Stats, TempCombined, ThermometerStat } from "../Types/Stats";
import { SimpleBackButton } from "../Components/SimpleBackButton";
import { TopBar } from "../Components/TopBar";
import { GetStats } from "../Components/GetStats";
import { toast } from "react-hot-toast";
import { TimestampAgo } from "../Components/TimestampAgo";
 
 
import moment from "moment";

export function StatsScreen() {
	const [data, setData] = useState<Array<Stats<ThermometerStat>>>([]);
	const [dayLimit, setDayLimit] = useState(1);
	useEffect(() => {
		GetStats(6000, 0, TimestampAgo(dayLimit))
			.then((data) => {
				setData(data);
				 
			})
			.catch(() => {
				toast("Failed to get stats");
			});
	}, [dayLimit]);
	if (data.length === 0) {
		return (
			<div className="screen">
				<TopBar float={true} leftToRight={true}>
					<SimpleBackButton />
					Stats
				</TopBar>
				<div className="maxWidthPlus">You seem to have no stats or it is still loading.</div>
			</div>
		);
	} else {
		let chartData = [];
		 
      // Simple reverse loop to get the last 1000 entries
		for (let i = data.length-1; i >= 0; i--) {
			if (data[i].MetricType === "TEMP_COMBINED") {
				// A lot of typecasting because MetricValue depends on MetricType
				// and TEMP_COMBINED, in my infinite wisdom, is a stringified JSON object.
				// A VERY BAD PRACTICE.
				// To be fair, the metrics system was made pre-TypeScript
				const temp = JSON.parse(data[i].MetricValue as string) as TempCombined;
            let saneInsideTemp = temp.inside?.temperature??0;
            if (saneInsideTemp > 100 || saneInsideTemp === -127 ) saneInsideTemp = 0;
            let saneOutsideTemp = temp.outside?.temperature??0;
            if (saneOutsideTemp > 100 || saneOutsideTemp === -127) saneOutsideTemp = 0;
            let saneInsideHumidity = temp.inside?.humidity??0;
            if (saneInsideHumidity === -1) saneInsideHumidity = 0;
            let saneOutsideHumidity = temp.outside?.humidity??0;
            if (saneOutsideHumidity === -1) saneOutsideHumidity = 0;
            if (!(saneInsideTemp === 0 || saneOutsideTemp === 0 || saneInsideHumidity === 0 || saneOutsideHumidity === 0)) {
               chartData.push({
                  label:  moment(data[i].Timestamp).format("DD/MM HH:mm"),
                  InsideTemp: saneInsideTemp.toFixed(2),
                  InsideHumidity: saneInsideHumidity.toFixed(2),
                  OutsideTemp: saneOutsideTemp.toFixed(2),
                  OutsideHumidity: saneOutsideHumidity.toFixed(2),
                  SystemTemp: temp.cpu?.temperature?temp.cpu.temperature.toFixed(2):0,
               });
              
            }
            
			}
		}

		return (
			<div className="screen">
				<TopBar float={true} leftToRight={true}>
					<SimpleBackButton />
					Stats
				</TopBar>
				<div className="maxWidthPlus">
					<select
						className="refreshButton"
						style={{
							height: 30,
						}}
						onChange={(e) => {
							setDayLimit(parseInt(e.target.value));
							console.log(e.target.value);
						}}
					>
						<option value="1">Today</option>
						<option value="7">Last 7 days</option>
						<option value="30">Last 30 days</option>
						<option value="90">Last 90 days</option>
					</select>
					<div className="genericEntry" style={{
                  backgroundColor: "black",
               }}>
						<ResponsiveContainer width="100%" height={400}>
							<LineChart width={100} height={400} margin={
                     {
                        top:16,
                        left: -10,
                        right: 16,
                        bottom: 16,
                       }
                     } data={chartData}>
								<Tooltip cursor={{ fill: "#f00", color: "black" }} />
								<XAxis stroke="white" dataKey="label" />
								<YAxis stroke="white" />
								<CartesianGrid stroke="#333" strokeDasharray="2" />
								<Legend />
								<Line dot={false} type="monotone" dataKey="InsideTemp" stroke="#EA8454" />
                        <Line dot={false} type="monotone" dataKey="OutsideTemp" stroke="#EA8454" />
								<Line dot={false} type="monotone" dataKey="InsideHumidity" stroke="#5378E8" />

								<Line dot={false} type="monotone" dataKey="OutsideHumidity" stroke="#5378E8" />
								<Line dot={false} type="monotone" dataKey="SystemTemp" stroke="#E25451" />
							</LineChart>
						</ResponsiveContainer>
					</div>
				</div>
			</div>
		);
	}
}

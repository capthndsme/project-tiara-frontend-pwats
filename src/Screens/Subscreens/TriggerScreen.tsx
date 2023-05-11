import { Link } from "react-router-dom";
import { ScheduledTask } from "../../Types/SchedulerTypes";
import { TopBar } from "../../Components/TopBar";
import { FaExternalLinkAlt } from "react-icons/fa";
import Delayed from "../../Components/Delayed";
import { SchedulerTimeToTime } from "../../Components/SchedulerTimeToTime";

export function TriggerScreen({ triggers }: { triggers: Array<ScheduledTask> }) {
	if (triggers.length === 0) {
		return (
			<>
				<TopBar float={true}> Automation and Triggers </TopBar>
				<div className="maxWidth">
					You have empty triggers.
					<Link to="/triggers/add" className="refreshButton">
						Add a trigger
					</Link>
				</div>
			</>
		);
	} else {
		const TriggersMap = triggers.map((trigger, index) => {
			const weHaveAnyTriggers = trigger.every || trigger.tempRange || trigger.timeRange;
			return (
				<Delayed delay={15 * index}>
					<div className="genericEntry" key={index}>
						<div className="genericTitle leftRightSplit">
							{trigger.outputName}
							<div className="alignCentre">
								<Link
									to={"/triggers/edit/" + trigger.outputName}
									style={{
										color: "white",
										marginLeft: "8px",
										padding: "0px",
										textDecoration: "none",
									}}
								>
									Edit
									<FaExternalLinkAlt
										style={{
											color: "white",
											marginLeft: "8px",
											padding: "0px",
										}}
									/>
								</Link>
							</div>
						</div>
						<div className="genericBody">
							{weHaveAnyTriggers ? (
								<div>
									{trigger.timeRange ? (
										<div>
											Turn on at: {SchedulerTimeToTime(trigger.timeRange.from.time)} and turn off at{" "}
											{SchedulerTimeToTime(trigger.timeRange.to.time)}
										</div>
									) : (
										<></>
									)}
									{trigger.tempRange ? (
										<div>
											Temperature range: Turn off when below {trigger.tempRange[0]}°C <br />
											and still remain on at above {trigger.tempRange[1]}°C
										</div>
									) : (
										<></>
									)}
									{trigger.every ? <div>
										Run once every:
										{
											trigger.every.map((every, index) => {
												return <div key={index}>
													- {SchedulerTimeToTime(every.time)}
												</div>
											})
										}
									</div> : <></>}
								</div>
							) : (
								<center>No automations found.</center>
							)}
						</div>
					</div>
				</Delayed>
			);
		});
		return (
			<div>
				<TopBar float={true}> Automation and Triggers </TopBar>
				<div className="maxWidth">					<Link to="/triggers/add" className="refreshButton">
						Add a trigger
					</Link>
					
					{TriggersMap}

					</div>
				
			</div>
		);
	}
}

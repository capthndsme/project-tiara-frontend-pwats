import { Link } from "react-router-dom";
import { ScheduledTask } from "../../Types/SchedulerTypes";
import { TopBar } from "../../Components/TopBar";
import { FaExternalLinkAlt } from "react-icons/fa";

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
									textDecoration: "none"
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
						{weHaveAnyTriggers ? <center>Triggers found</center> : <center>No automations found.</center>}
					</div>
				</div>
			);
		});
		return (
			<div>
				<TopBar float={true}> Automation and Triggers </TopBar>
				<div className="maxWidth">{TriggersMap}</div>
			</div>
		);
	}
}

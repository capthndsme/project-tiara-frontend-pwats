import { Link } from "react-router-dom";
import { ScheduledTask } from "../../Types/SchedulerTypes";
import { TopBar } from "../../Components/TopBar";

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
		return (
			<div>
				<TopBar float={true}> Automation and Triggers </TopBar>
			</div>
		);
	}
}

import { useEffect, useState } from "react";
import { TopBar } from "../Components/TopBar";
import { NotificationEntity } from "../Types/NotificationEntity";
import { socket } from "../Components/socket";
import { toast } from "react-hot-toast";
import moment from "moment";
import { GenericCallbackResultWithData } from "../Types/GenericCallbackResultWithData";
import { NotificationType } from "../Types/NotificationType";

export function Alerts() {
	const [alerts, setAlerts] = useState<Array<NotificationEntity>>([]);
	const [alertsFilter, setAlertsFilter] = useState<NotificationType | null>(null);
	const [filterInclude, setFilterInclude] = useState<boolean>(true);
	useEffect(() => {
		if (socket.disconnected) {
			socket.connect();
		}
		socket.timeout(15000).emit("GetNotifications", {}, (err: Boolean, data: GenericCallbackResultWithData<Array<NotificationEntity>>) => {
			if (err) {
				return toast.error("Failed to get notifications.");
			} else {
				console.log("Notifications", data.data);
				setAlerts(data.data);
			}
		});
	});
	let localAlerts;
	if (alertsFilter) {
		localAlerts = alerts.filter((alert) => {
			return filterInclude ? alert.type === alertsFilter : alert.type !== alertsFilter;
		});
	} else {
		// If you want to exclude all, then so be it.
		localAlerts = filterInclude ? alerts : [];
	}
	return (
		<div className="screen">
			<TopBar> Alerts </TopBar>
			<div className="maxWidth">
				Notification Type
				<div className="filterLine">
					<div
						style={{
							display: "flex",
							alignItems: "center",
							marginRight: "10px",
						}}
					>
						<label className="switch">
							<input
								type="checkbox"
								checked={filterInclude}
								onChange={(e) => {
									setFilterInclude(e.target.checked);
								}}
							/>
							<span className="slider round"></span>
						</label>
						{filterInclude ? "Include" : "Exclude"}
					</div>
					<select
						className="refreshButton"
						style={{ height: "30px" }}
						onChange={(e) => {
							if (e.target.value === "ALL") {
								setAlertsFilter(null);
							} else {
								setAlertsFilter(e.target.value as NotificationType);
							}
						}}
					>
						<option value="ALL"> All </option>
						{Object.keys(NotificationType)
							.sort()
							.map((type) => {
								return <option value={type}> {type.charAt(0) + type.slice(1).toLowerCase().split("_").join(" ")} </option>;
							})}
					</select>
				</div>
				{localAlerts.length === 0 ? (
					<div style={{ textAlign: "center" }}> No alerts to show. <br/>
                    {(alertsFilter||!filterInclude) ? "Try changing the filter." : ""}
                    </div>
				) : (
					localAlerts.map((alert, index) => {
						return (
							<div className="alertEntry" key={index}>
								<div className="alertTitle"> {alert.title} </div>
								<div className="alertTime"> {moment(alert.sentTimestamp).format("YYYY-MM-DD HH:mm")} </div>

								<div className="alertBody"> {alert.message} </div>
							</div>
						);
					})
				)}
			</div>
		</div>
	);
}

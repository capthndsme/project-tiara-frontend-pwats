import { useEffect, useState } from "react";
import { SimpleBackButton } from "../../Components/SimpleBackButton";
import { TopBar } from "../../Components/TopBar";
import { Sessions } from "../../Types/Sessions";
import { socket } from "../../Components/socket";
import { toast } from "react-hot-toast";
import moment from "moment";

export function SessionsScreen() {
	const [sessions, setSessions] = useState<Sessions[]>([]);
	const ourSession = localStorage.getItem("session");
	function getSessions() {
		socket.volatile.timeout(5000).emit("GetSessions", {}, (err: Boolean, data: Sessions[]) => {
			if (!err) {
				console.log("Sessions", data);
				setSessions(data);
			}
		});
	}
	useEffect(() => {
		if (socket.disconnected) socket.connect();
		getSessions();
	}, []);
	return (
		<div className="screen">
			<TopBar float={true} leftToRight={true}>
				<SimpleBackButton />
				Sessions
			</TopBar>
			<div className="maxWidth">
				{sessions.map((session, index) => {
					return (
						<div key={index} className="genericEntry">
							<div className="genericTitle">
								{session.Username} at {session.IPAddress}
							</div>
							<div className="genericBody">
								Logged in at {moment(parseInt(session.LoginTime)).format("YYYY-MM-DD HH:mm:ss")} <br />
								Last seen at {moment(parseInt(session.LastActive)).format("YYYY-MM-DD HH:mm:ss")} <br />
								<button
									className="refreshButton"
									style={{ marginBottom: 0, marginTop: 16 }}
									onClick={() => {
										if (session.Session === ourSession) {
											socket.volatile.timeout(5000).emit(
												"LogoutEvent",
												{
													session: localStorage.getItem("session"),
													username: localStorage.getItem("username"),
												},
												() => {
													localStorage.removeItem("username");
													localStorage.removeItem("session");
													window.location.href = "/login"; // Force a reload without routing.
												}
											);
										} else {
											socket.emit("InvalidateSession", { session: session.Session }, () => {
											toast("Session invalidated.");
											getSessions(); // Refresh the list.
											
										});
										}
										
									}}
								>
									{session.Session === ourSession ? "This is you. Logout?" : "Invalidate"}
								</button>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

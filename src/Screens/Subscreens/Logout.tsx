import {  useState } from "react";
import { SimpleBackButton } from "../../Components/SimpleBackButton";
import { TopBar } from "../../Components/TopBar";
 
import { socket } from "../../Components/socket";

export function Logout() {
 
   const [disabled, setDisabled] = useState(false)
	return (
		<div className="screen">
			<TopBar float={true} leftToRight={true}>
				<SimpleBackButton />
				Logout
			</TopBar>
			<div className="maxWidth">
				Are you sure you want to logout?
				<button
					className="refreshButton"
               disabled={disabled}
					onClick={(e) => {
                  setDisabled(true)
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
					}}
				>
					Logout
				</button>
			</div>
		</div>
	);
}

import { useContext } from "react";
import { AppContext } from "../Components/AppContext";
import { Spin } from "../Components/Spin";
import { Route, Routes } from "react-router-dom";


export function MainScreen() {
	const appContext = useContext(AppContext);

	if (appContext.connected) {
		return (
			<>
			 

				<Routes>
					
				</Routes>
			</>
		);
	} else {
		return (
			<div className="fullscreen loading">
				<div>
					<Spin />
					<br />
					Connecting to Project Tiara services...
				</div>
			</div>
		);
	}
}

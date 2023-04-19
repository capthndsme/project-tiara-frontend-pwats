import { Route, Routes } from "react-router-dom";

import { HomescreenView } from "./HomescreenView";
import { Triggers } from "./Triggers";
import { Alerts } from "./Alerts";
import { More } from "./More";
import NavigationBar from "../Components/NavigationBar";

export function MainScreen() {
	return (
		<>
			<NavigationBar />
			<Routes>
				<Route path="/" element={<HomescreenView />} />
				<Route path="/triggers" element={<Triggers />} />
				<Route path="/alerts" element={<Alerts />} />
				<Route path="/stats" element={<div>stats</div>} />
				<Route path="/more" element={<More />} />
			</Routes>
		</>
	);
}

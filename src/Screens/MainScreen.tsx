import { Route, Routes } from "react-router-dom";

import { HomescreenView } from "./HomescreenView";
import { Triggers } from "./Triggers";
import { Alerts } from "./Alerts";
import { More } from "./More";
import NavigationBar from "../Components/NavigationBar";
import { VideoCameraView } from "./VideoCameraView";
import { AppTheme } from "./Subscreens/AppTheme";
import { About } from "./About";

export function MainScreen({connectedOnce}:{connectedOnce:boolean}) {
	if (connectedOnce) {
		return (
			<>
				<NavigationBar />
				<Routes>
					<Route path="/" element={<HomescreenView />} />
					<Route path="/" element={<VideoCameraView />} />
					<Route path="/triggers/*" element={<Triggers />} />
					<Route path="/alerts" element={<Alerts />} />
					<Route path="/camera" element={<VideoCameraView />} />
					<Route path="/stats" element={<div>stats</div>} />
					<Route path="/more/themes" element={<AppTheme />} />
					<Route path="/more/about" element={<About />} />
					<Route path="/more" element={<More />} />
				</Routes>
			</>
		);
	} else {
		return(<></>)
	}
	
}

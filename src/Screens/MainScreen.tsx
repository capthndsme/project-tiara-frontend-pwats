import { Route, Routes } from "react-router-dom";

import { HomescreenView } from "./HomescreenView";
import { Triggers } from "./Triggers";
import { Alerts } from "./Alerts";
import { More } from "./More";
import NavigationBar from "../Components/NavigationBar";
import { VideoCameraView } from "./VideoCameraView";
import { AppTheme } from "./Subscreens/AppTheme";
 
import { StatsScreen } from "./StatsScreen";
import { About } from "./About";
import { Logout } from "./Subscreens/Logout";
import { SessionsScreen } from "./Subscreens/SessionsScreen";
import { Images } from "./Images";
import { Share } from "./Share";
import { ShareAccept } from "./ShareAccept";

export function MainScreen({connectedOnce}:{connectedOnce:boolean}) {
	if (connectedOnce) {
		return (
			<>
				<NavigationBar />
				<Routes>
					<Route path="/" element={<HomescreenView />} />
					<Route path="/share/:hash" element={<ShareAccept />} />
					<Route path="/triggers/*" element={<Triggers />} />
					<Route path="/alerts" element={<Alerts />} />
					<Route path="/camera" element={<VideoCameraView />} />
					<Route path="/stats" element={<StatsScreen/>} />
					<Route path="/more/pics" element={<Images />} />
					<Route path="/more/logout" element={<Logout />} />
					<Route path="/more/sessions" element={<SessionsScreen />} />
					<Route path="/more/share" element={<Share />} />
					<Route path="/more/about" element={<About />} />
					<Route path="/more/themes" element={<AppTheme />} />
					<Route path="/more" element={<More />} />
				</Routes>
			</>
		);
	} else {
		return(<></>)
	}
	
}

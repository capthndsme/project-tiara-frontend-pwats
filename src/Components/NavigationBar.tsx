import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiOutlineChartBarSquare, HiOutlineClock, HiOutlineBars3, HiOutlineHome, HiOutlineBell } from "react-icons/hi2";

export default function NavigationBar() {
	const { pathname } = useLocation();
	const [activeLocation, setActiveLocation] = useState("");
	useEffect(() => {
		setActiveLocation(pathname);
	}, [pathname]);
	function checkActive(path: string) {
		if (activeLocation === path) {
			return "activeLink navLinks";
		} else {
			return "navLinks";
		}
	}
	function checkActiveStart(path: string) {
		if (activeLocation.startsWith(path)) {
			return "activeLink navLinks";
		} else {
			return "navLinks";
		}
	}
	return (
		<div id="NavigationBar">
			<div id="InnerNavBar">
				<Link className={checkActive("/")} to="/">
					<HiOutlineHome size="32" />
					<div className="label">Home</div>
				</Link>

				<Link className={checkActiveStart("/triggers")} to="/triggers">
					<HiOutlineClock size="32" />
					<div className="label">Triggers</div>
				</Link>

				<Link className={checkActiveStart("/alerts")} to="/alerts">
					<HiOutlineBell size="32" />
					<div className="label">Alerts</div>
				</Link>

				<Link className={checkActiveStart("/stats")} to="/stats">
					<HiOutlineChartBarSquare size="32" />
					<div className="label">Stats</div>
				</Link>
				<Link className={checkActiveStart("/more")} to="/more">
					<HiOutlineBars3 size="32" />
					<div className="label">More</div>
				</Link>
				<div id="UsernameDisplay">@{localStorage.getItem("username")}</div>
			</div>
		</div>
	);
}

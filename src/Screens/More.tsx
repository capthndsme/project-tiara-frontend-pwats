import { Link } from "react-router-dom";
import { TopBar } from "../Components/TopBar";

export function More() {
	return (
		<div className="screen">
			<TopBar> More </TopBar>
			<div className="maxWidth">
				<div style={{ padding: "8px 12px" }}>PROFILE</div>
				<div className="genericEntry noMargin">
					<Link to="/more/me" className="appLink">
						@{localStorage.getItem("username")}
					</Link>
					<Link to="/more/account" className="appLink">
						Account Management
					</Link>
					<Link to="/more/themes" className="appLink">
						App Theme
					</Link>
				</div>
			</div>
		</div>
	);
}

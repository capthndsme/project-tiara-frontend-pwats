import { Link } from "react-router-dom";
import { TopBar } from "../Components/TopBar";
import GitInfo from "react-git-info/macro";
import moment from "moment";
export function More() {
	const gitInfo = GitInfo();
	return (
		<div className="screen">
			<TopBar> More </TopBar>
			<div className="maxWidth">
				<div style={{ padding: "8px 12px" }}>PROFILE</div>
				<div className="genericEntry noMargin">
					<div className="optionOnly">
					@{localStorage.getItem("username")}
					</div>
 
					<Link to="/more/account" className="appLink">
						Account Management
					</Link>
					<Link to="/logout" className="appLink">
						Logout
					</Link>
				</div>

				<div style={{ padding: "8px 12px", marginTop: "16px" }}>CUSTOMISATION</div>
				<div className="genericEntry noMargin">
					<Link to="/more/themes" className="appLink">
						App Theme
					</Link>
					<Link to="/more/themes" className="appLink">
						Customise background
					</Link>
				</div>

				<div style={{ padding: "8px 12px", marginTop: "16px" }}>ABOUT</div>
				<div className="genericEntry noMargin gx">
					<div className="optionOnly">
						project-tiara-frontend@{gitInfo.commit.shortHash} <br />
						built at {moment(gitInfo.commit.date).format("YYYY-MM-DD HH:mm")}
					</div>
					<Link to="/more/about" className="appLink">
						About Project Tiara
					</Link>
				</div>
			</div>
		</div>
	);
}

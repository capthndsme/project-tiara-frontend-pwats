import { Link } from "react-router-dom";
import { TopBar } from "../Components/TopBar";
import GitInfo from "react-git-info/macro";
import moment from "moment";
import { useContext } from "react";

import { ActiveDeviceContext } from "../Components/ActiveDeviceContext";
export function More() {
	const gitInfo = GitInfo();
	const activeDeviceContext = useContext(ActiveDeviceContext);
	return (
		<div className="screen">
			<TopBar> More </TopBar>
			<div className="maxWidth">
				<div style={{ padding: "0px 12px 8px" }}>{activeDeviceContext.deviceDetails?.DeviceName}</div>
				<div className="genericEntry noMargin">
					<Link to="/more/pics" className="appLink">
						Photo Gallery
					</Link>
					<Link to="/more/share" className="appLink">
						Share this device
					</Link>
					<Link to="/more/share" className="appLink">
						Edit device details
					</Link>
				</div>

				<div style={{ padding: "8px 12px", marginTop: "16px" }}>Profile</div>
				<div className="genericEntry noMargin">
					<div className="optionOnly">@{localStorage.getItem("username")}</div>

					<Link to="/more/account" className="appLink">
						Edit account details
					</Link>
					<Link to="/more/sessions" className="appLink">
						Authorised sessions
					</Link>
					<Link to="/more/logout" className="appLink">
						Logout
					</Link>
				</div>

				<div style={{ padding: "8px 12px", marginTop: "16px" }}>Customisation</div>
				<div className="genericEntry noMargin">
					<Link to="/more/themes" className="appLink">
						App Theme
					</Link>
					<Link to="/more/themes" className="appLink">
						Customise background
					</Link>
				</div>

				<div style={{ padding: "8px 12px", marginTop: "16px" }}>About</div>
				<div className="genericEntry noMargin gx">
					<Link to="/more/about" className="appLink">
						About Project Tiara
					</Link>
					<div
						style={{
							opacity: 0.7,
						}}
						className="optionOnly"
					>
						project-tiara-frontend@{gitInfo.commit.shortHash} <br />
						built at {moment(gitInfo.commit.date).format("YYYY-MM-DD HH:mm")}
					</div>
				</div>
			</div>
		</div>
	);
}

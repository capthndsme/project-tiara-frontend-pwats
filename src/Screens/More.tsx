import { Link } from "react-router-dom";
import { TopBar } from "../Components/TopBar";
import GitInfo from "react-git-info/macro";
import moment from "moment";
import { useContext } from "react";

import { ActiveDeviceContext } from "../Components/ActiveDeviceContext";
import { AppContext } from "../Components/AppContext";
import { CheckDefaultPFP } from "../Components/CheckDefaultPFP";
export function More() {
	const gitInfo = GitInfo();
	const activeDeviceContext = useContext(ActiveDeviceContext);
	const appContext = useContext(AppContext);
	return (
		<div className="screen">
			<TopBar> More </TopBar>
			<div className="maxWidth">
				<div style={{ padding: "0px 12px 8px" }}>{activeDeviceContext.deviceDetails?.DeviceName}</div>
				<div className="genericEntry noMargin">
					<Link to="/more/pics" className="appLink">
						Photo Gallery
					</Link>
					<Link to="/more/chat" className="appLink">
						Device chat
					</Link>
					<Link to="/more/share" className="appLink">
						Share this device
					</Link>
					<Link to="/more/share" className="appLink">
						Edit device details
					</Link>
					<button className="appLink" style={{
						 
						border: "none",
						textAlign: "left",
						fontSize: "1rem",
						fontWeight: "inherit",

						}}>
						Reboot device
					</button>
				</div>

				<div style={{ padding: "8px 12px", marginTop: "16px" }}>Profile</div>
				<div className="genericEntry noMargin">
					<div className="optionOnly" style={{
						display: "flex",
					}}>
						<img alt="Profile" style={{width:64, height: 64, borderRadius:50,marginRight: 16}} src={CheckDefaultPFP(appContext.accountDetails?.DisplayImage, appContext.accountDetails?.Username || "")}></img>
						<div><h2 className="noMargin" style={{marginBottom:4}}>{appContext.accountDetails?.DisplayName}</h2>@{appContext.accountDetails?.Username}</div>
					</div>

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
						<a
							target="_blank"
							rel="noreferrer noopener"
							style={{ color: "var(--highlight-colour)" }}
							href={"https://github.com/capthndsme/project-tiara-frontend-pwats/commit/" + gitInfo.commit.hash}
						>
							project-tiara-frontend@{gitInfo.commit.shortHash}
						</a>
						<br />
						built at {moment(gitInfo.commit.date).format("YYYY-MM-DD HH:mm")}
					</div>
				</div>
			</div>
		</div>
	);
}

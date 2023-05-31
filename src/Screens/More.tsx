import { Link } from "react-router-dom";
import { TopBar } from "../Components/TopBar";
import GitInfo from "react-git-info/macro";
import moment from "moment";
import { useContext, useEffect } from "react";

import { ActiveDeviceContext } from "../Components/ActiveDeviceContext";
import { AppContext } from "../Components/AppContext";
import { CheckDefaultPFP } from "../Components/CheckDefaultPFP";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { socket } from "../Components/socket";
import { Helmet } from "react-helmet-async";
 

const MySwal = withReactContent(Swal);
export function More() {
	const gitInfo = GitInfo();
	const activeDeviceContext = useContext(ActiveDeviceContext);
	const appContext = useContext(AppContext);
	useEffect(() => {
		return MySwal.close
	}, [])
	return (
		<div className="screen">
			<Helmet>
				<title>More - Project Tiara</title>
			</Helmet>
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
					<button className="appLink"
					onClick={() => {
						MySwal.fire({
							title: "Reload device?",
							text: "This will reload the device connector. It will take a few seconds.",
							icon: "warning",

							showCancelButton: true,
							confirmButtonText: "Reload"
						})
						.then((result) => {
							if (result.isConfirmed) {
								socket.emit("RebootSubscribedDevice");
							}
						});
					}}
					style={{
						 
						border: "none",
						textAlign: "left",
						fontSize: "1rem",
						fontWeight: "inherit",

						}}>
						Reload device<br/>
						Reloading your device will restart its connector. It will not affect your data.
					</button>

					<button className="appLink"
					onClick={() => {
						MySwal.fire({
							title: "Reboot device?",
							text: "This will reboot the device. It will take a few minutes.",
							icon: "warning",

							showCancelButton: true,
							confirmButtonText: "Reboot"
						})
						.then((result) => {
							if (result.isConfirmed) {
								socket.emit("RebootSubscribedDevice", {hard: true});
							}
						});
					}}
					style={{
						 
						border: "none",
						textAlign: "left",
						fontSize: "1rem",
						fontWeight: "inherit",

						}}>
						Reboot device<br/>
						Rebooting your device can help resolve issues. It will not affect your data.
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

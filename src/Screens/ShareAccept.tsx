import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
 
import { Spin } from "../Components/Spin";
import { socket } from "../Components/socket";
import { GenericCallbackResultWithData } from "../Types/GenericCallbackResultWithData";
import { InviteDetails } from "../Types/InviteDetails";
import { CheckDefaultPFP } from "../Components/CheckDefaultPFP";
import toast from "react-hot-toast";

export function ShareAccept() {
	const [loading, setLoading] = useState(true);
	const [loaderText, setLoaderText] = useState("Resolving invite...");
   const [inviteDetails, setInviteDetails] = useState<InviteDetails>();
	const { hash } = useParams();
   const [cantAccept, setCantAccept] = useState(false);
	useEffect(() => {
		socket
			.timeout(12500)
			.emit("ResolveInviteHash", { hash: hash }, (err: Boolean, data: GenericCallbackResultWithData<InviteDetails>) => {
				if (err || !data.success) {
					setLoaderText(
						"Failed to resolve invite! Please ask the person who sent you the invite to send it again or create a new one. You can also try again later."
					);
				} else {
					setLoaderText("Invite resolved.");
               setInviteDetails(data.data);
					setLoading(false);
               if (data.data.Username === localStorage.getItem("username")) {
                  setCantAccept(true);
               }
				}
			});
	}, [hash]);
	return (
		<div
			id="LoggedOutScreen"
			className="loading fullscreen overlaid centreText"
			style={{
				zIndex: 20,
            padding: 16
			}}
		>
			{loading ? (
				<div>
					{loaderText === "Resolving invite..." ? <Spin /> : <></>}
					<div className="centreText">{loaderText}</div>
				</div>
			) : (
				<div className=" centreText spanBox" style={{width: "100%", maxWidth:400, padding: 16}}>
                  <img style={{
                     width: 96,
                     height: 96,
                     borderRadius: 48,
                     objectFit: "cover",
                     display: "block",
                     margin: "auto",
                     marginBottom: 32,
                     marginTop: 16
                  }}
                  alt="Profile of the person who sent you the invite."
                  src={CheckDefaultPFP(inviteDetails?.DisplayImage, inviteDetails?.Username||"")}></img>
                  @{inviteDetails?.Username} invited you to join<br/>
                  <h2 style={{marginBottom:0}}>
                     {inviteDetails?.DeviceName}
                  </h2>
                  <div style={{marginBottom:32}}>{inviteDetails?.DeviceDescription}</div>
                  <button className="refreshButton" style={{marginBottom:0}} disabled={cantAccept} onClick={() => {
                     socket.timeout(12000).emit("AcceptInvite", {hash: hash}, (err: Boolean, data: GenericCallbackResultWithData<string>) => {
                        if (err || !data.success) {
                           toast("Failed to accept invite." + (data?.message ? " " + data?.message : ""));
                        } else {
                           toast("Invite accepted!");
                           setTimeout(() => {
                              window.location.href = "/";
                           }, 1000);
                        }
                     });
                  }}>
                     {cantAccept ? "You can't accept your own invite!" : "Accept invite"}
                  </button>
            </div>
			)}
		</div>
	);
}

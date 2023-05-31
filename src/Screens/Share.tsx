import { useEffect, useState } from "react";
import { SimpleBackButton } from "../Components/SimpleBackButton";
import { TopBar } from "../Components/TopBar";
import { socket } from "../Components/socket";
import { GenericCallbackResultWithData } from "../Types/GenericCallbackResultWithData";
import { toast } from "react-hot-toast";
 
import QRCode from "react-qr-code"
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export function Share() {
	const [loaded, setLoaded] = useState(false);
	const [hash, setHash] = useState<string>("");
	useEffect(() => {
		socket.timeout(15000).emit("InviteHashes", {}, (err: Boolean, data: GenericCallbackResultWithData<string>) => {
			if (err || !data.success) {
				toast("Failed to get device share hashes.");
				console.log("Failed to get hashes");
			} else {
				console.log("Got hashes", data.data);
				setHash(data.data);
				setLoaded(true);
			}
		});
		return MySwal.close // close all SweetAlerts on unmount
	}, []);
	return (
		<div className="screen">
			<TopBar float={true} leftToRight={true}>
				<SimpleBackButton />
				Share your device.
			</TopBar>
			<div className="maxWidth">
				<div style={{ padding: "0px 12px 8px" }}>Share this device</div>
				<div className="genericEntry">
					<div onClick={() => {
                  if (navigator.clipboard && navigator.clipboard.writeText) {
							navigator.clipboard.writeText("https://projecttiara.capthndsme.xyz/share/" + hash);
							toast("Invite copied to clipboard.")
						} else {
							toast("Failed to copy invite to clipboard.")
						}
                  
               }} className="appLink">Click to copy link. Device Share Code: {loaded ? hash : "Loading..."}</div>
					<a className="appLink" target="_blank" rel="noreferrer noopener" href={"/share/" + hash}>   
						Open invite link in new tab
					</a>
					<div className="appLink"  
					onClick={() => {
						MySwal.fire({
							title: "Are you sure?",
							text: "This will revoke the invite link for this device and generate a new one. This will not affect members who have already joined.",
							icon: "warning",
							showCancelButton: true,
							confirmButtonText: "Revoke",
							cancelButtonText: "Cancel",
						}).then((result) => {
							if (result.isConfirmed) {
								socket.timeout(15000).emit("RevokeInviteHash", {}, (err: Boolean, data: GenericCallbackResultWithData<string>) => {
									if (err || !data.success) {
										toast("Failed to revoke invite.");
										console.log("Failed to revoke invite");
									} else {
										console.log("Revoked invite", data.data);
										setHash(data.data);
										toast("Invite revoked.");
									}
								});
							}
						});
					}}
					>
						Revoke invite link
					</div>
					<div className="optionOnly"
				 
					>QR Code</div>
					<center>
						<QRCode value={"https://projecttiara.capthndsme.xyz/share/" + hash} />
					</center>
					
				</div>
 
			</div>
		</div>
	);
}

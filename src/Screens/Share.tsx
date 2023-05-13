import { useEffect, useState } from "react";
import { SimpleBackButton } from "../Components/SimpleBackButton";
import { TopBar } from "../Components/TopBar";
import { socket } from "../Components/socket";
import { GenericCallbackResultWithData } from "../Types/GenericCallbackResultWithData";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

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
                  navigator.clipboard.writeText("https://projecttiara.capthndsme.xyz/share/" + hash);
                  toast("Invite copied to clipboard.")
               }} className="appLink">Device Share Code: {loaded ? hash : "Loading..."}</div>
					<a className="appLink" target="_blank" rel="noreferrer noopener" href={"/share/" + hash}>   
						Share code
					</a>
					<a className="appLink" >
						Revoke invite link
					</a>
				</div>
				<div style={{padding:8, textAlign:"justify"}}>
					Going to this screen automatically generates a new share code. Avoid going to this screen unless you want to invite someone.
					Only share this code with people you trust.
				</div>
			</div>
		</div>
	);
}

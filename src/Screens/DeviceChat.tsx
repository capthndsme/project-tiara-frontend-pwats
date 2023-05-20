import { useContext, useEffect, useState } from "react";
import { SimpleBackButton } from "../Components/SimpleBackButton";
import { TopBar } from "../Components/TopBar";
import { ActiveDeviceContext } from "../Components/ActiveDeviceContext";
import { FaBars } from "react-icons/fa";
import { SendMessage } from "../Components/SendMessage";
import { Message } from "../Types/Messages";
import { socket } from "../Components/socket";
import { GenericCallbackResultWithData } from "../Types/GenericCallbackResultWithData";
import { CheckDefaultPFP } from "../Components/CheckDefaultPFP";
import moment from "moment";

export function DeviceChat() {
	const adc = useContext(ActiveDeviceContext);
	const [messages, setMessages] = useState<Message[]>([]);
	// Pagination is coming soon.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [oldestMessage, setOldestMessage] = useState(0); // For pagination
	function insertMessage(message: Message) {
		setMessages((messages) => [...messages, message]);
		requestAnimationFrame(() => {
			document.documentElement.scrollTo({
				top: document.documentElement.scrollHeight + 1000, // just to make sure
				behavior: "smooth",
			});
		});
	}
	useEffect(() => {
		function newMessageReceiver(data: Message) {
			insertMessage(data);
		}
		socket.on("MessagingReceive", newMessageReceiver);
		socket.emit("MessagingGet", { limit: 250 }, (data: GenericCallbackResultWithData<Array<Message>>) => {
			setMessages(data.data);
			setOldestMessage(data.data[0].messageID);
			console.log(data);
			// Our root scroll element is the documentElement
			document.documentElement.scrollTo({
				top: document.documentElement.scrollHeight + 1000, // just to make sure
				behavior: "smooth",
			});
		});
      console.log("Re-render triggered at DeviceChat.tsx")
		return () => {
			socket.off("MessagingReceive", newMessageReceiver);
		};
     
	}, []);
	return (
		<div
			className="screen"
			style={{
				display: "grid",
				gridTemplateRows: "60px 1fr 50px",
				gridTemplateColumns: "1fr",
				minHeight: "100vh",
			}}
		>
			<TopBar float={true}>
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "50px 1fr 50px",
						width: "100%",
						height: "60px",
					}}
				>
					<div style={{ paddingLeft: 16, display: "flex", justifyContent: "center", alignItems: "center" }}>
						<SimpleBackButton />
					</div>

					<div style={{ lineHeight: "20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
						Messages <br />
						{adc.deviceDetails?.DeviceName}
					</div>
					<div style={{ paddingRight: 8, display: "flex", justifyContent: "center", alignItems: "center" }}>
						<FaBars />
					</div>
				</div>
			</TopBar>

			<div
				style={{
					flexGrow: 1,
					paddingTop: 16,
					paddingBottom: 16,
				}}
			>
				{messages.map((message, index) => {
					return (
						<div key={message.messageID} className="msgBox">
							<div className="left">
								<img className="pfp" src={CheckDefaultPFP(message.DisplayImage, message.Username)} alt="User's PFP" />
							</div>
							<div className="right">
								<div className="inline">
									<div className="username">{message.Username}</div>
									<div className="time">{moment(message.timestamp).fromNow()}</div>
								</div>
								<div className="message">
									{message.msgContent.split("\n").map(function (item, key) {
										return (
											<span key={key}>
												{item}
												<br />
											</span>
										);
									})}
								</div>
							</div>
						</div>
					);
				})}
			</div>
			<SendMessage insertMessage={insertMessage} />
		</div>
	);
}

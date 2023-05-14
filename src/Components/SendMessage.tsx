import { useContext, useState } from "react";
import { Message } from "../Types/Messages";
import { AppContext } from "./AppContext";
import { socket } from "./socket";
import { GenericCallbackResultWithData } from "../Types/GenericCallbackResultWithData";
import { toast } from "react-hot-toast";
import { CheckDefaultPFP } from "./CheckDefaultPFP";

export function SendMessage({ insertMessage }: { insertMessage: (message: Message) => void }) {
	const [message, setMessage] = useState("");
	 
   const appContext = useContext(AppContext);
   function sendMessage() {
      const localMessage: Message = {
         // Set a max-int value for the messageID, so that it can be sorted locally
         messageID: Date.now(),
         msgContent: message,
         sender: appContext.accountId || 0,
         timestamp: new Date().getTime(),
         DeviceHWID: "",
         Username: localStorage.getItem("username") || "",
         DisplayImage: CheckDefaultPFP(appContext.accountDetails?.DisplayImage) || ""

      };
      socket.emit("MessagingSend", { message: message}, (data: GenericCallbackResultWithData<boolean>) => {
         if (!data.data) {
            toast("Message failed to send")
         } else {
            document.documentElement.scrollTo({
               top: document.documentElement.scrollHeight + 1000, // just to make sure
               behavior: "smooth",
            })
         }
      });
      insertMessage(localMessage);
      setMessage("");
   }
   let height = 50;
   const splits = message.split("\n").length;
   if (splits > 1) {
      height = ((splits< 5 ? splits : 5) * 10) + 50
   }
	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "1fr 70px",
				position: "sticky",
				bottom: 0,
				width: "100%",
				height: height,
				backdropFilter: "blur(var(--blur-filter))",
				background: "var(--darker-bg-colour-translucent)",
			}}
		>
			<textarea
	 
				placeholder="Message"
				value={message}
				onChange={(e) => {
					setMessage(e.target.value);
				}}
            onKeyUp={(e) => {
               if (e.key === "Enter" && !e.shiftKey && message.length > 0 && message.trim().length > 0) {
                  sendMessage()
               }
          
            }}
				style={{
					border: "none",
					outline: "none",
					background: "none",
					color: "var(--text-colour)",
					paddingLeft: 16,
					paddingRight: 16,
					fontSize: 16,
					width: "100%",
					height: height,
               resize: "none",
               fontFamily: "Inter, sans-serif",
               paddingTop: 14,
               paddingBottom: 14,
				}}
			></textarea>
			<button
				style={{
					border: "none",
					outline: "none",
					background: "none",
					color: "var(--highlight-colour)",
				}}
				onClick={sendMessage}
			>
				Send
			</button>
		</div>
	);
}

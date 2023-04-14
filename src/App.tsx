import "./App.css";
import toast, { Toaster } from "react-hot-toast";
import {  Route, Routes, useNavigate } from "react-router-dom";
import { Login } from "./Screens/Login";
import { useEffect, useState } from "react";
import { socket } from "./Components/socket";
import { AppContext, AppStateType, DefaultAppState } from "./Components/AppContext";
import { DisconnectedOverlay } from "./Components/DisconnectedOverlay";
import { FunctionContext } from "./Components/FunctionContext";
import "@fontsource/inter";
import NavigationBar from "./Components/NavigationBar";
import { HomescreenView } from "./Screens/HomescreenView";
import { Triggers } from "./Screens/Triggers";
import { Alerts } from "./Screens/Alerts";
import { More } from "./Screens/More";
function App() {
	const navigate = useNavigate();
	const [connectedOnce, setConnectedOnce] = useState(false);
  const [appState, setAppState] = useState<AppStateType>(DefaultAppState);
  const appFunctions = {
    setAppState: setAppState,
    setConnectedOnce: setConnectedOnce
  }
	useEffect(() => {
    
		// Check if the user is logged in
		// If not, redirect to login page.
		const user = localStorage.getItem("username");
		const session = localStorage.getItem("session");
		if (!user || !session) {
			navigate("/login");
		}

		// Connect to the websocket
		socket.connect();
		// Authenticate the user

		socket.on("connect", () => {
			let emitStart = Date.now();
			socket.emit(
				"authenticate",
				{
					username: user,
					session: session,
				},
				(data: any) => {
           
					console.log("[WebSockets] Authentication took " + (Date.now() - emitStart) + "ms");
					if (data.success) {
            toast("Connected to the server.", {icon: "🌐"})
						setConnectedOnce(true);
            setAppState(appState=>({...appState, authenticated: true, accountId: data.accountId, connected: true}));
						socket.timeout(6000).emit("requestDeviceList", {accountId: data.accountId}, (err: Boolean, requestData: any) => {
              if (err) {
                toast.error("Failed to get device list.");
                return;
              }
              setAppState(appState=>({...appState, devices: requestData.devices}));
              console.log(requestData);
            });
					} else {
						toast.error("Authentication failed.");
						localStorage.removeItem("session");
            setAppState(appState=>({...appState, authenticated: false, connected: true}));
						navigate("/login");
					}
				}
			);
		});
    socket.on("disconnect", () => {
      toast.error("Disconnected from the server.");
      setAppState(appState=>({...appState, authenticated: false, connected: false}));
      console.log("Disconnected from the server.");
    });
		return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
	}, [navigate]);
	return (
		<AppContext.Provider value={appState}>
      <FunctionContext.Provider value={appFunctions}>
      <DisconnectedOverlay disconnected={!appState.connected} />
        <NavigationBar />
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/" element={<HomescreenView />} />
					<Route path="/triggers" element={<Triggers />} />
					<Route path="/alerts" element={<Alerts />} />
					<Route path="/stats" element={<div>stats</div>} />
					<Route path="/more" element={<More />} />
				</Routes>
				<Toaster />
			 </FunctionContext.Provider>
		</AppContext.Provider>
	);
}

export default App;

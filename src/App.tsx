import "./App.css";
import toast from "react-hot-toast";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Login } from "./Screens/Login";
import { useEffect, useState } from "react";
import { socket } from "./Components/socket";
import { AppContext, AppStateType, DefaultAppState } from "./Components/AppContext";
import { DisconnectedOverlay } from "./Components/DisconnectedOverlay";
import { FunctionContext, FunctionContextType } from "./Components/FunctionContext";
import "@fontsource/inter/400.css";
import "@fontsource/inter/300.css";
import "@fontsource/inter/200.css";
import { MainScreen } from "./Screens/MainScreen";
import { ReqDevices } from "./Types/WS/ReqDevices";
import { ActiveDeviceContext } from "./Components/ActiveDeviceContext";
import { DeviceStateUpdate } from "./Types/DeviceStateUpdate";
import { DefaultDeviceState, DeviceState } from "./Types/DeviceState";
import { ToggleStateMutateAcknowledge } from "./Types/ToggleStateMutateAcknowledge";
import { DeviceBaseToggle } from "./Types/DeviceBaseToggle";
function App(): JSX.Element {
	const navigate = useNavigate();
	const [appState, setAppState] = useState<AppStateType>(DefaultAppState);

	// const [activeHwid, setActiveHwid] = useState("");
	const [activeDeviceState, setActiveDeviceState] = useState<DeviceState>(DefaultDeviceState);

	function mutateToggle(val: boolean, name: string) {
		console.log("Received toggle mutate request.");
		console.log("Toggle name: ", name);
		console.log("Toggle value: ", val);
		// Lock our local toggle so it doesn't get changed
		// while we're waiting for the server to respond.
		// This is done by setting the hasLock property to true.

		// If this fixes the error, lets see what we can type this as.
		setActiveDeviceState((state) => {
			// Create a new copy of the state
			const newState = { ...state };
			// Create a new copy of the deviceToggles array
			const newDeviceToggles = [...state.deviceToggles];
			// Find and update the toggle in the new array
			for (let i = 0; i < newDeviceToggles.length; i++) {
				if (newDeviceToggles[i]?.toggleName === name) {
					const found = newDeviceToggles[i];
					if (found) {
						// Create a new copy of the found object with the updated property
						const newFound = { ...found, hasLock: true };
						// Replace the old object with the new one in the new array
						newDeviceToggles[i] = newFound;
					}
				}
			}
			// Assign the new array to the newState object
			newState.deviceToggles = newDeviceToggles as DeviceBaseToggle[];
			// Return the newState from the callback function
			return newState;
		});

		socket.timeout(40000).emit(
			"ToggleStateMutate",
			{
				toggleName: name,
				toggleValue: val,
				hasLock: true, // We will lock it so other clients don't try to change it.
			},
			(hasError: boolean, data: ToggleStateMutateAcknowledge) => {
				if (hasError) {
					console.log("Toggle has error");
					toast.error("Failed to set toggle. Please try again later.");
				} else {
					if (!data.toggleSuccess && data.toggleError) {
						toast.error("Error toggling: " + data.toggleError);
					}
					toast("Toggled " + name, {icon: val?"🟢":"🔴"});
				}
				setActiveDeviceState((state) => {
					// Create a new copy of the state
					const newState = { ...state };
					// Create a new copy of the deviceToggles array
					const newDeviceToggles = [...state.deviceToggles];
					// Find and update the toggle in the new array
					for (let i = 0; i < newDeviceToggles.length; i++) {
						if (newDeviceToggles[i]?.toggleName === name) {
							const found = newDeviceToggles[i];
							if (found) {
								// Create a new copy of the found object with the updated property
								const newFound = {
									...found,
									hasLock: false, 

									// If there was an error, keep the old value.
									toggleValue: hasError ? found.toggleValue : data.toggleValue ? true : false,
								};
								// Replace the old object with the new one in the new array
								newDeviceToggles[i] = newFound;
							}
						}
					}
					// Assign the new array to the newState object
					newState.deviceToggles = newDeviceToggles as DeviceBaseToggle[];
					// Return the newState from the callback function
					return newState;
				});
			}
		);
	}
	const appFunctions: FunctionContextType = {
		setAppState,
		setActiveDeviceState,

		mutateToggle,
	};
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
			setAppState((appState) => ({ ...appState, connected: true }));
			socket.emit(
				"authenticate",
				{
					username: user,
					session: session,
				},
				(data: any) => {
					console.log("[WebSockets] Authentication took " + (Date.now() - emitStart) + "ms");
					if (data.success) {
						toast("Connected to the server.", { icon: "🌐" });
						setAppState((appState) => ({ ...appState, authenticated: true, accountId: data.accountId, connected: true }));
						socket.timeout(6000).emit("requestDeviceList", { accountId: data.accountId }, (err: Boolean, requestData: ReqDevices) => {
							if (err) {
								toast.error("Failed to get device list.");
								return;
							}

							if (requestData.devices) {
								if (requestData.devices.length === 0) {
									// Show a message saying that there are no devices
									toast.error("No devices found.");

									setActiveDeviceState((localState) => {
										localState.deviceDetails = undefined;
										return localState;
									});
								} else {
									// We have more than one device, so we need to select one.
									// By default, we select the first device.
									const device = requestData.devices[0];
									console.log("Selecting default device:", device);
									setActiveDeviceState(requestData.firstDeviceStateCache);

									const toggles = requestData.firstDeviceStateCache.deviceToggles;
									// We know for sure that the device sends an array of DeviceBaseToggle,
									// so we can safely cast it to an array of DeviceBaseToggle.
									console.log("Our toggles", toggles);

									setAppState((appState) => ({ ...appState, devices: requestData.devices }));
								}
							}
						});
						socket.on("deviceStateUpdate", (data: DeviceStateUpdate) => {
							setActiveDeviceState((prevState) => {
								return {
									...prevState,
									deviceToggles: data.deviceToggles,
									deviceSensors: data.deviceSensors,
									deviceIsOnline: data.deviceIsOnline,
									deviceLastUpdate: data.deviceLastUpdate,
								};
							});
						});
					} else {
						toast.error("Authentication failed.");
						localStorage.removeItem("session");

						setAppState((appState) => ({ ...appState, authenticated: false, connected: true }));
						navigate("/login");
					}
				}
			);
		});
		socket.on("toggleStateUpdate", (d: DeviceBaseToggle) => {
			console.log("toggle state received", d);
			// Find our toggle in the array and update it.
			toast("Someone else changed " + d.toggleName + " to " + d.toggleValue);

			setActiveDeviceState((state) => {
				// Create a new copy of the state
				const newState = { ...state };
				// Create a new copy of the deviceToggles array
				const newDeviceToggles = [...state.deviceToggles];
				// Find and update the toggle in the new array
				for (let i = 0; i < newDeviceToggles.length; i++) {
					if (newDeviceToggles[i]?.toggleName === d.toggleName) {
						const found = newDeviceToggles[i];
						if (found) {
							// Create a new copy of the found object with the updated property
							const newFound = { ...found, hasLock: d.hasLock, toggleValue: d.toggleValue, lastChanged: d.lastChanged };
							// Replace the old object with the new one in the new array
							newDeviceToggles[i] = newFound;
						}
					}
				}
				// Assign the new array to the newState object
				newState.deviceToggles = newDeviceToggles as DeviceBaseToggle[];
				// Return the newState from the callback function
				return newState;
			});
		});
		socket.on("disconnect", () => {
			toast.error("Disconnected from the server.");
			setAppState((appState) => ({ ...appState, authenticated: false, connected: false }));
			console.log("Disconnected from the server.");
		});

		return () => {
			//socket.disconnect(); // For some reason, this causes the socket to disconnect when navigating other pages.
			socket.off("connect");
			socket.off("toggleStateUpdate");
			socket.off("disconnect");
		};
	}, [navigate]);
	return (
		<AppContext.Provider value={appState}>
			<FunctionContext.Provider value={appFunctions}>
				<ActiveDeviceContext.Provider value={activeDeviceState}>
					<DisconnectedOverlay disconnected={!appState.connected} />

					<Routes>
						<Route path="/login" element={<Login />} />
						<Route path="/*" element={<MainScreen />} />
					</Routes>
				</ActiveDeviceContext.Provider>
			</FunctionContext.Provider>
		</AppContext.Provider>
	);
}

export default App;

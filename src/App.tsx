import "./App.css";
import "./Styles/AppThemes.css";
import toast from "react-hot-toast";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Login } from "./Screens/Login";
import { useEffect, useRef, useState } from "react";
import { socket } from "./Components/socket";
import { AppContext, AppStateType, DefaultAppState } from "./Components/AppContext";
import { DisconnectedOverlay } from "./Components/DisconnectedOverlay";
import { FunctionContext, FunctionContextType } from "./Components/FunctionContext";
import "@fontsource/inter/500.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/300.css";
import "@fontsource/inter/200.css";
import { MainScreen } from "./Screens/MainScreen";
import { ReqDevices } from "./Types/WS/ReqDevices";
import { ActiveDeviceContext } from "./Components/ActiveDeviceContext";
import { DeviceStateUpdate } from "./Types/DeviceStateUpdate";
import { DefaultDeviceState, DeviceState } from "./Types/DeviceState";
import { DeviceBaseToggle, ToggleType } from "./Types/DeviceBaseToggle";
import { ToggleWithStatus } from "./Types/WS/ToggleWithStatus";
import { About } from "./Screens/About";
import { AppTheme } from "./Screens/Subscreens/AppTheme";

function App(): JSX.Element {
	const navigate = useRef(useNavigate());
	const [appState, setAppState] = useState<AppStateType>(DefaultAppState);
	// ConnectedOnce is used to determine if we should show the disconnected overlay.
	const [connectedOnce, setConnectedOnce] = useState<boolean>(false);
	// const [activeHwid, setActiveHwid] = useState("");
	const [activeDeviceState, setActiveDeviceState] = useState<DeviceState>(DefaultDeviceState);
	function authenticate() {
		const user = localStorage.getItem("username");
		const session = localStorage.getItem("session");
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
					toast("Connected to the server.", { icon: "🌐" });
					setAppState((appState) => ({ ...appState, authenticated: true, accountId: data.accountId, connected: true }));
					socket.timeout(6000).emit("requestDeviceList", { accountId: data.accountId }, (err: Boolean, requestData: ReqDevices) => {
						if (err) {
							toast.error("Failed to get device list.");
							return;
						}
						// Move ConnectedOnce here. ConnectedOnce significies that we have connected to the server at least once.
						// and have received a list of devices.
						setConnectedOnce(true);
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
					navigate.current("/login");
				}
			}
		);
	}
	function mutateToggle(val: boolean, toggle: DeviceBaseToggle) {
		console.log("Received toggle mutate request.");
		console.log("Toggle name: ", toggle?.toggleName);
		console.log("Toggle value: ", val);

		// Lock our local toggle so it doesn't get changed
		// while we're waiting for the server to respond.
		// This is done by setting the hasLock property to true.

		// If this fixes the error, lets see what we can type this as.
		if (toggle.toggleType === ToggleType.ONEOFF) {
			// One off is not a toggle, so we need to toast as such.
			toast("Executing " + toggle.toggleDescription, { icon: "⌛", duration: 4000 });
		} else {
			toast("Toggling " + toggle.toggleDescription, { icon: "⌛", duration: 4000 });
		}
		setActiveDeviceState((state) => {
			// Create a new copy of the state
			const newState = { ...state };
			// Create a new copy of the deviceToggles array
			const newDeviceToggles = [...state.deviceToggles];
			// Find and update the toggle in the new array
			for (let i = 0; i < newDeviceToggles.length; i++) {
				if (newDeviceToggles[i] === toggle) {
					const found = newDeviceToggles[i];

					if (found) {
						// Create a new copy of the found object with the updated property
						// Mutate last changed to the current time (Doesn't matter if we use the server time or not)
						const newFound = { ...found, hasLock: true, lastChanged: new Date().getTime() };
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
		// Extend our timeout to 65 seconds to account for the server->device->server->client round trip.
		socket.timeout(65000).emit(
			"ToggleStateMutate",
			{
				toggleName: toggle?.toggleName,
				toggleValue: val,
				hasLock: true, // We will lock it so other clients don't try to change it.
			},
			(hasError: boolean, data: ToggleWithStatus) => {
				if (hasError) {
					console.log("Toggle has error");
					toast.error("Failed to set toggle. Please try again later.");
				} else {
					console.log("Got result,", data);
					if (!data.toggleResult.success) {
						if (toggle.toggleType === ToggleType.ONEOFF) {
							// One off is not a toggle, so we need to toast as such.
							console.log("Toggle error", data.toggleResult);
							toast.error("Error executing " + toggle.toggleDescription + ": " + data.toggleResult.message ?? "Unknown error");
						} else {
							toast.error("Error toggling " + toggle.toggleDescription + ": " + data.toggleResult.message ?? "Unknown error");
						}
					} else {
						if (toggle.toggleType === ToggleType.ONEOFF) {
							// One off is not a toggle, so we need to toast as such.
							toast(toggle.toggleDescription + " finished successfully!", { icon: "🟢" });
						} else {
							toast("Toggled " + toggle.toggleDescription, { icon: val ? "🟢" : "🔴" });
						}
					}
				}
				const hasAnyError = hasError || !data.toggleResult.success;
				console.log("Has any error: ", hasAnyError);
				setActiveDeviceState((state) => {
					// Create a new copy of the state
					const newState = { ...state };
					// Create a new copy of the deviceToggles array
					const newDeviceToggles = [...state.deviceToggles];
					// Find and update the toggle in the new array
					for (let i = 0; i < newDeviceToggles.length; i++) {
						// Because we are doing a spread operator, we need to check if the toggleName is the same.
						if (newDeviceToggles[i]?.toggleName === toggle.toggleName) {
							const found = newDeviceToggles[i];
							if (found) {
								// Create a new copy of the found object with the updated property
								console.log( found.lastChanged)
								const newFound = {
									...found,
									hasLock: false,
									lastChanged: hasAnyError ? found.lastChanged : data.lastChanged,
									// If there was an error, keep the old value.
									toggleValue: hasAnyError ? found.toggleValue : data.toggleValue ? true : false,
								};
								console.log("Done mutating toggle. Lets see what we got: ", newFound);
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
		reloadTheme,
		mutateToggle,
		authenticate,
	};
	function reloadTheme() {
		const theme = localStorage.getItem("theme");
		const themebg = localStorage.getItem("theme-custombg");
		if (theme) {
			document.documentElement.setAttribute("data-theme", theme);
			document.documentElement.style.backgroundSize = "unset";
		} else {
			document.documentElement.setAttribute("data-theme", "");
			document.documentElement.style.backgroundSize = "unset";
		}
		if (themebg) {
			document.documentElement.style.setProperty("--bg-colour", `url("${themebg}") no-repeat center center fixed`);
			document.documentElement.style.backgroundSize = "cover";
		}
	}
	useEffect(() => {
		// Check if the user is logged in
		// If not, redirect to login page.

		const user = localStorage.getItem("username");
		const session = localStorage.getItem("session");
		if (!user || !session) {
			navigate.current("/login");
		}

		// Theme loader

		const theme = localStorage.getItem("theme");
		const themebg = localStorage.getItem("theme-custombg");
		if (theme) {
			document.documentElement.setAttribute("data-theme", theme);
			document.documentElement.style.backgroundSize = "unset";
		}
		if (themebg) {
			document.documentElement.style.setProperty("--bg-colour", `url("${themebg}") no-repeat center center fixed`);
			document.documentElement.style.backgroundSize = "cover";
		}
		// Connect to the websocket
		socket.connect();
		// Authenticate the user

		socket.on("connect", () => {
			setAppState((appState) => ({ ...appState, connected: true }));
			authenticate();
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
			socket.disconnect();
			socket.off("connect");
			socket.off("toggleStateUpdate");
			socket.off("disconnect");
		};
		// The navigate function is a dependency of this effect, but we don't want to run this effect when it changes.
	}, []);

	return (
		<AppContext.Provider value={appState}>
			<FunctionContext.Provider value={appFunctions}>
				<ActiveDeviceContext.Provider value={activeDeviceState}>
					<DisconnectedOverlay disconnected={!appState.connected} />

					<Routes>
					<Route path="/about" element={<About />} />
					<Route path="/theme" element={<AppTheme />} />
						<Route path="/login" element={<Login />} />
						<Route path="/*" element={<MainScreen connectedOnce={connectedOnce} />} />
					</Routes>
				</ActiveDeviceContext.Provider>
			</FunctionContext.Provider>
		</AppContext.Provider>
	);
}

export default App;

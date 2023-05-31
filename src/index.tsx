import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import { Toaster } from "react-hot-toast";
import { Signup } from "./Screens/Signup";
 

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
	<React.StrictMode>
		{
			(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? (
				// Dev server, show warning that things may break.
				<div 
				style={{
					position: "fixed",
					top: "0",
					left: "0",
					width: "100%",
					
					zIndex: 999,
					background: "var(--darker-bg-colour-translucent)",
					backdropFilter: "blur(10px)",
					WebkitBackdropFilter: "blur(10px)",
					color: "var(--light-colour)",
					textAlign: "center",
					padding: "4px",
					pointerEvents: "none"

				}}
				>
					Development mode - bugs may occur.
				</div>
			):null
		
		}
		<div className="App">
			<BrowserRouter>
				<Routes>
					<Route path="/signup" element={<Signup/>} />
					<Route path="/*" element={<App />} />
				</Routes>
			</BrowserRouter>
			<Toaster
				toastOptions={{
					style: {
						background: "var(--bg2-colour)",
						color: "var(--light-colour)",
						borderRadius: "50px"
					}
				}}
			/>
		</div>
	</React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

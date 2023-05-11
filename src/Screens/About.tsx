import "@fontsource/lexend/200.css";
import { SimpleBackButton } from "../Components/SimpleBackButton";

export function About() {
	const paragraph: React.CSSProperties = { marginTop: 16, textAlign: "justify", lineHeight:"1.75em" };
	return (
		<div
			id="LoggedOutScreen"
			className="loading fullscreen"
			style={{
				display: "block",
				zIndex: 20
			}}
		>
			<div className="maxWidth">
				<div
					style={{
						background: "none",
						backdropFilter: "none",
						padding: 0,
					}}
					className="InnerTopBar LTR"
				>
					<SimpleBackButton /> About app
				</div>

				<h1 className="noMargin" style={{ fontFamily: "lexend", fontSize: 40, marginTop: 16 }}>
					Project Tiara
				</h1>
				<h2 className="noMargin" style={{ fontFamily: "lexend", fontSize: 20 }}>
					Smart Doghouse
				</h2>
				<p style={paragraph}>
					Project Tiara is a microprocessor-based multi-purpose doghouse with remote control system, a thesis by three STI College
					Carmona students, in partial fulfillment of the requirements for the degree Bachelor of Science in Computer Engineering.
	 
					It is named "Project Tiara" as a homage to one of the researchers' aging pet that time, Tiara. Unfortunately, she did not see the device get finished on her lifetime.
				</p>
				<p style={paragraph}>
					This web app allows you to manage your doghouse remotely, check the status of the doghouse, and more.
				</p>
				<h2 className="noMargin" style={{ fontFamily: "lexend", fontSize: 24, marginTop: 32 }}>
					Pets of the researchers
				</h2>
				<p style={paragraph}>
					The background image of the Login and About sections are researcher's pets. They are (in no particular order): 
					
				</p>
				<ul>
					<li>Riri</li>
					<li>Tara</li>
					<li>Tiara - the project's namesake.</li>
					<li>Chewy</li>
					<li>Maui - a cat, but since it is my GitHub PFP, I am including him</li>
				</ul>
				<h2 className="noMargin" style={{ fontFamily: "lexend", fontSize: 24, marginTop: 32 }}>
					Source code
				</h2>
				<p>
					<a target="_blank" style={{ color: "white" }} href="https://github.com/capthndsme/project-tiara-frontend-pwats">Frontend</a> - This powers this very app. TypeScript, create-react-app, PWA<br />
					<a target="_blank" style={{ color: "white" }} href="https://github.com/capthndsme/project-tiara-frontend-pwats">Backend</a> - The backend server. TypeScript<br />
					<a target="_blank" style={{ color: "white" }} href="https://github.com/capthndsme/project-tiara-frontend-pwats">Device code</a> - The device code, to be executed in a Raspberry Pi or similar. TypeScript, and one Arduino C++<br />
					<i>Paper will be uploaded when we successfully defend the title.</i>
 
				</p>
				
			</div>
		</div>
	);
}

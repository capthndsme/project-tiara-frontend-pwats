import "@fontsource/lexend/200.css";
import { SimpleBackButton } from "../Components/SimpleBackButton";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"
import { RegisterCommand, RegisterResult, RegisterStatus } from "../Types/HTTP/RegisterResult";
export function Signup() {
   const [formMessage, setFormMessage] = useState("");
   const [loading, setLoading] = useState(false);
	const [fullName, setFullName] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPw, setConfirm] = useState("");
	const navigate = useNavigate();
	useEffect(() => {
		if (localStorage.getItem("session") && localStorage.getItem("username")) {
			navigate("/", {replace: true})
		}
	},[])
	return (
		<div
			id="LoggedOutScreen"
			className="loading fullscreen"
			style={{
				display: "block",
				zIndex: 20,
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
					<SimpleBackButton /> Signup
				</div>

				<h1>Welcome to Project Tiara!</h1>
				<p>Sign up to continue.</p>
            <form onSubmit={(e) => {
               e.preventDefault();
					setFormMessage("");
               setLoading(true)
					const postData: RegisterCommand = {
						username: username,
						email: email,
						password: password,
						confirm: confirmPw,
						fullName: fullName.length > 0 ? fullName : undefined,
					}
					axios.post("https://ptserver.capthndsme.xyz/v1/register", postData)
					.then(res=> {
						const registerState: RegisterStatus = res.data;
						if (registerState.result && registerState.result === RegisterResult.SUCCESS) {
							setFormMessage("Success! Logging you in.");
							localStorage.setItem("session", registerState.sessionHash??"");
							localStorage.setItem("username", username);
							navigate("/");
						} else {
							setFormMessage("Error: " + registerState.result);
							setLoading(false);
						}
					})
            }}
            className="signupForm"
            >     
                  <div style={{textAlign:"center", marginBottom:(formMessage==="")?0:16}}>
							{formMessage}
                  </div>
                  Full name (optional)
                  <input type="text" placeholder="Full name (optional)" name="fullname" value={fullName} onChange={e=>setFullName(e.target.value)} />
                  Username
                  <input type="text" placeholder="Username" name="username" value={username} onChange={e=>setUsername(e.target.value)} />
                  Email
                  <input type="text" placeholder="Email" name="email" value={email} onChange={e=>setEmail(e.target.value)}/>
                  Password
                  <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}/>
                  Confirm Password {password !== confirmPw && <span style={{color:"red"}}>Passwords do not match</span>}
                  <input type="password" placeholder="Confirm Password" value={confirmPw} onChange={e=>setConfirm(e.target.value)}/>
                  <input type="submit" value="Sign Up" disabled={loading} />
            </form>
			</div>
		</div>
	);
}

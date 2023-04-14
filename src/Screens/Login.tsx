import { useContext, useEffect, useRef, useState } from "react";
import { socket } from "../Components/socket";
import { useNavigate } from "react-router-dom";
import { AppContext, AppStateType } from "../Components/AppContext";
import { Link } from "react-router-dom";
import "../Styles/Login.css"
import toast from "react-hot-toast";
import { FunctionContext } from "../Components/FunctionContext";
import { WSLogin } from "../Types/WSLogin";

export function Login() {
   const [loading, setLoading] = useState(false);
   const usernameRef = useRef<HTMLInputElement>(null);
   const passwordRef = useRef<HTMLInputElement>(null);
   const navigate = useNavigate();
   const spanRef = useRef<HTMLDivElement>(null);
   const appContext = useContext(AppContext);
   const functionContext = useContext(FunctionContext);
   function handleSubmission() {
      if (loading) return;
      
      if (!usernameRef.current || !passwordRef.current) {
         return;
      } 
      
      const username = usernameRef.current.value;
      const password = passwordRef.current.value;
      if (username.length < 3 || password.length < 3) {
         toast.error("Username or password is too short.");
         return;
      }
      setLoading(true);
      if (!socket.connected) {
         socket.connect();
      }
      socket.timeout(5000).emit("login", {
         username: username,
         password: password,
      }, (hasError: boolean, data: WSLogin) => {
         setLoading(false);
         if (!hasError && data.success && data.session && data.accountId) {
            toast.success("Logged in successfully.");
            localStorage.setItem("username", username);
            localStorage.setItem("session", data.session);
            if (functionContext.setAppState) functionContext.setAppState(appState=>({...appState, authenticated: true, accountId: data.accountId, connected: true}));
            navigate("/");
         } else {
            toast.error("Failed to log in. Check your username and password.");
         }
      });
   }
  
	useEffect(() => {
      if (!socket.connected) { 
         toast("Reconnecting")
         socket.connect();
         
         if (functionContext.setConnected) functionContext.setConnected(true);
      }
      if (appContext.authenticated) {
         console.log("Already logged in.")
         navigate("/");
      }
		const user = localStorage.getItem("username");
		const session = localStorage.getItem("session");
		if (user && session) {
			// Lets check if the session is valid
			// If it is, redirect to the main screen
			// If it isn't, stay in the login screen.
         if (socket.connected) {
            toast("Authenticating...")
            socket.emit("authenticate", {
               username: user,
               session: session,
            }, (data: any) => {
               if (data.success) {
                  // Redirect to the main screen
                  if (functionContext.setConnected) functionContext.setConnected(true);
                  navigate("/");
                  
               } else {
                  // Stay in the login screen
               }
            });
         } else {
            // Socket is not connect. Just redirect to the main screen.
            navigate("/");
         }
		}
	}, [navigate, appContext.authenticated]);
	return (
      <div id="LoggedOutScreen">
      <div className="SplitMode  ">
          <div className="LeftSplit">
              <div className="LoginInfo">
                  <h1 className="noMargin"><i>TIARA APP</i></h1>
                  <h2 className="noMargin"><i>REMOTE DOGHOUSE</i></h2>
                  <p className="pad">
                      Project Tiara Cloud allows you to manage your smart doghouse from everywhere.
                      View statistics, remotely give your dog treats and view them live, and more.
                  </p>
              </div>

          </div>
          <div className="VerticalCentre">
              <div ref={spanRef} className="spanBox">
                  <center className="mediumTextHeight">Sign-in required.</center>
                  Username<br />
                  <input className="InputStyle" ref={usernameRef}></input><br />
                  Password<br />
                  <input className="InputStyle" ref={passwordRef} type="password"></input>
                  <div className="pad flexbtn">
                      <button onClick={handleSubmission} className={"InputStyle loginbtns highlight " + (loading?"disabled":"")}>Login</button>
                      <Link to='/signup' className="InputStyle loginbtns centreText">Sign up</Link>

                  </div>

              </div>
          </div>

      </div>
  </div>
   );
}

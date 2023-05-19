import { useContext, useState } from "react";
import { AppContext } from "../Components/AppContext";
import { TopBar } from "../Components/TopBar";
import { SimpleBackButton } from "../Components/SimpleBackButton";

export function Account() {
	const appContext = useContext(AppContext);
	const [displayName, setDisplayName] = useState(appContext.accountDetails?.DisplayName || "");

	return (
		<div className="screen">
			<TopBar leftToRight={true}>
				<SimpleBackButton />
				Your Account
			</TopBar>
         <div className="maxWidth">
            <div style={{ padding: "0px 12px 8px" }}>Edit your account details</div>
            <div className="genericEntry noMargin">
               <div className="optionOnly">
                  Display Name
                  <input className="refreshButton left" value={displayName} onChange={(e) => {
                     setDisplayName(e.target.value);
                  }}></input>
               </div>
            </div>
            <button className="refreshButton">
               Save changes
            </button>
         </div>
		</div>
	);
}

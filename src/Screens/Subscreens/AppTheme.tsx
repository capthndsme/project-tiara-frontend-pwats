import { useContext } from "react";
import { SimpleBackButton } from "../../Components/SimpleBackButton";
import { TopBar } from "../../Components/TopBar";
import { FunctionContext } from "../../Components/FunctionContext";

export function AppTheme() { 
   const AppFunctions = useContext(FunctionContext)
	return (
		<div className="screen">
			<TopBar float={true} leftToRight={true}>
				<SimpleBackButton />
				App Theming
			</TopBar>
			<div className="maxWidth">
				Select theme
				<select className="refreshButton"
            style={{ height: "30px" }}
				defaultValue={localStorage.getItem("theme") || "_DEF_"}
            onChange={(e) => {
               
               localStorage.setItem("theme", e.target.value);
               if (e.target.value === "_DEF_") localStorage.removeItem("theme");
               if (AppFunctions && AppFunctions.reloadTheme) AppFunctions.reloadTheme();
            }}
            >
					<option value="_DEF_">Default</option>
					<option value="teal">Teal</option>
					<option value="midnightblue">Midnight Blue</option>
					<option value="palenight">Palenight</option>
					<option value="purpleorange">Purple and Orange</option>
				</select>
			</div>
		</div>
	);
}

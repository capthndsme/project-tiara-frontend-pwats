import { SimpleBackButton } from "../Components/SimpleBackButton";
import { TopBar } from "../Components/TopBar";

export function LogoutScreen() {
   return (
      <div className="screen">
			<TopBar float={true} leftToRight={true}>
				<SimpleBackButton />
				Logout
			</TopBar>
			<div className="maxWidth">
			 
			</div>
		</div>

   )
}
import { SimpleBackButton } from "../Components/SimpleBackButton";
import { TopBar } from "../Components/TopBar";

export function About() {
   return (
      <div className="screen">
			<TopBar float={true} leftToRight={true}>
				<SimpleBackButton />
				About app
			</TopBar>
			<div className="maxWidth">
			 
			</div>
		</div>

   )
}
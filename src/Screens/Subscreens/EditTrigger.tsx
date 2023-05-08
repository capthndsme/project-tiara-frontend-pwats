import { useParams } from "react-router-dom";
import { SimpleBackButton } from "../../Components/SimpleBackButton";
import { TopBar } from "../../Components/TopBar";
import { useState } from "react";
import { Spin } from "../../Components/Spin";

export function EditTrigger() {
	const { id } = useParams();
	const [fetching, setFetching] = useState(true);
	if (id === undefined) {
		return <></>;
	}
	if (fetching) {
		return (
			<>
				<TopBar float={true} leftToRight={true}>
					<SimpleBackButton />
					Edit Trigger: {id}
				</TopBar>
            <div className="loading fullscreen centreText">
					<Spin />
					<br />
               Fetching trigger information...
				</div>
			</>
		);
	}
	return (
		<>
			<TopBar float={true} leftToRight={true}>
				<SimpleBackButton />
				Edit Trigger: {id}
			</TopBar>
			<div className="maxWidth"></div>
		</>
	);
}

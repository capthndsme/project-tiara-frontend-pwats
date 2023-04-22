import { useContext, useState } from "react";
import { ActiveDeviceContext } from "../../Components/ActiveDeviceContext";
import { TopBar } from "../../Components/TopBar";
import { SimpleBackButton } from "../../Components/SimpleBackButton";
import { ScheduledTask, ScheduledTaskBase, SchedulerTime } from "../../Types/SchedulerTypes";

export function AddTriggers() {
	const adc = useContext(ActiveDeviceContext);
	const [activeKey, setActiveKey] = useState(-1);
	const [localScheduler, setLocalScheduler] = useState<ScheduledTask>(ScheduledTaskBase);
	let controls = [];
	// A simple selection screen for toggles
	if (adc.deviceToggles) {
		for (let i = 0; i < adc.deviceToggles.length; i++) {
			controls.push(
				<div
					key={i}
					onClick={() => {
						console.log("Set Active Key", i);
						setActiveKey(i);
					}}
					className={i === activeKey ? "deviceToggle activeToggle" : "deviceToggle"}
				>
					{adc.deviceToggles[i]?.toggleDescription}
				</div>
			);
		}
	}
	function addTime() {
		const newTime: SchedulerTime = {
			time: null,
			lastExecuted: 0,
		};
		setLocalScheduler((sched) => ({ ...sched, every: [...sched.every, newTime] }));
	}
	let RenderOptions = <></>;
	if (activeKey !== -1) {
		let everyTriggers = [];
		if (localScheduler.every) {
			for (let i = 0; i < localScheduler.every.length; i++) {
				const time = localScheduler.every[i].time;
				let timeVal = "";
				if (time) {
					timeVal = String(time[0]).padStart(2, "0") + ":" + String(time[1]).padStart(2, "0")
				}
				everyTriggers.push(
					<div key={i} className="trigger">
						<input type="time" value={timeVal} onChange={(val) => {
							const newTime: SchedulerTime = {
								time: [parseInt(val.target.value.split(":")[0]), parseInt(val.target.value.split(":")[1])],
								lastExecuted: 0,
							};
							setLocalScheduler((sched) => ({ ...sched, every: [...sched.every.slice(0, i), newTime, ...sched.every.slice(i + 1)] }));
						}} />
						<button className="refreshButton" onClick={()=>{
							setLocalScheduler((sched) => ({ ...sched, every: [...sched.every.slice(0, i), ...sched.every.slice(i + 1)] }));
						}}>Remove</button>
					</div>
				);
			}
		}

		RenderOptions = (
			<>
				<div className="padding">
					<section>
						<h2 className="noMargin">Time triggers</h2>
						<p>
							Time triggers are triggered at a specific time of day. When your device is turned off before an automation is
							triggered, it will be skipped.
						</p>
						<section className="triggerEditor">
							{localScheduler.every?.length === 0 ? (
								<center>No time triggers set.</center>
							) : (
								<>{everyTriggers}</>
							)}

							<button onClick={addTime} disabled={(localScheduler.every?.length>3)} className="refreshButton">
								Add a time trigger ({localScheduler.every?.length}/4)
							</button>
						</section>
					</section>
					<section>
						<h2 className="noMargin">Time-range triggers</h2>
						<p>
							Time-range triggers are triggered at a specific time of day, the start and end time of the trigger can be set. The
							start of the trigger-time means that it would be toggled on at that time, and the end of the trigger-time means that it
							would be toggled off at that time.
						</p>
						<p>Not all toggle types support time-range triggers.</p>
						<section className="triggerEditor"></section>
					</section>
					<section>
						<h2 className="noMargin">Temperature-range triggers</h2>
						<p>
							Temperature-range triggers are triggered when the temperature inside the doghouse are within a specific range. The
							lower and upper bounds of the trigger can be set. When the temperature is below the lower bound, the trigger will be
							toggled on, and when the temperature is above the upper bound, the trigger will be toggled off.
						</p>
						<section className="triggerEditor"></section>
					</section>
				</div>
			</>
		);
	}
	return (
		<>
			<TopBar float={true} leftToRight={true}>
				<SimpleBackButton />
				Add an automation
			</TopBar>
			<div className="maxWidth noPadding">
				<div className="padding">Select a toggle to automate:</div>
				<div className="toggleList">
					<div className="toggleContainer">{controls}</div>
				</div>

				{RenderOptions}
				<div className="padding">
					<button className="refreshButton">Save</button>
				</div>
			</div>
		</>
	);
}

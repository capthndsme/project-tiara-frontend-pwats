import { useContext, useState } from "react";
import { ActiveDeviceContext } from "../../Components/ActiveDeviceContext";
import { TopBar } from "../../Components/TopBar";
import { SimpleBackButton } from "../../Components/SimpleBackButton";
import { ScheduledTask, ScheduledTaskBase, SchedulerRange, SchedulerTime } from "../../Types/SchedulerTypes";
import { ToggleType } from "../../Types/DeviceBaseToggle";
import { TriggerValidator, ValidationErrors } from "../../Components/TriggerValidator";
import { toast } from "react-hot-toast";
import { socket } from "../../Components/socket";
import { DeviceReqStatus } from "../../Types/DeviceReqStatus";

export function AddTriggers({reload}:{reload:() => void}) {
	const adc = useContext(ActiveDeviceContext);
	const [activeKey, setActiveKey] = useState(-1);
	const [saving, setSaving] = useState(false);
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
						setLocalScheduler((sched) => ({ ...sched, outputName: adc?.deviceToggles?.[i]?.toggleName ?? "" }));
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
		const every = localScheduler.every;
		if (!every) {
			setLocalScheduler((sched) => ({ ...sched, every: [newTime] }));
			return;
		} else {
			setLocalScheduler((sched) => ({ ...sched, every: [...every, newTime] }));
		}
	}
	let RenderOptions = <></>;
	
	function requireToggleType(type: ToggleType): string {
		if (adc.deviceToggles) {
			const toggle = adc.deviceToggles[activeKey];
			if (toggle) {
				return toggle.toggleType === type ? "dt" : "dt disabled";
			}
		}
		// If we get here, we have no toggles, so we can't have a toggle type
		return "dt disabled";
	}
	function validateAndSave() {
		if (adc.deviceToggles) {
			const toggle = adc.deviceToggles[activeKey];
			if (toggle) {
				const validationPass: ValidationErrors = TriggerValidator(localScheduler, toggle.toggleType);
				if (validationPass === ValidationErrors.ValidationPassed) {
					// Save the trigger
					setSaving(true);
					let start = Date.now();
					toast("Saving trigger");
					console.log("Saving trigger...");
					socket.timeout(45000).emit(
						"AddTriggerDevice",
						{
							myTrigger: localScheduler,
						},
						(error: boolean, data: DeviceReqStatus) => {
							console.log("Trigger save latency " + (Date.now() - start) + "ms");
							if (error) {
								setSaving(false);
								return toast.error("Error saving trigger");
							}
							if (data.success) {
								toast.success("Trigger saved!");
								console.log("Trigger saved!");
								setSaving(false);
							} else {
								toast.error("Error saving trigger: " + data.error);
								console.log("Error saving trigger");
								setSaving(false);
							}
						}
					);
				} else {
					toast("Validation failed: " + validationPass, { icon: "❌" });
					console.log("Validation failed: " + validationPass);
				}
			}
		}
	}
	if (activeKey !== -1) {
		let everyTriggers = [];
		if (localScheduler.every) {
			for (let i = 0; i < localScheduler.every.length; i++) {
				const time = localScheduler.every[i].time;
				let timeVal = "";
				if (time) {
					timeVal = String(time[0]).padStart(2, "0") + ":" + String(time[1]).padStart(2, "0");
				}
				everyTriggers.push(
					<div key={i} className="trigger">
						<input
							type="time"
							value={timeVal}
							onChange={(val) => {
								const every = localScheduler.every;
								if (every) {
									const newTime: SchedulerTime = {
										time: [parseInt(val.target.value.split(":")[0]), parseInt(val.target.value.split(":")[1])],
										lastExecuted: 0,
									};
									setLocalScheduler((sched) => ({
										...sched,
										every: [...every.slice(0, i), newTime, ...every.slice(i + 1)],
									}));
								}
							}}
						/>
						<button
							className="refreshButton"
							onClick={() => {
								setLocalScheduler((sched) => {
									const every = sched.every;
									if (every) return { ...sched, every: [...every.slice(0, i), ...every.slice(i + 1)] };
									else return { ...sched }; // This should never happen
								});
							}}
						>
							Remove
						</button>
					</div>
				);
			}
		}

		RenderOptions = (
			<>
				<div className="padding">
					<section className={requireToggleType(ToggleType.ONEOFF)}>
						<h2 className="noMargin">Time triggers</h2>

						<section className="triggerEditor">
							Time triggers are triggered at a specific time of day. When your device is turned off before an automation is
							triggered, it will be skipped.
							{localScheduler.every?.length === 0 ? <center>No time triggers set.</center> : <>{everyTriggers}</>}
							<button
								onClick={addTime}
								disabled={localScheduler.every ? localScheduler.every.length > 3 : false}
								className="refreshButton"
							>
								Add a time trigger ({localScheduler.every?.length}/4)
							</button>
						</section>
					</section>

					<section className={requireToggleType(ToggleType.SWITCH)}>
						<h2 className="noMargin">Time-range triggers</h2>
						<section className="triggerEditor">
						<input
							checked={localScheduler.timeRange ? true : false}
							onClick={(e) => {

								if (localScheduler.timeRange) {
									// false, remove tempRange
									setLocalScheduler(sched=>({
										...sched, timeRange: null
									}));
								} else {
									// Populate tempRange
									setLocalScheduler(sched=>({
										...sched, timeRange: {
											from: {
												time: [0, 0],
												lastExecuted: 0
											},
											to: {
												time: [0, 0],
												lastExecuted: 0
											}
										}
									}));
								}
							}}
							type="checkbox"></input>
							Use time-range triggers<br/>
							This output will be turned on between <br />
							<input
								type="time"
								className="triggerstyle triggerstylespace"
								value={
									String(localScheduler.timeRange?.from.time?.[0]).padStart(2, "0") +
									":" +
									String(localScheduler.timeRange?.from.time?.[1]).padStart(2, "0")
								}
								onChange={(val) => {
									const newTime: SchedulerTime = {
										time: [parseInt(val.target.value.split(":")[0]), parseInt(val.target.value.split(":")[1])],
										lastExecuted: 0,
									};

									setLocalScheduler((sched) => {
										// There must be a better way to do this...
										const localTimeRange: SchedulerRange = {
											from: newTime,
											to: sched.timeRange?.to ? sched.timeRange.to : { time: [0, 0], lastExecuted: 0 },
										};

										return {
											...sched,
											timeRange: localTimeRange,
										};
									});
								}}
							/>
							to
							<input
								className="triggerstyle triggerstylespace"
								type="time"
								value={
									String(localScheduler.timeRange?.to.time?.[0]).padStart(2, "0") +
									":" +
									String(localScheduler.timeRange?.to.time?.[1]).padStart(2, "0")
								}
								onChange={(val) => {
									const newTime: SchedulerTime = {
										time: [parseInt(val.target.value.split(":")[0]), parseInt(val.target.value.split(":")[1])],
										lastExecuted: 0,
									};

									setLocalScheduler((sched) => {
										// There must be a better way to do this...
										const localTimeRange: SchedulerRange = {
											to: newTime,
											from: sched.timeRange?.from ? sched.timeRange.from : { time: [0, 0], lastExecuted: 0 },
										};

										return {
											...sched,
											timeRange: localTimeRange,
										};
									});
								}}
							/>
							<br />
						</section>
					</section>

					<section className={requireToggleType(ToggleType.SWITCH)}>
						<h2 className="noMargin">Temperature-range triggers</h2>
						<section className="triggerEditor">
							<input
							checked={localScheduler.tempRange ? true : false}
							onClick={(e) => {

								if (localScheduler.tempRange) {
									// false, remove tempRange
									setLocalScheduler(sched=>({
										...sched, tempRange: null
									}));
								} else {
									// Populate tempRange
									setLocalScheduler(sched=>({
										...sched, tempRange: [0, 0]
									}));
									
								}
							}}
							type="checkbox"></input>
							Use temperature triggers
							<br />
							Turn on when temperature is between
							<input
								className="triggerstyle triggerstylespace"
								type="number"
								onChange={(val) => {
									setLocalScheduler((sched) => {
										const hasother = sched.tempRange?.[1];
										return {
											...sched,
											tempRange: [parseInt(val.target.value), hasother ? hasother : 0],
										};
									});
								}}
								value={localScheduler.tempRange?.[0]}
							/>
							°C
							<br /> and
							<input
								onChange={(val) => {
									setLocalScheduler((sched) => {
										const hasother = sched.tempRange?.[0];
										return {
											...sched,
											tempRange: [hasother ? hasother : 0, parseInt(val.target.value)],
										};
									});
								}}
								value={localScheduler.tempRange?.[1]}
								className="triggerstyle triggerstylespace"
								type="number"
							/>
							°C <br />
							The selected output will be turned off when the temperature is below this range, and will remain on when it is above
							this range
						</section>
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
				<div className="toggleList">{controls}</div>

				{RenderOptions}
				<div className="padding">
					<button onClick={validateAndSave} className="refreshButton" disabled={saving}>
						{saving ? "Saving..." : "Save"}
					</button>
				</div>
			</div>
		</>
	);
}

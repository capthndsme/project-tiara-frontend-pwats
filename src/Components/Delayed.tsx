import React, { useState, useEffect } from "react";

type DelayedProps = {
	delay: number; // delay in milliseconds
	children: React.ReactNode; // child component to render,
	ignorePrefersReducedMotion?: boolean;
};

const Delayed: React.FC<DelayedProps> = ({ delay, children }) => {
 
  const shouldWeNotDelay = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 
	const [show, setShow] = useState(shouldWeNotDelay ? true : false); // state variable to control visibility

	useEffect(() => {
		let timer: NodeJS.Timeout | null ;


    if (!shouldWeNotDelay) timer = setTimeout(() => {
			setShow(true); // show the child component after the delay
		}, delay);

		return () => {if (timer) clearTimeout(timer)}; // clear the timeout if the component is unmounted
	}, [delay, shouldWeNotDelay]); // only re-run the effect if the delay prop changes

	return show ? <>{children}</> : null; // render the child component or nothing
};

export default Delayed;

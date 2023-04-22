import React, { useState, useEffect } from 'react';

type DelayedProps = {
  delay: number; // delay in milliseconds
  children: React.ReactNode; // child component to render
};

const Delayed: React.FC<DelayedProps> = ({ delay, children }) => {
  const [show, setShow] = useState(false); // state variable to control visibility

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true); // show the child component after the delay
    }, delay);

    return () => clearTimeout(timer); // clear the timeout if the component is unmounted
  }, [delay]); // only re-run the effect if the delay prop changes

  return show ? <>{children}</> : null; // render the child component or nothing
};

export default Delayed;
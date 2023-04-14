export function DisconnectedOverlay({disconnected}: {disconnected: boolean}) {
  if (!disconnected) return (<></>)
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      lineHeight: "30px",
      height: "30px",
      width: "100%",
      background: "rgba(0,0,0,0.5)"
    }}>
       Disconnected...
    </div>
  );
}
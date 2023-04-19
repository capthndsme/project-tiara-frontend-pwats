import { DeviceControls } from "../Components/DeviceControls";
import { DeviceGlance } from "../Components/DeviceGlance";
import { DeviceSelector } from "../Components/DeviceSelector";

export function HomescreenView() {
  return(
    <div className="screen">
      <div className="maxWidth">
        <DeviceSelector />
        <DeviceGlance />
        <DeviceControls/>
      </div>
    </div>
  )
}
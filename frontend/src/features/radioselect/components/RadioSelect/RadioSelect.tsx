import "./RadioSelect.css"
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi"

type RadioSelectProps = {
  handleRandomSelect: () => void
}

function RadioSelect(props: RadioSelectProps) {
  return (
    <div className="radio-select-container">
      <GiPerspectiveDiceSixFacesRandom
        onClick={props.handleRandomSelect}
        size={64}
        title="Select a random radio station"
        data-testid="random-radio-station-btn"
      />
    </div>
  )
}

export default RadioSelect

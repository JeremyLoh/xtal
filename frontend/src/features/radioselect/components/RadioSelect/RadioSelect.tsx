import "./RadioSelect.css"
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi"

type RadioSelectProps = {
  handleRandomSelect: () => void
  isLoading: boolean
}

function RadioSelect(props: RadioSelectProps) {
  return (
    <div className="radio-select-container">
      <button
        className="radio-select-random-btn"
        disabled={props.isLoading}
        onClick={props.handleRandomSelect}
        data-testid="random-radio-station-btn"
      >
        <GiPerspectiveDiceSixFacesRandom
          size={48}
          title="Select a random radio station"
        />
        <span>Random</span>
      </button>
    </div>
  )
}

export default RadioSelect

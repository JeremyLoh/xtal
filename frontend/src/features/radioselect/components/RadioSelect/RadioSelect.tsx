import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi"

type RadioSelectProps = {
  handleRandomSelect: () => void
}

function RadioSelect(props: RadioSelectProps) {
  return (
    <div>
      <GiPerspectiveDiceSixFacesRandom
        onClick={props.handleRandomSelect}
        size={64}
        title="select random radio"
      />
    </div>
  )
}

export default RadioSelect

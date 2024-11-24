import { useState } from "react"
import { getRandomStation } from "./api/radiobrowser/station"
import "./App.css"
import Map from "./features/map/components/Map/Map"
import RadioSelect from "./features/radioselect/components/RadioSelect/RadioSelect"
import RadioCard from "./features/map/components/RadioCard/RadioCard"

function App() {
  const [popupContent, setPopupContent] = useState<JSX.Element | null>(null)

  async function displayRandomStation() {
    const station = await getRandomStation()
    if (station) {
      // TODO remove debug log
      console.log(JSON.stringify(station, null, 2))
      // display on map as popup, of radio card
      setPopupContent(<RadioCard station={station} />)
    }
  }
  return (
    <>
      <Map popupContent={popupContent} />
      <RadioSelect handleRandomSelect={displayRandomStation} />
    </>
  )
}

export default App

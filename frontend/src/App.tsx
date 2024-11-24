import { useState } from "react"
import { getRandomStation } from "./api/radiobrowser/station"
import "./App.css"
import Map from "./features/map/components/Map/Map"
import RadioSelect from "./features/radioselect/components/RadioSelect/RadioSelect"
import Header from "./components/Header/Header"
import { Station } from "./api/radiobrowser/types"

function App() {
  const [currentStation, setCurrentStation] = useState<Station | null>(null)

  async function displayRandomStation() {
    const station = await getRandomStation()
    if (station) {
      // TODO remove debug log
      console.log(JSON.stringify(station, null, 2))
      setCurrentStation(station)
    }
  }
  return (
    <>
      <Header />
      <RadioSelect handleRandomSelect={displayRandomStation} />
      <Map station={currentStation} />
    </>
  )
}

export default App

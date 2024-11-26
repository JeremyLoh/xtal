import { useRef, useState } from "react"
import { getRandomStation } from "./api/radiobrowser/station"
import "./App.css"
import Map from "./features/map/components/Map/Map"
import RadioSelect from "./features/radioselect/components/RadioSelect/RadioSelect"
import Header from "./components/Header/Header"
import { Station } from "./api/radiobrowser/types"

function App() {
  const abortControllerRef = useRef<AbortController | null>(null)
  const [currentStation, setCurrentStation] = useState<Station | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  async function displayRandomStation() {
    setIsLoading(true)
    abortControllerRef.current?.abort()
    abortControllerRef.current = new AbortController()
    const station = await getRandomStation(abortControllerRef.current)
    if (station) {
      // TODO remove debug log
      console.log(JSON.stringify(station, null, 2))
      setCurrentStation(station)
    } else {
      // TODO display error message for failure to get station
    }
    setIsLoading(false)
  }
  return (
    <>
      <Header />
      <RadioSelect
        handleRandomSelect={displayRandomStation}
        isLoading={isLoading}
      />
      <Map station={currentStation} />
    </>
  )
}

export default App

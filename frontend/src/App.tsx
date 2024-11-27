import "./App.css"
import { useRef, useState } from "react"
import { toast, Toaster } from "sonner"
import { getRandomStation } from "./api/radiobrowser/station"
import Map from "./features/map/components/Map/Map"
import RadioSelect from "./features/radioselect/components/RadioSelect/RadioSelect"
import Header from "./components/Header/Header"
import { Station } from "./api/radiobrowser/types"
import Footer from "./components/Footer/Footer"

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
      setCurrentStation(station)
    } else {
      toast.error("Could not get random radio station")
    }
    setTimeout(() => setIsLoading(false), 3000)
  }
  return (
    <>
      <Toaster position="top-center" richColors />
      <Header />
      <RadioSelect
        handleRandomSelect={displayRandomStation}
        isLoading={isLoading}
      />
      <Map station={currentStation} />
      <Footer />
    </>
  )
}

export default App

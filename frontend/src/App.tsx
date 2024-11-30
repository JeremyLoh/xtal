import "./App.css"
import { useRef, useState } from "react"
import { toast, Toaster } from "sonner"
import { getRandomStation } from "./api/radiobrowser/station"
import Map from "./features/map/components/Map/Map"
import RadioSelect from "./features/radioselect/components/RadioSelect/RadioSelect"
import Header from "./components/Header/Header"
import Footer from "./components/Footer/Footer"
import { Station } from "./api/radiobrowser/types"
import { GenreInformation } from "./api/radiobrowser/genreTags"

function App() {
  const abortControllerRef = useRef<AbortController | null>(null)
  const [currentStation, setCurrentStation] = useState<Station | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  async function displayRandomStation(genre: GenreInformation) {
    setIsLoading(true)
    abortControllerRef.current?.abort()
    abortControllerRef.current = new AbortController()
    const station = await getRandomStation(abortControllerRef.current, genre)
    if (station) {
      setCurrentStation(station)
    } else {
      toast.error("Could not get random radio station")
    }
    setTimeout(() => setIsLoading(false), 3000)
  }
  return (
    <>
      <Toaster position="top-center" expand={true} richColors />
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

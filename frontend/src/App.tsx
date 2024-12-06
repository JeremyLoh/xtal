import "./App.css"
import { useRef, useState } from "react"
import { toast, Toaster } from "sonner"
import { LatLngExpression } from "leaflet"
import Map from "./features/map/components/Map/Map"
import RadioSelect from "./features/radioselect/components/RadioSelect/RadioSelect"
import Header from "./components/Header/Header"
import Footer from "./components/Footer/Footer"
import { Station } from "./api/radiobrowser/types"
import { StationSearchStrategy } from "./api/radiobrowser/searchStrategy/StationSearchStrategy"
import { countryAlpha2ToCoordinate } from "./api/location/countryCoordinate"

function App() {
  const abortControllerRef = useRef<AbortController | null>(null)
  const [currentStation, setCurrentStation] = useState<Station | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [currentView, setCurrentView] = useState<LatLngExpression>({
    lat: 0,
    lng: 0,
  })

  function getRandomInt(max: number) {
    return Math.floor(Math.random() * max)
  }
  async function displayRandomStation(searchStrategy: StationSearchStrategy) {
    setIsLoading(true)
    abortControllerRef.current?.abort()
    abortControllerRef.current = new AbortController()
    const stations = await searchStrategy.findStations(
      abortControllerRef.current
    )
    if (stations) {
      // API might return less entries compared to limit (reduce by 1 for array zero based index)
      const responseCount = Math.max(stations.length - 1, 0)
      const station = stations[getRandomInt(responseCount)]
      setCurrentStation(station)
    } else {
      toast.error("Could not get random radio station")
    }
    setTimeout(() => setIsLoading(false), 3000)
  }
  function handleCountryChange(countryCode: string) {
    if (countryAlpha2ToCoordinate.has(countryCode)) {
      // @ts-expect-error countryCode has been checked and exists in the Map
      const { latitude, longitude } = countryAlpha2ToCoordinate.get(countryCode)
      setCurrentView({ lat: latitude, lng: longitude })
    }
  }
  return (
    <>
      <Toaster position="top-center" expand={true} richColors />
      <Header />
      <main>
        <RadioSelect
          handleRandomSelect={displayRandomStation}
          handleCountryChange={handleCountryChange}
          isLoading={isLoading}
        />
        <Map station={currentStation} latLng={currentView} />
      </main>
      <Footer />
    </>
  )
}

export default App

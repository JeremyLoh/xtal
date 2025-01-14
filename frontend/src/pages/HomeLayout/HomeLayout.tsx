import { useContext, useRef, useState } from "react"
import { Outlet } from "react-router"
import { toast } from "sonner"
import RadioSelect from "../../features/radioselect/components/RadioSelect/RadioSelect"
import { countryAlpha2ToCoordinate } from "../../api/location/countryCoordinate"
import { MapContext } from "../../context/MapProvider/MapProvider"
import { StationSearchStrategy } from "../../api/radiobrowser/searchStrategy/StationSearchStrategy"

export default function HomeLayout() {
  const mapContext = useContext(MapContext)
  const abortControllerRef = useRef<AbortController | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

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
      mapContext?.setStation(station)
    } else {
      toast.error("Could not get random radio station")
    }
    setTimeout(() => setIsLoading(false), 3000)
  }
  function handleCountryChange(countryCode: string) {
    if (countryAlpha2ToCoordinate.has(countryCode)) {
      // @ts-expect-error countryCode has been checked and exists in the Map
      const { latitude, longitude } = countryAlpha2ToCoordinate.get(countryCode)
      mapContext?.setCurrentView({ lat: latitude, lng: longitude })
    }
  }

  return (
    <>
      <RadioSelect
        handleRandomSelect={displayRandomStation}
        handleCountryChange={handleCountryChange}
        isLoading={isLoading}
      />
      <Outlet />
    </>
  )
}

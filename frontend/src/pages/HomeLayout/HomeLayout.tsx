import "./HomeLayout.css"
import { preconnect, prefetchDNS, preload } from "react-dom"
import { useCallback, useContext, useRef, useState } from "react"
import { Outlet } from "react-router"
import { toast } from "sonner"
import RadioSelect from "../../features/radioselect/components/RadioSelect/RadioSelect.tsx"
import { countryAlpha2ToCoordinate } from "../../api/location/countryCoordinate.ts"
import { MapContext } from "../../context/MapProvider/MapProvider.tsx"
import { StationSearchStrategy } from "../../api/radiobrowser/searchStrategy/StationSearchStrategy.ts"

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max)
}

export default function HomeLayout() {
  preconnect("https://tile.openstreetmap.org")
  prefetchDNS("https://tile.openstreetmap.org")
  // This tilemap preload changes based on the initial map view LCP image
  preload("https://tile.openstreetmap.org/4/7/7.png", {
    as: "image",
    fetchPriority: "high",
    type: "image/png",
  })
  const mapContext = useContext(MapContext)
  const abortControllerRef = useRef<AbortController | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const displayRandomStation = useCallback(
    async (searchStrategy: StationSearchStrategy) => {
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
    },
    [mapContext]
  )

  const handleCountryChange = useCallback(
    (countryCode: string) => {
      if (countryAlpha2ToCoordinate.has(countryCode)) {
        // @ts-expect-error countryCode has been checked and exists in the Map
        const { latitude, longitude } =
          countryAlpha2ToCoordinate.get(countryCode)
        mapContext?.setCurrentView({ lat: latitude, lng: longitude })
      }
    },
    [mapContext]
  )

  return (
    <>
      <RadioSelect
        onRandomSelect={displayRandomStation}
        onCountryChange={handleCountryChange}
        isLoading={isLoading}
      />
      <Outlet />
    </>
  )
}

import { useContext, useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router"
import { toast } from "sonner"
import { MapContext } from "../../context/MapProvider/MapProvider.tsx"
import { SearchStrategyFactory } from "../../api/radiobrowser/searchStrategy/SearchStrategyFactory.ts"
import Map from "../../features/map/Map/Map.tsx"
import { notFoundPage } from "../../paths.ts"

type RadioStationDisplayPageParams = {
  stationuuid: string
}

function isInvalidUuid(uuid: string) {
  // check UUID Version 1 to 5 "[0-5]", version number is the first character of the third group: [VERSION_NUMBER][0-9A-F]{3}
  const uuidregex = new RegExp(
    /^[0-9A-F]{8}-[0-9A-F]{4}-[1-5][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
  )
  return !uuidregex.test(uuid)
}

export default function RadioStationDisplayPage() {
  const { stationuuid } = useParams<RadioStationDisplayPageParams>()
  const navigate = useNavigate()
  const mapContext = useContext(MapContext)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    async function displayStation(stationuuid: string | undefined) {
      if (stationuuid == undefined || mapContext == null) {
        return
      }
      if (isInvalidUuid(stationuuid)) {
        navigate(notFoundPage())
      }
      const searchStrategy =
        SearchStrategyFactory.createUuidSearchStrategy(stationuuid)
      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController()
      const stations = await searchStrategy.findStations(
        abortControllerRef.current
      )
      if (stations && stations.length >= 1) {
        const station = stations[0]
        mapContext.setStation(station)
      } else {
        toast.error("Could not find station")
      }
    }

    displayStation(stationuuid)
    // adding mapContext as dependency will cause an infinite loop due to setting of station
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stationuuid])

  return (
    <Map
      station={mapContext ? mapContext.station : null}
      latLng={mapContext ? mapContext.currentView : { lat: 0, lng: 0 }}
    />
  )
}

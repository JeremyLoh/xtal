import { useContext, useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router"
import { toast } from "sonner"
import { MapContext } from "../../context/MapProvider/MapProvider"
import { SearchStrategyFactory } from "../../api/radiobrowser/searchStrategy/SearchStrategyFactory"
import Map from "../../features/map/components/Map/Map"

type RadioStationParams = {
  stationuuid: string
}

function isInvalidUuid(uuid: string) {
  const uuidV4regex = new RegExp(
    /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
  )
  return !uuidV4regex.test(uuid)
}

export default function RadioStation() {
  const { stationuuid } = useParams<RadioStationParams>()
  const navigate = useNavigate()
  const mapContext = useContext(MapContext)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    async function displayStation(stationuuid: string | undefined) {
      if (stationuuid == undefined || mapContext == null) {
        return
      }
      if (isInvalidUuid(stationuuid)) {
        navigate("/404")
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
    <>
      <Map
        station={mapContext ? mapContext.station : null}
        latLng={mapContext ? mapContext.currentView : { lat: 0, lng: 0 }}
      />
    </>
  )
}

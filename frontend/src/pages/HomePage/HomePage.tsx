import { useContext } from "react"
import Map from "../../features/map/components/Map/Map"
import { MapContext } from "../../context/MapProvider/MapProvider"

export default function HomePage() {
  const mapContext = useContext(MapContext)
  return (
    <>
      <Map
        station={mapContext ? mapContext.station : null}
        latLng={mapContext ? mapContext.currentView : { lat: 0, lng: 0 }}
      />
    </>
  )
}

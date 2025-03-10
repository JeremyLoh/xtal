import { useContext, useEffect } from "react"
import Map from "../../features/map/components/Map/Map.tsx"
import { MapContext } from "../../context/MapProvider/MapProvider.tsx"

export default function HomePage() {
  const mapContext = useContext(MapContext)
  useEffect(() => {
    document.title = "xtal"
  }, [])

  return (
    <Map
      station={mapContext ? mapContext.station : null}
      latLng={mapContext ? mapContext.currentView : { lat: 0, lng: 0 }}
    />
  )
}

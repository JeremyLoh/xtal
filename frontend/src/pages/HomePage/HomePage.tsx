import { useContext, useEffect } from "react"
import MapView from "../../features/map/MapView/MapView.tsx"
import { MapContext } from "../../context/MapProvider/MapProvider.tsx"

export default function HomePage() {
  const mapContext = useContext(MapContext)
  useEffect(() => {
    document.title = "xtal"
  }, [])

  return (
    <MapView
      station={mapContext ? mapContext.station : null}
      latLng={mapContext ? mapContext.currentView : { lat: 0, lng: 0 }}
    />
  )
}

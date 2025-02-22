import { createContext, useState } from "react"
import { LatLngExpression } from "leaflet"
import { Station } from "../../api/radiobrowser/types.ts"

type MapInfo = {
  station: Station | null
  setStation: (station: Station | null) => void
  currentView: LatLngExpression
  setCurrentView: React.Dispatch<React.SetStateAction<LatLngExpression>>
}

// eslint-disable-next-line react-refresh/only-export-components
export const MapContext = createContext<MapInfo | null>(null)

function MapProvider({ children }: { children: React.ReactNode }) {
  const [currentView, setCurrentView] = useState<LatLngExpression>({
    lat: 0,
    lng: 0,
  })
  const [station, setStation] = useState<Station | null>(null)
  function setMapStation(station: Station | null) {
    setCurrentView({ lat: station?.geo_lat || 0, lng: station?.geo_long || 0 })
    setStation(station == null ? null : { ...station })
  }
  return (
    <MapContext.Provider
      value={{
        station,
        setStation: setMapStation,
        currentView,
        setCurrentView,
      }}
    >
      {children}
    </MapContext.Provider>
  )
}

export default MapProvider

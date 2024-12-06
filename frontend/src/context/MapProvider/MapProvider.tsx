import { createContext, useState } from "react"
import { Station } from "../../api/radiobrowser/types"
import { LatLngExpression } from "leaflet"

type MapInfo = {
  station: Station | null
  setStation: React.Dispatch<React.SetStateAction<Station | null>>
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
  return (
    <MapContext.Provider
      value={{ station, setStation, currentView, setCurrentView }}
    >
      {children}
    </MapContext.Provider>
  )
}

export default MapProvider

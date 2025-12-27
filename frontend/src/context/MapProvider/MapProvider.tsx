import { createContext, useCallback, useMemo, useState } from "react"
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

type MapProviderProps = { children: React.ReactNode }

function MapProvider({ children }: Readonly<MapProviderProps>) {
  const initialPosition = useMemo(() => {
    return { lat: 0, lng: 0 }
  }, [])
  const [currentView, setCurrentView] =
    useState<LatLngExpression>(initialPosition)
  const [station, setStation] = useState<Station | null>(null)

  const setMapStation = useCallback((station: Station | null) => {
    setCurrentView({ lat: station?.geo_lat || 0, lng: station?.geo_long || 0 })
    setStation(station == null ? null : { ...station })
  }, [])
  const output = useMemo(() => {
    return {
      station,
      setStation: setMapStation,
      currentView,
      setCurrentView,
    }
  }, [station, currentView, setMapStation])

  return <MapContext.Provider value={output}>{children}</MapContext.Provider>
}

export default MapProvider

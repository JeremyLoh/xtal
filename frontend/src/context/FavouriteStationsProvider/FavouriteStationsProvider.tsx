import { createContext, useCallback, useState } from "react"
import useLocalStorage from "../../hooks/useLocalStorage.ts"
import { Station } from "../../api/radiobrowser/types.ts"

type FavouriteStations = {
  getFavouriteStations: () => Station[]
  setFavouriteStations: (value: Station[]) => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const FavouriteStationsContext = createContext<FavouriteStations | null>(
  null
)

function FavouriteStationsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { getItem, setItem } = useLocalStorage("FAVOURITE_STATIONS")
  const [favouriteStations, setFavouriteStations] = useState<Station[]>(
    getItem() || []
  )
  const setStations = useCallback(
    (value: Station[]) => {
      setItem(value)
      setFavouriteStations(value)
    },
    [setItem]
  )
  const getFavouriteStations = useCallback(
    () => favouriteStations,
    [favouriteStations]
  )
  return (
    <FavouriteStationsContext.Provider
      value={{ getFavouriteStations, setFavouriteStations: setStations }}
    >
      {children}
    </FavouriteStationsContext.Provider>
  )
}

export default FavouriteStationsProvider

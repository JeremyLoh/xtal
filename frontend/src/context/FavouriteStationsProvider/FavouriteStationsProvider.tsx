import { createContext } from "react"
import useLocalStorage from "../../hooks/useLocalStorage.ts"
import { Station } from "../../api/radiobrowser/types.ts"

type FavouriteStations = {
  favouriteStations: Station[]
  setFavouriteStations: React.Dispatch<Station[]>
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
  const [favouriteStations, setFavouriteStations] = useLocalStorage<Station[]>(
    "FAVOURITE_STATIONS",
    []
  )
  return (
    <FavouriteStationsContext.Provider
      value={{ favouriteStations, setFavouriteStations }}
    >
      {children}
    </FavouriteStationsContext.Provider>
  )
}

export default FavouriteStationsProvider

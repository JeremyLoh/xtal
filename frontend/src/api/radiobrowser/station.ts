import ky from "ky"
import { getRandomServer } from "./servers"
import { Station } from "./types"
import { getCountryCoordinateBasedOn } from "../location/country"

async function getRandomStation(): Promise<Station> {
  const searchParams = new URLSearchParams(
    "?order=random&limit=1&hidebroken=true&is_https=true"
  )
  const server = await getRandomServer()
  const url = `${server}/json/stations/search`
  const json: Station[] = await ky.get(url, { retry: 0, searchParams }).json()
  const station = json[0]
  if (station != null && station.geo_lat == null && station.geo_long == null) {
    // populate geo_lat and geo_long if they are null
    const coordinate = getCountryCoordinateBasedOn(station.countrycode)
    if (coordinate == null) {
      return station
    }
    station.geo_lat = coordinate.latitude
    station.geo_long = coordinate.longitude
  }
  return station
}

export { getRandomStation }

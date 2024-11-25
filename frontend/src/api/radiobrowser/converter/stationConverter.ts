import { getCountryCoordinateBasedOn } from "../../location/country"
import { Station } from "../types"

const MAX_TAG_COUNT = 8

function convertMissingInformation(station: Station) {
  if (station != null && station.geo_lat == null && station.geo_long == null) {
    const coordinate = getCountryCoordinateBasedOn(station.countrycode)
    // default coordinate of [0, 0]
    station.geo_lat = coordinate ? coordinate.latitude : 0
    station.geo_long = coordinate ? coordinate.longitude : 0
  }
  const tags = station.tags.split(",")
  if (tags.length > MAX_TAG_COUNT) {
    station.tags = tags.slice(0, MAX_TAG_COUNT).join(",")
  }
  return station
}

export { convertMissingInformation }

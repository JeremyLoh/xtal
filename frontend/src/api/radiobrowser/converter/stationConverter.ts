import { getCountryCoordinateBasedOn } from "../../location/country"
import { Station } from "../types"

const MAX_TAG_COUNT = 8
const MAX_TAG_LENGTH = 50

function convertMissingInformation(station: Station) {
  if (station != null && station.geo_lat == null && station.geo_long == null) {
    const coordinate = getCountryCoordinateBasedOn(station.countrycode)
    // default coordinate of [0, 0]
    station.geo_lat = coordinate ? coordinate.latitude : 0
    station.geo_long = coordinate ? coordinate.longitude : 0
  }
  return station
}

function convertTags(station: Station) {
  // station.tags are stored in a comma separated string
  station.tags = station.tags
    .split(",")
    .map((tag: string) => tag.trim())
    .filter((tag: string) => tag.length <= MAX_TAG_LENGTH && tag.length > 0)
    .join(",")

  const tags = station.tags.split(",")
  if (tags.length > MAX_TAG_COUNT) {
    station.tags = tags.slice(0, MAX_TAG_COUNT).join(",")
  }
  return station
}

export { convertMissingInformation, convertTags }

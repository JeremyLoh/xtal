import { countryAlpha2ToCoordinate } from "./countryCoordinate.ts"

type Coordinates = {
  latitude: number
  longitude: number
}

function getCountryCoordinateBasedOn(
  alpha2Code: string
): Coordinates | undefined {
  return countryAlpha2ToCoordinate.get(alpha2Code.toUpperCase())
}

export { getCountryCoordinateBasedOn }

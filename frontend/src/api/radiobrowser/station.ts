import ky from "ky"
import { getRandomServer } from "./servers"
import { Station } from "./types"
import { convertMissingInformation } from "./converter/stationConverter"

async function getRandomStation(): Promise<Station> {
  const searchParams = new URLSearchParams(
    "?order=random&limit=1&hidebroken=true&is_https=true"
  )
  const server = await getRandomServer()
  const url = `${server}/json/stations/search`
  const json: Station[] = await ky.get(url, { retry: 0, searchParams }).json()
  const station = convertMissingInformation(json[0])
  return station
}

export { getRandomStation }

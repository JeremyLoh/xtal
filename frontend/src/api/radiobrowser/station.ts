import ky from "ky"
import { getRandomServer } from "./servers"
import { Station } from "./types"
import { convertMissingInformation } from "./converter/stationConverter"

async function getRandomStation(): Promise<Station> {
  const minBitrate = 64
  const offset = getRandomInt(10000)
  const searchParams = new URLSearchParams(
    `?order=random&limit=1&hidebroken=true&is_https=true&bitrateMin=${minBitrate}&offset=${offset}`
  )
  const server = await getRandomServer()
  const url = `${server}/json/stations/search`
  const json: Station[] = await ky.get(url, { retry: 0, searchParams }).json()
  const station = convertMissingInformation(json[0])
  return station
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max)
}

export { getRandomStation }

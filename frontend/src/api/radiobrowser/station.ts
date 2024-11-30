import ky from "ky"
import { getRandomServer } from "./servers"
import { Station } from "./types"
import { convertMissingInformation } from "./converter/stationConverter"
import { GenreInformation } from "./genreTags"

async function getRandomStation(
  abortController: AbortController,
  genre: GenreInformation
): Promise<Station | null> {
  const tag = genre.searchTag
  const offset = getRandomInt(genre.approxStationCount)
  const limit = 3
  const searchParams = new URLSearchParams(
    `?order=random&limit=${limit}&hidebroken=true&is_https=true&offset=${offset}&tag=${tag}`
  )
  const server = await getRandomServer()
  const url = `${server}/json/stations/search`
  try {
    const json: Station[] = await ky
      .get(url, { retry: 0, signal: abortController.signal, searchParams })
      .json()
    // API might return less entries compared to limit (reduce by 1 for array zero based index)
    const responseCount = Math.max(json.length - 1, 0)
    const station = convertMissingInformation(json[getRandomInt(responseCount)])
    return station
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.log("Aborted getRandomStation request")
    }
    return null
  }
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max)
}

export { getRandomStation }

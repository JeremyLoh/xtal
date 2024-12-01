import ky from "ky"
import { Station } from "./types"
import { convertMissingInformation } from "./converter/stationConverter"

async function getStation(
  abortController: AbortController,
  url: string,
  searchParams: URLSearchParams
): Promise<Station | null> {
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

export { getStation }

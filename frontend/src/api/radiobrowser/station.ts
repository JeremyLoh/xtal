import ky from "ky"
import { Station } from "./types"
import {
  convertMissingInformation,
  convertTags,
} from "./converter/stationConverter"

async function getAllStations(
  abortController: AbortController,
  url: string,
  searchParams: URLSearchParams
): Promise<Station[] | null> {
  try {
    const json: Station[] = await ky
      .get(url, { retry: 0, signal: abortController.signal, searchParams })
      .json()
    // API might return less entries compared to limit (reduce by 1 for array zero based index)
    return json.map(convertMissingInformation).map(convertTags)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.log("Aborted getAllStations request")
    }
    return null
  }
}

export { getAllStations }

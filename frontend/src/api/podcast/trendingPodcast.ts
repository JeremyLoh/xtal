import ky from "ky"
import dayjs from "dayjs"
import { TrendingPodcast } from "./model/podcast"

const BACKEND_ORIGIN = import.meta.env.VITE_BACKEND_ORIGIN

type TrendingPodcastSearchParams = {
  limit: number
  since?: Date
}

type TrendingPodcastResponse = {
  count: number
  data: TrendingPodcast[]
}

async function getTrendingPodcasts(
  abortController: AbortController,
  params: TrendingPodcastSearchParams
) {
  const url = BACKEND_ORIGIN + "/api/podcast/trending"
  const searchParams = getTrendingSearchParams(params)
  try {
    const json: TrendingPodcastResponse = await ky
      .get(url, {
        retry: 0,
        signal: abortController.signal,
        searchParams,
      })
      .json()
    return removeDuplicates(json)
    // eslint-disable-next-line
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.log("Aborted getTrendingPodcasts request")
    }
    return null
  }
}

function getTrendingSearchParams(
  params: TrendingPodcastSearchParams
): URLSearchParams {
  const searchParams = new URLSearchParams(`limit=${params.limit}`)
  if (params.since) {
    // convert to unix timestamp (in seconds)
    searchParams.append("since", "" + dayjs(params.since).unix())
  }
  return searchParams
}

function removeDuplicates(
  response: TrendingPodcastResponse
): TrendingPodcastResponse {
  const uniqueKeys = new Set()
  const uniqueEntries = []
  for (const entry of response.data) {
    const key = `${entry.title},${entry.author},${entry.image}`
    if (uniqueKeys.has(key)) {
      continue
    }
    uniqueKeys.add(key)
    uniqueEntries.push(entry)
  }
  return { count: uniqueEntries.length, data: uniqueEntries }
}

export { getTrendingPodcasts }

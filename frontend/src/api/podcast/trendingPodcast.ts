import ky from "ky"
import dayjs from "dayjs"
import { TrendingPodcast } from "./model/podcast.ts"
import { getEnv } from "../env/environmentVariables.ts"

export type TrendingPodcastSearchParams = {
  limit: number
  since?: Date
  category?: string
}

type TrendingPodcastResponse = {
  count: number
  data: TrendingPodcast[]
}

async function getTrendingPodcasts(
  abortController: AbortController,
  params: TrendingPodcastSearchParams
) {
  const { BACKEND_ORIGIN } = getEnv()
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
      return null
    }
    if (error.response && error.response.status === 429) {
      throw new Error(`Rate Limit Exceeded, please try again later`)
    }
    throw new Error(
      "Could not retrieve trending podcasts. Please try again later"
    )
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
  if (params.category) {
    searchParams.append("category", params.category)
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

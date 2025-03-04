import ky from "ky"
import { getEnv } from "../env/environmentVariables.ts"
import { Podcast } from "./model/podcast.ts"

type PodcastSearchParams = {
  q: string
  limit: number
  offset?: number
}

type PodcastSearchResponse = {
  count: number
  data: Podcast[]
}

async function getPodcastSearch(
  abortController: AbortController,
  params: PodcastSearchParams
) {
  const { BACKEND_ORIGIN } = getEnv()
  const url = BACKEND_ORIGIN + "/api/podcast/search"
  const searchParams = new URLSearchParams(
    `q=${params.q}&limit=${params.limit}`
  )
  if (params.offset) {
    searchParams.set("offset", `${params.offset}`)
  }
  try {
    const json: PodcastSearchResponse = await ky
      .get(url, { retry: 0, signal: abortController.signal, searchParams })
      .json()
    return removeDuplicates(json)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.name === "AbortError") {
      return null
    }
    if (error.response && error.response.status === 429) {
      throw new Error(`Rate Limit Exceeded, please try again later`)
    }
    throw new Error(
      "Could not retrieve podcasts by search term. Please try again later"
    )
  }
}

function removeDuplicates(response: PodcastSearchResponse) {
  const uniqueKeys = new Set<string>()
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

export { getPodcastSearch }

import ky from "ky"
import { Podcast, PodcastEpisode } from "./model/podcast.ts"
import { getEnv } from "../env/environmentVariables.ts"

type PodcastEpisodeSearchParams = {
  id: string
  limit: number
  offset?: number
}

type PodcastEpisodeResponse = {
  count: number
  data: {
    podcast: Podcast
    episodes: PodcastEpisode[]
  }
}

async function getPodcastEpisodes(
  abortController: AbortController,
  params: PodcastEpisodeSearchParams
) {
  const { BACKEND_ORIGIN } = getEnv()
  const url = BACKEND_ORIGIN + "/api/podcast/episodes"
  const searchParams = getPodcastEpisodeSearchParams(params)
  try {
    const json: PodcastEpisodeResponse = await ky
      .get(url, {
        retry: 0,
        signal: abortController.signal,
        searchParams,
      })
      .json()
    return json
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.name === "AbortError") {
      return null
    }
    if (error.response && error.response.status === 429) {
      throw new Error(`Rate Limit Exceeded, please try again later`)
    }
    throw new Error(
      "Could not retrieve podcast episodes. Please try again later"
    )
  }
}

function getPodcastEpisodeSearchParams(
  params: PodcastEpisodeSearchParams
): URLSearchParams {
  const searchParams = new URLSearchParams(
    `id=${params.id}&limit=${params.limit}`
  )
  if (params.offset) {
    searchParams.append("offset", "" + params.offset)
  }
  return searchParams
}

export { getPodcastEpisodes }

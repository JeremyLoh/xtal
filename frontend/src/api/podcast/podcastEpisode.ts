import ky from "ky"
import { Podcast, PodcastEpisode } from "./model/podcast.ts"

const BACKEND_ORIGIN = import.meta.env.VITE_BACKEND_ORIGIN

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
      console.log("Aborted getPodcastEpisodes request")
      return null
    }
    if (error.response && error.response.status === 429) {
      const timeoutInSeconds = error.response.headers.get("retry-after")
      throw new Error(
        `Rate Limit Exceeded, please try again after ${timeoutInSeconds} seconds`
      )
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

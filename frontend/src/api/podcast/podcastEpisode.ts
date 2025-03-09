import ky from "ky"
import { Podcast, PodcastEpisode } from "./model/podcast.ts"
import { getEnv } from "../env/environmentVariables.ts"

type PodcastEpisodesSearchParams = {
  id: string
  limit: number
  offset?: number
}
type PodcastEpisodesResponse = {
  count: number
  data: {
    podcast: Podcast
    episodes: PodcastEpisode[]
  }
}

type PodcastEpisodeSearchParams = {
  id: string // podcast episode id
}
type PodcastEpisodeResponse = {
  count: number
  data: PodcastEpisode | null
}

async function getPodcastEpisode(
  abortController: AbortController,
  params: PodcastEpisodeSearchParams
) {
  const { BACKEND_ORIGIN } = getEnv()
  const url = BACKEND_ORIGIN + "/api/podcast/episode"
  const searchParams = new URLSearchParams(`id=${params.id}`)
  try {
    const json: PodcastEpisodeResponse = await ky
      .get(url, { retry: 0, signal: abortController.signal, searchParams })
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
      "Could not retrieve podcast episode by episode id. Please try again later"
    )
  }
}

async function getPodcastEpisodes(
  abortController: AbortController,
  params: PodcastEpisodesSearchParams
): Promise<PodcastEpisodesResponse | null> {
  const { BACKEND_ORIGIN } = getEnv()
  const url = BACKEND_ORIGIN + "/api/podcast/episodes"
  const searchParams = getPodcastEpisodeSearchParams(params)
  try {
    const json: PodcastEpisodesResponse = await ky
      .get(url, {
        retry: 0,
        signal: abortController.signal,
        searchParams,
      })
      .json()
    return addMissingFeedTitleToEpisodes(json)
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
  params: PodcastEpisodesSearchParams
): URLSearchParams {
  const searchParams = new URLSearchParams(
    `id=${params.id}&limit=${params.limit}`
  )
  if (params.offset) {
    searchParams.append("offset", "" + params.offset)
  }
  return searchParams
}

function addMissingFeedTitleToEpisodes(json: PodcastEpisodesResponse) {
  // IMPORTANT: set podcast title in episode if not in response (to navigate to episode detail page)
  // missing feedTitle in the episodes data retrieved from backend endpoint "/api/podcast/episodes"
  return {
    ...json,
    data: {
      podcast: json.data.podcast,
      episodes: json.data.episodes.map((episode) => {
        return { ...episode, feedTitle: json.data.podcast.title }
      }),
    },
  }
}

export { getPodcastEpisode, getPodcastEpisodes }

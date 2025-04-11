import ky from "ky"
import dayjs from "dayjs"
import { PodcastEpisode } from "../../podcast/model/podcast.ts"
import { getEnv } from "../../env/environmentVariables.ts"
import { AccountPodcastEpisodePlayHistoryResponse } from "../accountPodcastHistory.ts"

export async function updateAccountPodcastEpisodePlayHistory(
  abortController: AbortController,
  episode: PodcastEpisode,
  resumePlayTimeInSeconds: number
) {
  const { BACKEND_ORIGIN } = getEnv()
  const backendUrl = BACKEND_ORIGIN + "/api/account/podcast-play-history"
  const data = {
    episodeId: episode.id,
    podcastId: episode.feedId,
    episodeTitle: episode.title,
    podcastTitle: episode.feedTitle,
    contentUrl: episode.contentUrl,
    durationInSeconds: episode.durationInSeconds,
    publishDateUnixTimestamp: dayjs.unix(episode.datePublished).toISOString(),
    isExplicit: episode.isExplicit,
    ...(episode.episodeNumber && { episodeNumber: episode.episodeNumber }),
    ...(episode.seasonNumber && { seasonNumber: episode.seasonNumber }),
    image: episode.image,
    language: episode.language,
    externalWebsiteUrl: episode.externalWebsiteUrl,
    resumePlayTimeInSeconds: resumePlayTimeInSeconds,
  }

  try {
    await ky.post(backendUrl, {
      json: data,
      retry: 0,
      signal: abortController.signal,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.name === "AbortError") {
      return null
    }
    if (error.response && error.response.status === 429) {
      throw new Error(
        `Update podcast episode play history Rate Limit Exceeded. Please try again later`
      )
    }
    throw new Error(
      `Could not update podcast episode play history. Please try again later. ${error.message}`
    )
  }
}

export async function getAccountPodcastEpisodePlayHistory(
  abortController: AbortController,
  limit: number,
  offset?: number
) {
  const { BACKEND_ORIGIN } = getEnv()
  const backendUrl = BACKEND_ORIGIN + "/api/account/podcast-play-history"
  const searchParams = new URLSearchParams(`limit=${limit}`)
  if (offset) {
    searchParams.append("offset", `${offset}`)
  }
  try {
    const response = await ky.get(backendUrl, {
      searchParams,
      retry: 0,
      signal: abortController.signal,
    })
    const json: AccountPodcastEpisodePlayHistoryResponse = await response.json()
    if (json.count === 0 || json.data == null) {
      return []
    }
    return json.data.map((entry) => {
      return {
        ...entry,
        lastPlayedTimestamp: dayjs(entry.lastPlayedTimestamp).toDate(),
      }
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.name === "AbortError") {
      return null
    }
    if (error.response && error.response.status === 429) {
      throw new Error(
        `Get podcast episode play history Rate Limit Exceeded. Please try again later`
      )
    }
    throw new Error(
      `Could not get podcast episode play history. Please try again later. ${error.message}`
    )
  }
}

export async function deleteAccountPodcastEpisodePlayHistory(
  abortController: AbortController,
  episodeId: string
) {
  const { BACKEND_ORIGIN } = getEnv()
  const backendUrl = BACKEND_ORIGIN + "/api/account/podcast-play-history"
  const data = { episodeId }
  try {
    await ky.delete(backendUrl, {
      json: data,
      retry: 0,
      signal: abortController.signal,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.name === "AbortError") {
      return null
    }
    if (error.response && error.response.status === 429) {
      throw new Error(
        `Delete podcast episode play history Rate Limit Exceeded. Please try again later`
      )
    }
    throw new Error(
      `Could not update podcast episode play history. Please try again later. ${error.message}`
    )
  }
}

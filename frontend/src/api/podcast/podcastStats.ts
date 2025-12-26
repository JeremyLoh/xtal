import ky from "ky"
import { getEnv } from "../env/environmentVariables.ts"

type CurrentPodcastStatsResponse = {
  totalPodcasts: number
  totalPodcastEpisodes: number
  episodesPublishedInLastThirtyDays: number
}

async function getCurrentPodcastStats(abortController: AbortController) {
  const { BACKEND_ORIGIN } = getEnv()
  const url = BACKEND_ORIGIN + "/api/podcast/stats/current"
  try {
    const json: CurrentPodcastStatsResponse = await ky
      .get(url, { retry: 0, signal: abortController.signal })
      .json()
    return json
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.name === "AbortError") {
      return null
    }
    if (error.response?.status === 429) {
      throw new Error(`Rate Limit Exceeded, please try again later`)
    }
    throw new Error(
      "Could not retrieve current podcast statistics. Please try again later"
    )
  }
}

export { getCurrentPodcastStats }
export type { CurrentPodcastStatsResponse }

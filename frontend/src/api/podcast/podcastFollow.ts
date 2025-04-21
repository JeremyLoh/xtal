import ky from "ky"
import { Podcast } from "./model/podcast.ts"
import { getEnv } from "../env/environmentVariables.ts"

async function getPodcastFollowStatusById(
  abortController: AbortController,
  podcastId: string
) {
  const { BACKEND_ORIGIN } = getEnv()
  const url = BACKEND_ORIGIN + "/api/podcast/follow"
  const searchParams = new URLSearchParams(`podcastId=${podcastId}`)
  try {
    const response = await ky.get(url, {
      searchParams,
      retry: 0,
      signal: abortController.signal,
    })
    const json: { isFollowing: boolean } = await response.json()
    return json.isFollowing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.name === "AbortError") {
      return null
    }
    if (error.response && error.response.status === 429) {
      throw new Error(
        `Podcast Check Follow History Rate Limit Exceeded, please try again later`
      )
    }
    throw new Error(
      "Could not check follow podcast history. Please try again later"
    )
  }
}

async function addPodcastFollow(
  abortController: AbortController,
  podcast: Podcast
) {
  const { BACKEND_ORIGIN } = getEnv()
  const url = BACKEND_ORIGIN + "/api/podcast/follow"
  const data = {
    podcastId: podcast.id,
    externalWebsiteUrl: podcast.url,
    title: podcast.title,
    author: podcast.author,
    image: podcast.image,
    language: podcast.language,
    categories: podcast.categories,
    ...(podcast.episodeCount && { episodeCount: podcast.episodeCount }),
    // publishDateUnixTimestamp is not commonly available in the Podcast type (from PodcastIndex API)
  }
  try {
    await ky.post(url, { json: data, retry: 0, signal: abortController.signal })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.name === "AbortError") {
      return null
    }
    if (error.response && error.response.status === 429) {
      throw new Error(
        `Podcast Follow Rate Limit Exceeded, please try again later`
      )
    }
    if (error.response) {
      const serverErrorMessage = await error.response.text()
      if (serverErrorMessage) {
        throw new Error(serverErrorMessage)
      }
    }
    throw new Error("Could not follow podcast. Please try again later")
  }
}

async function removePodcastFollow(
  abortController: AbortController,
  podcastId: string
) {
  const { BACKEND_ORIGIN } = getEnv()
  const url = BACKEND_ORIGIN + "/api/podcast/unfollow"
  const data = { podcastId }
  try {
    await ky.post(url, { json: data, retry: 0, signal: abortController.signal })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.name === "AbortError") {
      return null
    }
    if (error.response && error.response.status === 429) {
      throw new Error(
        `Podcast Unfollow Rate Limit Exceeded, please try again later`
      )
    }
    throw new Error("Could not unfollow podcast. Please try again later")
  }
}

export { getPodcastFollowStatusById, addPodcastFollow, removePodcastFollow }

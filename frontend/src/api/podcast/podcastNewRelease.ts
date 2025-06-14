import ky from "ky"
import { getEnv } from "../env/environmentVariables.ts"
import { Podcast } from "./model/podcast.ts"

type PodcastNewReleaseSearchParams = {
  limit: number
  lang?: string
}
type PodcastNewReleaseResponse = {
  count: number
  data: Partial<Podcast>[] | null
}

async function getNewReleasePodcasts(
  abortController: AbortController,
  params: PodcastNewReleaseSearchParams
): Promise<Podcast[] | null> {
  const { BACKEND_ORIGIN } = getEnv()
  const url = BACKEND_ORIGIN + "/api/podcast/recent"
  const exclude = "description"
  const searchParams = new URLSearchParams(
    `limit=${params.limit}&exclude=${exclude}`
  )
  if (params.lang) {
    searchParams.set("lang", params.lang)
  }
  try {
    const json: PodcastNewReleaseResponse = await ky
      .get(url, { retry: 0, signal: abortController.signal, searchParams })
      .json()
    return convertNewReleasePartialFieldsToEmptyString(json.data, exclude)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.name === "AbortError") {
      return null
    }
    if (error.response && error.response.status === 429) {
      throw new Error(`Rate Limit Exceeded, please try again later`)
    }
    throw new Error(
      "Could not retrieve recent podcasts. Please try again later"
    )
  }
}

function convertNewReleasePartialFieldsToEmptyString(
  podcasts: Partial<Podcast>[] | null,
  excludeField: keyof Podcast
): Podcast[] | null {
  if (podcasts) {
    return podcasts.map((p) => {
      return { ...p, [excludeField]: "" }
    }) as Podcast[]
  }
  return null
}

export { getNewReleasePodcasts }

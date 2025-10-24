import ky from "ky"
import { PodcastCategory } from "./model/podcast.ts"
import { getEnv } from "../env/environmentVariables.ts"

type PodcastCategoryResponse = {
  count: number
  data: PodcastCategory[]
}

async function getAllPodcastCategories(): Promise<PodcastCategory[] | null> {
  const { BACKEND_ORIGIN } = getEnv()
  const backendUrl = BACKEND_ORIGIN + "/api/podcast/category"
  try {
    const json: PodcastCategoryResponse = await ky
      .get(backendUrl, { retry: 0 })
      .json()
    return json.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.name === "AbortError") {
      return null
    }
    if (error.response && error.response.status === 429) {
      throw new Error(`Rate Limit Exceeded, please try again later`)
    }
    throw new Error(
      "Could not retrieve podcast categories. Please try again later"
    )
  }
}

export { getAllPodcastCategories }

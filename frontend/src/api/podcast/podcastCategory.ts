import ky from "ky"
import { PodcastCategory } from "./model/podcast.ts"

const BACKEND_ORIGIN = import.meta.env.VITE_BACKEND_ORIGIN

type PodcastCategoryResponse = {
  count: number
  data: PodcastCategory[]
}

async function getAllPodcastCategories(
  abortController: AbortController
): Promise<PodcastCategory[] | null> {
  const backendUrl = BACKEND_ORIGIN + "/api/podcast/category"
  try {
    const json: PodcastCategoryResponse = await ky
      .get(backendUrl, { retry: 0, signal: abortController.signal })
      .json()
    return json.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.log("Aborted getPodcastCategory request")
      return null
    }
    if (error.response && error.response.status === 429) {
      const timeoutInSeconds = error.response.headers.get("retry-after")
      throw new Error(
        `Rate Limit Exceeded, please try again after ${timeoutInSeconds} seconds`
      )
    }
    throw new Error(
      "Could not retrieve podcast categories. Please try again later"
    )
  }
}

export { getAllPodcastCategories }

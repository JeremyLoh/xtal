import ky from "ky"
import { getEnv } from "../../env/environmentVariables.ts"
import { Podcast } from "../model/podcast.ts"

export async function getAccountTotalFollowedPodcasts() {
  const { BACKEND_ORIGIN } = getEnv()
  const backendUrl = BACKEND_ORIGIN + "/api/account/podcast/following/total"
  try {
    const response = await ky.get(backendUrl, {
      retry: 0,
    })
    const json: { total: number } = await response.json()
    return json.total
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response && error.response.status === 429) {
      throw new Error(
        `Get account podcast following total count Rate Limit Exceeded. Please try again later`
      )
    }
    throw new Error(
      `Could not get account podcast following total count. Please try again later. ${error.message}`
    )
  }
}

export async function getAccountLatestFollowedPodcasts(
  limit: number,
  offset?: number
) {
  const { BACKEND_ORIGIN } = getEnv()
  const backendUrl = BACKEND_ORIGIN + "/api/account/podcast/following"
  const searchParams = new URLSearchParams(`limit=${limit}`)
  if (offset) {
    searchParams.append("offset", "" + offset)
  }
  try {
    const response = await ky.get(backendUrl, {
      retry: 0,
      searchParams,
    })
    const json: { count: number; data: Podcast[] } = await response.json()
    return json
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response && error.response.status === 429) {
      throw new Error(
        `Get account podcast following history Rate Limit Exceeded. Please try again later`
      )
    }
    throw new Error(
      `Could not get account podcast following history. Please try again later. ${error.message}`
    )
  }
}

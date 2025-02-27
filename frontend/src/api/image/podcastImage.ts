import ky from "ky"
import { getEnv } from "../env/environmentVariables.ts"

export async function getPodcastImage(
  abortController: AbortController,
  url: string,
  width: number,
  height: number
): Promise<string | null> {
  const { BACKEND_ORIGIN } = getEnv()
  const backendUrl = BACKEND_ORIGIN + "/api/podcast/image"
  try {
    const blob = await ky
      .post(backendUrl, {
        json: {
          url,
          width,
          height,
        },
        retry: 0,
        signal: abortController.signal,
      })
      .blob()
    // https://stackoverflow.com/questions/7650587/using-javascript-to-display-a-blob
    return URL.createObjectURL(blob)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.name === "AbortError") {
      return null
    }
    if (error.response && error.response.status === 429) {
      throw new Error(`Image Rate Limit Exceeded, please try again later`)
    }
    return null
  }
}

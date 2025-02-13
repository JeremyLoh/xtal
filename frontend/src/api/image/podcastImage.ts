import ky from "ky"

const BACKEND_ORIGIN = import.meta.env.VITE_BACKEND_ORIGIN

export async function getPodcastImage(
  abortController: AbortController,
  url: string,
  width: number,
  height: number
): Promise<string | null> {
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
      console.log("Aborted getPodcastImage request")
      return null
    }
    if (error.response && error.response.status === 429) {
      const timeoutInSeconds = error.response.headers.get("retry-after")
      throw new Error(
        `Image Rate Limit Exceeded, please try again after ${timeoutInSeconds} seconds`
      )
    }
    return null
  }
}

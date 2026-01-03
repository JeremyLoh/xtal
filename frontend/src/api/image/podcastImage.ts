import ky from "ky"
import { useQuery } from "@tanstack/react-query"
import { getEnv } from "../env/environmentVariables.ts"

export function usePodcastImage({
  url,
  width,
  height,
}: {
  url: string
  width: number
  height: number
}) {
  return useQuery({
    queryKey: ["podcast-image", { url, width, height }],
    queryFn: async ({ signal }) => {
      return await getPodcastImage(signal, url, width, height)
    },
    enabled: url != "",
  })
}

export async function getPodcastImage(
  abortSignal: AbortSignal,
  url: string,
  width: number,
  height: number
): Promise<string | null> {
  const { BACKEND_ORIGIN } = getEnv()
  const backendUrl = BACKEND_ORIGIN + "/api/podcast/image"
  const searchParams = new URLSearchParams(
    `url=${url}&width=${width}&height=${height}`
  )
  try {
    const blob = await ky
      .get(backendUrl, {
        searchParams,
        retry: 0,
        signal: abortSignal,
      })
      .blob()
    // https://stackoverflow.com/questions/7650587/using-javascript-to-display-a-blob
    return URL.createObjectURL(blob)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.name === "AbortError") {
      return null
    }
    if (error.response?.status === 429) {
      throw new Error(`Image Rate Limit Exceeded, please try again later`)
    }
    return null
  }
}

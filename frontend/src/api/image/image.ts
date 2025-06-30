import { getEnv } from "../env/environmentVariables.ts"

export function getArtworkMediaMetadata(imageUrl: string): MediaImage[] {
  const { BACKEND_ORIGIN } = getEnv()
  const width = 128
  const height = 128
  const searchParams = new URLSearchParams(
    `url=${imageUrl}&width=${width}&height=${height}`
  )
  return [
    {
      src: BACKEND_ORIGIN + `/api/podcast/image?${searchParams.toString()}`,
      sizes: `${width}x${height}`,
      type: "image/webp",
    },
  ]
}

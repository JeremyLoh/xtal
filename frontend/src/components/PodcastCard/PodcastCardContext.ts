import { createContext, useContext } from "react"
import { Podcast } from "../../api/podcast/model/podcast.ts"

type PodcastCardContext = {
  podcast: Podcast
}

export const PodcastCardContext = createContext<PodcastCardContext | null>(null)

export function usePodcastCardContext() {
  const context = useContext(PodcastCardContext)
  if (!context) {
    throw new Error("usePodcastCardContext must be used within a PodcastCard")
  }
  return context
}

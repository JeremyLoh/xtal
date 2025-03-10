import { createContext, RefObject, useContext } from "react"
import { PodcastEpisode } from "../../api/podcast/model/podcast"

type PodcastEpisodeContext = {
  episode: PodcastEpisode
  descriptionDivRef: RefObject<HTMLDivElement | null>
}

export const PodcastEpisodeCardContext =
  createContext<PodcastEpisodeContext | null>(null)

export function usePodcastEpisodeCardContext() {
  const context = useContext(PodcastEpisodeCardContext)
  if (!context) {
    throw new Error(
      "usePodcastEpisodeCardContext must be used within a PodcastEpisodeCard"
    )
  }
  return context
}

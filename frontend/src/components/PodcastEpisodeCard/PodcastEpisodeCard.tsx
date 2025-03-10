import "./PodcastEpisodeCard.css"
import { PropsWithChildren, useRef } from "react"
import DOMPurify from "dompurify"
import { PodcastEpisodeCardContext } from "./PodcastEpisodeCardContext.ts"
import { PodcastEpisode } from "../../api/podcast/model/podcast.ts"

export type PodcastEpisodeCardProps = PropsWithChildren & {
  episode: PodcastEpisode
}

export default function PodcastEpisodeCard({
  children,
  episode,
}: PodcastEpisodeCardProps) {
  const descriptionDivRef = useRef<HTMLDivElement | null>(null)
  const sanitizedEpisode = {
    ...episode,
    description: DOMPurify.sanitize(episode.description),
  }
  return (
    <PodcastEpisodeCardContext.Provider
      value={{ episode: sanitizedEpisode, descriptionDivRef }}
    >
      <div className="podcast-episode-card">{children}</div>
    </PodcastEpisodeCardContext.Provider>
  )
}

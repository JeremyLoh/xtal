import "./PodcastEpisodeCard.css"
import { memo, PropsWithChildren, useMemo, useRef } from "react"
import DOMPurify from "dompurify"
import { PodcastEpisodeCardContext } from "./PodcastEpisodeCardContext.ts"
import { PodcastEpisode } from "../../api/podcast/model/podcast.ts"

export type PodcastEpisodeCardProps = PropsWithChildren & {
  episode: PodcastEpisode
}

export default memo(function PodcastEpisodeCard({
  children,
  episode,
}: PodcastEpisodeCardProps) {
  const descriptionDivRef = useRef<HTMLDivElement | null>(null)
  const output = useMemo(() => {
    const sanitizedEpisode = {
      ...episode,
      description: DOMPurify.sanitize(episode.description),
    }
    return { episode: sanitizedEpisode, descriptionDivRef }
  }, [episode])

  return (
    <PodcastEpisodeCardContext.Provider value={output}>
      <div className="podcast-episode-card">{children}</div>
    </PodcastEpisodeCardContext.Provider>
  )
})

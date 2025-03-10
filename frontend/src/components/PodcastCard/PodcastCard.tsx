import "./PodcastCard.css"
import DOMPurify from "dompurify"
import { memo, PropsWithChildren, useMemo } from "react"
import { PodcastCardContext } from "./PodcastCardContext.ts"
import { Podcast } from "../../api/podcast/model/podcast.ts"

type PodcastCardProps = PropsWithChildren & {
  customClassName?: string
  podcast: Podcast
}

function PodcastCard({ children, customClassName, podcast }: PodcastCardProps) {
  const output = useMemo(() => {
    const sanitizedPodcast = {
      ...podcast,
      description: DOMPurify.sanitize(podcast.description),
    }
    return { podcast: sanitizedPodcast }
  }, [podcast])

  return (
    <PodcastCardContext.Provider value={output}>
      <div className={`podcast-card ${customClassName || ""}`.trim()}>
        {children}
      </div>
    </PodcastCardContext.Provider>
  )
}

export default memo(PodcastCard)
export type { PodcastCardProps }

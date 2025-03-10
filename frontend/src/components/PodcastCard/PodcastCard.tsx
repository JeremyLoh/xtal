import "./PodcastCard.css"
import DOMPurify from "dompurify"
import { PropsWithChildren } from "react"
import { PodcastCardContext } from "./PodcastCardContext.ts"
import { Podcast } from "../../api/podcast/model/podcast.ts"

type PodcastCardProps = PropsWithChildren & {
  customClassName?: string
  podcast: Podcast
}

function PodcastCard({ children, customClassName, podcast }: PodcastCardProps) {
  const sanitizedPodcast = {
    ...podcast,
    description: DOMPurify.sanitize(podcast.description),
  }
  return (
    <PodcastCardContext.Provider value={{ podcast: sanitizedPodcast }}>
      <div className={`podcast-card ${customClassName || ""}`.trim()}>
        {children}
      </div>
    </PodcastCardContext.Provider>
  )
}

export default PodcastCard
export type { PodcastCardProps }

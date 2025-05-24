import "./PodcastEpisodeCard.css"
import { memo, PropsWithChildren, useMemo, useRef } from "react"
import { AnimatePresence, motion } from "motion/react"
import { PodcastEpisodeCardContext } from "./PodcastEpisodeCardContext.ts"
import { PodcastEpisode } from "../../api/podcast/model/podcast.ts"
import { sanitizeHtmlString } from "../../api/dom/domSanitize.ts"

const podcastEpisodeCardInitial = { opacity: 0, x: 100 }
const podcastEpisodeCardAnimate = { opacity: 1, x: 0 }
const podcastEpisodeCardWhileInView = { opacity: 1, x: 0 }
const podcastEpisodeCardTransition = {
  duration: 0.5,
  type: "spring",
  bounce: 0,
}

export type PodcastEpisodeCardProps = PropsWithChildren & {
  episode: PodcastEpisode
}

function PodcastEpisodeCard({ children, episode }: PodcastEpisodeCardProps) {
  const descriptionDivRef = useRef<HTMLDivElement | null>(null)
  const output = useMemo(() => {
    const sanitizedEpisode = {
      ...episode,
      description: sanitizeHtmlString(episode.description),
    }
    return { episode: sanitizedEpisode, descriptionDivRef }
  }, [episode])

  return (
    <PodcastEpisodeCardContext.Provider value={output}>
      <AnimatePresence>
        <motion.div
          className="podcast-episode-card"
          initial={podcastEpisodeCardInitial}
          animate={podcastEpisodeCardAnimate}
          whileInView={podcastEpisodeCardWhileInView}
          transition={podcastEpisodeCardTransition}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </PodcastEpisodeCardContext.Provider>
  )
}

export default memo(PodcastEpisodeCard)

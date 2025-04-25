import "./PodcastEpisodeCard.css"
import { memo, PropsWithChildren, useMemo, useRef } from "react"
import { AnimatePresence, motion } from "motion/react"
import { PodcastEpisodeCardContext } from "./PodcastEpisodeCardContext.ts"
import { PodcastEpisode } from "../../api/podcast/model/podcast.ts"
import { sanitizeHtmlString } from "../../api/dom/domSanitize.ts"

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
      description: sanitizeHtmlString(episode.description),
    }
    return { episode: sanitizedEpisode, descriptionDivRef }
  }, [episode])

  return (
    <PodcastEpisodeCardContext.Provider value={output}>
      <AnimatePresence>
        <motion.div
          className="podcast-episode-card"
          layout
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </PodcastEpisodeCardContext.Provider>
  )
})

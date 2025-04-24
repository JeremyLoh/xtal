import "./PodcastEpisodeCard.css"
import { memo, PropsWithChildren, useMemo, useRef } from "react"
import { AnimatePresence, motion } from "motion/react"
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
      <AnimatePresence>
        <motion.div
          className="podcast-episode-card"
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </PodcastEpisodeCardContext.Provider>
  )
})

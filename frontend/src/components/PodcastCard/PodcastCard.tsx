import "./PodcastCard.css"
import DOMPurify from "dompurify"
import { memo, PropsWithChildren, useMemo } from "react"
import { AnimatePresence, motion } from "motion/react"
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
      <AnimatePresence>
        <motion.div
          className={`podcast-card ${customClassName || ""}`.trim()}
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </PodcastCardContext.Provider>
  )
}

export default memo(PodcastCard)
export type { PodcastCardProps }

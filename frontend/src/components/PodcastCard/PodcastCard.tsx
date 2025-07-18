import "./PodcastCard.css"
import { memo, PropsWithChildren, useMemo } from "react"
import { AnimatePresence, motion } from "motion/react"
import { PodcastCardContext } from "./PodcastCardContext.ts"
import { Podcast } from "../../api/podcast/model/podcast.ts"
import { sanitizeHtmlString } from "../../api/dom/domSanitize.ts"

type PodcastCardProps = PropsWithChildren & {
  customClassName?: string
  "data-testid"?: string
  podcast: Podcast
}

const initial = { opacity: 0, x: 50 }
const animate = { opacity: 1, x: 0 }
const whileInView = { opacity: 1, x: 0 }
const transition = { duration: 0.5, type: "spring", bounce: 0 }

function PodcastCard({
  children,
  customClassName,
  "data-testid": dataTestId,
  podcast,
}: PodcastCardProps) {
  const output = useMemo(() => {
    const sanitizedPodcast = {
      ...podcast,
      description: sanitizeHtmlString(podcast.description),
    }
    return { podcast: sanitizedPodcast }
  }, [podcast])

  return (
    <PodcastCardContext.Provider value={output}>
      <AnimatePresence>
        <motion.div
          {...(dataTestId && { "data-testid": dataTestId })}
          className="podcast-card"
          initial={initial}
          animate={animate}
          whileInView={whileInView}
          transition={transition}
        >
          <motion.div
            className={`podcast-card-content ${customClassName || ""}`.trim()}
          >
            {children}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </PodcastCardContext.Provider>
  )
}

export default memo(PodcastCard)
export type { PodcastCardProps }

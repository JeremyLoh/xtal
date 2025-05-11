import "./PodcastSearchResultList.css"
import { memo } from "react"
import { Link } from "react-router"
import { AnimatePresence, motion } from "motion/react"
import { Podcast } from "../../../../api/podcast/model/podcast.ts"
import { podcastDetailPage } from "../../../../paths.ts"

const linkStyle = { textDecoration: "none", width: "fit-content" }
const transition = { duration: 0.2, type: "spring", bounce: 0 }
const containerInitial = { opacity: 0 }
const containerAnimate = { opacity: 1 }
const containerExit = { opacity: 0 }
const itemInitial = { opacity: 0, x: 50 }
const itemAnimate = { opacity: 1, x: 0 }
const itemExit = { opacity: 0, x: 50 }

type PodcastSearchResultListProps = {
  results: Podcast[] | null
  showSearchResults: boolean
}

function PodcastSearchResultList({
  results,
  showSearchResults,
}: PodcastSearchResultListProps) {
  return (
    showSearchResults &&
    results &&
    results.length > 0 && (
      <AnimatePresence>
        <motion.div
          key="search-result-list-container"
          className="search-result-list-container"
          initial={containerInitial}
          animate={containerAnimate}
          exit={containerExit}
          transition={transition}
        >
          {results.map((data) => {
            const podcastDetailPageUrl = podcastDetailPage({
              podcastTitle: data.title,
              podcastId: `${data.id}`,
            })
            return (
              <motion.div
                key={`${data.id}-result-item`}
                initial={itemInitial}
                animate={itemAnimate}
                exit={itemExit}
                transition={transition}
              >
                <Link to={podcastDetailPageUrl} style={linkStyle}>
                  <p className="podcast-search-result-title">{data.title}</p>
                </Link>
                <p className="podcast-search-result-author">{data.author}</p>
                <hr />
              </motion.div>
            )
          })}
        </motion.div>
      </AnimatePresence>
    )
  )
}

export default memo(PodcastSearchResultList)

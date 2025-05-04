import "./PodcastSearchResultList.css"
import { memo } from "react"
import { Link } from "react-router"
import { AnimatePresence, motion } from "motion/react"
import { Podcast } from "../../../../api/podcast/model/podcast.ts"
import { podcastDetailPage } from "../../../../paths.ts"

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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, type: "spring", bounce: 0 }}
        >
          {results.map((data) => {
            const podcastDetailPageUrl = podcastDetailPage({
              podcastTitle: data.title,
              podcastId: `${data.id}`,
            })
            return (
              <motion.div
                key={`${data.id}-result-item`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3, type: "spring", bounce: 0 }}
              >
                <Link
                  to={podcastDetailPageUrl}
                  style={{ textDecoration: "none", width: "fit-content" }}
                >
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

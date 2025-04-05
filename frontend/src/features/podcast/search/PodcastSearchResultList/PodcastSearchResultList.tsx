import "./PodcastSearchResultList.css"
import { memo } from "react"
import { Link } from "react-router"
import { AnimatePresence, motion } from "motion/react"
import { Podcast } from "../../../../api/podcast/model/podcast.ts"

type PodcastSearchResultListProps = {
  results: Podcast[] | null
}

export default memo(function PodcastSearchResultList({
  results,
}: PodcastSearchResultListProps) {
  return (
    results &&
    results.length > 0 && (
      <AnimatePresence>
        <motion.div
          key="search-result-list-container"
          className="search-result-list-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {results.map((data) => {
            const podcastDetailPageUrl = `/podcasts/${encodeURIComponent(
              data.title
            )}/${data.id}`
            return (
              <motion.div key={`${data.id}-result-item`}>
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
})

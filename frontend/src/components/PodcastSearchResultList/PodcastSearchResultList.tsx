import "./PodcastSearchResultList.css"
import { memo } from "react"
import { motion } from "motion/react"
import { Podcast } from "../../api/podcast/model/podcast.ts"

type PodcastSearchResultListProps = {
  results: Podcast[] | null
}

export default memo(function PodcastSearchResultList({
  results,
}: PodcastSearchResultListProps) {
  return (
    results &&
    results.length > 0 && (
      <motion.div className="search-result-list-container">
        {results.map((data) => {
          return (
            <div key={`${data.id}-result-item`}>
              <p className="podcast-search-result-title">{data.title}</p>
              <p className="podcast-search-result-author">{data.author}</p>
              <hr />
            </div>
          )
        })}
      </motion.div>
    )
  )
})

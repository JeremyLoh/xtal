import { memo, useCallback } from "react"
import LoadingDisplay from "../../../../components/LoadingDisplay/LoadingDisplay.tsx"
import SearchBar from "../../../../components/SearchBar/SearchBar.tsx"
import PodcastSearchResultList from "../PodcastSearchResultList/PodcastSearchResultList.tsx"
import usePodcastSearch from "../../../../hooks/podcast/usePodcastSearch.ts"

function PodcastSearchSection() {
  const {
    loading: loadingSearchPodcasts,
    podcasts: searchPodcasts,
    fetchPodcastsBySearchQuery,
  } = usePodcastSearch()

  const handlePodcastSearch = useCallback(
    async (query: string) => {
      const podcastSearchLimit = 10
      fetchPodcastsBySearchQuery(query, podcastSearchLimit)
    },
    [fetchPodcastsBySearchQuery]
  )

  return (
    <div>
      <SearchBar
        className="podcast-search-bar"
        placeholder="Search Podcasts..."
        onChange={handlePodcastSearch}
      />
      <LoadingDisplay loading={loadingSearchPodcasts}>
        <PodcastSearchResultList results={searchPodcasts} />
      </LoadingDisplay>
    </div>
  )
}

export default memo(PodcastSearchSection)

import { memo, useCallback } from "react"
import { useNavigate } from "react-router"
import LoadingDisplay from "../../../../components/LoadingDisplay/LoadingDisplay.tsx"
import SearchBar from "../../../../components/SearchBar/SearchBar.tsx"
import PodcastSearchResultList from "../PodcastSearchResultList/PodcastSearchResultList.tsx"
import usePodcastSearch from "../../../../hooks/podcast/usePodcastSearch.ts"
import { podcastSearchPage } from "../../../../paths.ts"

function PodcastSearchSection() {
  const navigate = useNavigate()
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

  const handlePodcastSearchPage = useCallback(
    async (query: string) => {
      if (query.trim() === "") {
        return
      }
      navigate(podcastSearchPage(query.trim()))
    },
    [navigate]
  )

  return (
    <div>
      <SearchBar
        className="podcast-search-bar"
        placeholder="Search Podcasts..."
        onChange={handlePodcastSearch}
        onEnterSearch={handlePodcastSearchPage}
      />
      <LoadingDisplay loading={loadingSearchPodcasts}>
        <PodcastSearchResultList results={searchPodcasts} />
      </LoadingDisplay>
    </div>
  )
}

export default memo(PodcastSearchSection)

import { memo, useCallback, useState } from "react"
import { useNavigate } from "react-router"
import LoadingDisplay from "../../../../components/LoadingDisplay/LoadingDisplay.tsx"
import SearchBar from "../../../../components/SearchBar/SearchBar.tsx"
import PodcastSearchResultList from "../PodcastSearchResultList/PodcastSearchResultList.tsx"
import useClickOutside from "../../../../hooks/useClickOutside.ts"
import usePodcastSearch from "../../../../hooks/podcast/usePodcastSearch.ts"
import { podcastSearchPage } from "../../../../paths.ts"

function PodcastSearchSection() {
  const navigate = useNavigate()
  const {
    loading: loadingSearchPodcasts,
    podcasts: searchPodcasts,
    fetchPodcastsBySearchQuery,
  } = usePodcastSearch()
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false)
  const handleClickOutsideSearchBox = useCallback(() => {
    setShowSearchResults(false)
  }, [])
  const clickOutsideRef = useClickOutside<HTMLDivElement>({
    onClickOutside: handleClickOutsideSearchBox,
  })

  const handlePodcastSearch = useCallback(
    async (query: string) => {
      const podcastSearchLimit = 10
      fetchPodcastsBySearchQuery({ query: query, limit: podcastSearchLimit })
      setShowSearchResults(true)
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
    <div ref={clickOutsideRef}>
      <SearchBar
        className="podcast-search-bar"
        placeholder="Search Podcasts..."
        maxLength={200}
        onChange={handlePodcastSearch}
        onEnterSearch={handlePodcastSearchPage}
      />
      <LoadingDisplay loading={loadingSearchPodcasts}>
        <PodcastSearchResultList
          results={searchPodcasts}
          showSearchResults={showSearchResults}
        />
      </LoadingDisplay>
    </div>
  )
}

export default memo(PodcastSearchSection)

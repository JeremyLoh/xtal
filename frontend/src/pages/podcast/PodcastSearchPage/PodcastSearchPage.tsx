import "./PodcastSearchPage.css"
import { useCallback, useEffect } from "react"
import { useSearchParams } from "react-router"
import LoadingDisplay from "../../../components/LoadingDisplay/LoadingDisplay.tsx"
import usePodcastSearch from "../../../hooks/podcast/usePodcastSearch.ts"
import PodcastSearchResultSection from "../../../features/podcast/search/PodcastSearchResultSection/PodcastSearchResultSection.tsx"
import PodcastSearchSection from "../../../features/podcast/search/PodcastSearchSection/PodcastSearchSection.tsx"

const LIMIT = 10

export default function PodcastSearchPage() {
  const [searchParams] = useSearchParams()
  const {
    loading: loadingPodcasts,
    podcasts,
    fetchPodcastsBySearchQuery,
    fetchMorePodcasts,
  } = usePodcastSearch()

  const handleLoadMorePodcasts = useCallback(async () => {
    if (!searchParams.has("q") || podcasts == null) {
      return
    }
    const query = searchParams.get("q")
    if (query == null || query.trim() === "") {
      return
    }
    fetchMorePodcasts({ query: query.trim(), limit: LIMIT })
  }, [searchParams, podcasts, fetchMorePodcasts])

  useEffect(() => {
    if (!searchParams.has("q")) {
      return
    }
    const query = searchParams.get("q")
    document.title = `Showing results for ${query} - xtal - podcasts`
  }, [searchParams])

  useEffect(() => {
    if (!searchParams.has("q")) {
      return
    }
    const query = searchParams.get("q")
    if (query == null || query.trim() === "") {
      return
    }
    fetchPodcastsBySearchQuery({ query: query.trim(), limit: LIMIT })
  }, [searchParams, fetchPodcastsBySearchQuery])

  return (
    <div id="podcast-search-page-container">
      {/* place LoadingDisplay standalone to prevent re-render of virtualized list */}
      <LoadingDisplay loading={loadingPodcasts} />
      {searchParams.has("q") && (
        <div>
          Showing results for{" "}
          <span className="podcast-search-query-text">
            {searchParams.get("q")}
          </span>
        </div>
      )}
      <PodcastSearchSection />
      <PodcastSearchResultSection
        podcasts={podcasts || []}
        onLoadMorePodcasts={handleLoadMorePodcasts}
      />
    </div>
  )
}

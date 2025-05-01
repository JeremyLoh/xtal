import "./PodcastSearchPage.css"
import { useEffect } from "react"
import { useSearchParams } from "react-router"
import LoadingDisplay from "../../../components/LoadingDisplay/LoadingDisplay.tsx"
import usePodcastSearch from "../../../hooks/podcast/usePodcastSearch.ts"
import PodcastSearchResultSection from "../../../features/podcast/search/PodcastSearchResultSection/PodcastSearchResultSection.tsx"

const LIMIT = 10

export default function PodcastSearchPage() {
  const [searchParams] = useSearchParams()
  const { loading, podcasts, fetchPodcastsBySearchQuery } = usePodcastSearch()

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
    fetchPodcastsBySearchQuery(query.trim(), LIMIT)
  }, [searchParams, fetchPodcastsBySearchQuery])

  return (
    <div id="podcast-search-page-container">
      {searchParams.has("q") && (
        <p>
          Showing results for{" "}
          <span className="podcast-search-query-text">
            {searchParams.get("q")}
          </span>
        </p>
      )}
      <LoadingDisplay loading={loading}>
        <PodcastSearchResultSection podcasts={podcasts} />
      </LoadingDisplay>
    </div>
  )
}

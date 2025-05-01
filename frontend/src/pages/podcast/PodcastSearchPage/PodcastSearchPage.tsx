import "./PodcastSearchPage.css"
import { useEffect } from "react"
import { useSearchParams } from "react-router"
import LoadingDisplay from "../../../components/LoadingDisplay/LoadingDisplay.tsx"
import usePodcastSearch from "../../../hooks/podcast/usePodcastSearch.ts"

export default function PodcastSearchPage() {
  const [searchParams] = useSearchParams()
  const { loading } = usePodcastSearch()

  useEffect(() => {
    if (!searchParams.has("q")) {
      return
    }
    const query = searchParams.get("q")
    document.title = `Showing results for ${query} - xtal - podcasts`
  }, [searchParams])

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
      <LoadingDisplay loading={loading}></LoadingDisplay>
    </div>
  )
}

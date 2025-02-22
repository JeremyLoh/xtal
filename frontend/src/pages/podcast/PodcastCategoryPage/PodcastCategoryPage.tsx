import "./PodcastCategoryPage.css"
import { useCallback, useEffect, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import dayjs from "dayjs"
import { toast } from "sonner"
import { IoArrowBackSharp } from "react-icons/io5"
import TrendingPodcastSection from "../../../features/podcast/trending/components/TrendingPodcastSection/TrendingPodcastSection.tsx"
import { TrendingPodcast } from "../../../api/podcast/model/podcast.ts"
import { getTrendingPodcasts } from "../../../api/podcast/trendingPodcast.ts"
import Spinner from "../../../components/Spinner/Spinner.tsx"

const DEFAULT_SINCE_DAYS = 3

function convertToDate(daysBefore: number): Date {
  return dayjs().startOf("day").subtract(daysBefore, "days").toDate()
}

export default function PodcastCategoryPage() {
  const { categoryName } = useParams()
  const navigate = useNavigate()

  const abortControllerTrending = useRef<AbortController | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [sinceDaysBefore, setSinceDaysBefore] =
    useState<number>(DEFAULT_SINCE_DAYS)
  const [trendingPodcasts, setTrendingPodcasts] = useState<
    TrendingPodcast[] | null
  >(null)

  const getPodcasts = useCallback(
    async (since: Date) => {
      setLoading(true)
      abortControllerTrending.current?.abort()
      abortControllerTrending.current = new AbortController()
      try {
        const params = {
          limit: 10,
          since: since,
          category: categoryName,
        }
        const podcasts = await getTrendingPodcasts(
          abortControllerTrending.current,
          params
        )
        if (podcasts && podcasts.data) {
          setTrendingPodcasts(podcasts.data)
        } else {
          setTrendingPodcasts(null)
          setLoading(false) // prevent infinite load on no data
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error.message)
        setLoading(false) // prevent infinite load on error
      }
    },
    [categoryName]
  )

  useEffect(() => {
    if (!categoryName) {
      return
    }
    document.title = `xtal - ${decodeURIComponent(
      categoryName
    ).toLowerCase()} podcasts`
    getPodcasts(convertToDate(sinceDaysBefore))
    return () => {
      abortControllerTrending.current?.abort()
    }
  }, [getPodcasts, categoryName, sinceDaysBefore])

  useEffect(() => {
    // update loading state to false after set state has been run on the trending podcasts
    // prevents display of "no podcasts available" element due to trendingPodcasts = null, and loading = false
    if (trendingPodcasts) {
      setLoading(false)
    }
  }, [trendingPodcasts])

  async function handlePodcastRefresh(
    filters: {
      since: number
      category?: string
    } | null
  ) {
    if (filters == null) {
      await getPodcasts(convertToDate(DEFAULT_SINCE_DAYS))
    } else {
      const { since } = filters
      setSinceDaysBefore(since)
      await getPodcasts(convertToDate(since))
    }
  }

  function renderPodcasts() {
    if (!categoryName) {
      navigate("/404")
      return
    }
    return (
      <>
        <Spinner isLoading={loading} />
        <Link
          to="/podcasts"
          style={{ textDecoration: "none", width: "fit-content" }}
        >
          <button className="podcast-category-back-button">
            <IoArrowBackSharp size={16} />
            Back
          </button>
        </Link>
        <h2 className="podcast-category-title">
          {decodeURIComponent(categoryName)}
        </h2>
        <TrendingPodcastSection
          loading={loading}
          trendingPodcasts={trendingPodcasts}
          onRefresh={handlePodcastRefresh}
        />
      </>
    )
  }

  return <div className="podcast-category-container">{renderPodcasts()}</div>
}

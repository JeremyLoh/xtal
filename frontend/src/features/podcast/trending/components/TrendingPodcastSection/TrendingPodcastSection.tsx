import "./TrendingPodcastSection.css"
import dayjs from "dayjs"
import { toast } from "sonner"
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import { IoChevronForward, IoReload } from "react-icons/io5"
import { TrendingPodcast } from "../../../../../api/podcast/model/podcast"
import PodcastCard from "../../../../../components/PodcastCard/PodcastCard"
import useScreenDimensions from "../../../../../hooks/useScreenDimensions"
import {
  getTrendingPodcasts,
  TrendingPodcastSearchParams,
} from "../../../../../api/podcast/trendingPodcast"
import Spinner from "../../../../../components/Spinner/Spinner"

type TrendingPodcastSectionProps = {
  category?: string
}

export default function TrendingPodcastSection(
  props: TrendingPodcastSectionProps
) {
  const abortControllerRef = useRef<AbortController | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [sinceDays, setSinceDays] = useState<number>(3)
  const [trendingPodcasts, setTrendingPodcasts] = useState<
    TrendingPodcast[] | null
  >(null)
  const { isMobile } = useScreenDimensions()

  useEffect(() => {
    updateTrendingPodcasts(sinceDays)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function getSearchParams(since: Date) {
    const params: TrendingPodcastSearchParams = {
      limit: 10,
      since: since,
    }
    if (props.category) {
      params.category = props.category
    }
    return params
  }

  async function fetchTrendingPodcasts(since: Date) {
    abortControllerRef?.current?.abort()
    abortControllerRef.current = new AbortController()
    try {
      const podcasts = await getTrendingPodcasts(
        abortControllerRef.current,
        getSearchParams(since)
      )
      return podcasts && podcasts.data ? podcasts.data : null
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message)
    }
    return null
  }

  async function handleRefreshTrendingPodcasts() {
    await updateTrendingPodcasts(sinceDays)
  }

  async function handleSinceChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    const newSinceDays = Number.parseInt(event.target.value)
    setSinceDays(newSinceDays)
    await updateTrendingPodcasts(newSinceDays)
  }

  function convertToDate(daysBefore: number): Date {
    return dayjs().startOf("day").subtract(daysBefore, "days").toDate()
  }

  async function updateTrendingPodcasts(daysBefore: number) {
    setLoading(true)
    const podcasts = await fetchTrendingPodcasts(convertToDate(daysBefore))
    if (podcasts && podcasts.length > 0) {
      setTrendingPodcasts(podcasts)
    } else {
      setTrendingPodcasts(null)
    }
    setLoading(false)
  }

  function getPodcastDetailPath(podcast: TrendingPodcast) {
    return `/podcasts/${encodeURIComponent(podcast.title)}/${podcast.id}`
  }

  return (
    <div className="podcast-trending-container">
      <Spinner isLoading={loading} />
      <h2 className="podcast-trending-title">
        Trending
        <IoChevronForward size={20} />
        <label>
          Since
          <select
            className="podcast-trending-since-select"
            name="podcast-trending-since"
            defaultValue={sinceDays}
            onChange={handleSinceChange}
          >
            <option value="1">Last 24 hours</option>
            <option value="3">Last 72 hours</option>
            <option value="7">Last Week</option>
          </select>
        </label>
      </h2>
      <div className="podcast-trending-card-container">
        {trendingPodcasts == null ? (
          <div>
            <p>Zero podcasts found. Please try again later</p>
            <button
              onClick={handleRefreshTrendingPodcasts}
              className="refresh-trending-podcasts-btn"
              aria-label="refresh trending podcasts"
              title="refresh trending podcasts"
            >
              <IoReload size={20} /> Refresh
            </button>
          </div>
        ) : (
          trendingPodcasts.map((podcast) => (
            <PodcastCard
              key={podcast.id}
              customClassName="podcast-trending-card"
              podcast={podcast}
            >
              <PodcastCard.Artwork size={isMobile ? 144 : 200} />
              <Link
                to={getPodcastDetailPath(podcast)}
                className="podcast-trending-card-detail-link"
              >
                <PodcastCard.TitleAndAuthor />
              </Link>
            </PodcastCard>
          ))
        )}
      </div>
    </div>
  )
}

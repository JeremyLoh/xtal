import "./TrendingPodcastSection.css"
import { toast } from "sonner"
import { useEffect, useRef, useState } from "react"
import { IoChevronForward, IoReload } from "react-icons/io5"
import { TrendingPodcast } from "../../../../../api/podcast/model/podcast"
import PodcastCard from "../../../../../components/PodcastCard/PodcastCard"
import useScreenDimensions from "../../../../../hooks/useScreenDimensions"
import { getTrendingPodcasts } from "../../../../../api/podcast/trendingPodcast"

export default function TrendingPodcastSection() {
  const abortControllerRef = useRef<AbortController | null>(null)
  const [trendingPodcasts, setTrendingPodcasts] = useState<
    TrendingPodcast[] | null
  >(null)
  const { isMobile } = useScreenDimensions()

  useEffect(() => {
    fetchTrendingPodcasts().then((podcasts) => {
      if (podcasts && podcasts.length > 0) {
        setTrendingPodcasts(podcasts)
      } else {
        setTrendingPodcasts(null)
      }
    })
  }, [])

  async function fetchTrendingPodcasts() {
    abortControllerRef?.current?.abort()
    abortControllerRef.current = new AbortController()
    try {
      const podcasts = await getTrendingPodcasts(abortControllerRef.current, {
        limit: 10,
      })
      return podcasts && podcasts.data ? podcasts.data : null
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message)
    }
    return null
  }

  async function handleRefreshTrendingPodcasts() {
    const podcasts = await fetchTrendingPodcasts()
    if (podcasts && podcasts.length > 0) {
      setTrendingPodcasts(podcasts)
    } else {
      setTrendingPodcasts(null)
    }
  }

  return (
    <div className="podcast-trending-container">
      <h2 className="podcast-trending-title">
        Trending
        <IoChevronForward size={20} />
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
              <PodcastCard.TitleAndAuthor />
            </PodcastCard>
          ))
        )}
      </div>
    </div>
  )
}

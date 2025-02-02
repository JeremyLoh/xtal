import "./PodcastHomePage.css"
import { useEffect, useRef, useState } from "react"
import { IoChevronForward } from "react-icons/io5"
import { TrendingPodcast } from "../../../api/podcast/model/podcast"
import { getTrendingPodcasts } from "../../../api/podcast/trendingPodcast"

export default function PodcastHomePage() {
  const abortControllerRef = useRef<AbortController | null>(null)
  const [trendingPodcasts, setTrendingPodcasts] = useState<
    TrendingPodcast[] | null
  >(null)
  useEffect(() => {
    document.title = "xtal - podcasts"
    fetchTrendingPodcasts().then((podcasts) => {
      if (podcasts) {
        setTrendingPodcasts(podcasts)
      }
    })
  }, [])

  async function fetchTrendingPodcasts() {
    abortControllerRef?.current?.abort()
    abortControllerRef.current = new AbortController()
    const podcasts = await getTrendingPodcasts(abortControllerRef.current, {
      limit: 10,
    })
    return podcasts?.data
  }
  return (
    <div id="podcast-home-page-container">
      <div className="podcast-trending-container">
        <h2 className="podcast-trending-title">
          Trending
          <IoChevronForward size={20} />
        </h2>
        {trendingPodcasts &&
          // TODO refactor to a PodcastCard compound component
          trendingPodcasts.map((podcast) => {
            return (
              <div key={podcast.id} className="podcast-trending-card">
                {podcast.image && (
                  <img
                    src={podcast.image}
                    height={144}
                    width={144}
                    title={podcast.title + " podcast image"}
                  />
                )}
                <p>{podcast.title}</p>
                <p>{podcast.author}</p>
              </div>
            )
          })}
      </div>
    </div>
  )
}

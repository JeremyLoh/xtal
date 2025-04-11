import "./ProfileHistoryPage.css"
import { useEffect, useState } from "react"
import LoadingDisplay from "../../components/LoadingDisplay/LoadingDisplay.tsx"
import usePlayHistory, {
  PlayHistoryPodcastEpisode,
} from "../../hooks/podcast/usePlayHistory.ts"
import PodcastEpisodeCard from "../../components/PodcastEpisodeCard/index.tsx"

const IMAGE_LAZY_LOAD_START_INDEX = 2

function ProfileHistoryPage() {
  const { session, loading, getPlayedPodcastEpisodes } = usePlayHistory()
  const [episodes, setEpisodes] = useState<PlayHistoryPodcastEpisode[] | null>(
    null
  )

  useEffect(() => {
    document.title = "xtal - profile - history"
  }, [])

  useEffect(() => {
    if (session.loading) {
      return
    }
    const limit = 10
    getPlayedPodcastEpisodes(limit).then((data) => {
      if (data) {
        setEpisodes(data)
      }
    })
  }, [session, getPlayedPodcastEpisodes])

  return (
    <div className="profile-history-page-container">
      <h2 className="profile-history-page-title">Profile History</h2>
      <h3 className="profile-history-page-title">Podcast Listen History</h3>
      <LoadingDisplay loading={loading}>
        {episodes ? (
          <div className="profile-history-podcast-episodes-container">
            {episodes.map((data, index) => {
              const episode = data.podcastEpisode
              const podcastTitle = episode.feedTitle
              const podcastId = episode.feedId
              return (
                <div className="profile-history-podcast-listen-history-item">
                  <span className="profile-history-podcast-listen-history-count">
                    {index + 1}
                  </span>
                  <PodcastEpisodeCard key={episode.id} episode={episode}>
                    <PodcastEpisodeCard.Artwork
                      size={144}
                      title={`${episode.title} podcast image`}
                      lazyLoad={index >= IMAGE_LAZY_LOAD_START_INDEX}
                    />
                    <PodcastEpisodeCard.Title
                      url={`/podcasts/${podcastTitle}/${podcastId}/${episode.id}`}
                    />
                    <PodcastEpisodeCard.PublishDate />
                    <PodcastEpisodeCard.Duration />
                    <PodcastEpisodeCard.ExplicitIndicator />
                    <PodcastEpisodeCard.EpisodeWebsiteLink />
                    <PodcastEpisodeCard.EpisodeNumber />
                    <PodcastEpisodeCard.SeasonNumber />
                  </PodcastEpisodeCard>
                  <span>
                    Last Played on {data.lastPlayedTimestamp.toDateString()}
                  </span>
                </div>
              )
            })}
          </div>
        ) : (
          <p>Not available. Start listening to some podcasts!</p>
        )}
      </LoadingDisplay>
    </div>
  )
}

export default ProfileHistoryPage

import "./PodcastPlayer.css"
import { lazy, memo, useCallback, useContext } from "react"
import { Link } from "react-router"
import dayjs from "dayjs"
import { PodcastEpisodeContext } from "../../../context/PodcastEpisodeProvider/PodcastEpisodeProvider.tsx"
import AudioPlayer from "../../../components/AudioPlayer/AudioPlayer.tsx"
import { PodcastEpisode } from "../../../api/podcast/model/podcast.ts"
import usePlayHistory from "../../../hooks/podcast/usePlayHistory.ts"
const Pill = lazy(() => import("../../../components/Pill/Pill.tsx"))
const PodcastImage = lazy(
  () => import("../../../components/PodcastImage/PodcastImage.tsx")
)

function getDateFormat(unixTimestampInSeconds: number): string {
  return dayjs.unix(unixTimestampInSeconds).format("MMMM D, YYYY")
}

function getEpisodeDetailPageUrl(episode: PodcastEpisode) {
  if (episode == null) {
    return ""
  }
  return `/podcasts/${episode.feedTitle}/${episode.feedId}/${episode.id}`
}

export default memo(function PodcastPlayer() {
  const { session, updatePlayPodcastEpisodeTime } = usePlayHistory()
  const podcastEpisodeContext = useContext(PodcastEpisodeContext)
  const episode = podcastEpisodeContext?.episode
  const handlePause = useCallback(
    async (currentTimeInSeconds: number) => {
      if (session.loading) {
        return
      }
      if (!session.doesSessionExist || !episode) {
        return
      }
      await updatePlayPodcastEpisodeTime(episode, currentTimeInSeconds)
    },
    [session, episode, updatePlayPodcastEpisodeTime]
  )
  const handleEnded = useCallback(
    async (currentTimeInSeconds: number) => {
      if (session.loading) {
        return
      }
      if (!session.doesSessionExist || !episode) {
        return
      }
      await updatePlayPodcastEpisodeTime(episode, currentTimeInSeconds)
    },
    [session, episode, updatePlayPodcastEpisodeTime]
  )
  return (
    <div className="podcast-player">
      <AudioPlayer
        source={episode ? episode.contentUrl : ""}
        onPause={handlePause}
        onEnded={handleEnded}
      >
        {episode && (
          <div className="podcast-play-episode-container">
            <PodcastImage
              imageUrl={episode.image}
              size={96}
              imageClassName="podcast-play-episode-artwork"
              imageTitle={episode.title + " podcast image"}
              imageNotAvailableTitle="Podcast Play Episode Artwork Not Available"
            />
            <div className="podcast-play-episode-info">
              <Link
                to={getEpisodeDetailPageUrl(episode)}
                style={{ textDecoration: "none", width: "fit-content" }}
              >
                <p className="podcast-play-episode-title">{episode.title}</p>
              </Link>
              <p className="podcast-play-episode-date">
                {getDateFormat(episode.datePublished)}
              </p>
              {episode.episodeNumber && (
                <Pill className="podcast-play-episode-number">{`Episode ${episode.episodeNumber}`}</Pill>
              )}
            </div>
          </div>
        )}
      </AudioPlayer>
    </div>
  )
})

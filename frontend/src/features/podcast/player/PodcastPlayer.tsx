import "./PodcastPlayer.css"
import { lazy, memo, useCallback, useContext } from "react"
import { Link } from "react-router"
import dayjs from "dayjs"
import { PodcastEpisodeContext } from "../../../context/PodcastEpisodeProvider/PodcastEpisodeProvider.tsx"
import AudioPlayer from "../../../components/AudioPlayer/AudioPlayer.tsx"
import usePlayHistory from "../../../hooks/podcast/usePlayHistory.ts"
import { podcastEpisodeDetailPage } from "../../../paths.ts"
const Pill = lazy(() => import("../../../components/Pill/Pill.tsx"))
const PodcastImage = lazy(
  () => import("../../../components/PodcastImage/PodcastImage.tsx")
)

function getDateFormat(unixTimestampInSeconds: number): string {
  return dayjs.unix(unixTimestampInSeconds).format("MMMM D, YYYY")
}

function PodcastPlayer() {
  const { updatePlayPodcastEpisodeTime } = usePlayHistory()
  const podcastEpisodeContext = useContext(PodcastEpisodeContext)
  const episode = podcastEpisodeContext?.episode
  const lastPlayedTimestamp = podcastEpisodeContext?.lastPlayedTimestamp

  const handlePause = useCallback(
    async (currentTimeInSeconds: number) => {
      if (!episode) {
        return
      }
      await updatePlayPodcastEpisodeTime(episode, currentTimeInSeconds)
    },
    [episode, updatePlayPodcastEpisodeTime]
  )
  const handleEnded = useCallback(
    async (currentTimeInSeconds: number) => {
      if (!episode) {
        return
      }
      await updatePlayPodcastEpisodeTime(episode, currentTimeInSeconds)
    },
    [episode, updatePlayPodcastEpisodeTime]
  )
  return (
    <div className="podcast-player">
      <AudioPlayer
        source={episode ? episode.contentUrl : ""}
        onPause={handlePause}
        onEnded={handleEnded}
        playFromTimestamp={lastPlayedTimestamp || 0}
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
                to={podcastEpisodeDetailPage({
                  podcastTitle: episode.feedTitle || "",
                  podcastId: `${episode.feedId}`,
                  episodeId: `${episode.id}`,
                })}
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
}

export default memo(PodcastPlayer)

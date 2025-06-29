import "./PodcastPlayer.css"
import { lazy, memo, useCallback, useContext, useMemo, useState } from "react"
import { MdOutlineExpandLess, MdOutlineExpandMore } from "react-icons/md"
import { Link } from "react-router"
import dayjs from "dayjs"
import {
  PodcastEpisodeContext,
  PodcastEpisodeTimestampContext,
} from "../../../context/PodcastEpisodeProvider/PodcastEpisodeProvider.tsx"
import AudioPlayer from "../../../components/AudioPlayer/AudioPlayer.tsx"
import Button from "../../../components/ui/button/Button.tsx"
import usePlayHistory from "../../../hooks/podcast/usePlayHistory.ts"
import { podcastEpisodeDetailPage } from "../../../paths.ts"
const Pill = lazy(() => import("../../../components/Pill/Pill.tsx"))
const PodcastImage = lazy(
  () => import("../../../components/PodcastImage/PodcastImage.tsx")
)

function getDateFormat(unixTimestampInSeconds: number): string {
  return dayjs.unix(unixTimestampInSeconds).format("MMMM D, YYYY")
}

const linkStyle = { textDecoration: "none", width: "fit-content" }

function PodcastPlayer() {
  const [isExpanded, setIsExpanded] = useState<boolean>(true)
  const { updatePlayPodcastEpisodeTime } = usePlayHistory()
  const podcastEpisodeContext = useContext(PodcastEpisodeContext)
  const podcastEpisodeTimestampContext = useContext(
    PodcastEpisodeTimestampContext
  )
  const episode = podcastEpisodeContext?.episode
  const lastPlayedTimestamp =
    podcastEpisodeTimestampContext?.lastPlayedTimestamp
  const episodeAudioMetadata: MediaMetadataInit = useMemo(() => {
    if (episode) {
      return {
        title: episode.title || "",
        artist: episode.feedTitle || "",
      }
    }
    return {}
  }, [episode])

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
  const handleMinimizePlayerClick = useCallback(() => {
    setIsExpanded(false)
  }, [])
  const handleExpandPlayerClick = useCallback(() => {
    setIsExpanded(true)
  }, [])
  return (
    <div className="podcast-player">
      <AudioPlayer
        source={episode ? episode.contentUrl : ""}
        onPause={handlePause}
        onEnded={handleEnded}
        playFromTimestamp={lastPlayedTimestamp || 0}
        audioMetadata={episodeAudioMetadata}
      >
        {episode && (
          <div className="podcast-play-episode-container">
            {isExpanded && (
              <PodcastImage
                imageUrl={episode.image}
                size={96}
                imageClassName="podcast-play-episode-artwork"
                imageTitle={episode.title + " podcast image"}
                imageNotAvailableTitle="Podcast Play Episode Artwork Not Available"
              />
            )}
            <div className="podcast-play-episode-info">
              <Link
                to={podcastEpisodeDetailPage({
                  podcastTitle: episode.feedTitle || "",
                  podcastId: `${episode.feedId}`,
                  episodeId: `${episode.id}`,
                })}
                style={linkStyle}
              >
                <p className="podcast-play-episode-title">{episode.title}</p>
              </Link>
              {isExpanded && episode.datePublished > 0 && (
                <p className="podcast-play-episode-date">
                  {getDateFormat(episode.datePublished)}
                </p>
              )}
              {isExpanded && episode.episodeNumber && (
                <Pill className="podcast-play-episode-number">{`Episode ${episode.episodeNumber}`}</Pill>
              )}
            </div>
            {isExpanded ? (
              <Button
                keyProp="podcast-play-episode-minimize-player-button"
                variant="icon"
                className="podcast-play-episode-minimize-player-button"
                title="Minimize Player"
                onClick={handleMinimizePlayerClick}
              >
                <MdOutlineExpandLess size={24} />
              </Button>
            ) : (
              <Button
                keyProp="podcast-play-episode-expand-player-button"
                className="podcast-play-episode-expand-player-button"
                variant="icon"
                title="Expand Player"
                onClick={handleExpandPlayerClick}
              >
                <MdOutlineExpandMore size={24} />
              </Button>
            )}
          </div>
        )}
      </AudioPlayer>
    </div>
  )
}

export default memo(PodcastPlayer)

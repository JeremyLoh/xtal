import "./PodcastPlayer.css"
import { lazy, memo, useContext } from "react"
import dayjs from "dayjs"
import { PodcastEpisodeContext } from "../../../context/PodcastEpisodeProvider/PodcastEpisodeProvider.tsx"
import AudioPlayer from "../../../components/AudioPlayer/AudioPlayer.tsx"
const Pill = lazy(() => import("../../../components/Pill/Pill.tsx"))
const PodcastImage = lazy(
  () => import("../../../components/PodcastImage/PodcastImage.tsx")
)

function getDateFormat(unixTimestampInSeconds: number): string {
  return dayjs.unix(unixTimestampInSeconds).format("MMMM D, YYYY")
}

export default memo(function PodcastPlayer() {
  const podcastEpisodeContext = useContext(PodcastEpisodeContext)
  const episode = podcastEpisodeContext?.episode
  return (
    <div className="podcast-player">
      <AudioPlayer source={episode ? episode.contentUrl : ""}>
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
              <p className="podcast-play-episode-title">{episode.title}</p>
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

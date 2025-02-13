import "./PodcastPlayer.css"
import dayjs from "dayjs"
import { useContext } from "react"
import { PodcastEpisodeContext } from "../../../context/PodcastEpisodeProvider/PodcastEpisodeProvider"
import AudioPlayer from "../../../components/AudioPlayer/AudioPlayer"
import Pill from "../../../components/Pill/Pill"
import PodcastImage from "../../../components/PodcastImage/PodcastImage"

function getDateFormat(unixTimestampInSeconds: number): string {
  return dayjs.unix(unixTimestampInSeconds).format("MMMM D, YYYY")
}

export default function PodcastPlayer() {
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
              imageTitle={episode.title + " podcast episode artwork"}
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
}

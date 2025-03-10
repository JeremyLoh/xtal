import { usePodcastEpisodeCardContext } from "./PodcastEpisodeCardContext.ts"
import PodcastImage from "../PodcastImage/PodcastImage.tsx"

type ArtworkProps = {
  size: number
  title: string
}

const Artwork = function PodcastEpisodeCardArtwork({
  size,
  title,
}: ArtworkProps) {
  const { episode } = usePodcastEpisodeCardContext()
  return (
    <PodcastImage
      imageUrl={episode.image}
      size={size}
      imageClassName="podcast-episode-card-artwork"
      imageTitle={title}
      imageNotAvailableTitle="Podcast Episode Artwork Not Available"
    />
  )
}

export default Artwork
export type { ArtworkProps }

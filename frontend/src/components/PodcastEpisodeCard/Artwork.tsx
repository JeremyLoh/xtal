import { usePodcastEpisodeCardContext } from "./PodcastEpisodeCardContext.ts"
import PodcastImage from "../PodcastImage/PodcastImage.tsx"

type ArtworkProps = {
  size: number
  title: string
  lazyLoad?: boolean
}

const Artwork = function PodcastEpisodeCardArtwork({
  size,
  title,
  lazyLoad,
}: ArtworkProps) {
  const { episode } = usePodcastEpisodeCardContext()
  return (
    <PodcastImage
      {...(lazyLoad && { lazyLoad: lazyLoad })}
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

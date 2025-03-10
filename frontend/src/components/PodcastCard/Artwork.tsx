import { usePodcastCardContext } from "./PodcastCardContext.ts"
import PodcastImage from "../PodcastImage/PodcastImage.tsx"

type ArtworkProps = {
  size: number
}

const Artwork = function PodcastCardArtwork({ size }: ArtworkProps) {
  const { podcast } = usePodcastCardContext()
  return (
    <PodcastImage
      imageUrl={podcast.image}
      size={size}
      imageClassName="podcast-card-artwork"
      imageTitle={podcast.title + " podcast image"}
      imageNotAvailableTitle="Podcast Artwork Not Available"
    />
  )
}

export default Artwork
export type { ArtworkProps }

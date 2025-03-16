import { usePodcastCardContext } from "./PodcastCardContext.ts"
import PodcastImage from "../PodcastImage/PodcastImage.tsx"

type ArtworkProps = {
  size: number
  lazyLoad?: boolean
}

const Artwork = function PodcastCardArtwork({ size, lazyLoad }: ArtworkProps) {
  const { podcast } = usePodcastCardContext()
  return (
    <PodcastImage
      {...(lazyLoad && { lazyLoad: lazyLoad })}
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

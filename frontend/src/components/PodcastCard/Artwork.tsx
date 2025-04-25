import "./Artwork.css"
import { Link } from "react-router"
import { usePodcastCardContext } from "./PodcastCardContext.ts"
import PodcastImage from "../PodcastImage/PodcastImage.tsx"

type ArtworkProps = {
  size: number
  lazyLoad?: boolean
  redirectUrl?: string
}

const Artwork = function PodcastCardArtwork({
  size,
  lazyLoad,
  redirectUrl,
}: ArtworkProps) {
  const { podcast } = usePodcastCardContext()
  const podcastImage = (
    <PodcastImage
      {...(lazyLoad && { lazyLoad: lazyLoad })}
      imageUrl={podcast.image}
      size={size}
      imageClassName="podcast-card-artwork"
      imageTitle={podcast.title + " podcast image"}
      imageNotAvailableTitle="Podcast Artwork Not Available"
    />
  )
  if (redirectUrl) {
    return (
      <Link to={redirectUrl} className="podcast-card-artwork-link">
        {podcastImage}
      </Link>
    )
  }
  return podcastImage
}

export default Artwork
export type { ArtworkProps }

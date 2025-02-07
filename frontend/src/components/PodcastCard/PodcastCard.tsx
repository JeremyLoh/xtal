import "./PodcastCard.css"
import { createContext, PropsWithChildren, useContext } from "react"
import { MdOutlineImageNotSupported } from "react-icons/md"
import { Podcast } from "../../api/podcast/model/podcast"
import Pill from "../Pill/Pill"

type PodcastCardProps = PropsWithChildren & {
  customClassName?: string
  podcast: Podcast
}

type PodcastCardContext = {
  podcast: Podcast
}

const PodcastCardContext = createContext<PodcastCardContext | null>(null)

function usePodcastCardContext() {
  const context = useContext(PodcastCardContext)
  if (!context) {
    throw new Error("usePodcastCardContext must be used within a PodcastCard")
  }
  return context
}

export default function PodcastCard({
  children,
  customClassName,
  podcast,
}: PodcastCardProps) {
  return (
    <PodcastCardContext.Provider value={{ podcast }}>
      <div className={`podcast-card ${customClassName || ""}`.trim()}>
        {children}
      </div>
    </PodcastCardContext.Provider>
  )
}

PodcastCard.Artwork = function PodcastCardArtwork({ size }: { size: number }) {
  const { podcast } = usePodcastCardContext()
  return podcast.image ? (
    <img
      className="podcast-card-artwork"
      src={podcast.image}
      height={size}
      width={size}
      title={podcast.title + " podcast image"}
    />
  ) : (
    <div className="podcast-card-artwork">
      <MdOutlineImageNotSupported
        size={size}
        title="Podcast Artwork Not Available"
      />
    </div>
  )
}

PodcastCard.TitleAndAuthor = function PodcastCardTitleAndAuthor({
  variant,
}: {
  variant?: "large" | "normal"
}) {
  const { podcast } = usePodcastCardContext()
  if (variant === "large") {
    return (
      <div className="podcast-card-title-author-container">
        <p className="podcast-card-title-large">{podcast.title}</p>
        <p className="podcast-card-author-large">{podcast.author}</p>
      </div>
    )
  }
  return (
    <div className="podcast-card-title-author-container">
      <p className="podcast-card-title">{podcast.title}</p>
      <p className="podcast-card-author">{podcast.author}</p>
    </div>
  )
}

PodcastCard.EpisodeCount = function PodcastCardEpisodeCount() {
  const { podcast } = usePodcastCardContext()
  return (
    <Pill>
      {podcast.episodeCount ? `${podcast.episodeCount} episodes` : "0 episodes"}
    </Pill>
  )
}

import "./PodcastCard.css"
import DOMPurify from "dompurify"
import { createContext, PropsWithChildren, useContext } from "react"
import { Podcast } from "../../api/podcast/model/podcast"
import Pill from "../Pill/Pill"
import PodcastImage from "../PodcastImage/PodcastImage"

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
  const sanitizedPodcast = {
    ...podcast,
    description: DOMPurify.sanitize(podcast.description),
  }
  return (
    <PodcastCardContext.Provider value={{ podcast: sanitizedPodcast }}>
      <div className={`podcast-card ${customClassName || ""}`.trim()}>
        {children}
      </div>
    </PodcastCardContext.Provider>
  )
}

PodcastCard.Artwork = function PodcastCardArtwork({ size }: { size: number }) {
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

PodcastCard.Language = function PodcastCardLanguage() {
  const { podcast } = usePodcastCardContext()
  return podcast.language && <Pill>{podcast.language}</Pill>
}

PodcastCard.Categories = function PodcastCardCategories() {
  const { podcast } = usePodcastCardContext()
  return (
    podcast.categories &&
    podcast.categories.map((category, index) => {
      return (
        <Pill
          className="podcast-card-category-pill"
          key={`${category}-${index}`}
        >
          {category}
        </Pill>
      )
    })
  )
}

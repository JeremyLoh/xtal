import "./PodcastEpisodeCard.css"
import { Link } from "react-router"
import DOMPurify from "dompurify"
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
} from "react"
import { IoPlaySharp } from "react-icons/io5"
import dayjs from "dayjs"
import { PodcastEpisode } from "../../api/podcast/model/podcast.ts"
import Pill from "../Pill/Pill.tsx"
import PodcastImage from "../PodcastImage/PodcastImage.tsx"

type PodcastEpisodeCardProps = PropsWithChildren & {
  episode: PodcastEpisode
}

type PodcastEpisodeContext = {
  episode: PodcastEpisode
  descriptionDivRef: React.MutableRefObject<HTMLDivElement | null>
}

const PodcastEpisodeCardContext = createContext<PodcastEpisodeContext | null>(
  null
)

function usePodcastEpisodeCardContext() {
  const context = useContext(PodcastEpisodeCardContext)
  if (!context) {
    throw new Error(
      "usePodcastEpisodeCardContext must be used within a PodcastEpisodeCard"
    )
  }
  return context
}

export default function PodcastEpisodeCard({
  children,
  episode,
}: PodcastEpisodeCardProps) {
  const descriptionDivRef = useRef<HTMLDivElement | null>(null)
  const sanitizedEpisode = {
    ...episode,
    description: DOMPurify.sanitize(episode.description),
  }
  return (
    <PodcastEpisodeCardContext.Provider
      value={{ episode: sanitizedEpisode, descriptionDivRef }}
    >
      <div className="podcast-episode-card">{children}</div>
    </PodcastEpisodeCardContext.Provider>
  )
}

function isHTML(text: string) {
  const document = new DOMParser().parseFromString(text, "text/html")
  return Array.from(document.body.childNodes).some(
    (node) => node.nodeType === Node.ELEMENT_NODE
  )
}

function convertHtmlStringToElement(htmlString: string) {
  // should only be used for string that contain HTML!
  // https://stackoverflow.com/questions/29643368/cannot-append-dom-element-to-div-node-uncaught-hierarchyrequesterror-failed-to
  const domParser = new DOMParser()
  const document = domParser.parseFromString(htmlString, "text/html")
  return document.documentElement
}

PodcastEpisodeCard.Artwork = function PodcastEpisodeCardArtwork({
  size,
  title,
}: {
  size: number
  title: string
}) {
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

PodcastEpisodeCard.Title = function PodcastEpisodeCardTitle({
  url,
}: {
  url: string
}) {
  const { episode } = usePodcastEpisodeCardContext()
  return (
    <Link to={url} style={{ textDecoration: "none", width: "fit-content" }}>
      <p className="podcast-episode-card-title">{episode.title}</p>
    </Link>
  )
}

PodcastEpisodeCard.Description = function PodcastEpisodeCardDescription() {
  const { episode, descriptionDivRef } = usePodcastEpisodeCardContext()
  useEffect(() => {
    if (
      descriptionDivRef.current == null ||
      descriptionDivRef.current.hasChildNodes()
    ) {
      // hasChildNodes() prevents React strict mode from appending duplicate episode description
      return
    }
    if (!isHTML(episode.description)) {
      const paragraph = document.createElement("p")
      paragraph.innerText = episode.description
      descriptionDivRef.current.appendChild(paragraph)
      return
    }
    const fragment = document.createDocumentFragment()
    const element = convertHtmlStringToElement(episode.description)
    for (const child of element.children) {
      if (child.tagName.toLowerCase() === "body") {
        fragment.append(...child.childNodes)
      }
    }
    descriptionDivRef.current.appendChild(fragment)
  }, [descriptionDivRef, episode.description])

  return (
    <div
      ref={descriptionDivRef}
      className="podcast-episode-card-description"
    ></div>
  )
}

PodcastEpisodeCard.EpisodeNumber = function PodcastEpisodeCardEpisodeNumber() {
  const { episode } = usePodcastEpisodeCardContext()
  if (episode.episodeNumber == null) {
    return null
  }
  const text = `Episode ${episode.episodeNumber}`
  return <Pill className="podcast-episode-card-episode-number">{text}</Pill>
}

PodcastEpisodeCard.SeasonNumber = function PodcastEpisodeCardSeasonNumber() {
  const { episode } = usePodcastEpisodeCardContext()
  if (episode.seasonNumber == null || episode.seasonNumber <= 0) {
    return null
  }
  const seasonNumberText = `Season ${episode.seasonNumber}`
  return (
    <Pill className="podcast-episode-card-season-number">
      {seasonNumberText}
    </Pill>
  )
}

PodcastEpisodeCard.PlayButton = function PodcastEpisodeCardPlayButton({
  onPlayClick,
}: {
  onPlayClick: (podcastEpisode: PodcastEpisode) => void
}) {
  const { episode } = usePodcastEpisodeCardContext()
  return (
    <button
      onClick={() => onPlayClick(episode)}
      className="podcast-episode-card-play-button"
    >
      <IoPlaySharp size={16} />
      Play
    </button>
  )
}

PodcastEpisodeCard.PublishDate = function PodcastEpisodeCardPublishDate() {
  const { episode } = usePodcastEpisodeCardContext()
  const date = dayjs.unix(episode.datePublished).format("MMMM D, YYYY")
  return <p className="podcast-episode-card-publish-date">{date}</p>
}

PodcastEpisodeCard.Duration = function PodcastEpisodeCardDuration() {
  const { episode } = usePodcastEpisodeCardContext()
  if (episode.durationInSeconds == null) {
    return null
  }
  const hours = Math.floor(episode.durationInSeconds / 3600)
  const minutes =
    hours === 0
      ? Math.floor(episode.durationInSeconds / 60)
      : Math.floor((episode.durationInSeconds - hours * 3600) / 60)
  const durationInMinutes =
    hours === 0 ? `${minutes} min` : `${hours} hr ${minutes} min`
  return <p className="podcast-episode-card-duration">{durationInMinutes}</p>
}

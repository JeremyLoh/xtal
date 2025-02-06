import "./PodcastEpisodeCard.css"
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
} from "react"
import { PodcastEpisode } from "../../api/podcast/model/podcast"

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
  return (
    <PodcastEpisodeCardContext.Provider value={{ episode, descriptionDivRef }}>
      <div className="podcast-episode-card">{children}</div>
    </PodcastEpisodeCardContext.Provider>
  )
}

function convertHtmlStringToElement(htmlString: string) {
  const domParser = new DOMParser()
  const document = domParser.parseFromString(htmlString, "text/html")
  // https://stackoverflow.com/questions/29643368/cannot-append-dom-element-to-div-node-uncaught-hierarchyrequesterror-failed-to
  return document.documentElement
}

PodcastEpisodeCard.Artwork = function PodcastEpisodeCardArtwork({
  size,
}: {
  size: number
}) {
  const { episode } = usePodcastEpisodeCardContext()
  return (
    <img
      className="podcast-episode-card-artwork"
      src={episode.image}
      width={size}
      height={size}
    />
  )
}

PodcastEpisodeCard.Title = function PodcastEpisodeCardTitle() {
  const { episode } = usePodcastEpisodeCardContext()
  return <p className="podcast-episode-card-title">{episode.title}</p>
}

PodcastEpisodeCard.Description = function PodcastEpisodeCardDescription() {
  const { episode, descriptionDivRef } = usePodcastEpisodeCardContext()
  useEffect(() => {
    const element = convertHtmlStringToElement(episode.description)
    descriptionDivRef.current?.appendChild(element)
  }, [descriptionDivRef, episode.description])

  return (
    <div
      ref={descriptionDivRef}
      className="podcast-episode-card-description"
    ></div>
  )
}

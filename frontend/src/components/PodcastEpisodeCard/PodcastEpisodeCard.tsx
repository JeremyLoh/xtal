import "./PodcastEpisodeCard.css"
import DOMPurify from "dompurify"
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

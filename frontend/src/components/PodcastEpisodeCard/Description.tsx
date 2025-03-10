import { useEffect } from "react"
import { usePodcastEpisodeCardContext } from "./PodcastEpisodeCardContext.ts"

type DescriptionProps = {
  className?: string
}

const Description = function PodcastEpisodeCardDescription({
  className,
}: DescriptionProps) {
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
      className={`podcast-episode-card-description ${
        className ? className : ""
      }`}
    ></div>
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

export default Description
export type { DescriptionProps }

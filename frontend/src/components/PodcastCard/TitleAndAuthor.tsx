import { usePodcastCardContext } from "./PodcastCardContext.ts"

type TitleAndAuthorProps = {
  variant?: "large" | "normal"
}

const TitleAndAuthor = function PodcastCardTitleAndAuthor({
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

export default TitleAndAuthor
export type { TitleAndAuthorProps }

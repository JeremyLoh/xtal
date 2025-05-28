import "./NewReleasePodcastSection.css"
import { memo, useCallback, useMemo } from "react"
import { Components, ItemContent, Virtuoso } from "react-virtuoso"
import { Link } from "react-router"
import { Podcast } from "../../../../api/podcast/model/podcast.ts"
import PodcastCard from "../../../../components/PodcastCard/index.tsx"
import useScreenDimensions from "../../../../hooks/useScreenDimensions.ts"
import { podcastDetailPage } from "../../../../paths.ts"

const virtuosoStyle = {
  width: "100%",
  height: "18rem",
}

type NewReleasePodcastSectionProps = {
  newReleasePodcasts: Podcast[] | null
}

function NewReleasePodcastSection({
  newReleasePodcasts,
}: NewReleasePodcastSectionProps) {
  const { isMobile } = useScreenDimensions()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const components: Components<Podcast, any> | undefined = useMemo(() => {
    return {
      Item: (props) => (
        <div {...props} className="new-release-podcast-list-item" />
      ),
    }
  }, [])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const itemContent: ItemContent<Podcast, any> | undefined = useCallback(
    (_: number, podcast: Podcast) => {
      const podcastDetailPageUrl = podcastDetailPage({
        podcastTitle: podcast.title,
        podcastId: `${podcast.id}`,
      })
      return (
        <PodcastCard
          podcast={podcast}
          customClassName="new-release-podcast-card"
          data-testid={`new-release-podcast-card-${podcast.id}`}
        >
          <PodcastCard.Artwork
            size={isMobile ? 96 : 200}
            redirectUrl={podcastDetailPageUrl}
          />
          <Link
            to={podcastDetailPageUrl}
            className="new-release-podcast-card-title-link"
          >
            <PodcastCard.TitleAndAuthor />
          </Link>
        </PodcastCard>
      )
    },
    [isMobile]
  )

  if (newReleasePodcasts == null) {
    return
  }
  return (
    <div className="new-release-podcast-container">
      <h2>
        New Releases
        <br />
        <span className="new-release-podcast-subtitle">
          Latest podcasts with new episodes
        </span>
      </h2>
      <Virtuoso
        style={virtuosoStyle}
        horizontalDirection={!isMobile}
        data={newReleasePodcasts}
        components={components}
        itemContent={itemContent}
      />
    </div>
  )
}

export default memo(NewReleasePodcastSection)

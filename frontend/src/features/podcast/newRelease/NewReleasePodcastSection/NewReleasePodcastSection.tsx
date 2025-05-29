import "./NewReleasePodcastSection.css"
import { memo, useCallback, useMemo } from "react"
import { Components, ItemContent, Virtuoso } from "react-virtuoso"
import { Link } from "react-router"
import { IoReload } from "react-icons/io5"
import { Podcast } from "../../../../api/podcast/model/podcast.ts"
import PodcastCard from "../../../../components/PodcastCard/index.tsx"
import Button from "../../../../components/ui/button/Button.tsx"
import useScreenDimensions from "../../../../hooks/useScreenDimensions.ts"
import { podcastDetailPage } from "../../../../paths.ts"

const virtuosoStyle = {
  width: "100%",
  height: "21rem",
}

type NewReleasePodcastSectionProps = {
  loading: boolean
  newReleasePodcasts: Podcast[] | null
  onRefreshNewReleasePodcasts: () => Promise<void>
}

function NewReleasePodcastSection({
  loading,
  newReleasePodcasts,
  onRefreshNewReleasePodcasts,
}: NewReleasePodcastSectionProps) {
  const { isMobile } = useScreenDimensions()

  const handleRefreshNewReleasePodcasts = useCallback(async () => {
    await onRefreshNewReleasePodcasts()
  }, [onRefreshNewReleasePodcasts])

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
          <div className="new-release-podcast-card-info">
            <Link
              to={podcastDetailPageUrl}
              className="new-release-podcast-card-title-link"
            >
              <PodcastCard.TitleAndAuthor />
            </Link>
            <PodcastCard.LastActiveTime className="new-release-podcast-card-last-active-time" />
          </div>
        </PodcastCard>
      )
    },
    [isMobile]
  )

  const headerComponent = (
    <h2 className="new-release-podcast-header">
      New Releases
      <br />
      <span className="new-release-podcast-subtitle">
        Latest podcasts with new episodes
      </span>
    </h2>
  )

  if (newReleasePodcasts == null) {
    return (
      <div className="new-release-podcast-container">
        {headerComponent}
        <div>Zero recent podcasts found. Please try again later</div>
        <Button
          keyProp="refresh-recent-podcast-button"
          className="refresh-recent-podcast-button"
          variant="primary"
          disabled={loading}
          onClick={handleRefreshNewReleasePodcasts}
          aria-label="refresh new release podcasts"
          title="refresh new release podcasts"
        >
          <IoReload size={20} /> Refresh
        </Button>
      </div>
    )
  }
  return (
    <div className="new-release-podcast-container">
      {headerComponent}
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

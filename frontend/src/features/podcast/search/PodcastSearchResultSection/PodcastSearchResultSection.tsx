import "./PodcastSearchResultSection.css"
import { forwardRef, memo, useCallback, useMemo } from "react"
import { Link } from "react-router"
import { RxInfoCircled } from "react-icons/rx"
import { GridComponents, VirtuosoGrid } from "react-virtuoso"
import { Podcast } from "../../../../api/podcast/model/podcast.ts"
import useScreenDimensions from "../../../../hooks/useScreenDimensions.ts"
import PodcastCard from "../../../../components/PodcastCard/index.tsx"
import { podcastDetailPage } from "../../../../paths.ts"

// Ensure that this stays out of the component,
// Otherwise the grid will remount with each render due to new component instances.
const gridComponents: GridComponents<Podcast> | undefined = {
  List: forwardRef(({ style, children, ...props }, ref) => (
    <div
      ref={ref}
      {...props}
      style={{
        ...style,
      }}
      className="podcast-search-result-section-container" /* needs to be last to override given class name */
    >
      {children}
    </div>
  )),
  Item: ({ children, ...props }) => (
    <div {...props} className="podcast-search-result-item">
      {children}
    </div>
  ),
}

type PodcastSearchResultSectionType = {
  podcasts: Podcast[]
}

function PodcastSearchResultSection({
  podcasts,
}: PodcastSearchResultSectionType) {
  const { height, isMobile } = useScreenDimensions()
  const virtuosoStyle = useMemo(() => {
    return { height }
  }, [height])

  const renderItemContent = useCallback(
    (index: number) => {
      if (podcasts == null) {
        return null
      }
      const podcast = podcasts[index]
      const podcastDetailUrl = podcastDetailPage({
        podcastId: `${podcast.id}`,
        podcastTitle: `${podcast.title}`,
      })
      return (
        <PodcastCard podcast={podcast}>
          <PodcastCard.Artwork size={isMobile ? 96 : 144} />
          <Link
            to={podcastDetailUrl}
            className="podcast-search-result-card-detail-link"
          >
            <PodcastCard.TitleAndAuthor />
          </Link>
        </PodcastCard>
      )
    },
    [isMobile, podcasts]
  )

  if (podcasts.length === 0) {
    return (
      <div className="podcast-search-result-empty">
        <RxInfoCircled size={32} />
        <p>No results found.</p>
        <p>Try searching again using different spelling or keywords</p>
      </div>
    )
  }
  return (
    <VirtuosoGrid
      style={virtuosoStyle}
      totalCount={podcasts.length}
      components={gridComponents}
      itemContent={renderItemContent}
    />
  )
}

export default memo(PodcastSearchResultSection)

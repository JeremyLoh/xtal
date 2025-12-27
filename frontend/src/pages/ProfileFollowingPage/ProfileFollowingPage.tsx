import "./ProfileFollowingPage.css"
import { useCallback, useMemo, useState } from "react"
import { Components, ItemContent, Virtuoso } from "react-virtuoso"
import { Link } from "react-router"
import useFollowPodcastHistory from "../../hooks/podcast/useFollowPodcastHistory.ts"
import useScreenDimensions from "../../hooks/useScreenDimensions.ts"
import { Podcast } from "../../api/podcast/model/podcast.ts"
import { podcastDetailPage, profilePage } from "../../paths.ts"
import LoadingDisplay from "../../components/LoadingDisplay/LoadingDisplay.tsx"
import PodcastCard from "../../components/PodcastCard/index.tsx"
import Breadcrumb from "../../components/ui/breadcrumb/index.tsx"
import Pagination from "../../components/Pagination/Pagination.tsx"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const components: Components<Podcast, any> | undefined = {
  List: (props) => (
    <div {...props} className="podcast-following-list-container" />
  ),
  Item: (props) => <div {...props} className="podcast-following-list-item" />,
}

const LIMIT_PER_PAGE = 10

function ProfileFollowingPage() {
  const { height, isMobile } = useScreenDimensions()
  const [limitPerPage] = useState<number>(LIMIT_PER_PAGE)
  const [pageOffset, setPageOffset] = useState<number>()

  const { loading, latestFollowedPodcasts, totalFollowedPodcasts } =
    useFollowPodcastHistory({ limitPerPage, pageOffset })
  const [page, setPage] = useState<number>(1)

  const virtuosoStyle = useMemo(() => {
    return { height: (height * 2) / 3 }
  }, [height])

  const handlePreviousPageClick = useCallback(
    async (currentPage: number) => {
      if (currentPage === 1) {
        return
      }
      setPage(currentPage - 1)
      const offset = (currentPage - 2) * limitPerPage
      setPageOffset(offset)
    },
    [limitPerPage]
  )

  const handleNextPageClick = useCallback(
    async (currentPage: number) => {
      if (
        !totalFollowedPodcasts ||
        currentPage === Math.ceil(totalFollowedPodcasts / limitPerPage)
      ) {
        return
      }
      setPage(currentPage + 1)
      const offset = currentPage * limitPerPage
      setPageOffset(offset)
    },
    [totalFollowedPodcasts, limitPerPage]
  )

  const handlePageClick = useCallback(
    async (pageNumber: number) => {
      if (pageNumber === page) {
        return
      }
      setPage(pageNumber)
      const offset = (pageNumber - 1) * limitPerPage
      setPageOffset(offset)
    },
    [page, limitPerPage]
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const itemContent: ItemContent<Podcast, any> | undefined = useCallback(
    (_: number, podcast: Podcast) => {
      const podcastDetailUrl = podcastDetailPage({
        podcastId: `${podcast.id}`,
        podcastTitle: `${podcast.title}`,
      })
      return (
        <PodcastCard
          podcast={podcast}
          customClassName="podcast-following-list-podcast-card"
        >
          <PodcastCard.Artwork
            size={isMobile ? 96 : 144}
            redirectUrl={podcastDetailUrl}
          />
          <div className="podcast-following-list-item-info">
            <Link
              to={podcastDetailUrl}
              className="podcast-following-list-item-detail-link"
            >
              <PodcastCard.TitleAndAuthor />
            </Link>
            <div className="podcast-following-list-item-categories">
              <PodcastCard.Categories />
            </div>
            <div>
              <PodcastCard.EpisodeCount />
            </div>
            <div>
              <PodcastCard.Language />
            </div>
          </div>
          <span className="podcast-following-list-item-follow-button">
            <PodcastCard.FollowButton isInitialFollowed={true} />
          </span>
        </PodcastCard>
      )
    },
    [isMobile]
  )

  return (
    <div className="profile-following-page-container">
      <Breadcrumb>
        <Breadcrumb.Link
          href={profilePage()}
          data-testid="profile-following-page-profile-page-link"
        >
          Profile
        </Breadcrumb.Link>
        <Breadcrumb.Separator size={16} />
        <Breadcrumb.Item>Profile Following</Breadcrumb.Item>
      </Breadcrumb>
      <h2 className="profile-following-page-title">Profile Following</h2>
      <h3>Followed Podcasts</h3>
      <LoadingDisplay loading={loading}>
        <Pagination
          currentPage={page}
          totalPages={Math.ceil((totalFollowedPodcasts || 0) / LIMIT_PER_PAGE)}
          onPreviousPageClick={handlePreviousPageClick}
          onNextPageClick={handleNextPageClick}
          onPageClick={handlePageClick}
        />
        {latestFollowedPodcasts?.data.length === 0 && (
          <p>Zero followed podcasts</p>
        )}
        <Virtuoso
          style={virtuosoStyle}
          data={latestFollowedPodcasts?.data}
          components={components}
          itemContent={itemContent}
        />
      </LoadingDisplay>
    </div>
  )
}

export default ProfileFollowingPage

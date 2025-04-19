import "./ProfileFollowingPage.css"
import { useEffect, useMemo, useState } from "react"
import { Components, ItemContent, Virtuoso } from "react-virtuoso"
import { Link } from "react-router"
import LoadingDisplay from "../../components/LoadingDisplay/LoadingDisplay.tsx"
import useFollowPodcastHistory from "../../hooks/podcast/useFollowPodcastHistory.ts"
import { Podcast } from "../../api/podcast/model/podcast.ts"
import useScreenDimensions from "../../hooks/useScreenDimensions.ts"
import PodcastCard from "../../components/PodcastCard/index.tsx"
import Breadcrumb from "../../components/ui/breadcrumb/index.tsx"
import { profilePage } from "../../paths.ts"
import { getPodcastDetailPath } from "../../features/utils/navigation/pageNavigation.ts"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const components: Components<Podcast, any> | undefined = {
  List: (props) => (
    <div {...props} className="podcast-following-list-container" />
  ),
  Item: (props) => <div {...props} className="podcast-following-list-item" />,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const itemContent: ItemContent<Podcast, any> | undefined = (
  _: number,
  podcast: Podcast
) => {
  return (
    <PodcastCard
      podcast={podcast}
      customClassName="podcast-following-list-podcast-card"
    >
      <PodcastCard.Artwork size={144} />
      <div className="podcast-following-list-item-info">
        <Link
          to={getPodcastDetailPath({
            podcastId: `${podcast.id}`,
            podcastTitle: `${podcast.title}`,
          })}
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
        <PodcastCard.Follow isInitialFollowed={true} />
      </span>
    </PodcastCard>
  )
}

function ProfileFollowingPage() {
  const limit = 10
  const { height } = useScreenDimensions()
  const { loading, getLatestFollowedPodcasts } = useFollowPodcastHistory()
  const [followedPodcasts, setFollowedPodcasts] = useState<Podcast[]>([])

  const virtuosoStyle = useMemo(() => {
    return { height: (height * 2) / 3 }
  }, [height])

  useEffect(() => {
    getLatestFollowedPodcasts(limit).then((response) => {
      if (response == null) {
        return
      }
      setFollowedPodcasts(response.data)
    })
  }, [getLatestFollowedPodcasts])

  return (
    <LoadingDisplay loading={loading}>
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
        {followedPodcasts.length === 0 && <p>Zero followed podcasts</p>}
        <Virtuoso
          style={virtuosoStyle}
          data={followedPodcasts}
          components={components}
          itemContent={itemContent}
        />
      </div>
    </LoadingDisplay>
  )
}

export default ProfileFollowingPage

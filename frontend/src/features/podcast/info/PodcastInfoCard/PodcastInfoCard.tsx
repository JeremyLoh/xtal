import "./PodcastInfoCard.css"
import { memo, useCallback } from "react"
import { Podcast } from "../../../../api/podcast/model/podcast.ts"
import PodcastCard from "../../../../components/PodcastCard/index.tsx"
import useClipboard from "../../../../hooks/useClipboard.ts"
import useScreenDimensions from "../../../../hooks/useScreenDimensions.ts"

type PodcastInfoCardProps = {
  podcast: Podcast | null
}

function PodcastInfoCard({ podcast }: Readonly<PodcastInfoCardProps>) {
  const { isMobile } = useScreenDimensions()
  const { copyPodcastShareUrl } = useClipboard()

  const handleShareClick = useCallback(
    (podcast: Podcast) => {
      copyPodcastShareUrl(podcast)
    },
    [copyPodcastShareUrl]
  )

  if (podcast == null) {
    return null
  }
  return (
    <div className="podcast-info-container">
      <PodcastCard podcast={podcast} customClassName="podcast-info-card">
        <PodcastCard.Artwork size={isMobile ? 144 : 200} />
        <div>
          <PodcastCard.TitleAndAuthor variant="large" />
          <PodcastCard.LastActiveTime />
          <div className="podcast-info-card-pill-container">
            <PodcastCard.EpisodeCount />
            <PodcastCard.Language />
          </div>
          <div className="podcast-info-card-pill-container">
            <PodcastCard.Categories />
          </div>
        </div>
        <div className="podcast-info-card-actions">
          <span className="podcast-info-card-follow-button">
            <PodcastCard.FollowButton />
          </span>
          <span className="podcast-info-card-share-button">
            <PodcastCard.ShareButton onClick={handleShareClick} />
          </span>
        </div>
      </PodcastCard>
    </div>
  )
}

export default memo(PodcastInfoCard)

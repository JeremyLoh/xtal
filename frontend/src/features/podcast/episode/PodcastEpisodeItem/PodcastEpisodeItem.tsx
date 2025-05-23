import "./PodcastEpisodeItem.css"
import { memo, useCallback } from "react"
import PodcastEpisodeCard from "../../../../components/PodcastEpisodeCard/index.tsx"
import { PodcastEpisode } from "../../../../api/podcast/model/podcast.ts"
import useScreenDimensions from "../../../../hooks/useScreenDimensions.ts"
import useClipboard from "../../../../hooks/useClipboard.ts"

type PodcastEpisodeItemProps = {
  lazyLoad: boolean
  episode: PodcastEpisode
  titleUrl: string
  onPlayClick: (podcastEpisode: PodcastEpisode) => Promise<void>
}

function PodcastEpisodeItem({
  lazyLoad,
  episode,
  titleUrl,
  onPlayClick,
}: PodcastEpisodeItemProps) {
  const { isMobile } = useScreenDimensions()
  const { copyPodcastEpisodeShareUrl } = useClipboard()

  const handleShareClick = useCallback(
    (episode: PodcastEpisode, startDurationInSeconds: number) => {
      copyPodcastEpisodeShareUrl(episode, startDurationInSeconds)
    },
    [copyPodcastEpisodeShareUrl]
  )

  return (
    <PodcastEpisodeCard episode={episode}>
      <PodcastEpisodeCard.Artwork
        size={isMobile ? 96 : 144}
        title={`${episode.title} podcast image`}
        lazyLoad={lazyLoad}
      />
      <PodcastEpisodeCard.Title url={titleUrl} />
      <PodcastEpisodeCard.PublishDate />
      <PodcastEpisodeCard.Duration />
      <PodcastEpisodeCard.ExplicitIndicator />
      <div className="podcast-episode-item-pill-container">
        <PodcastEpisodeCard.EpisodeNumber />
        <PodcastEpisodeCard.SeasonNumber />
      </div>
      <PodcastEpisodeCard.ShareButton onClick={handleShareClick} />
      <PodcastEpisodeCard.PlayButton onPlayClick={onPlayClick} />
      <PodcastEpisodeCard.Description />
    </PodcastEpisodeCard>
  )
}

export default memo(PodcastEpisodeItem)

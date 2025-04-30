import { memo } from "react"
import PodcastEpisodeCard from "../../../../components/PodcastEpisodeCard/index.tsx"
import { PodcastEpisode } from "../../../../api/podcast/model/podcast.ts"
import useScreenDimensions from "../../../../hooks/useScreenDimensions.ts"

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
      <PodcastEpisodeCard.EpisodeNumber />
      <PodcastEpisodeCard.SeasonNumber />
      <PodcastEpisodeCard.PlayButton onPlayClick={onPlayClick} />
      <PodcastEpisodeCard.Description />
    </PodcastEpisodeCard>
  )
}

export default memo(PodcastEpisodeItem)

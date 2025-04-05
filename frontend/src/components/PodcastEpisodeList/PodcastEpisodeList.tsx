import { memo, useCallback, useContext } from "react"
import { PodcastEpisode } from "../../api/podcast/model/podcast.ts"
import PodcastEpisodeCard from "../PodcastEpisodeCard/index.tsx"
import { PodcastEpisodeContext } from "../../context/PodcastEpisodeProvider/PodcastEpisodeProvider.tsx"

type PodcastEpisodeListProps = {
  IMAGE_LAZY_LOAD_START_INDEX: number
  episodes: PodcastEpisode[]
  podcastTitle: string | undefined
  podcastId: string | undefined
}

function PodcastEpisodeList({
  IMAGE_LAZY_LOAD_START_INDEX,
  episodes,
  podcastTitle,
  podcastId,
}: PodcastEpisodeListProps) {
  const podcastEpisodeContext = useContext(PodcastEpisodeContext)
  const handlePlayClick = useCallback(
    (podcastEpisode: PodcastEpisode) => {
      if (podcastEpisodeContext) {
        podcastEpisodeContext.setEpisode(podcastEpisode)
      }
    },
    [podcastEpisodeContext]
  )
  return episodes.map((episode, index) => {
    return (
      <PodcastEpisodeCard key={episode.id} episode={episode}>
        <PodcastEpisodeCard.Artwork
          size={144}
          title={`${episode.title} podcast image`}
          lazyLoad={index >= IMAGE_LAZY_LOAD_START_INDEX}
        />
        <PodcastEpisodeCard.Title
          url={`/podcasts/${podcastTitle}/${podcastId}/${episode.id}`}
        />
        <PodcastEpisodeCard.PublishDate />
        <PodcastEpisodeCard.Duration />
        <PodcastEpisodeCard.EpisodeNumber />
        <PodcastEpisodeCard.SeasonNumber />
        <PodcastEpisodeCard.PlayButton onPlayClick={handlePlayClick} />
        <PodcastEpisodeCard.Description />
      </PodcastEpisodeCard>
    )
  })
}

export default memo(PodcastEpisodeList)

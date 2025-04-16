import "./PodcastEpisodeList.css"
import { memo, useCallback, useContext, useMemo } from "react"
import { Components, ItemContent, Virtuoso } from "react-virtuoso"
import { PodcastEpisode } from "../../../../api/podcast/model/podcast.ts"
import PodcastEpisodeCard from "../../../../components/PodcastEpisodeCard/index.tsx"
import { PodcastEpisodeContext } from "../../../../context/PodcastEpisodeProvider/PodcastEpisodeProvider.tsx"
import usePlayHistory from "../../../../hooks/podcast/usePlayHistory.ts"
import useScreenDimensions from "../../../../hooks/useScreenDimensions.ts"

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
  const { height } = useScreenDimensions()
  const podcastEpisodeContext = useContext(PodcastEpisodeContext)
  const { session, addPlayPodcastEpisode, getPodcastEpisodeLastPlayTimestamp } =
    usePlayHistory()

  const virtuosoStyle = useMemo(() => {
    return { height }
  }, [height])

  const handlePlayClick = useCallback(
    async (podcastEpisode: PodcastEpisode) => {
      if (session.loading) {
        return
      }
      if (podcastEpisodeContext) {
        podcastEpisodeContext.setEpisode(podcastEpisode)
      }
      if (session.doesSessionExist && podcastEpisodeContext) {
        const lastPlayedTimestamp = await getPodcastEpisodeLastPlayTimestamp(
          `${podcastEpisode.id}`
        )
        const resumePlayTimeInSeconds = lastPlayedTimestamp || 0
        podcastEpisodeContext.setLastPlayedTimestamp(resumePlayTimeInSeconds)
        await addPlayPodcastEpisode(podcastEpisode, resumePlayTimeInSeconds)
      }
    },
    [
      session,
      podcastEpisodeContext,
      addPlayPodcastEpisode,
      getPodcastEpisodeLastPlayTimestamp,
    ]
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const components: Components<PodcastEpisode, any> | undefined =
    useMemo(() => {
      return {
        Item: (props) => (
          <div {...props} className="podcast-episode-list-item" />
        ),
      }
    }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const itemContent: ItemContent<PodcastEpisode, any> | undefined = useCallback(
    (index: number, episode: PodcastEpisode) => {
      return (
        <PodcastEpisodeCard episode={episode}>
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
    },
    [IMAGE_LAZY_LOAD_START_INDEX, podcastId, podcastTitle, handlePlayClick]
  )

  return (
    <Virtuoso
      style={virtuosoStyle}
      data={episodes}
      components={components}
      itemContent={itemContent}
    />
  )
}

export default memo(PodcastEpisodeList)

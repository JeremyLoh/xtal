import "./PodcastEpisodeDetailPage.css"
import { useCallback, useContext, useEffect } from "react"
import { useParams, useSearchParams } from "react-router"
import {
  PodcastEpisodeDispatchContext,
  PodcastEpisodeTimestampDispatchContext,
} from "../../../context/PodcastEpisodeProvider/PodcastEpisodeProvider.tsx"
import LoadingDisplay from "../../../components/LoadingDisplay/LoadingDisplay.tsx"
import PodcastEpisodeCard from "../../../components/PodcastEpisodeCard/index.tsx"
import usePodcastEpisode from "../../../hooks/podcast/usePodcastEpisode.ts"
import PodcastEpisodeDetailPageNavigation from "../../../features/podcast/navigation/PodcastEpisodeDetailPageNavigation/PodcastEpisodeDetailPageNavigation.tsx"
import usePlayHistory from "../../../hooks/podcast/usePlayHistory.ts"
import { PodcastEpisode } from "../../../api/podcast/model/podcast.ts"
import useClipboard from "../../../hooks/useClipboard.ts"

export default function PodcastEpisodeDetailPage() {
  const { podcastId, podcastTitle, podcastEpisodeId } = useParams()
  const [searchParams] = useSearchParams()
  const startEpisodeTime = searchParams.get("t")

  const { copyPodcastEpisodeShareUrl } = useClipboard()
  const { addPlayPodcastEpisode, getPodcastEpisodeLastPlayTimestamp } =
    usePlayHistory()
  const podcastEpisodeDispatchContext = useContext(
    PodcastEpisodeDispatchContext
  )
  const podcastEpisodeTimestampDispatchContext = useContext(
    PodcastEpisodeTimestampDispatchContext
  )
  const { loading, error, episode, fetchPodcastEpisode } = usePodcastEpisode()

  useEffect(() => {
    if (episode) {
      return
    }
    if (podcastEpisodeId && fetchPodcastEpisode) {
      fetchPodcastEpisode(podcastEpisodeId)
    }
  }, [episode, podcastEpisodeId, fetchPodcastEpisode])

  const handlePlayClick = useCallback(async () => {
    if (
      episode == null ||
      podcastEpisodeDispatchContext == null ||
      podcastEpisodeTimestampDispatchContext == null
    ) {
      return
    }
    podcastEpisodeDispatchContext.setEpisode(episode)
    let resumePlayTimeInSeconds = 0
    const isValidStartEpisodeTime =
      startEpisodeTime &&
      episode.durationInSeconds &&
      Number(startEpisodeTime) >= 0 &&
      Number(startEpisodeTime) <= episode.durationInSeconds
    if (isValidStartEpisodeTime) {
      resumePlayTimeInSeconds = Number(startEpisodeTime)
    } else {
      const lastPlayedTimestamp = await getPodcastEpisodeLastPlayTimestamp(
        `${episode.id}`
      )
      resumePlayTimeInSeconds = lastPlayedTimestamp || 0
    }
    podcastEpisodeTimestampDispatchContext.setLastPlayedTimestamp(
      resumePlayTimeInSeconds
    )
    await addPlayPodcastEpisode(episode, resumePlayTimeInSeconds)
  }, [
    podcastEpisodeDispatchContext,
    podcastEpisodeTimestampDispatchContext,
    episode,
    startEpisodeTime,
    addPlayPodcastEpisode,
    getPodcastEpisodeLastPlayTimestamp,
  ])

  const handleShareClick = useCallback(
    (episode: PodcastEpisode, startDurationInSeconds: number) => {
      copyPodcastEpisodeShareUrl(episode, startDurationInSeconds)
    },
    [copyPodcastEpisodeShareUrl]
  )

  return (
    <div className="podcast-episode-detail-container">
      <PodcastEpisodeDetailPageNavigation
        podcastId={podcastId}
        podcastTitle={podcastTitle}
      />
      <LoadingDisplay loading={loading}>
        {!loading && episode == null && error && (
          <p className="error-text">{error}</p>
        )}
        {episode && (
          <PodcastEpisodeCard episode={episode}>
            <PodcastEpisodeCard.Artwork
              size={200}
              title={episode.title + " podcast image"}
            />
            <PodcastEpisodeCard.Title />
            <PodcastEpisodeCard.PublishDate />
            <PodcastEpisodeCard.Duration />
            <PodcastEpisodeCard.ExplicitIndicator />
            <PodcastEpisodeCard.EpisodeWebsiteLink />
            <span className="podcast-episode-detail-share-button">
              <PodcastEpisodeCard.ShareButton onClick={handleShareClick} />
            </span>
            <PodcastEpisodeCard.PlayButton onPlayClick={handlePlayClick} />
            <PodcastEpisodeCard.Description className="podcast-episode-detail-description" />
          </PodcastEpisodeCard>
        )}
      </LoadingDisplay>
    </div>
  )
}

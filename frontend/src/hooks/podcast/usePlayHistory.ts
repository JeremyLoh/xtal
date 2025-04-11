import { useCallback, useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import {
  SessionContextType,
  useSessionContext,
} from "supertokens-auth-react/recipe/session/index"
import { PodcastEpisode } from "../../api/podcast/model/podcast.ts"
import {
  getAccountPodcastEpisodePlayHistory,
  updateAccountPodcastEpisodePlayHistory,
} from "../../api/podcast/history/account.ts"

type PlayHistoryPodcastEpisode = {
  lastPlayedTimestamp: Date
  resumePlayTimeInSeconds: number
  podcastEpisode: PodcastEpisode
}

function usePlayHistory() {
  const session: SessionContextType = useSessionContext()
  const [loading, setLoading] = useState<boolean>(true)
  const abortController = useRef<AbortController | null>(null)

  const addPlayPodcastEpisode = useCallback(
    async (episode: PodcastEpisode, resumePlayTimeInSeconds: number) => {
      setLoading(true)
      if (session.loading) {
        return
      }
      if (!session.doesSessionExist) {
        return
      }
      try {
        await updateAccountPodcastEpisodePlayHistory(
          episode,
          resumePlayTimeInSeconds
        )
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error.message)
      } finally {
        setLoading(false)
      }
    },
    [session]
  )
  const getPlayedPodcastEpisodes = useCallback(
    async (
      limit: number,
      offset?: number
    ): Promise<PlayHistoryPodcastEpisode[] | null> => {
      setLoading(true)
      if (session.loading) {
        return null
      }
      if (!session.doesSessionExist) {
        return null
      }
      abortController.current?.abort()
      abortController.current = new AbortController()
      try {
        const episodes = await getAccountPodcastEpisodePlayHistory(
          abortController.current,
          limit,
          offset
        )
        return episodes
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error.message)
        return null
      } finally {
        setLoading(false)
      }
    },
    [session]
  )

  const output = useMemo(() => {
    return { session, loading, addPlayPodcastEpisode, getPlayedPodcastEpisodes }
  }, [session, loading, addPlayPodcastEpisode, getPlayedPodcastEpisodes])

  return output
}

export default usePlayHistory
export type { PlayHistoryPodcastEpisode }

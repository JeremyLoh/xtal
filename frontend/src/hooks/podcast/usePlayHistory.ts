import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import {
  SessionContextType,
  useSessionContext,
} from "supertokens-auth-react/recipe/session/index"
import { PodcastEpisode } from "../../api/podcast/model/podcast.ts"
import {
  deleteAccountPodcastEpisodePlayHistory,
  getAccountPodcastEpisodePlayHistory,
  getAccountTotalPodcastEpisodePlayCount,
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
  const [totalPlayedPodcastEpisodes, setTotalPlayedPodcastEpisodes] =
    useState<number>(0)

  useEffect(() => {
    async function getTotalPlayedCount() {
      if (session.loading) {
        return
      }
      if (!session.doesSessionExist) {
        return
      }
      try {
        const total = await getAccountTotalPodcastEpisodePlayCount()
        setTotalPlayedPodcastEpisodes(total)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error.message)
      }
    }

    getTotalPlayedCount()
  }, [session])

  const addPlayPodcastEpisode = useCallback(
    async (episode: PodcastEpisode, resumePlayTimeInSeconds: number) => {
      setLoading(true)
      if (session.loading) {
        return
      }
      if (!session.doesSessionExist) {
        return
      }
      abortController.current?.abort()
      abortController.current = new AbortController()
      try {
        await updateAccountPodcastEpisodePlayHistory(
          abortController.current,
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
  const deletePlayedPodcastEpisode = useCallback(
    async (episodeId: string) => {
      setLoading(true)
      if (session.loading) {
        return
      }
      if (!session.doesSessionExist) {
        return
      }
      abortController.current?.abort()
      abortController.current = new AbortController()
      try {
        await deleteAccountPodcastEpisodePlayHistory(
          abortController.current,
          episodeId
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

  const output = useMemo(() => {
    return {
      session,
      loading,
      totalPlayedPodcastEpisodes,
      addPlayPodcastEpisode,
      getPlayedPodcastEpisodes,
      deletePlayedPodcastEpisode,
    }
  }, [
    session,
    loading,
    totalPlayedPodcastEpisodes,
    addPlayPodcastEpisode,
    getPlayedPodcastEpisodes,
    deletePlayedPodcastEpisode,
  ])

  return output
}

export default usePlayHistory
export type { PlayHistoryPodcastEpisode }

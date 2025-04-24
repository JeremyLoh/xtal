import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import {
  SessionContextType,
  useSessionContext,
} from "supertokens-auth-react/recipe/session/index"
import { PodcastEpisode } from "../../api/podcast/model/podcast.ts"
import {
  deleteAccountPodcastEpisodePlayHistory,
  getAccountPodcastEpisodeLastPlayTimestamp,
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
  const isInitialFetchRef = useRef<boolean | null>(null)
  const [totalPlayedPodcastEpisodes, setTotalPlayedPodcastEpisodes] =
    useState<number>(0)

  useEffect(() => {
    async function getTotalPlayedCount() {
      if (session.loading || isInitialFetchRef.current != null) {
        return
      }
      if (!session.doesSessionExist) {
        return
      }
      try {
        isInitialFetchRef.current = false
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
      if (session.loading) {
        return
      }
      if (!session.doesSessionExist) {
        return
      }
      setLoading(true)
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
  const updatePlayPodcastEpisodeTime = useCallback(
    async (episode: PodcastEpisode, currentTimeInSeconds: number) => {
      if (session.loading) {
        return
      }
      if (!session.doesSessionExist) {
        return
      }
      setLoading(true)
      abortController.current?.abort()
      abortController.current = new AbortController()
      try {
        await updateAccountPodcastEpisodePlayHistory(
          abortController.current,
          episode,
          currentTimeInSeconds
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
      if (session.loading) {
        return null
      }
      if (!session.doesSessionExist) {
        return null
      }
      setLoading(true)
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
      if (session.loading) {
        return
      }
      if (!session.doesSessionExist) {
        return
      }
      setLoading(true)
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

  const getPodcastEpisodeLastPlayTimestamp = useCallback(
    async (episodeId: string) => {
      // get user last played timestamp for podcast episode
      if (session.loading) {
        return
      }
      if (!session.doesSessionExist) {
        return
      }
      setLoading(true)
      abortController.current?.abort()
      abortController.current = new AbortController()
      try {
        const lastPlayedTimestamp =
          await getAccountPodcastEpisodeLastPlayTimestamp(
            abortController.current,
            episodeId
          )
        return lastPlayedTimestamp
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
      updatePlayPodcastEpisodeTime,
      getPlayedPodcastEpisodes,
      deletePlayedPodcastEpisode,
      getPodcastEpisodeLastPlayTimestamp,
    }
  }, [
    session,
    loading,
    totalPlayedPodcastEpisodes,
    addPlayPodcastEpisode,
    updatePlayPodcastEpisodeTime,
    getPlayedPodcastEpisodes,
    deletePlayedPodcastEpisode,
    getPodcastEpisodeLastPlayTimestamp,
  ])

  return output
}

export default usePlayHistory
export type { PlayHistoryPodcastEpisode }

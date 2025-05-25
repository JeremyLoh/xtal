import { useCallback, useMemo, useRef, useState } from "react"
import {
  CurrentPodcastStatsResponse,
  getCurrentPodcastStats,
} from "../../api/podcast/podcastStats.ts"

type CurrentPodcastStats = CurrentPodcastStatsResponse

function usePodcastStats() {
  const abortController = useRef<AbortController | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCurrentPodcastStats = useCallback(async (): Promise<
    CurrentPodcastStats | null | undefined
  > => {
    setLoading(true)
    setError(null)
    abortController.current?.abort()
    abortController.current = new AbortController()
    try {
      return await getCurrentPodcastStats(abortController.current)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const output = useMemo(() => {
    return { loading, error, fetchCurrentPodcastStats }
  }, [loading, error, fetchCurrentPodcastStats])

  return output
}

export default usePodcastStats
export type { CurrentPodcastStats }

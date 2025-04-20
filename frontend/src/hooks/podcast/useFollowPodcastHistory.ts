import { useCallback, useMemo, useRef, useState } from "react"
import { useSessionContext } from "supertokens-auth-react/recipe/session"
import { toast } from "sonner"
import {
  getAccountLatestFollowedPodcasts,
  getAccountTotalFollowedPodcasts,
} from "../../api/podcast/history/accountFollowing.ts"

function useFollowPodcastHistory() {
  const session = useSessionContext()
  const [loading, setLoading] = useState<boolean>(false)
  const abortController = useRef<AbortController | null>(null)
  const totalFollowedAbortController = useRef<AbortController | null>(null)

  const getTotalFollowedPodcasts = useCallback(async () => {
    if (session.loading) {
      return
    }
    if (!session.doesSessionExist) {
      return
    }
    totalFollowedAbortController.current?.abort()
    totalFollowedAbortController.current = new AbortController()
    try {
      setLoading(true)
      const total = await getAccountTotalFollowedPodcasts(
        totalFollowedAbortController.current
      )
      return total
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }, [session])

  const getLatestFollowedPodcasts = useCallback(
    async (limit: number, offset: number = 0) => {
      if (session.loading) {
        return
      }
      if (!session.doesSessionExist) {
        return
      }
      abortController.current?.abort()
      abortController.current = new AbortController()
      try {
        setLoading(true)
        const followedPodcastData = await getAccountLatestFollowedPodcasts(
          abortController.current,
          limit,
          offset
        )
        return followedPodcastData
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
    return { loading, getLatestFollowedPodcasts, getTotalFollowedPodcasts }
  }, [loading, getLatestFollowedPodcasts, getTotalFollowedPodcasts])
  return output
}

export default useFollowPodcastHistory

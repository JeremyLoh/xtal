import { useCallback, useMemo, useRef, useState } from "react"
import { useSessionContext } from "supertokens-auth-react/recipe/session"
import { toast } from "sonner"
import { getAccountLatestFollowedPodcasts } from "../../api/podcast/history/accountFollowing.ts"

function useFollowPodcastHistory() {
  const session = useSessionContext()
  const [loading, setLoading] = useState<boolean>(false)
  const abortController = useRef<AbortController | null>(null)

  const getLatestFollowedPodcasts = useCallback(
    async (limit: number, offset: number = 0) => {
      if (session.loading) {
        return
      }
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
    return { loading, getLatestFollowedPodcasts }
  }, [loading, getLatestFollowedPodcasts])
  return output
}

export default useFollowPodcastHistory

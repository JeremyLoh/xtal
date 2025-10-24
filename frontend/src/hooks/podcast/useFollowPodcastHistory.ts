import { useQuery } from "@tanstack/react-query"
import { useSessionContext } from "supertokens-auth-react/recipe/session"
import { toast } from "sonner"
import {
  getAccountLatestFollowedPodcasts,
  getAccountTotalFollowedPodcasts,
} from "../../api/podcast/history/accountFollowing.ts"

function useFollowPodcastHistory({
  limitPerPage,
  pageOffset,
}: {
  limitPerPage: number
  pageOffset?: number
}) {
  const session = useSessionContext()

  const {
    data: totalFollowedPodcasts,
    isLoading: isTotalFollowedPodcastsLoading,
  } = useQuery({
    queryKey: ["useFollowPodcastHistory", "totalFollowedPodcasts"],
    queryFn: async () => {
      if (session.loading || !session.doesSessionExist) {
        return
      }
      try {
        return await getAccountTotalFollowedPodcasts()
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message)
        }
        throw error
      }
    },
    enabled: !session.loading && session.doesSessionExist,
  })

  const {
    data: latestFollowedPodcasts,
    isLoading: isLatestFollowedPodcastsLoading,
  } = useQuery({
    queryKey: [
      "useFollowPodcastHistory",
      "latestFollowedPodcasts",
      { limitPerPage, pageOffset },
    ],
    queryFn: async () => {
      if (session.loading || !session.doesSessionExist) {
        return
      }
      try {
        return await getAccountLatestFollowedPodcasts(limitPerPage, pageOffset)
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message)
        }
        throw error
      }
    },
    enabled: !session.loading && session.doesSessionExist,
  })

  return {
    loading: isTotalFollowedPodcastsLoading || isLatestFollowedPodcastsLoading,
    latestFollowedPodcasts,
    totalFollowedPodcasts,
  }
}

export default useFollowPodcastHistory

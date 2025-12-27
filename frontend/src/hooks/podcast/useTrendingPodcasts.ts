import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import dayjs from "dayjs"
import { getTrendingPodcasts } from "../../api/podcast/trendingPodcast.ts"
import { TrendingPodcastFiltersType } from "../../api/podcast/model/podcast.ts"

type UseTrendingPodcastsProps = TrendingPodcastFiltersType

export function convertToDate(daysBefore: number): Date {
  return dayjs().startOf("day").subtract(daysBefore, "days").toDate()
}

const DEFAULT_SINCE_DAYS = 3

function useTrendingPodcasts({
  limit = 10,
  category,
  since = DEFAULT_SINCE_DAYS,
  offset = 0,
}: UseTrendingPodcastsProps) {
  const getPodcasts = async () => {
    const params = {
      limit: limit,
      offset: offset,
      since: convertToDate(since),
      ...(category && { category }),
    }
    try {
      const podcasts = await getTrendingPodcasts(params)
      if (podcasts?.data) {
        return podcasts.data
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message)
      throw error
    }
  }

  const query = useQuery({
    queryKey: ["useTrendingPodcasts", { limit, category, since, offset }],
    queryFn: async () => {
      return await getPodcasts()
    },
  })

  return {
    loading: query.isLoading,
    trendingPodcasts: query.data ?? null,
    refetch: query.refetch,
  }
}

export default useTrendingPodcasts

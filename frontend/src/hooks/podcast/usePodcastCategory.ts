import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { getAllPodcastCategories } from "../../api/podcast/podcastCategory.ts"

const PODCAST_CATEGORY_STALE_TIME_IN_MS = 60 * 60 * 1000

function usePodcastCategory() {
  const handleCategoryRefresh = async () => {
    try {
      return await getAllPodcastCategories()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message)
      throw error
    }
  }

  const query = useQuery({
    queryKey: ["usePodcastCategory"],
    queryFn: handleCategoryRefresh,
    staleTime: PODCAST_CATEGORY_STALE_TIME_IN_MS,
  })

  return {
    loading: query.isLoading,
    categories: query.data ?? null,
    refetch: async () => {
      await query.refetch()
    },
  }
}

export default usePodcastCategory

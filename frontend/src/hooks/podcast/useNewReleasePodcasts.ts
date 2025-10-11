import { toast } from "sonner"
import { useQuery } from "@tanstack/react-query"
import { getNewReleasePodcasts } from "../../api/podcast/podcastNewRelease.ts"
import { RECENT_PODCAST_LANGUAGES } from "../../api/podcast/model/podcastRecent.ts"
import { ALL_LANGUAGES } from "../../features/podcast/newRelease/NewReleasePodcastFilters/NewReleasePodcastFilters.tsx"

const AVAILABLE_LANGUAGES = Object.entries(RECENT_PODCAST_LANGUAGES)

function useNewReleasePodcasts({
  limit,
  language,
}: {
  limit: number
  language?: string
}) {
  const getNewReleases = async ({
    limit,
    language,
  }: {
    limit: number
    language?: string
  }) => {
    const params = {
      limit,
      ...(language && language !== ALL_LANGUAGES && { lang: language }),
    }
    try {
      return await getNewReleasePodcasts(params)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message)
      throw error
    }
  }

  const query = useQuery({
    queryKey: ["newReleasePodcasts", { limit, language }],
    queryFn: () => getNewReleases({ limit, language }),
  })

  return {
    loading: query.isLoading,
    AVAILABLE_LANGUAGES,
    newReleasePodcasts: query.isError ? null : query.data ?? null,
    refetch: () => query.refetch(),
  }
}

export default useNewReleasePodcasts
